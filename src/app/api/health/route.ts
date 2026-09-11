import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/infra/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Quick DB ping to ensure connection liveness
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: "connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        db: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
