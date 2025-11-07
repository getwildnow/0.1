"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import Button from "../Button";

interface IdentityStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function IdentityStep({ onNext, onBack }: IdentityStepProps) {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const handleSubmit = () => {
    if (idFront && idBack && selfie) {
      onNext({ idFront, idBack, selfie });
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
          disabled={!idFront || !idBack || !selfie}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

