"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  userId: string;
  userName?: string | null;
}

interface CommentSectionProps {
  avalancheId: string;
  initialComments: Comment[];
}

export default function CommentSection({ avalancheId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const filteredComments = comments.filter((comment) =>
    comment.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/avalanche/${avalancheId}`);
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avalancheId,
          body: newComment,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment("");
        // Refresh the page to get updated comments list
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to post comment");
      }
    } catch (error) {
      alert("Error posting comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Comments</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          <a href={`/login?redirect=/avalanche/${avalancheId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </a>{" "}
          to post a comment
        </p>
      )}

      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No comments yet.</p>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {comment.userName || "Anonymous"}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-900 dark:text-gray-100">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

