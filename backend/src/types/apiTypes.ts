// Common API response envelope types for backend

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
