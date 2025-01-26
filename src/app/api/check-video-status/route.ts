import { type NextRequest, NextResponse } from "next/server"
import { videoStore } from "../webhook-video/route"

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")

  if (!runId) {
    return NextResponse.json({ error: "No runId provided" }, { status: 400 })
  }

  if (videoStore[runId]) {
    return NextResponse.json({ status: "success", videoUrl: videoStore[runId] })
  } else {
    return NextResponse.json({ status: "pending" })
  }
}

