import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const userDetail = await currentUser();

    //if User Already Exist
    const checkUser = await prisma.user.findFirst({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    if (!checkUser) {
      if (!userDetail?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json({});
      }

      const data = {
        email: userDetail?.primaryEmailAddress?.emailAddress,
        name: userDetail?.fullName,
        credits: 2,
      };
      const result = await prisma.user.create({
        data,
      });
      return NextResponse.json({ data });
    }
    return NextResponse.json({ data: checkUser });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
