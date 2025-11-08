/**
 * Veriff API client
 */

import crypto from 'crypto';
import { env } from './env';

export interface VeriffSession {
  id: string;
  url: string;
  status: string;
}

export interface VeriffPerson {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  idNumber?: string;
  nationality?: string;
  gender?: string;
  email?: string;
  phone?: string;
}

export interface VeriffAddress {
  fullAddress?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface VeriffVerification {
  id: string;
  status: 'success' | 'failed' | 'abandoned' | 'declined' | 'approved';
  code?: number;
  person?: VeriffPerson;
  document?: {
    type?: string;
    number?: string;
    country?: string;
  };
  address?: VeriffAddress;
  additionalData?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
    idNumber?: string;
  };
  vendorData?: string;
}

class VeriffClient {
  private apiKey: string;
  private baseUrl: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = env.veriff.apiKey;
    this.apiSecret = env.veriff.apiSecret;
    this.baseUrl = env.veriff.apiUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Veriff API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createSession(callbackUrl: string, metadata?: Record<string, string>): Promise<VeriffSession> {
    const verification: any = {
      callback: callbackUrl,
    };

    // Only include vendorData if it exists (for sessionId tracking)
    if (metadata?.session_id) {
      verification.vendorData = metadata.session_id;
    }

    const payload = { 
      verification
    };

    const response = await this.request('/v1/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: response.verification.id,
      url: response.verification.url,
      status: response.verification.status,
    };
  }

  async getVerification(verificationId: string): Promise<VeriffVerification> {
    const response = await this.request(`/v1/sessions/${verificationId}`);
    return response.verification || response;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Veriff webhook signature verification
    // Signature is HMAC SHA256 of payload with API secret
    const expectedSignature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }
}

export const veriff = new VeriffClient();

