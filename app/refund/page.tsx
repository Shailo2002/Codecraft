import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Refund & Cancellation
              </h1>
              <p className="text-sm text-muted-foreground">
                Policy regarding subscriptions and payments.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">
                Strict No Refund Policy
              </h3>
              <p className="text-red-600/80 dark:text-red-400/80 text-sm mt-1">
                Due to the high costs associated with AI generation (GPU/API
                usage), all sales are final. We do not offer refunds once
                credits have been allocated or a subscription has been
                activated.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              1. Testing Before Purchasing
            </h2>
            <p>
              We understand the need to evaluate our service before committing
              to a monthly subscription. Therefore, we provide a{" "}
              <strong>Testing Premium Plan</strong> for only{" "}
              <strong>₹10</strong>.
            </p>
            <p className="mt-2">
              This plan includes 10 credits valid for 1 day, allowing you to
              fully test the premium capabilities (unlimited chats, model
              access, code export) at a minimal cost. We strongly encourage
              users to utilize this plan to ensure the service meets their needs
              before upgrading to the ₹99 monthly plan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              2. Cancellation of Subscriptions
            </h2>
            <p>You may cancel your "Premium Plan Subscription" at any time.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>How to cancel:</strong> Go to your account settings or
                contact support.
              </li>
              <li>
                <strong>Effect of cancellation:</strong> Your subscription will
                remain active until the end of the current billing cycle. You
                will not be charged for the next month.
              </li>
              <li>
                <strong>No partial refunds:</strong> We do not refund unused
                time or credits for the remainder of the billing cycle.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              3. Failed Transactions
            </h2>
            <p>
              If a payment fails or is flagged by Razorpay, no credits will be
              allocated. If your account was charged but credits were not
              received, the amount is usually automatically refunded by the bank
              within 5-7 business days. If not, please contact us with your
              transaction ID.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
