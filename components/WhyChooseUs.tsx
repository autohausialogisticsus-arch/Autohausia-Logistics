import {
  ArrowRightIcon,
  ChatIcon,
  DocIcon,
  PriceTagIcon,
  RouteIcon,
  SearchIcon,
  SteeringWheelIcon,
} from "@/components/icons";

const FEATURES = [
  {
    icon: SteeringWheelIcon,
    title: "Carrier-Focused Dispatch",
    body: "Every plan starts with your equipment, your lanes, and your rate floor — not what is easiest for us.",
    href: "/why-choose-us",
  },
  {
    icon: RouteIcon,
    title: "Load Matching",
    body: "We present loads that fit your setup, and you approve every match before anything is booked.",
    href: "/services",
  },
  {
    icon: PriceTagIcon,
    title: "Rate Negotiation",
    body: "We handle the back-and-forth with brokers so every load has a clear, agreed rate up front.",
    href: "/services",
  },
  {
    icon: ChatIcon,
    title: "Dedicated Communication",
    body: "One dispatcher stays with your account from pickup through delivery — no call-center roulette.",
    href: "/contact",
  },
  {
    icon: DocIcon,
    title: "Paperwork Support",
    body: "Rate confirmations, BOLs, and load documents get organized before you roll.",
    href: "/services",
  },
  {
    icon: SearchIcon,
    title: "Flexible Freight Search",
    body: "We search across lanes and equipment fits, so you can run the freight that works for you.",
    href: "/services",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-hairline bg-fog py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <span className="block text-center font-mono text-xs font-semibold uppercase tracking-widest text-amber">
          Why Autohausia
        </span>
        <h2 className="mt-3 text-center font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
          Why carriers choose us
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group flex h-full flex-col border border-line border-t-2 border-t-amber bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.06),0_12px_24px_-16px_rgba(11,18,32,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-amber/60 hover:shadow-[0_2px_4px_rgba(11,18,32,0.08),0_20px_36px_-18px_rgba(11,18,32,0.4)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-ink">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink transition-colors group-hover:text-amber">
                {feature.title}
              </h3>
              <p className="mt-2 grow text-sm text-slate">{feature.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber transition-transform group-hover:translate-x-1">
                Learn more
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}