import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Check, CircleCheckBig } from "lucide-react";
import toast from "react-hot-toast";

const pricingPlans = [
  //   {
  //     name: "Free Plan",
  //     price: "₹0",
  //     period: "per month",
  //     description: "Essential features for individual users.",
  //     cta: "Start Free",
  //     featuresIntro: "Includes core free features...",
  //     features: [
  //       "Access to limited basic features",
  //       "Up to 3 projects",
  //       "Community support",
  //       "Standard security",
  //     ],
  //   },

  {
    name: "Basic Plan OneTime",
    price: "₹99",
    period: "for one month",
    description: "Basic features for up to 10 users.",
    cta: "Get Started",
    featuresIntro: "Everything in Free Plan plus...",
    features: [
      "Access to all basic features",
      "Up to 10 users",
      "Email support",
      "Advanced analytics",
    ],
    payment_type: "one_time",
  },
  {
    name: "Basic Plan Subscription",
    price: "₹99",
    period: "per month",
    description: "Basic features for up to 10 users.",
    cta: "Get Started",
    featuresIntro: "Everything in Free Plan plus...",
    features: [
      "Access to all basic features",
      "Up to 10 users",
      "Email support",
      "Advanced analytics",
    ],
    payment_type: "subscription",
  },

  {
    name: "Pro Plan",
    price: "₹799",
    period: "per year",
    description: "Advanced features for growing teams.",
    cta: "Upgrade Now",
    featuresIntro: "Everything in Basic Plan plus...",
    features: [
      "Unlimited users",
      "Priority support",
      "Custom workflows",
      "Enhanced security",
    ],
    payment_type: "subscription",
  },
];

export function PaymentModel({ children }: any) {
  const handlePayment = async (type: string) => {
    try {
      const response = await axios.post("/api/create-checkout-session", {
        type,
      });
      console.log("response : ", response);
      const data = response.data;
      window.location.href = data.url;
    } catch (error) {
      console.log("error : ", error);
      toast.error("payment failed");
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-w-[916px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {pricingPlans.map((plan) => (
              <div className="border rounded-lg shadow w-70 p-4">
                <div className="font-semibold text-lg">{plan.name}</div>
                <div className="flex justify-start items-end gap-2 mt-2">
                  <span className="text-5xl font-semibold">{plan.price}</span>
                  <div className="flex flex-col -space-y-1 text-sm text-slate-700">
                    <span>per user</span>
                    <span>{plan.period}</span>
                  </div>
                </div>
                <div className="my-6 text-sm text-slate-700">
                  {plan.description}{" "}
                </div>
                {plan.name === "Free Plan" ? (
                  <DialogClose asChild>
                    <Button className="mb-6 w-full">{plan.cta}</Button>
                  </DialogClose>
                ) : (
                  <Button
                    className="mb-6 w-full"
                    onClick={() => handlePayment(plan.payment_type)}
                  >
                    {plan.cta}
                  </Button>
                )}

                <div className="py-4 border-t">
                  <div className="font-semibold text-sm">Features</div>
                  <div className="mb-4 text-sm text-slate-700">
                    {plan.featuresIntro}
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div className="flex justify-start items-center gap-2 text-sm text-slate-700">
                        <Check className="h-4 w-4 text-lime-800 bg-lime-400 rounded-full font-bold p-0.5" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
