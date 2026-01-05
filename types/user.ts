export type UserType = {
  id: string;
  email: string;
  name?: string | null;
  credits: number;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  plan: string;
  premiumExpiresAt?: Date | null;
};

