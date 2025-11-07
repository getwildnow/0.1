import { createClient } from "@/lib/supabase/client";

export async function saveOnboardingData(userId: string, step: number, data: any) {
  const supabase = createClient();

  try {
    switch (step) {
      case 2: // Health Goals
        await supabase.from("health_goals").upsert({
          user_id: userId,
          goals_text: data.goals,
          daily_routine: data.dailyRoutine,
          health_concerns: data.concerns,
          dream_scenario: data.dreamScenario,
          what_makes_best: data.whatMakesBest,
        });
        break;

      case 3: // Basic Info
        await supabase.from("profiles").upsert({
          user_id: userId,
          full_name: data.fullName,
          dob: data.dob,
          address: data.address,
          phone: data.phone,
          emergency_contact: {
            name: data.emergencyContactName,
            relation: data.emergencyContactRelation,
            phone: data.emergencyContactPhone,
          },
        });
        break;

      case 4: // Identity - already handled in IdentityStep component
        // Files are uploaded and saved there
        break;

      case 5: // Health History
        await supabase.from("health_records").upsert({
          user_id: userId,
          medications: data.medications || [],
          allergies: data.allergies || [],
          chronic_conditions: data.conditions || [],
          surgeries: data.surgeries || [],
          smoking: data.smoking,
          drinking: data.drinking,
        });
        break;

      case 6: // Lifestyle
        await supabase.from("lifestyle_data").upsert({
          user_id: userId,
          exercise_frequency: data.exerciseFrequency,
          diet_type: data.dietType,
          sleep_quality: data.sleepQuality,
          stress_level: data.stressLevel,
          work_type: data.workType,
          screen_time: data.screenTime,
          caffeine_use: data.caffeineUse,
        });
        break;

      case 7: // Integrations Tier 1
        if (data.appleHealth) {
          await supabase.from("integrations").upsert({
            user_id: userId,
            integration_type: "apple_health",
            connection_status: "connected",
          });
        }
        if (data.googleWorkspace) {
          await supabase.from("integrations").upsert({
            user_id: userId,
            integration_type: "google_workspace",
            connection_status: "connected",
          });
        }
        if (data.instagram) {
          await supabase.from("social_media_accounts").upsert({
            user_id: userId,
            platform: "instagram",
            connection_status: "connected",
          });
        }
        if (data.linkedin) {
          await supabase.from("social_media_accounts").upsert({
            user_id: userId,
            platform: "linkedin",
            connection_status: "connected",
          });
        }
        break;

      case 8: // Integrations Tier 2
        if (data.strava) {
          await supabase.from("integrations").upsert({
            user_id: userId,
            integration_type: "strava",
            connection_status: "connected",
          });
        }
        if (data.myfitnesspal) {
          await supabase.from("integrations").upsert({
            user_id: userId,
            integration_type: "myfitnesspal",
            connection_status: "connected",
          });
        }
        if (data.spotify) {
          await supabase.from("integrations").upsert({
            user_id: userId,
            integration_type: "spotify",
            connection_status: "connected",
          });
        }
        if (data.twitter) {
          await supabase.from("social_media_accounts").upsert({
            user_id: userId,
            platform: "twitter",
            connection_status: "connected",
          });
        }
        break;

      case 9: // Wearable
        await supabase.from("wearables").upsert({
          user_id: userId,
          device_type: data.deviceType,
          connection_status: data.deviceType === "existing" ? "connected" : "pending",
          shipping_status: data.deviceType !== "existing" ? "pending" : null,
        });
        break;

      case 10: // Mental Health
        await supabase.from("lifestyle_data").update({
          work_life_balance: data.workLifeBalance,
          social_support: data.socialSupport,
          mental_health_interest: data.mentalHealthInterest,
        }).eq("user_id", userId);
        break;

      case 11: // Financial
        if (data.incomeRange || data.occupation) {
          await supabase.from("profiles").update({
            income_range: data.incomeRange,
            occupation: data.occupation,
          }).eq("user_id", userId);
        }
        break;

      case 12: // Consents
        const consentTypes = Object.keys(data).filter((key) => data[key] === true);
        for (const consentType of consentTypes) {
          await supabase.from("consents").insert({
            user_id: userId,
            consent_type: consentType,
          });
        }
        break;

      case 13: // Complete - Password setup
        // Password is handled by Supabase Auth
        await supabase.auth.updateUser({ password: data.password });
        break;
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return { success: false, error };
  }
}

