import { NextResponse } from "next/server";
import type { ApiResponse, LeaderboardResponse } from "@/types";

export async function GET() {
  const body: ApiResponse<LeaderboardResponse> = {
    success: true,
    data: {
      mode: "local-only",
      message:
        "There is no global leaderboard. This application has no mandatory database, so typing results are kept locally in each user's browser. See the Statistics page for your own local history.",
    },
  };
  return NextResponse.json(body, { status: 200 });
}
