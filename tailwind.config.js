export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                surface: "#FEF7FF",
                "on-surface": "#49454F",
                primary: "#6750A4",
                "primary-dark": "#1D1B20",
                "primary-fixed": "#D0BCFF",
                // Contrast text for primary surfaces
                "on-primary-contrast": "#FFFFFF",
            },
            fontFamily: {
                sans: ["Poppins", "ui-sans-serif", "system-ui"],
                serif: ["Georgia", "ui-serif", "serif"],
            },
            fontSize: {
                // UI Typography
                headline: ["20px", { lineHeight: "24px" }],
                "title-md": ["16px", { lineHeight: "24px" }],
                "body-lg": ["16px", { lineHeight: "24px" }],

                // Article Typography
                "article-h1": ["28px", { lineHeight: "36px" }],
                "article-p": ["20px", { lineHeight: "28px" }],
                "article-excerpt": ["20px", { lineHeight: "28px" }],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.on-surface"),
                        fontFamily: theme("fontFamily.serif").join(","),
                        // --- Base Article Typography ---
                        p: {
                            fontSize: theme("fontSize.article-p")[0],
                            lineHeight: theme("fontSize.article-p")[1].lineHeight,
                            marginTop: "1.25em",
                            marginBottom: "1.25em",
                        },
                        h1: {
                            fontFamily: theme("fontFamily.serif").join(","),
                            fontSize: theme("fontSize.article-h1")[0],
                            lineHeight: theme("fontSize.article-h1")[1].lineHeight,
                            fontWeight: "700",
                        },
                        // --- Links ---
                        a: {
                            color: theme("colors.primary"),
                            "&:hover": {
                                color: theme("colors.primary-dark"),
                            },
                        },
                    },
                },
                invert: {
                    css: {
                        // --- Base ---
                        color: theme("colors.white / 0.9"),
                        '--tw-prose-body': theme('colors.gray.300'),
                        '--tw-prose-headings': theme('colors.white'),
                        '--tw-prose-lead': theme('colors.gray.400'),
                        '--tw-prose-links': theme('colors.primary-fixed'),
                        '--tw-prose-bold': theme('colors.white'),
                        '--tw-prose-counters': theme('colors.gray.400'),
                        '--tw-prose-bullets': theme('colors.gray.600'),
                        '--tw-prose-hr': theme('colors.gray.700'),
                        '--tw-prose-quotes': theme('colors.gray.100'),
                        '--tw-prose-quote-borders': theme('colors.primary-fixed'),
                        '--tw-prose-captions': theme('colors.gray.400'),
                        '--tw-prose-code': theme('colors.white'),
                        '--tw-prose-pre-code': theme('colors.gray.300'),
                        '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.2)',
                        '--tw-prose-th-borders': theme('colors.gray.600'),
                        '--tw-prose-td-borders': theme('colors.gray.700'),
                        '--tw-prose-invert-body': theme('colors.gray.300'),
                        // --- Links (Invert) ---
                        a: {
                            color: theme("colors.primary-fixed"),
                            "&:hover": {
                                color: theme("colors.white"),
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
