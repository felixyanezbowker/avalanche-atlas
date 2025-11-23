import Link from "next/link";
import Image from "next/image";

interface AvalancheCardProps {
  id: string;
  photoUrl?: string | null;
  reportedAt: Date;
  locationName?: string | null;
  region: string;
  slopeAspect: string;
  elevationM?: number | null;
}

export default function AvalancheCard({
  id,
  photoUrl,
  reportedAt,
  locationName,
  region,
  slopeAspect,
  elevationM,
}: AvalancheCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/avalanche/${id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex">
          {photoUrl && (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={photoUrl}
                alt="Avalanche photo"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {locationName || region}
              </h3>
              <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(reportedAt)}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">{region}</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">Aspect: {slopeAspect}</span>
              {elevationM && (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100">{elevationM}m</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

