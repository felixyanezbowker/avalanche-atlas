"use server";

import { db } from "@/db";
import { avalanches } from "@/db/schema";
import { createSupabaseServerClient, createSupabaseAdminServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createAvalanche(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to submit a report");
  }

  const region = formData.get("region") as string;
  const slopeAspect = formData.get("slopeAspect") as string;
  const reportedAt = formData.get("reportedAt") as string;
  const avalancheSize = parseInt(formData.get("avalancheSize") as string);
  const triggerType = formData.get("triggerType") as string;
  const locationName = formData.get("locationName") as string | null;
  const elevationM = formData.get("elevationM")
    ? parseInt(formData.get("elevationM") as string)
    : null;
  const mapUrl = formData.get("mapUrl") as string | null;
  const additionalComments = formData.get("additionalComments") as string | null;

  // Get user metadata for name
  const adminSupabase = createSupabaseAdminServerClient();
  const { data: userData } = await adminSupabase.auth.admin.getUserById(user.id);
  const reporterName =
    userData?.user?.user_metadata?.name || userData?.user?.email || "Anonymous";

  // Handle photo upload
  let photoUrl: string | null = null;
  const photoFiles: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("photo_") && value instanceof File) {
      photoFiles.push(value);
    }
  }

  if (photoFiles.length > 0) {
    // Upload first photo to Supabase Storage
    const file = photoFiles[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `avalanche-photos/${fileName}`;

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("avalanche-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = adminSupabase.storage.from("avalanche-photos").getPublicUrl(filePath);
    photoUrl = publicUrl;
  }

  // Get size label
  const sizeLabels: Record<number, string> = {
    1: "1/5 – Very Small (could bury/injure someone)",
    2: "2/5 – Small (could bury/injure someone)",
    3: "3/5 – Medium (could bury a car, destroy a small building)",
    4: "4/5 – Large (could destroy a railway car, large truck, several buildings)",
    5: "5/5 – Very Large (could destroy a village or forest)",
  };

  const avalancheSizeLabel = sizeLabels[avalancheSize] || null;

  // Insert into database
  const [newAvalanche] = await db
    .insert(avalanches)
    .values({
      region,
      slopeAspect: slopeAspect as any,
      reportedAt: new Date(reportedAt),
      avalancheSize,
      avalancheSizeLabel,
      triggerType: triggerType as any,
      locationName,
      elevationM,
      mapUrl,
      photoUrl,
      additionalComments,
      reporterId: user.id,
      reporterName,
      isPublic: true,
    })
    .returning();

  revalidatePath("/");
  return newAvalanche;
}

export async function getRecentAvalanches() {
  const results = await db
    .select()
    .from(avalanches)
    .where(eq(avalanches.isPublic, true))
    .orderBy(desc(avalanches.reportedAt))
    .limit(100);

  return results;
}

export async function getAvalancheById(id: string) {
  const [avalanche] = await db
    .select()
    .from(avalanches)
    .where(eq(avalanches.id, id))
    .limit(1);

  return avalanche;
}

export async function updateAvalanche(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to update a report");
  }

  // Check if user owns the report or is admin
  const existing = await getAvalancheById(id);
  if (!existing) {
    throw new Error("Avalanche report not found");
  }

  const isAdmin = user.email?.includes("admin") || false;
  if (existing.reporterId !== user.id && !isAdmin) {
    throw new Error("You don't have permission to edit this report");
  }

  const region = formData.get("region") as string;
  const slopeAspect = formData.get("slopeAspect") as string;
  const reportedAt = formData.get("reportedAt") as string;
  const avalancheSize = parseInt(formData.get("avalancheSize") as string);
  const triggerType = formData.get("triggerType") as string;
  const locationName = formData.get("locationName") as string | null;
  const elevationM = formData.get("elevationM")
    ? parseInt(formData.get("elevationM") as string)
    : null;
  const mapUrl = formData.get("mapUrl") as string | null;
  const additionalComments = formData.get("additionalComments") as string | null;

  // Handle photo upload if new photos provided
  let photoUrl = existing.photoUrl;
  const photoFiles: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("photo_") && value instanceof File) {
      photoFiles.push(value);
    }
  }

  if (photoFiles.length > 0) {
    const file = photoFiles[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `avalanche-photos/${fileName}`;

    const adminSupabase = createSupabaseAdminServerClient();
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("avalanche-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = adminSupabase.storage.from("avalanche-photos").getPublicUrl(filePath);
      photoUrl = publicUrl;
    }
  }

  const sizeLabels: Record<number, string> = {
    1: "1/5 – Very Small (could bury/injure someone)",
    2: "2/5 – Small (could bury/injure someone)",
    3: "3/5 – Medium (could bury a car, destroy a small building)",
    4: "4/5 – Large (could destroy a railway car, large truck, several buildings)",
    5: "5/5 – Very Large (could destroy a village or forest)",
  };

  const avalancheSizeLabel = sizeLabels[avalancheSize] || null;

  const [updated] = await db
    .update(avalanches)
    .set({
      region,
      slopeAspect: slopeAspect as any,
      reportedAt: new Date(reportedAt),
      avalancheSize,
      avalancheSizeLabel,
      triggerType: triggerType as any,
      locationName,
      elevationM,
      mapUrl,
      photoUrl,
      additionalComments,
    })
    .where(eq(avalanches.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath(`/avalanche/${id}`);
  return updated;
}

