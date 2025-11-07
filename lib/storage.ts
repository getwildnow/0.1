import { createClient } from "@/lib/supabase/client";

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export async function uploadDocument(
  file: File,
  userId: string,
  docType: "id_front" | "id_back" | "selfie" | "medical_record"
): Promise<string | null> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const path = `${userId}/${docType}_${timestamp}.${extension}`;

  let bucket = "documents";
  if (docType === "selfie") {
    bucket = "profile-photos";
  } else if (docType === "medical_record") {
    bucket = "health-documents";
  } else {
    bucket = "identity-documents";
  }

  return uploadFile(file, bucket, path);
}

