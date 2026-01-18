"use client";

import { XCircle, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reason =
    searchParams.get("reason") || "The payment process was cancelled.";
  const paymentId = searchParams.get("payment_id");
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-red-100 dark:border-red-500">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-red-100 p-3 mb-2">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your payment process was cancelled or failed. No charges were made
            to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 text-sm border border-gray-100 dark:border-gray-600">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                #{paymentId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {date}
              </span>
            </div>
          </div>
        </CardContent>

        <CardContent>
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-200 border border-amber-200 dark:border-amber-400 rounded-md p-3 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{reason}, please try again or contact support.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => router.push("/contact")}
          >
            Contact Us
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/workspace")}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
