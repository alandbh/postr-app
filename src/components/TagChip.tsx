export default function TagChip({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-sans bg-primary/20 text-primary">
            {children}
        </span>
    );
}
