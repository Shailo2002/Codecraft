import { Suspense } from "react";
import PaymentCancelClient from "./PaymentCancelClient";

export const dynamic = "force-dynamic";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelClient />
    </Suspense>
  );
}
