import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { validateResultSubmission } from "@/lib/validation";

interface ResultsConfigResponse {
  acceptedDurations: number[];
  acceptedDifficulties: string[];
  maxPlausibleWpm: number;
  note: string;
}

/** Describes what POST accepts — useful for API consumers, not a stored resource. */
export async function GET() {
  const body: ApiResponse<ResultsConfigResponse> = {
    success: true,
    data: {
      acceptedDurations: [15, 30, 60, 120],
      acceptedDifficulties: ["easy", "medium", "hard"],
      maxPlausibleWpm: 400,
      note: "This endpoint validates result payloads. It does not store or return past results — there is no server-side database.",
    },
  };
  return NextResponse.json(body, { status: 200 });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    const body: ApiResponse<never> = { success: false, error: "Request body must be valid JSON." };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = validateResultSubmission(payload);

  if (!parsed.success) {
    const body: ApiResponse<never> = {
      success: false,
      error: parsed.error.issues.map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`).join("; "),
    };
    return NextResponse.json(body, { status: 422 });
  }

  const body: ApiResponse<{ message: string }> = {
    success: true,
    data: {
      message:
        "Result validated successfully. This API does not persist data — your result is stored locally in your browser.",
    },
  };
  return NextResponse.json(body, { status: 200 });
}
