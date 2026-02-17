import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';

// Tipagem do ambiente (vars do wrangler.toml)
interface Env {
	ALLOWED_ORIGIN?: string;
}

type ExtractResponse = {
	url: string;
	title: string;
	content: string; // HTML limpo
	excerpt?: string;
	author?: string;
	image?: string;
	siteName?: string;
};

function corsHeaders(origin: string) {
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		Vary: 'Origin',
	};
}

export default {
	// Tipos completos do handler (Cloudflare Workers)
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders(env.ALLOWED_ORIGIN || '*') });
		}

		if (url.pathname === '/extract') {
			const target = url.searchParams.get('url');
			if (!target) return json({ error: 'Missing the ?url=' }, 400, env);

			try {
				const resp = await fetch(target, {
					redirect: 'follow',
					headers: {
						'User-Agent': 'Mozilla/5.0 (compatible; PostrReader/1.0; +https://postr.app)',
						Accept: 'text/html,application/xhtml+xml',
					},
				});
				if (!resp.ok) return json({ error: `Upstream ${resp.status}` }, resp.status, env);

				const buf = await resp.arrayBuffer();
				const html = new TextDecoder('utf-8').decode(buf);

				// linkedom -> Document (fazendo cast explícito para satisfazer o Readability)
				const { document } = parseHTML(html) as unknown as { document: Document };

				// Garante <head> e <base href="..."> sem usar .prepend (evita erro de tipagem)
				let head = document.querySelector('head') as HTMLHeadElement | null;
				if (!head) {
					head = document.createElement('head') as HTMLHeadElement;
					const root = document.documentElement;
					// insere head no topo do html
					root.insertBefore(head, root.firstChild);
				}
				const baseEl = document.createElement('base') as HTMLBaseElement;
				baseEl.setAttribute('href', resp.url);
				// insere <base> como primeiro filho do head
				head.insertBefore(baseEl, head.firstChild);

				// Readability
				const reader = new Readability(document);
				const article = reader.parse();
				if (!article) return json({ error: 'Unable to parse article' }, 422, env);

				const baseUrl = resp.url; // já é a URL final
				let content = article.content ?? '';
				content = fixImages(content, baseUrl);

				const data: ExtractResponse = {
					url: resp.url,
					title: article.title || new URL(resp.url).hostname,
					content,
					excerpt: article.excerpt || undefined,
					author: article.byline || undefined,
					siteName: (document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement | null)?.content ?? undefined,
				};

				// og:image (principal)
				const ogImg = (document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null)?.content;
				if (ogImg) data.image = new URL(ogImg, resp.url).toString();

				return json(data, 200, env);
			} catch (e: any) {
				return json({ error: e?.message || 'Unknown error' }, 500, env);
			}
		}

		// rota raiz
		return new Response('Postr Worker up. Use /extract?url=https://exemplo.com/artigo', {
			headers: corsHeaders(env.ALLOWED_ORIGIN || '*'),
		});
	},
} satisfies ExportedHandler<Env>;

function json(obj: any, status = 200, env: Env) {
	return new Response(JSON.stringify(obj), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			...corsHeaders(env.ALLOWED_ORIGIN || '*'),
		},
	});
}

function fixImages(html: string, baseUrl: string) {
	const { document } = parseHTML(`<div id="root">${html}</div>`) as unknown as { document: Document };
	const root = document.getElementById('root')!;

	// <noscript><img/></noscript> → img normal
	root.querySelectorAll('noscript').forEach((ns) => {
		const tmp = parseHTML(ns.textContent || '') as unknown as { document: Document };
		const img = tmp.document.querySelector('img');
		if (img) ns.replaceWith(img);
	});

	// data-src / data-srcset → src / srcset
	root.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
		const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src');
		const dataSrcSet = img.getAttribute('data-srcset');
		if (dataSrc && !img.getAttribute('src')) img.setAttribute('src', dataSrc);
		if (dataSrcSet && !img.getAttribute('srcset')) img.setAttribute('srcset', dataSrcSet);

		// absolutiza src/srcset
		const src = img.getAttribute('src');
		if (src) img.setAttribute('src', new URL(src, baseUrl).toString());

		const srcset = img.getAttribute('srcset');
		if (srcset) {
			const fixed = srcset
				.split(',')
				.map((part) => {
					const [u, d] = part.trim().split(' ');
					return `${new URL(u, baseUrl).toString()} ${d || ''}`.trim();
				})
				.join(', ');
			img.setAttribute('srcset', fixed);
		}
	});

	// <source> dentro de <picture>
	root.querySelectorAll<HTMLSourceElement>('source[srcset]').forEach((source) => {
		const srcset = source.getAttribute('srcset')!;
		const fixed = srcset
			.split(',')
			.map((part) => {
				const [u, d] = part.trim().split(' ');
				return `${new URL(u, baseUrl).toString()} ${d || ''}`.trim();
			})
			.join(', ');
		source.setAttribute('srcset', fixed);
	});

	return root.innerHTML;
}
