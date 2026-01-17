import prisma from "@/lib/db";

export async function expirePremiumUsers() {
  const expiredUsers = await prisma.user.findMany({
    where: {
      plan: "PREMIUM",
      premiumExpiresAt: { lt: new Date(), not: null },
    },
    select: {
      id: true,
      credits: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });


  for (const user of expiredUsers) {
    let newCredit = 2;
    if (user?._count?.projects >= 2) {
      newCredit = 0;
    } else if (user?._count?.projects === 1) {
      newCredit = 1;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: newCredit, premiumExpiresAt: null, plan: "FREE" },
    });
  }
}
