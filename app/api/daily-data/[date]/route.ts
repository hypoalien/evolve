import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const { date } = await params;
    const client = await db;

    // First get the user's template
    const templateCollection = client.db().collection("templates");
    const template = await templateCollection.findOne({ userId });

    const collection = client.db().collection("daily-data");
    const dailyData = await collection.findOne({
      userId,
      date,
    });

    if (!dailyData) {
      const defaultItems = template || {
        abstinenceItems: ["No Alcohol"],
        dailyTasks: ["Workout", "Eat healthy"],
      };

      const emptyData = {
        date,
        abstinenceItems: defaultItems.abstinenceItems.map(
          (text: string, index: number) => ({
            id: index + 1,
            text,
            completed: false,
          })
        ),
        dailyTasks: defaultItems.dailyTasks.map(
          (text: string, index: number) => ({
            id: index + 1,
            text,
            completed: false,
          })
        ),
        manifestations: Array(5).fill(""),
        journalEntry: "",
      };
      return NextResponse.json(emptyData);
    }

    return NextResponse.json(dailyData);
  } catch (error) {
    console.error("Error fetching daily data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
