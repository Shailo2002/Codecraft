import { expirePremiumUsers } from "@/app/jobs/expirePremiumUsers";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("CRON FIRED AT:", new Date().toISOString());

  try {
    await expirePremiumUsers();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}
