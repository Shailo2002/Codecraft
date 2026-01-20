import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export const dynamic = "force-dynamic";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
