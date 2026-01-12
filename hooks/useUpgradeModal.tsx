import { PaymentModel } from "@/app/workspace/_components/PaymentModel";
import { useState } from "react";

export function useUpgradeModal() {
  const [open, setOpen] = useState(false);

  return {
    open,
    show: () => setOpen(true),
    hide: () => setOpen(false),
    modal: <PaymentModel open={open} onOpenChange={setOpen} />,
  };
}
