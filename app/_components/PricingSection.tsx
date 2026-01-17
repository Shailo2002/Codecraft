import { Check } from "lucide-react";
import { pricingPlans } from "../constants/pricing-plans";

export default function PricingDisplay() {
  return (
    <div className="w-full py-12 px-4 md:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Upgrade Your Plan
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Get full access by choosing a subscription plan that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col border-black-400 border-2 rounded-xl shadow-sm bg-card text-card-foreground p-6 h-full"
          >
            <div className="font-semibold text-xl">{plan.name}</div>

            <div className="flex justify-start items-end gap-2 mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <div className="flex flex-col text-sm text-muted-foreground mb-1">
                <span>{plan.period}</span>
              </div>
            </div>

            <div className="mt-6 mb-8 text-sm text-muted-foreground">
              {plan.description}
            </div>

            <div className="pt-6 border-t mt-auto">
              <div className="font-semibold text-sm mb-4">Features</div>
              <div className="mb-4 text-sm text-muted-foreground">
                {plan.featuresIntro}
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="h-5 w-5 shrink-0 text-lime-800 bg-lime-400 rounded-full p-1" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

