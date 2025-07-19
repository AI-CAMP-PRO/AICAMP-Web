"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Edit3, Save, X } from "lucide-react";
import EditableText from "@/components/ui/editable-text";
import EditableOptions from "@/components/ui/editable-options";
import { QuestionCardProps, QuizQuestion } from "@/types/quiz";

export default function QuestionCard({ 
  question, 
  index, 
  mode = 'preview',
  onEdit,
  isEditing = false,
  onEditToggle,
  className = ""
}: QuestionCardProps) {
  const t = useTranslations();
  // 使用页面特定翻译
  const tp = useTranslations('pages.quiz-generator');
  
  // 本地编辑状态
  const [localQuestion, setLocalQuestion] = useState<QuizQuestion>(question);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 更新本地题目
  const updateLocalQuestion = useCallback((updates: Partial<QuizQuestion>) => {
    setLocalQuestion(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);
  
  // 保存更改
  const saveChanges = useCallback(() => {
    if (onEdit && hasChanges) {
      onEdit(localQuestion);
      setHasChanges(false);
    }
  }, [onEdit, hasChanges, localQuestion]);
  
  // 取消更改
  const cancelChanges = useCallback(() => {
    setLocalQuestion(question);
    setHasChanges(false);
    if (onEditToggle) {
      onEditToggle();
    }
  }, [question, onEditToggle]);
  
  // 题目验证规则
  const questionValidation = {
    required: true,
    minLength: 10,
    maxLength: 500,
  };
  
  // 解释验证规则
  const explanationValidation = {
    minLength: 5,
    maxLength: 1000,
  };
  
  const displayQuestion = isEditing ? localQuestion : question;

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg border-0 bg-card/80 backdrop-blur-sm ${isEditing ? 'ring-2 ring-primary shadow-xl' : 'shadow-md'} ${className}`}>
      <CardContent className="p-4 sm:p-6">
        {/* 题目头部 */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
                {t("quiz_generator.results.question_number", { number: index + 1 })}
              </Badge>
              {displayQuestion.difficulty && (
                <Badge 
                  variant={displayQuestion.difficulty === 'easy' ? 'secondary' : 
                          displayQuestion.difficulty === 'medium' ? 'default' : 'destructive'}
                  className="text-xs font-semibold px-3 py-1"
                >
                  {t(`quiz_generator.difficulty.${displayQuestion.difficulty}`)}
                </Badge>
              )}
              {isEditing && hasChanges && (
                <Badge variant="outline" className="text-xs text-orange-600 font-semibold px-3 py-1 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {t('edit.unsaved_changes')}
                </Badge>
              )}
            </div>
            
            {/* 可编辑题目文本 */}
            {isEditing ? (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-muted-foreground">{t('edit.question_title')}</h5>
                <EditableText
                  value={displayQuestion.question}
                  onSave={(value) => updateLocalQuestion({ question: value })}
                  placeholder={t('edit.question_placeholder')}
                  multiline={true}
                  validation={questionValidation}
                  autoEdit={false}
                  showEditIcon={false}
                />
              </div>
            ) : (
              <h4 className="text-base sm:text-lg font-medium leading-relaxed text-foreground">
                {displayQuestion.question}
              </h4>
            )}
          </div>
          
          {/* 编辑控制按钮 */}
          {onEditToggle && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:ml-4">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={saveChanges}
                    disabled={!hasChanges}
                    className="h-8 px-3 text-xs font-medium w-full sm:w-auto"
                    title={tp('tooltips.save')}
                  >
                    <Save className="w-3 h-3 mr-1.5" />
                    {t('edit.save_changes')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelChanges}
                    className="h-8 px-3 text-xs font-medium w-full sm:w-auto"
                    title={tp('tooltips.cancel')}
                  >
                    <X className="w-3 h-3 mr-1.5" />
                    {t('edit.discard_changes')}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditToggle}
                  className="h-8 px-3 text-xs font-medium w-full sm:w-auto border-dashed hover:border-solid transition-all"
                  title={tp('tooltips.edit')}
                >
                  <Edit3 className="w-3 h-3 mr-1.5" />
                  {t('edit.edit_question')}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 选项列表 */}
        <div className="mb-4">
          <EditableOptions
            options={displayQuestion.options}
            correctAnswer={displayQuestion.correctAnswer}
            onOptionsChange={(options) => updateLocalQuestion({ options })}
            onCorrectAnswerChange={(correctAnswer) => updateLocalQuestion({ correctAnswer })}
            isEditing={isEditing}
          />
        </div>

        {/* 解释说明 */}
        <div className="mt-4">
          {isEditing ? (
            <div>
              <h5 className="text-sm font-medium mb-2">{t('edit.explanation_title')}</h5>
              <EditableText
                value={displayQuestion.explanation || ''}
                onSave={(value) => updateLocalQuestion({ explanation: value })}
                placeholder={t('edit.explanation_placeholder')}
                multiline={true}
                validation={explanationValidation}
                autoEdit={false}
                showEditIcon={false}
              />
            </div>
          ) : displayQuestion.explanation ? (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">?</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {t("quiz_generator.results.explanation")}
                  </h5>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    {displayQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* 标签 */}
        {displayQuestion.tags && displayQuestion.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {displayQuestion.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 