import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Shipping & Delivery Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                How you receive your digital products.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              1. Digital Delivery
            </h2>
            <p>
              Codecraft is a SaaS (Software as a Service) platform. We do not
              ship physical products. All services and generated code are
              delivered digitally through our website interface.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              2. Delivery Timeline
            </h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Immediate Access:</strong> Upon successful payment, your
                account is instantly upgraded to the Premium plan, and credits
                are added to your balance immediately.
              </li>
              <li>
                <strong>Code Generation:</strong> Website code is generated in
                real-time and is available for viewing, editing, and deployment
                instantly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              3. Proof of Delivery
            </h2>
            <p>
              Access to premium features (such as advanced AI models, increased
              project limits, and code export) serves as proof of delivery. You
              will also receive a confirmation email from our payment provider
              (Razorpay) upon successful transaction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              4. Contact Us
            </h2>
            <p>
              If you experience any issues with accessing your premium features
              after payment, please contact us immediately via our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
