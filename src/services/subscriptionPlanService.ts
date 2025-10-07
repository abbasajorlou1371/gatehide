import { apiClient } from '../utils/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  plan_type: 'trial' | 'monthly' | 'annual';
  price: number;
  annual_discount_percentage?: number;
  trial_duration_days?: number;
  is_active: boolean;
  subscription_count: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // Index signature for Table component compatibility
}

export interface CreatePlanRequest {
  name: string;
  plan_type: 'trial' | 'monthly' | 'annual';
  price: number;
  annual_discount_percentage?: number;
  trial_duration_days?: number;
  is_active: boolean;
}

export interface UpdatePlanRequest {
  name?: string;
  plan_type?: string;
  price?: number;
  annual_discount_percentage?: number;
  trial_duration_days?: number;
  is_active?: boolean;
}

export interface PlansResponse {
  data: SubscriptionPlan[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface PlanResponse {
  data: SubscriptionPlan;
}

export interface CreatePlanResponse {
  message: string;
  data: SubscriptionPlan;
}

export interface UpdatePlanResponse {
  message: string;
  data: SubscriptionPlan;
}

export interface DeletePlanResponse {
  message: string;
}

export class SubscriptionPlanService {
  // Get all subscription plans
  static async getAllPlans(token: string, params?: {
    limit?: number;
    offset?: number;
    is_active?: boolean;
  }): Promise<PlansResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/subscription-plans/?${queryString}`
      : '/subscription-plans/';
    
    return apiClient.authenticatedRequest<PlansResponse>(endpoint, token, {
      method: 'GET',
    });
  }

  // Get a single subscription plan
  static async getPlan(token: string, id: string): Promise<PlanResponse> {
    return apiClient.authenticatedRequest<PlanResponse>(`/subscription-plans/${id}`, token, {
      method: 'GET',
    });
  }

  // Create a new subscription plan
  static async createPlan(token: string, data: CreatePlanRequest): Promise<CreatePlanResponse> {
    return apiClient.authenticatedRequest<CreatePlanResponse>('/subscription-plans/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update a subscription plan
  static async updatePlan(token: string, id: string, data: UpdatePlanRequest): Promise<UpdatePlanResponse> {
    return apiClient.authenticatedRequest<UpdatePlanResponse>(`/subscription-plans/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete a subscription plan
  static async deletePlan(token: string, id: string): Promise<DeletePlanResponse> {
    return apiClient.authenticatedRequest<DeletePlanResponse>(`/subscription-plans/${id}`, token, {
      method: 'DELETE',
    });
  }
}
