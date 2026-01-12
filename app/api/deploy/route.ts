import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("deployement api check");
  try {
    const { htmlCode, projectName, projectId } = await req.json();

    //check is user have premium plan
    const userDetail = await currentUser();

    if (!userDetail) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userDetail.primaryEmailAddress?.emailAddress,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (dbUser.plan !== "PREMIUM") {
      return NextResponse.json(
        {
          message: "Premium plan required to deploy project",
        },
        { status: 403 }
      );
    }

    // 1. Force lowercase and remove spaces for URL safety
    const shortId = projectName.slice(-16);
    const formattedName = shortId.toLowerCase().replace(/\s+/g, "-");

    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.My_VERCEL_ACCESS_TOKEN}`,
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

    const publicUrl = `https://${data.name}.vercel.app`;

    console.log("projectId : ", projectId);
    console.log("publicUrl : ", publicUrl);
    await prisma.project.update({
      where: { projectId: projectId },
      data: { deploymentUrl: publicUrl },
    });

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
