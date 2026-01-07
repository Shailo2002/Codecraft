import { pricingPlans } from "@/app/constants/pricing-plans";
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
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { Check, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function PaymentModel({ children }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const handlePayment = async (type: string, name: string) => {
    setLoading(true);
    setSelectedPlan(name);
    try {
      const response = await axios.post("/api/create-checkout-session", {
        type,
      });
      const data = response.data;
      console.log("stripe frontend data : ", data)
      window.location.href = data.url;
    } catch (error) {
      console.log("error : ", error);
      toast.error("payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
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
                    onClick={() => handlePayment(plan.payment_type, plan.name)}
                    disabled={loading}
                  >
                    {selectedPlan === plan.name && <Spinner />} {plan.cta}
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
