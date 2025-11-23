"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import AvalancheForm from "@/components/AvalancheForm";
import { createAvalanche } from "@/actions/avalanches";

export default function SubmitPage() {
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/submit");
    }
  }, [user, authLoading, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);

    try {
      await createAvalanche(formData);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Submit Avalanche Report</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <AvalancheForm onSubmit={handleSubmit} loading={submitting} />
        </div>
      </main>
    </div>
  );
}

