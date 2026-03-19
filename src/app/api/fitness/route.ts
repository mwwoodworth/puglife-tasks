import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startMillis = today.getTime();
    const endMillis = new Date().getTime(); // current time or end of day

    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
            dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startMillis,
        endTimeMillis: endMillis,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Fit API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse step count
    let stepCount = 0;
    try {
      stepCount = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
    } catch (e) {
      // Ignore parsing errors, keep stepCount at 0
    }

    return NextResponse.json({ stepCount });
  } catch (error) {
    console.error("Fitness API Error:", error);
    return NextResponse.json({ error: "Failed to fetch fitness data" }, { status: 500 });
  }
}
