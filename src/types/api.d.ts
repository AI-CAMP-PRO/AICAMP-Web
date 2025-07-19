// API请求状态和错误处理类型定义

export type RequestState = 'idle' | 'loading' | 'success' | 'error';

export type ErrorType = 
  | 'network'      // 网络连接错误
  | 'validation'   // 参数验证错误  
  | 'quota'        // 配额限制错误
  | 'server'       // 服务器内部错误
  | 'timeout'      // 请求超时错误
  | 'unknown';     // 未知错误

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type RetryStrategy = 'retry' | 'fallback' | 'ignore' | 'redirect';

export interface ApiError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  retryStrategy: RetryStrategy;
  canRetry: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export interface LoadingState {
  isLoading: boolean;
  stage?: 'initializing' | 'validating' | 'generating' | 'processing' | 'finalizing';
  progress?: number;
  estimatedTime?: number;
  message?: string;
}

export interface RequestStatus<T = any> {
  state: RequestState;
  data?: T;
  error?: ApiError;
  loading: LoadingState;
}

// 请求配置选项
export interface RequestOptions {
  retries?: number;
  timeout?: number;
  fallbackData?: any;
  showToast?: boolean;
  persistError?: boolean;
} 