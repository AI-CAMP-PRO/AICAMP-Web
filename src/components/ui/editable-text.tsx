"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Check, 
  X, 
  Edit3, 
  AlertCircle 
} from "lucide-react";
import { EditableFieldProps, EditValidationRule } from "@/types/quiz";
import { useEditableState } from "@/hooks/useEditableState";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  validation?: EditValidationRule;
  autoEdit?: boolean;
  showEditIcon?: boolean;
  className?: string;
}

export default function EditableText({
  value,
  onSave,
  placeholder,
  multiline = false,
  validation,
  autoEdit = false,
  showEditIcon = true,
  className = ""
}: EditableTextProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const {
    isEditing,
    currentValue,
    hasChanges,
    isValid,
    error,
    canSave,
    displayValue,
    startEdit,
    updateValue,
    saveChanges,
    cancelEdit,
  } = useEditableState(value, validation, onSave);

  // 自动焦点到输入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 选中所有文本
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      if (canSave) {
        saveChanges();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      if (canSave) {
        saveChanges();
      }
    }
  };

  // 失焦处理
  const handleBlur = () => {
    // 延迟处理，让点击保存/取消按钮有机会执行
    setTimeout(() => {
      if (isEditing && hasChanges && isValid) {
        saveChanges();
      } else if (isEditing) {
        cancelEdit();
      }
    }, 150);
  };

  // 双击编辑
  const handleDoubleClick = () => {
    if (!isEditing) {
      startEdit();
    }
  };

  const InputComponent = multiline ? Textarea : Input;

  if (isEditing) {
    return (
      <div className={`group ${className}`}>
        <div className="relative">
          <InputComponent
            ref={inputRef as any}
            value={currentValue}
            onChange={(e) => updateValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${multiline ? 'min-h-[80px]' : ''}`}
            rows={multiline ? 3 : undefined}
          />
          
          {/* 编辑控制按钮 */}
          <div className="flex items-center gap-1 mt-2">
            <Button
              size="sm"
              onClick={saveChanges}
              disabled={!canSave}
              className="h-7 px-2"
            >
              <Check className="w-3 h-3 mr-1" />
              {t('common.save')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              className="h-7 px-2"
            >
              <X className="w-3 h-3 mr-1" />
              {t('common.cancel')}
            </Button>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
          
          {/* 帮助文本 */}
          <div className="text-xs text-muted-foreground mt-1">
            {multiline ? (
              <span>{t('edit.help_multiline')}</span>
            ) : (
              <span>{t('edit.help_single')}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group cursor-pointer hover:bg-muted/30 rounded px-2 py-1 transition-colors ${className}`}
      onDoubleClick={handleDoubleClick}
      onClick={autoEdit ? startEdit : undefined}
    >
      <div className="flex items-center justify-between">
        <span className={`flex-1 ${!displayValue ? 'text-muted-foreground italic' : ''}`}>
          {displayValue || placeholder || t('edit.empty_value')}
        </span>
        
        {showEditIcon && (
          <Button
            size="sm"
            variant="ghost"
            onClick={startEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-2"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
} 