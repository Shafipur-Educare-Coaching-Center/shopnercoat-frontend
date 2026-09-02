export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: FieldError[];
  hint?: string;
}
