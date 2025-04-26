// API Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Common response type
export interface APIResponse<T> {
  data: T;
  error: null;
}

export interface APIErrorResponse {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

// API Configuration types
export interface APIConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Default configuration
const defaultConfig: APIConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Make an API request with error handling and timeout
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {},
  config: APIConfig = {}
): Promise<T> {
  const { timeout = defaultConfig.timeout } = { ...defaultConfig, ...config };
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultConfig.headers,
        ...config.headers,
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.error?.message || 'API request failed',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      
      throw new APIError(error.message, 500);
    }
    
    throw new APIError('Unknown error', 500);
  }
}

/**
 * Create API endpoints with base URL and default config
 */
export function createAPI(baseConfig: APIConfig = {}) {
  return {
    get: <T>(path: string, options: RequestInit = {}) =>
      apiRequest<T>(
        `${baseConfig.baseUrl || ''}${path}`,
        { ...options, method: 'GET' },
        baseConfig
      ),
      
    post: <T>(path: string, data: unknown, options: RequestInit = {}) =>
      apiRequest<T>(
        `${baseConfig.baseUrl || ''}${path}`,
        {
          ...options,
          method: 'POST',
          body: JSON.stringify(data),
        },
        baseConfig
      ),
      
    put: <T>(path: string, data: unknown, options: RequestInit = {}) =>
      apiRequest<T>(
        `${baseConfig.baseUrl || ''}${path}`,
        {
          ...options,
          method: 'PUT',
          body: JSON.stringify(data),
        },
        baseConfig
      ),
      
    delete: <T>(path: string, options: RequestInit = {}) =>
      apiRequest<T>(
        `${baseConfig.baseUrl || ''}${path}`,
        { ...options, method: 'DELETE' },
        baseConfig
      ),
  };
} 
