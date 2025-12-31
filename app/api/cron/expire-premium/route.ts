import { expirePremiumUsers } from "@/app/jobs/expirePremiumUsers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await expirePremiumUsers();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}
