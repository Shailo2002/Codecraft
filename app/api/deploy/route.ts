import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { htmlCode, projectName } = await req.json();

    // 1. Force lowercase and remove spaces for URL safety
    const shortId = projectName.slice(-16);
    const formattedName = shortId.toLowerCase().replace(/\s+/g, "-");

    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formattedName,
        target: "production", // ensuring it's a production deployment
        files: [
          {
            file: "index.html",
            data: htmlCode,
          },
        ],
        projectSettings: {
          framework: null,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { error: data.error?.message || "Deployment failed" },
        { status: response.status || 500 }
      );
    }

    // --- THE FIX IS HERE ---
    // data.url is the PRIVATE deployment hash (e.g., project-d83838...vercel.app)
    // We want the PUBLIC production alias (e.g., project.vercel.app)

    // We construct it manually because Vercel reserves this name for you immediately:
    const publicUrl = `https://${data.name}.vercel.app`;

    return NextResponse.json({
      url: publicUrl,
      dashboardUrl: data.inspectorUrl,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
