const STEPS = [
  {
    num: "01",
    title: "Tell Us About Your Truck",
    body: "Equipment, MC/USDOT information where applicable, truck count, location, preferred lanes, and availability.",
  },
  {
    num: "02",
    title: "Build Your Carrier Profile",
    body: "We take the time to learn your operating preferences so every match fits how you run.",
  },
  {
    num: "03",
    title: "Search & Match Freight",
    body: "Dispatchers identify freight based on equipment, location, lanes, timing, and your preferences.",
  },
  {
    num: "04",
    title: "Negotiate the Load",
    body: "We communicate with brokers and negotiate on your behalf when authorized.",
  },
  {
    num: "05",
    title: "Carrier Approves the Load",
    body: "Every load comes to you first. Nothing is booked without your approval.",
  },
  {
    num: "06",
    title: "Dispatch & Paperwork",
    body: "We coordinate dispatch logistics and handle the required documentation.",
  },
  {
    num: "07",
    title: "Delivery",
    body: "You complete the delivery and finish the required paperwork.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
            How It Works
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
            How Autohausia Dispatch Works
          </h2>
          <p className="mt-4 text-base text-slate sm:text-base">
            Seven clear steps from truck setup to delivery, and you approve
            every load before it is booked.
          </p>
        </header>

        <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-7 top-4 w-px bg-line sm:hidden"
          />
          {STEPS.map((step) => (
            <li key={step.num} className="relative flex items-start gap-4">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber bg-white font-mono text-sm font-semibold text-amber sm:h-14 sm:w-14">
                {step.num}
              </span>
              <div className="flex-1 rounded-sm border-t-2 border-amber bg-fog p-5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}