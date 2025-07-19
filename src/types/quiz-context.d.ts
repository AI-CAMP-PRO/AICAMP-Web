import { QuizData } from './quiz';

// 测验状态
export interface QuizState {
  // 当前测验数据
  currentQuiz: QuizData | null;
  // 状态标志
  isLoading: boolean;
  error: Error | null;
  // 持久化版本（用于迁移）
  version: string;
  // 历史记录（未来扩展用）
  history: QuizHistoryItem[];
}

// 测验历史记录项
export interface QuizHistoryItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  timestamp: string;
  questionCount: number;
}

// Context值类型
export interface QuizContextValue {
  // 状态
  state: QuizState;
  
  // 测验操作
  setQuiz: (quiz: QuizData) => void;
  clearQuiz: () => void;
  resetQuiz: () => void;
  
  // 加载状态
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // 持久化操作
  saveToStorage: () => void;
  loadFromStorage: () => boolean;
  clearStorage: () => void;
  
  // 工具方法
  hasQuiz: boolean;
  lastGeneratedTime: string | null;
} 