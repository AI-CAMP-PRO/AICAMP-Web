"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Plus, 
  Trash2,
  MoveUp,
  MoveDown,
  Edit3
} from "lucide-react";
import EditableText from "./editable-text";
import { EditValidationRule } from "@/types/quiz";

interface EditableOptionsProps {
  options: string[];
  correctAnswer: number;
  onOptionsChange: (options: string[]) => void;
  onCorrectAnswerChange: (index: number) => void;
  isEditing?: boolean;
  onEditToggle?: () => void;
  maxOptions?: number;
  minOptions?: number;
  className?: string;
}

export default function EditableOptions({
  options,
  correctAnswer,
  onOptionsChange,
  onCorrectAnswerChange,
  isEditing = false,
  onEditToggle,
  maxOptions = 6,
  minOptions = 2,
  className = ""
}: EditableOptionsProps) {
  const t = useTranslations();

  // 选项验证规则
  const optionValidation: EditValidationRule = {
    required: true,
    minLength: 1,
    maxLength: 200,
  };

  // 更新单个选项
  const updateOption = useCallback((index: number, newValue: string) => {
    const newOptions = [...options];
    newOptions[index] = newValue;
    onOptionsChange(newOptions);
  }, [options, onOptionsChange]);

  // 添加新选项
  const addOption = useCallback(() => {
    if (options.length < maxOptions) {
      const newOptions = [...options, ''];
      onOptionsChange(newOptions);
    }
  }, [options, maxOptions, onOptionsChange]);

  // 删除选项
  const removeOption = useCallback((index: number) => {
    if (options.length > minOptions) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
      
      // 调整正确答案索引
      if (correctAnswer === index) {
        // 如果删除的是正确答案，设置为第一个选项
        onCorrectAnswerChange(0);
      } else if (correctAnswer > index) {
        // 如果正确答案在删除项之后，索引减1
        onCorrectAnswerChange(correctAnswer - 1);
      }
    }
  }, [options.length, minOptions, correctAnswer, onOptionsChange, onCorrectAnswerChange]);

  // 移动选项
  const moveOption = useCallback((fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= options.length) return;
    
    const newOptions = [...options];
    [newOptions[fromIndex], newOptions[toIndex]] = [newOptions[toIndex], newOptions[fromIndex]];
    onOptionsChange(newOptions);
    
    // 调整正确答案索引
    if (correctAnswer === fromIndex) {
      onCorrectAnswerChange(toIndex);
    } else if (correctAnswer === toIndex) {
      onCorrectAnswerChange(fromIndex);
    }
  }, [options, correctAnswer, onOptionsChange, onCorrectAnswerChange]);

  // 设置正确答案
  const setCorrectAnswer = useCallback((index: number) => {
    onCorrectAnswerChange(index);
  }, [onCorrectAnswerChange]);

  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            {t('edit.options_title')}
          </h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {options.length}/{maxOptions}
            </Badge>
            {onEditToggle && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEditToggle}
                className="h-7 px-2"
              >
                <Check className="w-3 h-3 mr-1" />
                {t('edit.done')}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 group">
              {/* 选项字母标识 */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                correctAnswer === index
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-slate-200 text-slate-600 hover:bg-green-100 hover:text-green-800 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-green-800 dark:hover:text-green-100'
              }`}
              onClick={() => setCorrectAnswer(index)}
              title={t('edit.set_correct_answer')}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* 可编辑选项文本 */}
              <div className="flex-1">
                <EditableText
                  value={option}
                  onSave={(newValue) => updateOption(index, newValue)}
                  placeholder={t('edit.option_placeholder', { letter: String.fromCharCode(65 + index) })}
                  validation={optionValidation}
                  autoEdit={false}
                  showEditIcon={false}
                  className="border rounded p-2 hover:border-border"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* 上移 */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveOption(index, 'up')}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                  title={t('edit.move_up')}
                >
                  <MoveUp className="w-3 h-3" />
                </Button>

                {/* 下移 */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveOption(index, 'down')}
                  disabled={index === options.length - 1}
                  className="h-6 w-6 p-0"
                  title={t('edit.move_down')}
                >
                  <MoveDown className="w-3 h-3" />
                </Button>

                {/* 删除 */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= minOptions}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  title={t('edit.remove_option')}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加选项按钮 */}
        {options.length < maxOptions && (
          <Button
            variant="outline"
            onClick={addOption}
            className="w-full h-10 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('edit.add_option')}
          </Button>
        )}

        {/* 帮助文本 */}
        <div className="text-xs text-muted-foreground">
          <p>{t('edit.options_help')}</p>
        </div>
      </div>
    );
  }

  // 预览模式
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {t('quiz_generator.results.options')}
        </span>
        {onEditToggle && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEditToggle}
            className="h-6 w-6 p-0"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isCorrect = index === correctAnswer;
          const optionLetter = String.fromCharCode(65 + index);
          
          return (
            <div 
              key={index}
              className={`p-3 rounded border transition-colors ${
                isCorrect 
                  ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-700 dark:text-green-100' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCorrect 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                }`}>
                  {optionLetter}
                </div>
                
                <span className="flex-1 text-sm leading-relaxed">
                  {option}
                </span>
                
                {isCorrect && (
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {t("quiz_generator.results.correct_answer")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 