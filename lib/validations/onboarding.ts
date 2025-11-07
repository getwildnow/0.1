import { z } from "zod";

export const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  address: z.string().min(5, "Please enter a valid address"),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  emergencyContactName: z.string().min(2),
  emergencyContactRelation: z.string().min(2),
  emergencyContactPhone: z.string().regex(/^\+?[\d\s-()]+$/),
});

export const healthGoalsSchema = z.object({
  goals: z.string().min(10, "Please tell us about your health goals"),
  dailyRoutine: z.string().min(10, "Please describe your typical day"),
  concerns: z.string().optional(),
  dreamScenario: z.string().optional(),
  whatMakesBest: z.string().optional(),
});

export const healthHistorySchema = z.object({
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),
  familyHistory: z.record(z.string()).optional(),
  smoking: z.string().optional(),
  drinking: z.string().optional(),
});

export const lifestyleSchema = z.object({
  exerciseFrequency: z.string(),
  dietType: z.string(),
  sleepQuality: z.string(),
  stressLevel: z.string(),
  workType: z.string(),
  screenTime: z.string(),
  caffeineUse: z.string(),
});

export const mentalHealthSchema = z.object({
  workLifeBalance: z.string(),
  socialSupport: z.string(),
  mentalHealthInterest: z.boolean(),
});

export const financialSchema = z.object({
  incomeRange: z.string().optional(),
  occupation: z.string().optional(),
});

