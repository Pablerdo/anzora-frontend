import { NextRequest, NextResponse } from 'next/server'
import { ComfyDeploy } from "comfydeploy";

const cd = new ComfyDeploy({
  bearer: process.env.COMFY_DEPLOY_API_KEY!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const positivePrompt = formData.get('prompt') ?? '';

  console.log("Received form data:", Object.fromEntries(formData))

  try {
    const result = await cd.run.deployment.queue({
      deploymentId: "5153923e-a313-4087-9953-976135bd67d8",
      webhook: `${req.nextUrl.origin}/api/webhook`,
      inputs: {
        "steps": 20,
        "positive_prompt": positivePrompt,
      }
    });

    if (result) {
      const runId = result.runId;
      // In a real application, you'd save this runId to a database
      console.log("Run ID:", runId);

      return NextResponse.json({ 
        message: 'Image generation started',
        runId: runId
      });
    } else {
      throw new Error('Failed to start image generation');
    }
  } catch (error) {
    console.error('Error starting image generation:', error);
    return NextResponse.json({ error: 'Failed to start image generation' }, { status: 500 });
  }
  
}

