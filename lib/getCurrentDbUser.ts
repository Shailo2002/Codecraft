import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { cache } from "react";

export const getCurrentDbUser = cache(async () => {
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress;

    if (!email) return null;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: clerkUser.fullName,
        credits: 2,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      plan: user.plan,
      premiumExpiresAt: user.premiumExpiresAt,
    };
  } catch (error) {
    console.error("getOrCreateCurrentUser failed:", error);
    throw error;
  }
});

