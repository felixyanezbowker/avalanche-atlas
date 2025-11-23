"use client";

import { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload";

const ANDORRA_REGIONS = [
  "Ordino Arcalis",
  "Pal",
  "Arinsal",
  "Soldeu",
  "El Tarter",
  "Pas de la Casa",
  "Grau Roig",
  "Comapedrosa",
  "Sorteny",
  "Ransol",
  "Vall del Madriu",
  "Incles",
];

const SLOPE_ASPECTS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

const TRIGGER_TYPES = ["natural", "accidental", "remote", "unknown"] as const;

const AVALANCHE_SIZES = [
  { value: 1, label: "1/5 – Very Small (could bury/injure someone)" },
  { value: 2, label: "2/5 – Small (could bury/injure someone)" },
  { value: 3, label: "3/5 – Medium (could bury a car, destroy a small building)" },
  { value: 4, label: "4/5 – Large (could destroy a railway car, large truck, several buildings)" },
  { value: 5, label: "5/5 – Very Large (could destroy a village or forest)" },
];

interface AvalancheFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: {
    locationName?: string | null;
    region?: string;
    elevationM?: number | null;
    slopeAspect?: string;
    avalancheSize?: number;
    avalancheSizeLabel?: string | null;
    triggerType?: string;
    mapUrl?: string | null;
    additionalComments?: string | null;
    photoUrl?: string | null;
    reportedAt?: Date;
  };
  loading?: boolean;
}

export default function AvalancheForm({ onSubmit, initialData, loading }: AvalancheFormProps) {
  const [locationName, setLocationName] = useState(initialData?.locationName || "");
  const [region, setRegion] = useState(initialData?.region || "");
  const [elevationM, setElevationM] = useState(initialData?.elevationM?.toString() || "");
  const [slopeAspect, setSlopeAspect] = useState(initialData?.slopeAspect || "");
  const [avalancheSize, setAvalancheSize] = useState(initialData?.avalancheSize?.toString() || "");
  const [triggerType, setTriggerType] = useState(initialData?.triggerType || "");
  const [mapUrl, setMapUrl] = useState(initialData?.mapUrl || "");
  const [additionalComments, setAdditionalComments] = useState(
    initialData?.additionalComments || ""
  );
  const [reportedAt, setReportedAt] = useState(
    initialData?.reportedAt
      ? new Date(initialData.reportedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setLocationName(initialData.locationName || "");
      setRegion(initialData.region || "");
      setElevationM(initialData.elevationM?.toString() || "");
      setSlopeAspect(initialData.slopeAspect || "");
      setAvalancheSize(initialData.avalancheSize?.toString() || "");
      setTriggerType(initialData.triggerType || "");
      setMapUrl(initialData.mapUrl || "");
      setAdditionalComments(initialData.additionalComments || "");
      setReportedAt(
        initialData.reportedAt
          ? new Date(initialData.reportedAt).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!region) newErrors.region = "Region is required";
    if (!slopeAspect) newErrors.slopeAspect = "Slope aspect is required";
    if (!reportedAt) newErrors.reportedAt = "Date is required";
    if (!avalancheSize) newErrors.avalancheSize = "Avalanche size is required";
    if (!triggerType) newErrors.triggerType = "Trigger type is required";

    // Validate date is not in the future
    if (reportedAt && new Date(reportedAt) > new Date()) {
      newErrors.reportedAt = "Date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("region", region);
    formData.append("slopeAspect", slopeAspect);
    formData.append("reportedAt", reportedAt);
    formData.append("avalancheSize", avalancheSize);
    formData.append("triggerType", triggerType);
    if (locationName) formData.append("locationName", locationName);
    if (elevationM) formData.append("elevationM", elevationM);
    if (mapUrl) formData.append("mapUrl", mapUrl);
    if (additionalComments) formData.append("additionalComments", additionalComments);
    photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo);
    });

    await onSubmit(formData);
  };

  const selectedSizeLabel = AVALANCHE_SIZES.find((s) => s.value.toString() === avalancheSize)?.label;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          Region <span className="text-red-500">*</span>
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.region ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a region</option>
          {ANDORRA_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
      </div>

      <div>
        <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">
          Location Name (optional)
        </label>
        <input
          id="locationName"
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Vall del Madriu"
        />
      </div>

      <div>
        <label htmlFor="slopeAspect" className="block text-sm font-medium text-gray-700">
          Slope Aspect <span className="text-red-500">*</span>
        </label>
        <select
          id="slopeAspect"
          value={slopeAspect}
          onChange={(e) => setSlopeAspect(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.slopeAspect ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select aspect</option>
          {SLOPE_ASPECTS.map((aspect) => (
            <option key={aspect} value={aspect}>
              {aspect}
            </option>
          ))}
        </select>
        {errors.slopeAspect && (
          <p className="mt-1 text-sm text-red-600">{errors.slopeAspect}</p>
        )}
      </div>

      <div>
        <label htmlFor="reportedAt" className="block text-sm font-medium text-gray-700">
          Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          id="reportedAt"
          type="datetime-local"
          value={reportedAt}
          onChange={(e) => setReportedAt(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.reportedAt ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.reportedAt && <p className="mt-1 text-sm text-red-600">{errors.reportedAt}</p>}
      </div>

      <div>
        <label htmlFor="elevationM" className="block text-sm font-medium text-gray-700">
          Elevation (meters, optional)
        </label>
        <input
          id="elevationM"
          type="number"
          value={elevationM}
          onChange={(e) => setElevationM(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 2500"
        />
      </div>

      <div>
        <label htmlFor="avalancheSize" className="block text-sm font-medium text-gray-700">
          Avalanche Size <span className="text-red-500">*</span>
        </label>
        <select
          id="avalancheSize"
          value={avalancheSize}
          onChange={(e) => setAvalancheSize(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.avalancheSize ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select size</option>
          {AVALANCHE_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        {errors.avalancheSize && (
          <p className="mt-1 text-sm text-red-600">{errors.avalancheSize}</p>
        )}
      </div>

      <div>
        <label htmlFor="triggerType" className="block text-sm font-medium text-gray-700">
          Cause/Trigger Type <span className="text-red-500">*</span>
        </label>
        <select
          id="triggerType"
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.triggerType ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select trigger type</option>
          {TRIGGER_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.triggerType && <p className="mt-1 text-sm text-red-600">{errors.triggerType}</p>}
      </div>

      <div>
        <label htmlFor="mapUrl" className="block text-sm font-medium text-gray-700">
          Map Link (optional)
        </label>
        <input
          id="mapUrl"
          type="url"
          value={mapUrl}
          onChange={(e) => setMapUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://mapy.com/..."
        />
      </div>

      <PhotoUpload
        onPhotosChange={setPhotos}
        existingPhotoUrl={initialData?.photoUrl}
      />

      <div>
        <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
          Additional Comments (optional)
        </label>
        <textarea
          id="additionalComments"
          rows={4}
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any additional details about the avalanche..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Submitting..." : initialData ? "Update Report" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}

