export type UserType = {
  id: string;
  email: string;
  name: string;
  credits: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: string;
  premiumExpiresAt?: Date;
};
