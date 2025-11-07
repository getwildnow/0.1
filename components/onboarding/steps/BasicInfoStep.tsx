"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema } from "@/lib/validations/onboarding";
import Button from "../Button";

interface BasicInfoStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function BasicInfoStep({ onNext, onBack }: BasicInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName")}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          {...register("dob")}
          type="date"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register("address")}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="123 Main St, San Francisco, CA 94102"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phone")}
          type="tel"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("emergencyContactName")}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Jane Doe"
            />
            {errors.emergencyContactName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyContactName.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              {...register("emergencyContactRelation")}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Spouse, Parent, Friend..."
            />
            {errors.emergencyContactRelation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyContactRelation.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register("emergencyContactPhone")}
              type="tel"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
            {errors.emergencyContactPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emergencyContactPhone.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
}

