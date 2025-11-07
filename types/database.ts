export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          employee_count: number
          stripe_customer_id: string | null
          subscription_status: 'trial' | 'active' | 'canceled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          employee_count: number
          stripe_customer_id?: string | null
          subscription_status?: 'trial' | 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          employee_count?: number
          stripe_customer_id?: string | null
          subscription_status?: 'trial' | 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          user_id: string | null
          company_id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'employee' | 'admin' | 'owner'
          phone: string | null
          date_of_birth: string | null
          coverage_status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'employee' | 'admin' | 'owner'
          phone?: string | null
          date_of_birth?: string | null
          coverage_status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'employee' | 'admin' | 'owner'
          phone?: string | null
          date_of_birth?: string | null
          coverage_status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          employee_id: string
          company_id: string
          claim_type: string
          description: string
          amount: number
          status: 'pending' | 'processing' | 'approved' | 'denied' | 'paid'
          submitted_at: string
          processed_at: string | null
          processed_by: string | null
          processing_notes: string | null
          payment_method: string | null
          payment_details: Record<string, any> | null
          documents: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          company_id: string
          claim_type: string
          description: string
          amount: number
          status?: 'pending' | 'processing' | 'approved' | 'denied' | 'paid'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          payment_method?: string | null
          payment_details?: Record<string, any> | null
          documents?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          company_id?: string
          claim_type?: string
          description?: string
          amount?: number
          status?: 'pending' | 'processing' | 'approved' | 'denied' | 'paid'
          submitted_at?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          payment_method?: string | null
          payment_details?: Record<string, any> | null
          documents?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'support' | 'manager' | 'super_admin'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'support' | 'manager' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'support' | 'manager' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_sessions: {
        Row: {
          id: string
          admin_user_id: string
          session_token: string
          ip_address: string | null
          user_agent: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          session_token: string
          ip_address?: string | null
          user_agent?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          session_token?: string
          ip_address?: string | null
          user_agent?: string | null
          expires_at?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          company_id: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'paid' | 'failed' | 'canceled'
          period_start: string | null
          period_end: string | null
          employee_count: number | null
          due_date: string | null
          paid_at: string | null
          invoice_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'failed' | 'canceled'
          period_start?: string | null
          period_end?: string | null
          employee_count?: number | null
          due_date?: string | null
          paid_at?: string | null
          invoice_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'paid' | 'failed' | 'canceled'
          period_start?: string | null
          period_end?: string | null
          employee_count?: number | null
          due_date?: string | null
          paid_at?: string | null
          invoice_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      verify_admin_password: {
        Args: { input_password: string }
        Returns: boolean
      }
    }
  }
}
