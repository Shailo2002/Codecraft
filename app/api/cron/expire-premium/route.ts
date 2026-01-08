import { expirePremiumUsers } from "@/app/jobs/expirePremiumUsers";

export async function GET() {
  console.log("CRON FIRED AT:", new Date().toISOString());

  try {
    await expirePremiumUsers();
    return Response.json({ ok: true });
  } catch (e) {
    console.error("CRON ERROR", e);
    return Response.json({ ok: false });
  }
}
