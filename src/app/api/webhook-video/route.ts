import { ComfyDeploy } from "comfydeploy"
import { NextResponse } from "next/server"

const cd = new ComfyDeploy()

// In-memory storage for video URLs (replace with a database in production)
const videoStore: { [key: string]: string } = {}

export async function POST(request: Request) {
  try {
    const data = await cd.validateWebhook({ request })

    const { status, runId, outputs } = data

    console.log("Webhook received:", { status, runId, outputs })

    console.log(JSON.stringify(outputs, null, 2))

    if (status === "success") {
      // Get the URL from the first output's url field
      const videoUrl = outputs[0].data.gifs[0].url
      console.log("Video generated:", videoUrl)
      videoStore[runId] = videoUrl
    }

    // Return success to ComfyDeploy
    return NextResponse.json({ message: "success" }, { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

// API route to get the video URL
export async function GET(request: Request) {
  const url = new URL(request.url)
  const runId = url.searchParams.get("runId")

  if (!runId) {
    return NextResponse.json({ error: "No runId provided" }, { status: 400 })
  }

  if (videoStore[runId]) {
    return NextResponse.json({ status: "success", videoUrl: videoStore[runId] })
  } else {
    return NextResponse.json({ status: "pending" })
  }
}

export { videoStore }

