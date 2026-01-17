import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import prisma from "./db";

export const getPaymentDetails = cache(async () => {
  try {
    const userDetail = await currentUser();

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    if (!dbUser) {
      return null;
    }

    const payments = await prisma.payment.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return payments;
  } catch (error) {
    return console.error("getOrCreateCurrentUser failed:", error);
    throw error;
  }
});
