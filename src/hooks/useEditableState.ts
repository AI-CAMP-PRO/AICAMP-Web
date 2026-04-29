import { useState, useCallback, useEffect } from 'react';
import { EditState, EditValidationRule } from '@/types/quiz';

// 验证函数
const validateValue = (value: string, rules?: EditValidationRule): string | null => {
  if (!rules) return null;

  // 必填检查
  if (rules.required && !value.trim()) {
    return 'This field is required';
  }

  // 最小长度检查
  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  // 最大长度检查
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // 正则表达式检查
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  // 自定义验证
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export function useEditableState(
  initialValue: string, 
  validation?: EditValidationRule,
  onSave?: (value: string) => void
) {
  const [state, setState] = useState<EditState>({
    isEditing: false,
    originalValue: initialValue,
    currentValue: initialValue,
    hasChanges: false,
    isValid: true,
    error: undefined,
  });

  // 当初始值变化时更新状态
  useEffect(() => {
    setState(prev => ({
      ...prev,
      originalValue: initialValue,
      currentValue: prev.isEditing ? prev.currentValue : initialValue,
    }));
  }, [initialValue]);

  // 开始编辑
  const startEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditing: true,
      currentValue: prev.originalValue,
      hasChanges: false,
      isValid: true,
      error: undefined,
    }));
  }, []);

  // 更新值
  const updateValue = useCallback((newValue: string) => {
    const validationError = validateValue(newValue, validation);
    const isValid = validationError === null;
    const hasChanges = newValue !== state.originalValue;

    setState(prev => ({
      ...prev,
      currentValue: newValue,
      hasChanges,
      isValid,
      error: validationError || undefined,
    }));
  }, [validation, state.originalValue]);

  // 保存更改
  const saveChanges = useCallback(() => {
    if (!state.isValid || !state.hasChanges) {
      return false;
    }

    setState(prev => ({
      ...prev,
      isEditing: false,
      originalValue: prev.currentValue,
      hasChanges: false,
    }));

    if (onSave) {
      onSave(state.currentValue);
    }

    return true;
  }, [state.isValid, state.hasChanges, state.currentValue, onSave]);

  // 取消编辑
  const cancelEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      currentValue: prev.originalValue,
      hasChanges: false,
      isValid: true,
      error: undefined,
    }));
  }, []);

  // 重置到原始值
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: prev.originalValue,
      hasChanges: false,
      isValid: true,
      error: undefined,
    }));
  }, []);

  return {
    ...state,
    startEdit,
    updateValue,
    saveChanges,
    cancelEdit,
    reset,
    
    // 便利方法
    canSave: state.isValid && state.hasChanges,
    displayValue: state.isEditing ? state.currentValue : state.originalValue,
  };
} 