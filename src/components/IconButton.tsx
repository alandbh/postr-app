type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    icon?: React.ReactNode;
};
export default function IconButton({
    label,
    icon,
    className = "",
    ...rest
}: Props) {
    return (
        <button
            {...rest}
            className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition ${className}`}
            aria-label={typeof label === "string" ? label : undefined}
            title={typeof label === "string" ? label : undefined}
        >
            {icon ?? null}
            <span>{label}</span>
        </button>
    );
}
