import { getPostsService } from "@/services/post-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getPostsService();
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
