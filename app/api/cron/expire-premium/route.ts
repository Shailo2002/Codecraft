import { expirePremiumUsers } from "@/app/jobs/expirePremiumUsers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // const authHeader = req.headers.get("authorization");

  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  console.log("CRON FIRED AT:", new Date().toISOString());

  try {
    await expirePremiumUsers();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
