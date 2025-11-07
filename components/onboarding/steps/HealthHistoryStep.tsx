"use client";

import { useState } from "react";
import Button from "../Button";
import FileUpload from "../FileUpload";

interface HealthHistoryStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function HealthHistoryStep({ onNext, onBack }: HealthHistoryStepProps) {
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [medicalRecords, setMedicalRecords] = useState<File | null>(null);

  const handleSubmit = () => {
    onNext({
      medications: medications.split(",").map((m) => m.trim()).filter(Boolean),
      allergies: allergies.split(",").map((a) => a.trim()).filter(Boolean),
      conditions: conditions.split(",").map((c) => c.trim()).filter(Boolean),
      surgeries: surgeries.split(",").map((s) => s.trim()).filter(Boolean),
      smoking,
      drinking,
      medicalRecords,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health History</h2>
        <p className="text-gray-600">
          Help us understand your health history so we can serve you better.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        <textarea
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="List medications separated by commas (e.g., Aspirin, Metformin)"
          className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="List allergies separated by commas (e.g., Penicillin, Peanuts)"
          className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chronic Conditions
        </label>
        <textarea
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
          className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Past Surgeries/Hospitalizations
        </label>
        <textarea
          value={surgeries}
          onChange={(e) => setSurgeries(e.target.value)}
          placeholder="List any major surgeries or hospitalizations"
          className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
          <select
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="never">Never</option>
            <option value="occasionally">Occasionally</option>
            <option value="regularly">Regularly</option>
            <option value="former">Former smoker</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Drinking</label>
          <select
            value={drinking}
            onChange={(e) => setDrinking(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="never">Never</option>
            <option value="occasionally">Occasionally</option>
            <option value="regularly">Regularly</option>
            <option value="socially">Socially only</option>
          </select>
        </div>
      </div>

      <div>
        <FileUpload
          label="Upload Medical Records (Optional)"
          accept=".pdf,.jpg,.jpeg,.png"
          onFileSelect={setMedicalRecords}
          currentFile={medicalRecords}
        />
        <p className="text-sm text-gray-500 mt-2">
          Upload recent lab results, doctor notes, or medical records
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}

