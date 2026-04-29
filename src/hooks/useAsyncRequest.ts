import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { RequestStatus, ApiError, ErrorType, RequestOptions } from '@/types/api';

// 错误类型检测工具函数
const detectErrorType = (error: any): ErrorType => {
  if (!error) return 'unknown';
  
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('timeout') || message.includes('connect timeout')) {
    return 'timeout';
  }
  if (message.includes('quota') || message.includes('rate limit')) {
    return 'quota';
  }
  if (message.includes('fetch') || message.includes('network')) {
    return 'network';
  }
  if (error.status >= 400 && error.status < 500) {
    return 'validation';
  }
  if (error.status >= 500) {
    return 'server';
  }
  
  return 'unknown';
};

// 错误消息本地化
const getLocalizedErrorMessage = (error: ApiError, t: any): string => {
  const key = `errors.${error.type}`;
  const fallback = error.message || t('errors.unknown');
  
  try {
    return t(key, { fallback });
  } catch {
    return fallback;
  }
};

export function useAsyncRequest<T = any>(options: RequestOptions = {}) {
  const t = useTranslations();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [status, setStatus] = useState<RequestStatus<T>>({
    state: 'idle',
    data: undefined,
    error: undefined,
    loading: {
      isLoading: false,
    }
  });

  // 重置状态
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus({
      state: 'idle',
      data: undefined,
      error: undefined,
      loading: { isLoading: false }
    });
  }, []);

  // 设置加载状态
  const setLoading = useCallback((stage?: string, message?: string, progress?: number) => {
    setStatus(prev => ({
      ...prev,
      state: 'loading',
      loading: {
        isLoading: true,
        stage: stage as any,
        message,
        progress,
      }
    }));
  }, []);

  // 设置成功状态
  const setSuccess = useCallback((data: T) => {
    setStatus({
      state: 'success',
      data,
      error: undefined,
      loading: { isLoading: false }
    });
    
    if (options.showToast !== false) {
      toast.success(t('common.success'));
    }
  }, [options.showToast, t]);

  // 设置错误状态
  const setError = useCallback((error: any, retryFn?: () => void) => {
    const errorType = detectErrorType(error);
    const canRetry = ['network', 'timeout', 'server'].includes(errorType);
    
    const apiError: ApiError = {
      type: errorType,
      severity: errorType === 'quota' ? 'warning' : 'error',
      message: error.message || t('errors.unknown'),
      details: error.details,
      retryStrategy: canRetry ? 'retry' : 'fallback',
      canRetry,
      retryCount: 0,
      maxRetries: options.retries || 3,
    };

    setStatus({
      state: 'error',
      data: options.fallbackData,
      error: apiError,
      loading: { isLoading: false }
    });

    if (options.showToast !== false) {
      const localizedMessage = getLocalizedErrorMessage(apiError, t);
      toast.error(localizedMessage);
    }
  }, [options.retries, options.fallbackData, options.showToast, t]);

  // 执行异步请求
  const execute = useCallback(async (
    requestFn: (signal?: AbortSignal) => Promise<T>,
    loadingMessage?: string
  ) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的中止控制器
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading('initializing', loadingMessage);
      
      // 执行请求
      const result = await requestFn(signal);
      
      // 检查是否被取消
      if (signal.aborted) {
        return;
      }
      
      setSuccess(result);
      return result;
      
    } catch (error: any) {
      // 检查是否被取消
      if (signal.aborted) {
        return;
      }
      
      setError(error);
      throw error;
    }
  }, [setLoading, setSuccess, setError]);

  // 重试函数
  const retry = useCallback(() => {
    if (status.error && status.error.canRetry) {
      reset();
      // 注意：这里需要外部提供重试逻辑
      return true;
    }
    return false;
  }, [status.error, reset]);

  // 取消请求
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    reset();
  }, [reset]);

  // 手动设置数据
  const setData = useCallback((data: T) => {
    setSuccess(data);
  }, [setSuccess]);

  return {
    // 状态
    ...status,
    isIdle: status.state === 'idle',
    isLoading: status.state === 'loading',
    isSuccess: status.state === 'success',
    isError: status.state === 'error',
    
    // 操作
    execute,
    retry,
    reset,
    cancel,
    
    // 辅助方法
    setLoading,
    setSuccess,
    setError,
    setData,
  };
} 