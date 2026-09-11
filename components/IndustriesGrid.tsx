import ImageCard from "@/components/ui/ImageCard";

// Six industries receive photographic cards (primary feature)
const FEATURED_INDUSTRIES = [
  { name: "Energy & Petrochemicals", slug: "energy", image: "Energy.png" },
  { name: "Automotive", slug: "automotive", image: "Automotive.png" },
  { name: "Defense & Government", slug: "defense", image: "Defense.png" },
  { name: "Chemicals", slug: "chemicals", image: "Chemical.png" },
  { name: "Technology", slug: "technology", image: "Technology.png" },
  { name: "Consumer Goods", slug: "consumer-goods", image: "Consumer-Goods.png" },
];

// The remaining six industries stay text-only
const TEXT_ONLY_INDUSTRIES = [
  "Pharmaceuticals",
  "Retail",
  "Construction",
  "Logistics & Transportation",
  "Agriculture",
  "Mining",
];

export default function IndustriesGrid() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-display text-2xl font-semibold sm:text-2xl">
          Industries We Serve
        </h2>

        {/* Featured photographic industries - 6 cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_INDUSTRIES.map((item) => (
            <ImageCard
              key={item.slug}
              src={`/images/${item.image}`}
              alt={`Transportation logistics for the ${item.name.toLowerCase()}`}
              title={item.name}
              subtitle=""
              ctaText="Learn More"
              ctaHref="/contact"
            />
          ))}
        </div>

        {/* Remaining text-only industries */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 text-sm text-slate">
          {TEXT_ONLY_INDUSTRIES.map((ind) => (
            <div key={ind} className="rounded-sm border border-line bg-white px-2 py-5 transition hover:border-amber hover:text-amber">
              {ind}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}