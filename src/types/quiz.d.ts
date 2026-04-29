// 测验相关类型定义

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface QuizData {
  id?: string;
  title?: string;
  grade: string;
  subject: string;
  questions: QuizQuestion[];
  generatedAt: string;
  modelProvider: string;
  totalQuestions: number;
  note?: string;
}

export interface QuizDisplayProps {
  quizData: QuizData;
  mode?: 'preview' | 'practice' | 'review' | 'print' | 'edit';
  onQuestionEdit?: (questionId: number, updatedQuestion: QuizQuestion) => void;
  className?: string;
}

export interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  mode?: 'preview' | 'practice' | 'review' | 'print' | 'edit';
  onEdit?: (updatedQuestion: QuizQuestion) => void;
  isEditing?: boolean;
  onEditToggle?: () => void;
  className?: string;
}

// 编辑状态相关类型
export interface EditState {
  isEditing: boolean;
  originalValue: string;
  currentValue: string;
  hasChanges: boolean;
  isValid: boolean;
  error?: string;
}

export interface EditValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  multiline?: boolean;
  validation?: EditValidationRule;
  className?: string;
}

// 导出相关类型
export interface ExportOptions {
  format: 'print' | 'pdf';
  layout: 'standard' | 'compact' | 'expanded';
  includeAnswers: boolean;
  includeExplanations: boolean;
  includeDifficulty: boolean;
  includeTags: boolean;
  includeMetadata: boolean;
  paperSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  questionsPerPage: number | 'auto';
}

export interface ExportState {
  isExporting: boolean;
  isPreviewOpen: boolean;
  currentOptions: ExportOptions;
  error?: string;
  progress?: number;
}

export interface PrintPreviewProps {
  quizData: QuizData;
  options: ExportOptions;
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onOptionsChange: (options: Partial<ExportOptions>) => void;
}

export interface ExportControllerProps {
  quizData: QuizData;
  onExport?: (options: ExportOptions) => void;
  className?: string;
}

export interface OptionListProps {
  options: string[];
  correctAnswer: number;
  mode?: 'preview' | 'practice' | 'review' | 'print';
  selectedAnswer?: number;
  onAnswerSelect?: (index: number) => void;
} 