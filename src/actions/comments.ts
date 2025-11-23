"use server";

import { db } from "@/db";
import { comments } from "@/db/schema";
import { createSupabaseServerClient, createSupabaseAdminServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createComment(avalancheId: string, body: string) {
  const supabase = createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to comment");
  }

  const adminSupabase = createSupabaseAdminServerClient();
  const { data: userData } = await adminSupabase.auth.admin.getUserById(user.id);
  const userName = userData?.user?.user_metadata?.name || userData?.user?.email || "Anonymous";

  const [newComment] = await db
    .insert(comments)
    .values({
      avalancheId,
      userId: user.id,
      body,
      isPublic: true,
    })
    .returning();

  revalidatePath(`/avalanche/${avalancheId}`);
  return { ...newComment, userName };
}

export async function getCommentsByAvalancheId(avalancheId: string) {
  const results = await db
    .select()
    .from(comments)
    .where(eq(comments.avalancheId, avalancheId))
    .orderBy(desc(comments.createdAt));

  // Note: In a real implementation, you'd join with users table to get names
  // For now, we'll return comments and fetch user names separately if needed
  return results;
}

