// Vital API Client
// For health data integration (wearables, lab tests, etc.)
import crypto from 'crypto';
import { env } from './env';

export interface VitalUser {
  user_id: string;
  user_key: string;
  client_user_id: string;
  team_id: string;
  created_on: string;
}

export interface VitalProvider {
  name: string;
  slug: string;
  logo: string;
  auth_type: 'oauth' | 'password' | 'email';
}

export interface VitalConnection {
  name: string;
  slug: string;
  logo: string;
  created_on: string;
  status: string;
  external_user_id: string;
  error_details: any;
  resource_availability: any;
}

export interface VitalLinkToken {
  link_token: string;
  user_id: string;
}

export interface VitalHealthData {
  // Generic structure - specific endpoints return different data
  user_id: string;
  source: {
    provider: string;
    type: string;
  };
  data: any[];
}

class VitalClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.vital.apiKey;
    const environment = env.vital.environment;
    
    // Construct base URL based on environment
    // Production: https://api.tryvital.io
    // Sandbox: https://api.sandbox.tryvital.io
    this.baseUrl = environment === 'production' 
      ? 'https://api.tryvital.io' 
      : 'https://api.sandbox.tryvital.io';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`[Vital API] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-vital-api-key': this.apiKey,
        ...options.headers,
      },
    });

    console.log(`[Vital API] Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Vital API] Error response:`, error);
      throw new Error(`Vital API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log(`[Vital API] Response data:`, JSON.stringify(data).substring(0, 200));
    return data;
  }

  // User Management
  async createUser(clientUserId: string): Promise<VitalUser> {
    return this.request('/v2/user', {
      method: 'POST',
      body: JSON.stringify({ client_user_id: clientUserId }),
    });
  }

  async getUser(userId: string): Promise<VitalUser> {
    return this.request(`/v2/user/${userId}`);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.request(`/v2/user/${userId}`, {
      method: 'DELETE',
    });
  }

  // Link Token for connecting providers
  async createLinkToken(userId: string, redirectUrl?: string): Promise<VitalLinkToken> {
    return this.request('/v2/link/token', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...(redirectUrl && { redirect_url: redirectUrl }),
      }),
    });
  }

  // Get available providers
  async getProviders(): Promise<VitalProvider[]> {
    return this.request('/v2/providers');
  }

  // Get user's connections
  async getUserConnections(userId: string): Promise<VitalConnection[]> {
    return this.request(`/v2/user/providers/${userId}`);
  }

  // Health Data - Activity
  async getActivity(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/summary/activity/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Sleep
  async getSleep(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/summary/sleep/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Body (weight, body fat, etc.)
  async getBody(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/summary/body/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Workouts
  async getWorkouts(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/summary/workouts/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Profile (age, height, biological sex)
  async getProfile(userId: string): Promise<VitalHealthData> {
    return this.request(`/v2/summary/profile/${userId}`);
  }

  // Health Data - Heart Rate
  async getHeartRate(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/timeseries/heartrate/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Blood Pressure
  async getBloodPressure(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/timeseries/blood_pressure/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Health Data - Glucose
  async getGlucose(userId: string, startDate: string, endDate: string): Promise<VitalHealthData> {
    return this.request(`/v2/timeseries/glucose/${userId}?start_date=${startDate}&end_date=${endDate}`);
  }

  // Webhook signature verification (if using webhooks)
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Vital uses HMAC SHA256 for webhook verification
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }
}

export const vital = new VitalClient();


