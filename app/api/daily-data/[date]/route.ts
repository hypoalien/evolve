import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { date: string } }
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
    const collection = client.db().collection("daily-data");
    const dailyData = await collection.findOne({
      userId: userId,
      date: date,
    });

    if (!dailyData) {
      const emptyData = {
        date: date,
        abstinenceItems: [
          { id: 1, text: "No Alcohol", completed: false },
          { id: 2, text: "No Weed", completed: false },
          { id: 3, text: "No Fap", completed: false },
          { id: 4, text: "No Women", completed: false },
        ],
        dailyTasks: [
          { id: 1, text: "Leetcode", completed: false },
          { id: 2, text: "Gym", completed: false },
          { id: 3, text: "Right Food", completed: false },
        ],
        manifestations: Array(5).fill(""),
        journalEntry: "",
      };
      return new Response(JSON.stringify(emptyData), { status: 200 });
    }

    return new Response(JSON.stringify(dailyData), { status: 200 });
  } catch (error) {
    console.error("Error fetching daily data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
