import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, MapPin, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full p-4">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Contact Us</h1>
              <p className="text-sm text-muted-foreground">
                We are here to help.
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

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  Get in touch
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Have questions about our pricing, AI models, or need support
                  with a project? Fill out the form or reach us directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <Mail className="w-5 h-5 mt-1 text-neutral-500" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      support@codecraft.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <MapPin className="w-5 h-5 mt-1 text-neutral-500" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      Office
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      123 Tech Park, Cyber City
                      <br />
                      Bangalore, KA 560001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" className="bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="How can we help you?"
                    className="bg-transparent min-h-[120px] resize-none"
                  />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
