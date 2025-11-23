import { NextRequest, NextResponse } from "next/server";
import { createComment } from "@/actions/comments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avalancheId, body: commentBody } = body;

    if (!avalancheId || !commentBody) {
      return NextResponse.json(
        { error: "avalancheId and body are required" },
        { status: 400 }
      );
    }

    const comment = await createComment(avalancheId, commentBody);
    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

