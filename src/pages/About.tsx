export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center"><p className="text-sm text-muted-foreground">ABOUT <span className="font-semibold text-foreground">US</span></p></div>
      <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl">
          <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&h=400&fit=crop" alt="About Prescripto" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <p className="leading-relaxed text-muted-foreground">Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p className="leading-relaxed text-muted-foreground">Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.</p>
          <div><h3 className="mb-3 font-bold text-foreground">Our Vision</h3><p className="leading-relaxed text-muted-foreground">Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers.</p></div>
        </div>
      </div>
      <div className="mt-20">
        <div className="mb-12"><p className="text-sm text-muted-foreground">WHY <span className="font-semibold text-foreground">CHOOSE US</span></p></div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border md:grid-cols-3">
          <div className="group bg-card p-12 transition-colors hover:bg-primary hover:text-primary-foreground"><h3 className="mb-4 font-bold">EFFICIENCY:</h3><p className="text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/80">Streamlined appointment scheduling that fits into your busy lifestyle.</p></div>
          <div className="group border-x border-border bg-card p-12 transition-colors hover:bg-primary hover:text-primary-foreground"><h3 className="mb-4 font-bold">CONVENIENCE:</h3><p className="text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/80">Access to a network of trusted healthcare professionals in your area.</p></div>
          <div className="group bg-card p-12 transition-colors hover:bg-primary hover:text-primary-foreground"><h3 className="mb-4 font-bold">PERSONALIZATION:</h3><p className="text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/80">Tailored recommendations and reminders to help you stay on top of your health.</p></div>
        </div>
      </div>
    </div>
  );
}
