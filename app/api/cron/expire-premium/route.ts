import { expirePremiumUsers } from "@/app/jobs/expirePremiumUsers";
import { NextResponse } from "next/server";

export async function GET() {
  await expirePremiumUsers();
  return NextResponse.json({ ok: true });
}
