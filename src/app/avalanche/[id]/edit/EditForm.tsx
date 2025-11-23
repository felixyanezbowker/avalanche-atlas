"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import AvalancheForm from "@/components/AvalancheForm";
import { updateAvalanche } from "@/actions/avalanches";

interface EditFormProps {
  avalanche: any;
  avalancheId: string;
}

export default function EditForm({ avalanche, avalancheId }: EditFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);

    try {
      await updateAvalanche(avalancheId, formData);
      router.push(`/avalanche/${avalancheId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update report");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Edit Avalanche Report</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <AvalancheForm
            onSubmit={handleSubmit}
            initialData={avalanche}
            loading={submitting}
          />
        </div>
      </main>
    </div>
  );
}

