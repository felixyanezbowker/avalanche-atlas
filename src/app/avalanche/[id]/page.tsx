import { getAvalancheById } from "@/actions/avalanches";
import { getCommentsByAvalancheId } from "@/actions/comments";
import AvalancheDetail from "@/components/AvalancheDetail";
import CommentSection from "@/components/CommentSection";
import Navigation from "@/components/Navigation";
import { notFound } from "next/navigation";

export default async function AvalancheDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const avalanche = await getAvalancheById(params.id);
  const commentsList = await getCommentsByAvalancheId(params.id);

  if (!avalanche) {
    notFound();
  }

  // Fetch user names for comments
  const { createSupabaseAdminServerClient } = await import("@/lib/supabase/server");
  const adminSupabase = createSupabaseAdminServerClient();
  
  const commentsWithNames = await Promise.all(
    commentsList.map(async (comment) => {
      try {
        const { data: userData } = await adminSupabase.auth.admin.getUserById(comment.userId);
        const userName = userData?.user?.user_metadata?.name || userData?.user?.email || "Anonymous";
        return { ...comment, userName };
      } catch {
        return { ...comment, userName: "Anonymous" };
      }
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AvalancheDetail avalanche={avalanche} />
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <CommentSection avalancheId={params.id} initialComments={commentsWithNames} />
        </div>
      </main>
    </div>
  );
}

