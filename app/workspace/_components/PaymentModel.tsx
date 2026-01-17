import { pricingPlans } from "@/app/constants/pricing-plans";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Razorpay from "razorpay";
import { useState } from "react";
import toast from "react-hot-toast";

export function PaymentModel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const router = useRouter();

  const handlePayment = async (
    type: string,
    name: string,
    pricing_type: string
  ) => {
    setSelectedPlan(name);

    console.log("type of payment : ", type);
    try {
      setLoading(true);
      const response = await axios.post("/api/razorpay/create-order", {
        type,
        pricing_type,
      });
      console.log("razorpay order create response : ", response?.data?.data);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response?.data?.data?.amount || 1000,
        currency: "INR",
        name: "CodeCraft",
        description: "Test Transaction",
        order_id: response?.data?.data?.id,
        handler: async function (response: any) {
          console.log(
            "Payment Success:",
            response?.razorpay_payment_id,
            response?.razorpay_order_id,
            response?.razorpay_signature
          );
          await axios.post("/api/razorpay/verify", response);
          router.refresh();
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", async function (response: any) {
        console.error("Payment Failed:", response.error);
        toast.error(response.error.description);

        await axios.post("/api/razorpay/payment-failure", {
          order_id: response.error.metadata.order_id,
          payment_id: response.error.metadata.payment_id,
          reason: response.error.reason,
        });
      });

      rzp.open();
    } catch (error) {
      console.log("error : ", error);

      toast.error("payment failed");
    } finally {
      console.log("finally run");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:overflow-none md:min-w-[650px] lg:min-w-[916px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Get full access by choosing a subscription plan that fits your
            needs.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap md:grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4">
          {pricingPlans.map((plan) => (
            <div className="border dark:border-neutral-700 rounded-lg shadow w-70 p-4">
              <div className="font-semibold text-lg">{plan.name}</div>
              <div className="flex justify-start items-end gap-2 mt-2">
                <span className="text-5xl font-semibold">{plan.price}</span>
                <div className="flex flex-col text-sm text-slate-700 dark:text-slate-300">
                  <span className="mb-2">{plan.period}</span>
                </div>
              </div>
              <div className="my-6 text-sm text-slate-700 dark:text-slate-300">
                {plan.description}{" "}
              </div>
              {plan.name === "Free Plan" ? (
                <DialogClose asChild>
                  <Button className="mb-6 w-full">{plan.cta}</Button>
                </DialogClose>
              ) : (
                <Button
                  className="mb-6 w-full"
                  onClick={() =>
                    handlePayment(
                      plan.payment_type,
                      plan.name,
                      plan.pricing_type
                    )
                  }
                  disabled={loading}
                >
                  {selectedPlan === plan.name && loading && <Spinner />}{" "}
                  {plan.cta}
                </Button>
              )}

              <div className="py-4 border-t">
                <div className="font-semibold text-sm">Features</div>
                <div className="mb-4 text-sm text-slate-700 dark:text-slate-300 mt-1">
                  {plan.featuresIntro}
                </div>

                <div className="space-y-1">
                  {plan.features.map((feature) => (
                    <div className="flex justify-start items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-lime-800 dark:text-lime-200 bg-lime-400 dark:bg-lime-600 rounded-full font-bold p-0.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
