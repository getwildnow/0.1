import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save user message
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      message: message,
    });

    // TODO: Phase 2 - Integrate OpenAI API here
    // For now, return a placeholder response
    const aiResponse = "I'm learning about you! Check back soon for personalized health insights and support.";

    // Save AI response
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "assistant",
      message: aiResponse,
    });

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get chat history
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

