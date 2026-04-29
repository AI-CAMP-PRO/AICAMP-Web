'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { QuizContextValue, QuizState, QuizHistoryItem } from '@/types/quiz-context';
import { QuizData } from '@/types/quiz';

// 存储键名
const STORAGE_KEY = 'quiz-generator-state';
const CURRENT_VERSION = '1.0.0';

// 默认状态
const initialState: QuizState = {
  currentQuiz: null,
  isLoading: false,
  error: null,
  version: CURRENT_VERSION,
  history: [],
};

// 创建Context
const QuizContext = createContext<QuizContextValue | null>(null);

// Action类型
type QuizAction =
  | { type: 'SET_QUIZ'; payload: QuizData }
  | { type: 'CLEAR_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_STATE'; payload: QuizState }
  | { type: 'ADD_TO_HISTORY'; payload: QuizHistoryItem };

// Reducer函数
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_QUIZ':
      return {
        ...state,
        currentQuiz: null,
        error: null,
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
        version: state.version,
        history: state.history,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error,
      };
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_STATE':
      return action.payload;
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history.slice(0, 9)], // 保留最近10条
      };
    default:
      return state;
  }
}

// Provider组件
export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // 设置测验
  const setQuiz = useCallback((quiz: QuizData) => {
    dispatch({ type: 'SET_QUIZ', payload: quiz });

    // 添加到历史记录
    if (quiz && quiz.id) {
      const historyItem: QuizHistoryItem = {
        id: quiz.id,
        title: quiz.title || `${quiz.grade} - ${quiz.subject} Quiz`,
        grade: quiz.grade,
        subject: quiz.subject,
        timestamp: new Date().toISOString(),
        questionCount: quiz.questions?.length || 0,
      };
      dispatch({ type: 'ADD_TO_HISTORY', payload: historyItem });
    }
  }, []);

  // 清除当前测验
  const clearQuiz = useCallback(() => {
    dispatch({ type: 'CLEAR_QUIZ' });
  }, []);

  // 重置状态
  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, []);

  // 设置加载状态
  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  // 设置错误
  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // 保存到sessionStorage
  const saveToStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const serialized = JSON.stringify(state);
        sessionStorage.setItem(STORAGE_KEY, serialized);
        return true;
      } catch (err) {
        console.error('Failed to save quiz state to sessionStorage:', err);
        return false;
      }
    }
    return false;
  }, [state]);

  // 从sessionStorage加载
  const loadFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const serialized = sessionStorage.getItem(STORAGE_KEY);
        if (serialized) {
          const savedState = JSON.parse(serialized) as QuizState;
          
          // 版本检查（未来可以添加迁移逻辑）
          if (savedState.version !== CURRENT_VERSION) {
            console.warn('Version mismatch in saved quiz state, using default');
            return false;
          }
          
          dispatch({ type: 'SET_STATE', payload: savedState });
          return true;
        }
      } catch (err) {
        console.error('Failed to load quiz state from sessionStorage:', err);
      }
    }
    return false;
  }, []);

  // 清除存储
  const clearStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear quiz state from sessionStorage:', err);
      }
    }
  }, []);

  // 计算派生状态
  const hasQuiz = state.currentQuiz !== null;
  const lastGeneratedTime = state.currentQuiz?.generatedAt || null;

  // 自动保存状态到sessionStorage
  useEffect(() => {
    if (state.currentQuiz) {
      saveToStorage();
    }
  }, [state.currentQuiz, saveToStorage]);

  // 页面加载时尝试恢复状态
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Context值
  const contextValue = useMemo(
    () => ({
      state,
      setQuiz,
      clearQuiz,
      resetQuiz,
      setLoading,
      setError,
      saveToStorage,
      loadFromStorage,
      clearStorage,
      hasQuiz,
      lastGeneratedTime,
    }),
    [
      state,
      setQuiz,
      clearQuiz,
      resetQuiz,
      setLoading,
      setError,
      saveToStorage,
      loadFromStorage,
      clearStorage,
      hasQuiz,
      lastGeneratedTime,
    ]
  );

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
}

// 自定义Hook
export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
} 