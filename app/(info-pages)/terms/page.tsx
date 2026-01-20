import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using CodeCraft ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
              The Service allows users to generate, edit, and export websites
              using Artificial Intelligence.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              2. Services & Credits
            </h2>
            <p>
              CodeCraft operates on a credit-based system. We offer Free,
              Monthly Subscription, and One-Time Testing plans.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Free Plan:</strong> Limited access for trial purposes.
              </li>
              <li>
                <strong>Premium Plan (Monthly):</strong> Includes 100
                credits/month, unlimited chats, and watermark-free exports.
                Credits reset monthly.
              </li>
              <li>
                <strong>Testing Plan (₹10):</strong> A short-term 1-day pass
                with 10 credits for evaluation purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              3. User Obligations
            </h2>
            <p>
              You agree not to use the generated code for illegal activities.
              You constitute that you are responsible for any content generated
              and deployed using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              4. Ownership & Intellectual Property
            </h2>
            <p>
              <strong>Your Exports:</strong> You retain full ownership of the
              HTML/CSS code you export from CodeCraft, specifically when using a
              Premium Plan (No Watermark).
              <br />
              <strong>Platform Rights:</strong> CodeCraft retains rights to the
              AI models, interface, and underlying infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              5. Payment & Billing
            </h2>
            <p>
              Payments are processed securely via Razorpay. By purchasing a
              plan, you agree to the pricing listed on our website. Subscription
              plans (₹99/month) renew automatically unless cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              CodeCraft is provided "as is". We are not liable for any direct,
              indirect, incidental, or consequential damages resulting from the
              use or inability to use our service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
