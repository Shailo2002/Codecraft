"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Ban,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { Payment } from "@/types/payment";

interface MyUserButtonProps {
  payments: Payment[];
  user?: any;
}

const MyUserButton = ({ payments, user }: MyUserButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    setLoading(true);
    try {
      await axios.post("/api/razorpay/cancel-subscription");
      toast.success("Subscription cancelled.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "captured":
      case "succeeded":
      case "paid":
        return {
          label: "Completed",
          color:
            "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
          icon: <CheckCircle2 size={12} />,
        };
      case "failed":
        return {
          label: "Failed",
          color:
            "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
          icon: <XCircle size={12} />,
        };
      case "created":
      case "pending":
      case "processing":
        return {
          label: "Processing",
          color:
            "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
          icon: <Clock size={12} />,
        };
      default:
        return {
          label: status,
          color:
            "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
          icon: <Clock size={12} />,
        };
    }
  };

  return (
    <>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Payment Settings"
            labelIcon={<CreditCard size={15} />}
            onClick={() => setIsDialogOpen(true)}
          />
        </UserButton.MenuItems>
      </UserButton>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Subscription & Billing</DialogTitle>
            <DialogDescription>
              Manage your plan, check credits, and view payment history.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            <div className="grid grid-cols-2 gap-3">
              {/* Plan Card */}
              <div
                className={`bg-secondary/40 border-2 ${
                  user?.plan === "PREMIUM" && "border-amber-400"
                } p-3 rounded-xl flex flex-col gap-1`}
              >
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Current Plan
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {user?.plan || "Free"}
                  </span>
                  {user?.plan !== "FREE" && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Credits Card */}
              <div className="bg-secondary/40 p-3 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Remaining Credits
                </span>
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  <span className="text-lg font-bold">
                    {user?.credits !== undefined ? user.credits : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Unsubscribe Action (Hidden for Free users) */}
            {user?.razorpaySubscriptionId && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50 flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-red-900 dark:text-red-200">
                    Cancel Subscription
                  </p>
                  <p className="text-xs text-red-700/80 dark:text-red-300/70">
                    Downgrade to Free plan at end of cycle
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => handleCancel()}
                  disabled={loading}
                >
                  <Ban size={14} />
                  {loading ? <Spinner /> : "Unsubscribe"}
                </Button>
              </div>
            )}

            {/* 3. Transaction History List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Transaction History
              </h3>

              <div className="max-h-[280px] overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors bg-card"
                      >
                        <div className="flex flex-col gap-1.5">
                          {/* Amount and Status */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium border ${statusConfig.color}`}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </div>

                          {/* Date and Time */}
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {formatDateTime(payment.createdAt)}
                          </span>
                        </div>

                        {/* Type Badge */}
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded capitalize border border-border/50">
                            {payment.type === "one_time"
                              ? "One-time"
                              : "Subscription"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                    <CreditCard className="mb-2 opacity-50" size={32} />
                    <p className="text-sm">No transaction history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-2 mt-2">
            <p className="text-[10px] text-muted-foreground self-center">
              Secure payments powered by Stripe/Razorpay
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyUserButton;
