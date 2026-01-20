import { Button } from "@/components/ui/button";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">
                Your data security is our priority.
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
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect the following types of information to provide and
              improve our services:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                profile picture (via Clerk authentication).
              </li>
              <li>
                <strong>Usage Data:</strong> Prompts entered, code generated,
                and project metadata.
              </li>
              <li>
                <strong>Payment Information:</strong> We do not store credit
                card details. Payment processing is handled by Razorpay.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              2. How We Use Your Data
            </h2>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Generate website code based on your prompts.</li>
              <li>Maintain your project history and saved workspaces.</li>
              <li>Process transactions and manage subscriptions.</li>
              <li>Improve our AI models and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              3. Data Sharing
            </h2>
            <p>
              We do not sell your personal data to third parties. We may share
              data with trusted service providers (e.g., Clerk for auth,
              Razorpay for payments, Database providers) solely for the purpose
              of operating the application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              4. Cookies
            </h2>
            <p>
              We use essential cookies to maintain your session and
              authentication state.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data. However, no method of transmission over the Internet is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              6. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              via the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
