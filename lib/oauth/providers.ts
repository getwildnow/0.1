import { createClient } from "@/lib/supabase/client";

export const OAUTH_PROVIDERS = {
  google: {
    name: "Google Workspace",
    scopes: ["email", "profile", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/gmail.readonly"],
  },
  instagram: {
    name: "Instagram",
    scopes: ["user_profile", "user_media"],
  },
  linkedin: {
    name: "LinkedIn",
    scopes: ["r_liteprofile", "r_emailaddress"],
  },
  strava: {
    name: "Strava",
    scopes: ["read", "activity:read"],
  },
  spotify: {
    name: "Spotify",
    scopes: ["user-read-email", "user-read-private"],
  },
  twitter: {
    name: "Twitter/X",
    scopes: ["tweet.read", "users.read"],
  },
} as const;

export async function initiateOAuth(provider: keyof typeof OAUTH_PROVIDERS) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback/${provider}`,
      scopes: OAUTH_PROVIDERS[provider].scopes.join(" "),
    },
  });

  if (error) {
    console.error("OAuth error:", error);
    throw error;
  }

  return data;
}

export async function saveOAuthToken(
  userId: string,
  provider: string,
  token: string,
  integrationType: string
) {
  const supabase = createClient();

  // Save to integrations table
  await supabase.from("integrations").upsert({
    user_id: userId,
    integration_type: integrationType,
    connection_status: "connected",
    oauth_token: token,
    last_synced: new Date().toISOString(),
  });

  // If it's a social media platform, also save to social_media_accounts
  if (["instagram", "linkedin", "twitter"].includes(provider)) {
    await supabase.from("social_media_accounts").upsert({
      user_id: userId,
      platform: provider,
      oauth_token: token,
      connected_at: new Date().toISOString(),
    });
  }
}

