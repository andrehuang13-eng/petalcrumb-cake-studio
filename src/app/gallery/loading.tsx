export default function GalleryLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mb-12 md:mb-16">
        <div className="h-3 w-20 bg-line rounded mb-6 animate-pulse" />
        <div className="h-14 w-64 bg-line rounded mb-6 animate-pulse" />
        <div className="h-6 w-full max-w-md bg-line/70 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-cream-soft rounded-lg mb-4" />
            <div className="h-4 w-3/4 bg-line rounded mb-2" />
            <div className="h-3 w-1/3 bg-line/70 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
