"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AvalancheDetailProps {
  avalanche: {
    id: string;
    photoUrl?: string | null;
    reportedAt: Date;
    locationName?: string | null;
    region: string;
    elevationM?: number | null;
    slopeAspect: string;
    avalancheSize: number;
    avalancheSizeLabel?: string | null;
    triggerType: string;
    mapUrl?: string | null;
    additionalComments?: string | null;
    reporterId: string;
    reporterName?: string | null;
    createdAt: Date;
  };
}

export default function AvalancheDetail({ avalanche }: AvalancheDetailProps) {
  const { user } = useAuth();
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEdit = user && (user.id === avalanche.reporterId || user.email?.includes("admin"));

  const handleShare = async () => {
    const url = `${window.location.origin}/avalanche/${avalanche.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Avalanche Report - ${avalanche.locationName || avalanche.region}`,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleContactReporter = () => {
    // Note: In production, you'd fetch the reporter's email from the database
    // For now, we'll use reporterName if it's an email, otherwise show a message
    if (avalanche.reporterName && avalanche.reporterName.includes("@")) {
      window.location.href = `mailto:${avalanche.reporterName}`;
    } else {
      alert("Reporter email not available. Please use the share feature to contact them.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {avalanche.photoUrl && (
        <div className="relative w-full h-96">
          <Image
            src={avalanche.photoUrl}
            alt="Avalanche photo"
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {avalanche.locationName || avalanche.region}
            </h1>
            <p className="text-gray-600">Reported: {formatDate(avalanche.reportedAt)}</p>
          </div>
          {canEdit && (
            <Link
              href={`/avalanche/${avalanche.id}/edit`}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Edit
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-500">Region</span>
            <p className="text-lg">{avalanche.region}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Slope Aspect</span>
            <p className="text-lg">{avalanche.slopeAspect}</p>
          </div>
          {avalanche.elevationM && (
            <div>
              <span className="text-sm font-medium text-gray-500">Elevation</span>
              <p className="text-lg">{avalanche.elevationM}m</p>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-500">Avalanche Size</span>
            <p className="text-lg">
              {avalanche.avalancheSize}/5
              {avalanche.avalancheSizeLabel && ` - ${avalanche.avalancheSizeLabel}`}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Trigger Type</span>
            <p className="text-lg capitalize">{avalanche.triggerType}</p>
          </div>
        </div>

        {avalanche.additionalComments && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Additional Comments</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{avalanche.additionalComments}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4 border-t">
          {avalanche.mapUrl && (
            <a
              href={avalanche.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View on Map
            </a>
          )}
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Share Report
          </button>
          {avalanche.reporterName && (
            <button
              onClick={handleContactReporter}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Contact Reporter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

