"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
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

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get("payment_id") || "N/A";
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-green-200">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your transaction has been completed
            successfully.
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
              <span className="text-gray-500">{date}</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push("/workspace")}
          >
            Go to Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="w-full text-gray-500"
            onClick={() => router.push("/workspace")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
