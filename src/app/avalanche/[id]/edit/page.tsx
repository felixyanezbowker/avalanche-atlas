import { getAvalancheById } from "@/actions/avalanches";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/avalanche/${params.id}/edit`);
  }

  const avalanche = await getAvalancheById(params.id);

  if (!avalanche) {
    redirect("/");
  }

  const isAdmin = user.email?.includes("admin") || false;
  if (avalanche.reporterId !== user.id && !isAdmin) {
    redirect(`/avalanche/${params.id}`);
  }

  return <EditForm avalanche={avalanche} avalancheId={params.id} />;
}

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!avalanche) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Avalanche report not found"}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);

    try {
      await updateAvalanche(params.id, formData);
      router.push(`/avalanche/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update report");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Avalanche Report</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
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

