import { NextResponse } from "next/server";
import type { ApiResponse, HealthCheckResponse } from "@/types";

const startedAt = Date.now();

export async function GET() {
  const body: ApiResponse<HealthCheckResponse> = {
    success: true,
    data: {
      status: "ok",
      service: "keyboard-tester",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    },
  };
  return NextResponse.json(body, { status: 200 });
}
