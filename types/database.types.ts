export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: string
          company_id: string | null
          onboarding_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          company_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          company_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          user_id: string
          full_name: string | null
          dob: string | null
          address: string | null
          phone: string | null
          emergency_contact: Json | null
          profile_photo_url: string | null
          income_range: string | null
          occupation: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          full_name?: string | null
          dob?: string | null
          address?: string | null
          phone?: string | null
          emergency_contact?: Json | null
          profile_photo_url?: string | null
          income_range?: string | null
          occupation?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string | null
          dob?: string | null
          address?: string | null
          phone?: string | null
          emergency_contact?: Json | null
          profile_photo_url?: string | null
          income_range?: string | null
          occupation?: string | null
          updated_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          medications: string[] | null
          allergies: string[] | null
          chronic_conditions: string[] | null
          surgeries: string[] | null
          family_history: Json | null
          smoking: string | null
          drinking: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medications?: string[] | null
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          surgeries?: string[] | null
          family_history?: Json | null
          smoking?: string | null
          drinking?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medications?: string[] | null
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          surgeries?: string[] | null
          family_history?: Json | null
          smoking?: string | null
          drinking?: string | null
          created_at?: string
        }
      }
      health_goals: {
        Row: {
          id: string
          user_id: string
          goals_text: string | null
          daily_routine: string | null
          health_concerns: string | null
          dream_scenario: string | null
          what_makes_best: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goals_text?: string | null
          daily_routine?: string | null
          health_concerns?: string | null
          dream_scenario?: string | null
          what_makes_best?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goals_text?: string | null
          daily_routine?: string | null
          health_concerns?: string | null
          dream_scenario?: string | null
          what_makes_best?: string | null
          created_at?: string
        }
      }
      lifestyle_data: {
        Row: {
          id: string
          user_id: string
          exercise_frequency: string | null
          diet_type: string | null
          sleep_quality: string | null
          stress_level: string | null
          work_type: string | null
          screen_time: string | null
          caffeine_use: string | null
          work_life_balance: string | null
          social_support: string | null
          mental_health_interest: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_frequency?: string | null
          diet_type?: string | null
          sleep_quality?: string | null
          stress_level?: string | null
          work_type?: string | null
          screen_time?: string | null
          caffeine_use?: string | null
          work_life_balance?: string | null
          social_support?: string | null
          mental_health_interest?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_frequency?: string | null
          diet_type?: string | null
          sleep_quality?: string | null
          stress_level?: string | null
          work_type?: string | null
          screen_time?: string | null
          caffeine_use?: string | null
          work_life_balance?: string | null
          social_support?: string | null
          mental_health_interest?: boolean | null
          created_at?: string
        }
      }
      social_media_accounts: {
        Row: {
          id: string
          user_id: string
          platform: string
          username: string | null
          oauth_token: string | null
          connected_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          username?: string | null
          oauth_token?: string | null
          connected_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          username?: string | null
          oauth_token?: string | null
          connected_at?: string | null
          created_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          integration_type: string
          connection_status: string
          oauth_token: string | null
          last_synced: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          integration_type: string
          connection_status?: string
          oauth_token?: string | null
          last_synced?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          integration_type?: string
          connection_status?: string
          oauth_token?: string | null
          last_synced?: string | null
          created_at?: string
        }
      }
      wearables: {
        Row: {
          id: string
          user_id: string
          device_type: string | null
          connection_status: string
          shipping_status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_type?: string | null
          connection_status?: string
          shipping_status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_type?: string | null
          connection_status?: string
          shipping_status?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          doc_type: string
          file_url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          doc_type: string
          file_url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          doc_type?: string
          file_url?: string
          uploaded_at?: string
        }
      }
      consents: {
        Row: {
          id: string
          user_id: string
          consent_type: string
          given_at: string
        }
        Insert: {
          id?: string
          user_id: string
          consent_type: string
          given_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          consent_type?: string
          given_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: string
          message: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          message: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          message?: string
          timestamp?: string
        }
      }
      onboarding_progress: {
        Row: {
          user_id: string
          current_step: number
          completed_steps: number[]
          updated_at: string
        }
        Insert: {
          user_id: string
          current_step?: number
          completed_steps?: number[]
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_step?: number
          completed_steps?: number[]
          updated_at?: string
        }
      }
    }
  }
}

