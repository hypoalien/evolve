// app/api/templates/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Template {
  abstinenceItems: string[];
  dailyTasks: string[];
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const userId = session.user.id;
    if (!userId || typeof userId !== "string") {
      return new Response("Invalid UserId", { status: 400 });
    }

    const client = await db;
    const collection = client.db().collection("templates");
    const template = await collection.findOne({ userId });

    return new Response(
      JSON.stringify(
        template || {
          abstinenceItems: ["No Alcohol"],
          dailyTasks: ["Workout", "Eat healthy"],
        }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching template:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

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

    const data: Template = await req.json();
    const client = await db;
    const collection = client.db().collection("templates");

    await collection.updateOne(
      { userId },
      {
        $set: {
          userId,
          abstinenceItems: data.abstinenceItems,
          dailyTasks: data.dailyTasks,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error saving template:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
