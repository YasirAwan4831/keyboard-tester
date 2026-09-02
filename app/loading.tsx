export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-sm text-muted">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
        Loading…
      </div>
    </div>
  );
}
