import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const data = await req.json();
    const client = await db;
    const collection = client.db().collection("daily-data");

    const existingData = await collection.findOne({
      userId: userId,
      date: data.date,
    });

    if (existingData) {
      await collection.updateOne(
        { userId: userId, date: data.date },
        {
          $set: {
            abstinenceItems: data.abstinenceItems,
            dailyTasks: data.dailyTasks,
            manifestations: data.manifestations,
            journalEntry: data.journalEntry,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await collection.insertOne({
        userId: userId,
        date: data.date,
        abstinenceItems: data.abstinenceItems,
        dailyTasks: data.dailyTasks,
        manifestations: data.manifestations,
        journalEntry: data.journalEntry,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return new Response(
      JSON.stringify({ message: "Data saved successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving daily data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
