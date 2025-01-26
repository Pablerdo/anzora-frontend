import { NextRequest, NextResponse } from "next/server"
import { ComfyDeploy } from "comfydeploy"

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const prompt = formData.get("prompt")
  const imageUrl = formData.get("inputImageUrl")
  
  // Log the received data for debugging
  console.log("Received form data:", Object.fromEntries(formData))


  try {
    const result = await cd.run.deployment.queue({
      deploymentId: "ff9ed2d9-b1c0-4036-b700-e4eb9c08f945",
      webhook: `${req.nextUrl.origin}/api/webhook-video`,
      inputs: {
        "input_image": imageUrl,
        "input_prompt": prompt,
      },
    })

    if (result) {
      const runId = result.runId
      console.log("Run ID:", runId)

      return NextResponse.json({
        message: "Video generation started",
        runId: runId,
      })
    } else {
      throw new Error("Failed to start video generation")
    }
  } catch (error) {
    console.error("Error starting video generation:", error)
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 })
  }
}

