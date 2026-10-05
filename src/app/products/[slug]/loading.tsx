export default function Loading() {
  return (
    <div className="grid gap-8 md:grid-cols-2" aria-busy="true">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-4">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-9 w-40" />
        <div className="skeleton h-24 w-full" />
      </div>
    </div>
  );
}
