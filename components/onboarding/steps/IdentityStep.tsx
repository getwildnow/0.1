"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import Button from "../Button";
import { uploadDocument } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { validateImage } from "@/lib/validations/file-upload";

interface IdentityStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function IdentityStep({ onNext, onBack }: IdentityStepProps) {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!idFront || !idBack || !selfie) return;

    // Validate files
    const validations = [
      validateImage(idFront),
      validateImage(idBack),
      validateImage(selfie),
    ];

    const invalidFile = validations.find((v) => !v.valid);
    if (invalidFile) {
      alert(invalidFile.error);
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in first");
        return;
      }

      // Upload files
      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        uploadDocument(idFront, user.id, "id_front"),
        uploadDocument(idBack, user.id, "id_back"),
        uploadDocument(selfie, user.id, "selfie"),
      ]);

      if (idFrontUrl && idBackUrl && selfieUrl) {
        // Save document URLs to database
        await supabase.from("documents").insert([
          { user_id: user.id, doc_type: "id_front", file_url: idFrontUrl },
          { user_id: user.id, doc_type: "id_back", file_url: idBackUrl },
          { user_id: user.id, doc_type: "selfie", file_url: selfieUrl },
        ]);

        // Update profile photo
        await supabase
          .from("profiles")
          .upsert({ user_id: user.id, profile_photo_url: selfieUrl });

        onNext({ idFrontUrl, idBackUrl, selfieUrl });
      } else {
        alert("Failed to upload files. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600 mb-6">
          We need to verify your identity to provide you with coverage.
        </p>
      </div>

      <FileUpload
        label="ID Front"
        accept="image/*"
        onFileSelect={setIdFront}
        currentFile={idFront}
        required
      />

      <FileUpload
        label="ID Back"
        accept="image/*"
        onFileSelect={setIdBack}
        currentFile={idBack}
        required
      />

      <FileUpload
        label="Selfie for Verification"
        accept="image/*"
        onFileSelect={setSelfie}
        currentFile={selfie}
        required
      />

      <p className="text-sm text-gray-500">
        Your documents are encrypted and stored securely. We use this to verify your identity and
        set up your profile photo.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!idFront || !idBack || !selfie || uploading}
          className="flex-1"
        >
          {uploading ? "Uploading..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}

