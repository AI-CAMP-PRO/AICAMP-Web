"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, Brain, Sparkles, Calendar, Edit3, Eye } from "lucide-react";
import QuestionCard from "./question-card";
import ExportController from "./export-controller";
import { QuizDisplayProps, QuizQuestion } from "@/types/quiz";
import { formatDistanceToNow } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

export default function QuizResultDisplay({ 
  quizData, 
  mode = 'preview',
  onQuestionEdit,
  className = ""
}: QuizDisplayProps) {
  const t = useTranslations();
  const locale = useLocale();
  const tp = useTranslations('pages.quiz-generator');
  
  // 编辑状态管理
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [localQuizData, setLocalQuizData] = useState(quizData);
  
  // 切换编辑模式
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
    setEditingQuestionId(null);
  }, []);
  
  // 切换单个题目编辑
  const toggleQuestionEdit = useCallback((questionId: number) => {
    setEditingQuestionId(prev => prev === questionId ? null : questionId);
  }, []);
  
  // 更新题目
  const updateQuestion = useCallback((updatedQuestion: QuizQuestion) => {
    setLocalQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    }));
    
    // 通知父组件
    if (onQuestionEdit) {
      onQuestionEdit(updatedQuestion.id, updatedQuestion);
    }
  }, [onQuestionEdit]);
  
  // 格式化生成时间
  const formatGeneratedTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: locale === 'zh' ? zhCN : enUS 
      });
    } catch {
      return dateString;
    }
  };

  // 获取年级和科目的显示名称
  const getGradeDisplayName = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      'kindergarten': t('quiz_generator.grades.kindergarten'),
      'grade1': t('quiz_generator.grades.grade1'),
      'grade2': t('quiz_generator.grades.grade2'),
      'grade3': t('quiz_generator.grades.grade3'),
      'grade4': t('quiz_generator.grades.grade4'),
      'grade5': t('quiz_generator.grades.grade5'),
      'grade6': t('quiz_generator.grades.grade6'),
    };
    return gradeMap[grade] || grade;
  };

  const getSubjectDisplayName = (subject: string) => {
    const subjectMap: { [key: string]: string } = {
      'math': t('quiz_generator.subjects.math'),
      'science': t('quiz_generator.subjects.science'),
      'english': t('quiz_generator.subjects.english'),
      'social_studies': t('quiz_generator.subjects.social_studies'),
    };
    return subjectMap[subject] || subject;
  };

  const getProviderDisplayName = (provider: string) => {
    const providerMap: { [key: string]: string } = {
      'openai': 'OpenAI GPT',
      'deepseek': 'DeepSeek',
      'demo': t('quiz_generator.provider.demo'),
    };
    return providerMap[provider] || provider;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 测验信息头部 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {t("quiz_generator.results.title")}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{getGradeDisplayName(quizData.grade)}</span>
                <Separator orientation="vertical" className="h-4" />
                <Brain className="w-4 h-4" />
                <span>{getSubjectDisplayName(quizData.subject)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-xs">
                {t("quiz_generator.results.total_questions", { count: quizData.totalQuestions })}
              </Badge>
              {quizData.modelProvider === 'demo' && (
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t("quiz_generator.results.demo_mode")}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t("quiz_generator.results.generated")} {formatGeneratedTime(quizData.generatedAt)}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t("quiz_generator.results.provider")}: {getProviderDisplayName(quizData.modelProvider)}</span>
            </div>
          </div>
          
          {/* 演示模式提示 */}
          {quizData.note && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <Sparkles className="w-4 h-4 inline mr-2" />
                {quizData.note}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 题目列表 */}
      <div className="space-y-6">
        {quizData.questions && quizData.questions.length > 0 ? (
          <>
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    {t("quiz_generator.results.questions_title")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={isEditMode ? "default" : "outline"} 
                      size="sm"
                      onClick={toggleEditMode}
                      className="h-9 px-4 text-sm font-medium"
                      title={isEditMode ? tp('tooltips.preview') : tp('tooltips.edit')}
                    >
                      {isEditMode ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          {t("quiz_generator.actions.preview")}
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          {t("quiz_generator.actions.edit_quiz")}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 text-sm font-medium"
                      title={tp('tooltips.new_quiz')}
                    >
                      {t("quiz_generator.actions.regenerate")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            <div className="space-y-6">
              {localQuizData.questions.map((question, index) => (
                <QuestionCard
                  key={question.id || index}
                  question={question}
                  index={index}
                  mode={isEditMode ? 'edit' : mode}
                  onEdit={updateQuestion}
                  isEditing={isEditMode && editingQuestionId === question.id}
                  onEditToggle={() => toggleQuestionEdit(question.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("quiz_generator.results.no_questions")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 导出控制器 */}
      {localQuizData.questions.length > 0 && (
        <div className="mt-6">
          <ExportController 
            quizData={localQuizData}
            onExport={(options) => {
              console.log('Quiz exported with options:', options);
            }}
          />
        </div>
      )}
    </div>
  );
} 