export default function TagChip({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
            {children}
        </span>
    );
}
