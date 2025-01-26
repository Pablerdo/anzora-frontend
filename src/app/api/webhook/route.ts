import { ComfyDeploy } from "comfydeploy";
import { NextResponse } from "next/server";

const cd = new ComfyDeploy();

// In-memory storage for image URLs (replace with a database in production)
let imageStore: { [key: string]: string } = {};

export async function POST(request: Request) {
  try {
    const data = await cd.validateWebhook({ request });

    const { status, runId, outputs } = data;

    console.log("Webhook received:", { status, runId, outputs });

    console.log(JSON.stringify(outputs, null, 2))
    
    if (status === 'success') {
      // Get the URL from the first output's url field
      const imageUrl = outputs[0].data.images[0].url;
      console.log("Image generated:", imageUrl);
      // Store the image URL
      imageStore[runId] = imageUrl;
    }

    // Return success to ComfyDeploy
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

// API route to get the image URL
export async function GET(request: Request) {
  const url = new URL(request.url);
  const runId = url.searchParams.get('runId');

  if (!runId) {
    return NextResponse.json({ error: 'No runId provided' }, { status: 400 });
  }

  if (imageStore[runId]) {
    return NextResponse.json({ status: 'success', imageUrl: imageStore[runId] });
  } else {
    return NextResponse.json({ status: 'pending' });
  }
}

export { imageStore };

