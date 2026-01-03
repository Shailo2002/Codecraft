"use client";

import { XCircle, AlertCircle} from "lucide-react";
import { useRouter } from "next/navigation";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-red-100">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-red-100 p-3 mb-2">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your payment process was cancelled or failed. No charges were made
            to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              If you experienced an error, please try again or contact support.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => {
              window.location.href =
                "mailto:shaileshdeviitr@gmail.com?subject=Support Request For Payment Failure&body=Hi there, I need help with...";
            }}
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
