// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public error: string;
  public details?: string;

  constructor(message: string, status: number, error: string, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.details = details;
  }
}

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT, maxRetries: number = MAX_RETRIES) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  // Create abort controller with timeout
  private createAbortController(timeoutMs: number): AbortController {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Store timeout ID for cleanup
    (controller.signal as any).timeoutId = timeoutId;
    
    return controller;
  }

  // Cleanup abort controller
  private cleanupAbortController(controller: AbortController): void {
    const timeoutId = (controller.signal as any).timeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  // Determine if error is retryable
  private isRetryableError(error: any): boolean {
    // Network errors
    if (error.name === 'AbortError') return true;
    if (error.message?.includes('network') || error.message?.includes('fetch')) return true;
    
    // HTTP status codes that should be retried
    if (error instanceof ApiError) {
      return error.status >= 500 || error.status === 408 || error.status === 429;
    }
    
    return false;
  }

  // Make request with retry logic
  private async makeRequestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const controller = this.createAbortController(this.timeout);
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      
      this.cleanupAbortController(controller);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Generic error message for security
        let errorMessage = 'درخواست با خطا مواجه شد';
        
        // Only provide specific messages for expected errors
        if (response.status === 401) {
          errorMessage = 'احراز هویت نامعتبر است';
        } else if (response.status === 403) {
          errorMessage = 'دسترسی غیرمجاز';
        } else if (response.status === 404) {
          errorMessage = 'منبع یافت نشد';
        } else if (response.status === 429) {
          errorMessage = 'تعداد درخواست‌ها بیش از حد مجاز است';
        } else if (response.status >= 500) {
          errorMessage = 'خطای سرور';
        }
        
        const apiError = new ApiError(
          errorMessage,
          response.status,
          errorData.error || errorMessage,
          errorData.details
        );
        
        // Retry for server errors
        if (this.isRetryableError(apiError) && retryCount < this.maxRetries) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
          await sleep(delay);
          return this.makeRequestWithRetry<T>(endpoint, options, retryCount + 1);
        }
        
        throw apiError;
      }

      return response.json();
    } catch (error) {
      this.cleanupAbortController(controller);
      
      // Re-throw ApiError instances as-is
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle abort/timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        if (retryCount < this.maxRetries) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount);
          await sleep(delay);
          return this.makeRequestWithRetry<T>(endpoint, options, retryCount + 1);
        }
        throw new Error('درخواست به دلیل اتمام زمان لغو شد');
      }
      
      // Handle network errors with retry
      if (error instanceof Error && this.isRetryableError(error) && retryCount < this.maxRetries) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        await sleep(delay);
        return this.makeRequestWithRetry<T>(endpoint, options, retryCount + 1);
      }
      
      // Generic network error
      if (error instanceof Error) {
        throw new Error('خطا در اتصال به سرور');
      }
      
      throw new Error('خطای نامشخص');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.makeRequestWithRetry<T>(endpoint, options, 0);
  }

  // Public methods (no authentication required)
  async login(credentials: { email: string; password: string; remember_me?: boolean }) {
    try {
      return await this.makeRequest<ApiResponse<{
        token: string;
        user_type: 'user' | 'admin';
        user: any;
        expires_at: string;
      }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      // Re-throw with generic message for security
      if (error instanceof ApiError) {
        // Don't expose whether user exists or not
        if (error.status === 401 || error.status === 404) {
          throw new ApiError(
            'ایمیل یا رمز عبور اشتباه است',
            error.status,
            'اطلاعات ورود نامعتبر است',
            undefined
          );
        }
      }
      throw error;
    }
  }

  async refreshToken(token: string, rememberMe: boolean = false) {
    return this.makeRequest<ApiResponse<{ token: string; expires_at: string }>>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remember_me: rememberMe }),
    });
  }

  // Protected methods (authentication required)
  async getProfile(token: string) {
    return this.makeRequest<ApiResponse<any>>('/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async logout(token: string) {
    return this.makeRequest<ApiResponse<{}>>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Generic authenticated request method
  async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Change timeout for specific requests
  withTimeout(timeoutMs: number): ApiClient {
    return new ApiClient(this.baseURL, timeoutMs, this.maxRetries);
  }

  // Disable retries for specific requests
  withoutRetries(): ApiClient {
    return new ApiClient(this.baseURL, this.timeout, 0);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };
