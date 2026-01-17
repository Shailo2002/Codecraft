export type UserType = {
  id: string;
  email: string;
  name?: string | null;
  credits: number;
  plan: string;
  premiumExpiresAt?: Date | null;
};

