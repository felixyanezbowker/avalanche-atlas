import { getRecentAvalanches } from "@/actions/avalanches";
import AvalancheCard from "@/components/AvalancheCard";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

async function AvalancheList() {
  try {
    const avalancheList = await getRecentAvalanches();

    if (avalancheList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-700 dark:text-gray-300 text-lg">No avalanche reports yet.</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Be the first to submit a report!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avalancheList.map((avalanche) => (
          <AvalancheCard
            key={avalanche.id}
            id={avalanche.id}
            photoUrl={avalanche.photoUrl}
            reportedAt={avalanche.reportedAt}
            locationName={avalanche.locationName}
            region={avalanche.region}
            slopeAspect={avalanche.slopeAspect}
            elevationM={avalanche.elevationM}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching avalanches:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg">Error loading avalanche reports.</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please check your database connection.</p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Recent Avalanches</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <AvalancheList />
        </Suspense>
      </main>
    </div>
  );
}
