import prisma from "@/lib/db";

export async function expirePremiumUsers() {
  const expiredUsers = await prisma.user.findMany({
    where: {
      plan: "PREMIUM",
      premiumExpiresAt: { lt: new Date(), not: null },
    },
    include: {
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  console.log("expiredUser : ", expiredUsers);

  // for (const user of expiredUsers) {
  //   let newCredit = 2;

  //   const projectCount = user._count?.projects ?? 0;

  //   if (projectCount >= 2) {
  //     newCredit = 0;
  //   } else if (projectCount === 1) {
  //     newCredit = 1;
  //   }

  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: { credits: newCredit, premiumExpiresAt: null, plan: "FREE" },
  //   });
  // }
}
