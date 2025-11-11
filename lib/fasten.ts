// Fasten Health API Client
// For clinical data integration (medical records, lab results, medications, etc.)
import crypto from 'crypto';
import { env } from './env';

export interface FastenUser {
  user_id: string;
  patient_id: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface FastenConnection {
  id: string;
  user_id: string;
  source: string;
  source_name: string;
  status: 'connected' | 'disconnected' | 'error';
  connected_at: string;
  last_sync_at?: string;
}

export interface FastenMedication {
  id: string;
  medication_name: string;
  dosage?: string;
  frequency?: string;
  prescriber?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

export interface FastenLabResult {
  id: string;
  test_name: string;
  value: string;
  unit?: string;
  reference_range?: string;
  status: string;
  date: string;
  ordering_provider?: string;
}

export interface FastenCondition {
  id: string;
  condition_name: string;
  clinical_status: string;
  verification_status?: string;
  onset_date?: string;
  recorded_date: string;
  notes?: string;
}

export interface FastenProcedure {
  id: string;
  procedure_name: string;
  performed_date: string;
  performer?: string;
  location?: string;
  notes?: string;
}

class FastenClient {
  private apiKey: string;
  private publicId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.fasten.apiKey;
    this.publicId = env.fasten.publicId;
    this.baseUrl = env.fasten.apiUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Fasten API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // User Management
  async createUser(clientUserId: string, metadata?: Record<string, any>): Promise<FastenUser> {
    return this.request('/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        client_user_id: clientUserId,
        metadata,
      }),
    });
  }

  async getUser(userId: string): Promise<FastenUser> {
    return this.request(`/v1/users/${userId}`);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.request(`/v1/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Connection Management
  async getUserConnections(userId: string): Promise<FastenConnection[]> {
    return this.request(`/v1/users/${userId}/connections`);
  }

  async disconnectSource(userId: string, connectionId: string): Promise<void> {
    await this.request(`/v1/users/${userId}/connections/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Clinical Data Retrieval
  async getMedications(userId: string, options?: {
    status?: 'active' | 'completed' | 'all';
    startDate?: string;
    endDate?: string;
  }): Promise<FastenMedication[]> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/users/${userId}/medications${query}`);
  }

  async getLabResults(userId: string, options?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<FastenLabResult[]> {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    if (options?.category) params.append('category', options.category);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/users/${userId}/labs${query}`);
  }

  async getConditions(userId: string, options?: {
    status?: 'active' | 'resolved' | 'all';
  }): Promise<FastenCondition[]> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/users/${userId}/conditions${query}`);
  }

  async getProcedures(userId: string, options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<FastenProcedure[]> {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/v1/users/${userId}/procedures${query}`);
  }

  async getImmunizations(userId: string): Promise<any[]> {
    return this.request(`/v1/users/${userId}/immunizations`);
  }

  async getAllergies(userId: string): Promise<any[]> {
    return this.request(`/v1/users/${userId}/allergies`);
  }

  async getCarePlans(userId: string): Promise<any[]> {
    return this.request(`/v1/users/${userId}/care-plans`);
  }

  // Get raw FHIR resources
  async getFHIRResources(userId: string, resourceType: string, options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('resource_type', resourceType);
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    
    return this.request(`/v1/users/${userId}/fhir?${params.toString()}`);
  }

  // Get Public ID for frontend widget
  getPublicId(): string {
    return this.publicId;
  }

  // Webhook signature verification
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  // Sync user data (trigger a new sync from connected sources)
  async syncUserData(userId: string): Promise<{ status: string; message: string }> {
    return this.request(`/v1/users/${userId}/sync`, {
      method: 'POST',
    });
  }
}

export const fasten = new FastenClient();



