import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center"><p className="text-sm text-muted-foreground">CONTACT <span className="font-semibold text-foreground">US</span></p></div>
      <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop" alt="Contact" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-muted-foreground">OUR OFFICE</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>No. 42, 3rd Floor, Greams Road</p>
              <p>Thousand Lights, Chennai, Tamil Nadu 600006</p>
              <p className="mt-4">Tel: +91 44 2829 0000</p>
              <p>Email: contact@prescripto.com</p>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-muted-foreground">CAREERS AT PRESCRIPTO</h3>
            <p className="mb-4 text-muted-foreground">Learn more about our teams and job openings.</p>
            <Button variant="outline" className="rounded-none">Explore Jobs</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
