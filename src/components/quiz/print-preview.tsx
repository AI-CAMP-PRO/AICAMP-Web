"use client";

import { useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Printer as Print, 
  Download, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings
} from "lucide-react";
import { PrintPreviewProps, QuizQuestion } from "@/types/quiz";
import { formatDistanceToNow } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

export default function PrintPreview({
  quizData,
  options,
  isOpen,
  onClose,
  onExport,
  onOptionsChange,
}: PrintPreviewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const previewRef = useRef<HTMLDivElement>(null);

  // 格式化时间的locale
  const dateLocale = locale === 'zh' ? zhCN : enUS;

  // 生成打印内容
  const printContent = useMemo(() => {
    const formatTime = (date: Date) => {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: dateLocale 
      });
    };

    const renderQuestion = (question: QuizQuestion, index: number) => {
      const showAnswers = options.includeAnswers;
      const showExplanations = options.includeExplanations && question.explanation;
      const showDifficulty = options.includeDifficulty && question.difficulty;
      const showTags = options.includeTags && question.tags && question.tags.length > 0;

      return (
        <div key={question.id || index} className="print-question print-avoid-break">
          {/* 题目头部 */}
          <div className="print-question-header">
            <div className="print-question-number">
              {t("quiz_generator.results.question_number", { number: index + 1 })}
            </div>
            
            {showDifficulty && (
              <div className="print-question-badges">
                <div className={`print-badge print-badge-difficulty-${question.difficulty}`}>
                  {t(`quiz_generator.difficulty.${question.difficulty}`)}
                </div>
              </div>
            )}
          </div>

          {/* 题目文本 */}
          <div className="print-question-text">
            {question.question}
          </div>

          {/* 选项 */}
          <div className="print-options">
            {question.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === question.correctAnswer;
              const optionLetter = String.fromCharCode(65 + optionIndex);
              
              return (
                <div 
                  key={optionIndex}
                  className={`print-option ${showAnswers && isCorrect ? 'print-option-correct' : ''}`}
                >
                  <div className="print-option-letter">
                    {optionLetter}
                  </div>
                  <div className="print-option-text">
                    {option}
                  </div>
                  {showAnswers && isCorrect && (
                    <div className="print-option-indicator">
                      ✓ {t("quiz_generator.results.correct_answer")}
                    </div>
                  )}
                  {!showAnswers && (
                    <div className="print-answer-space"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 解释 */}
          {showExplanations && (
            <div className="print-explanation">
              <div className="print-explanation-header">
                <div className="print-explanation-icon">?</div>
                <div className="print-explanation-title">
                  {t("quiz_generator.results.explanation")}
                </div>
              </div>
              <div className="print-explanation-text">
                {question.explanation}
              </div>
            </div>
          )}

          {/* 标签 */}
          {showTags && (
            <div className="print-tags">
              {question.tags!.map((tag, tagIndex) => (
                <div key={tagIndex} className="print-tag">
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={`print-container print-layout-${options.layout} ${options.orientation === 'landscape' ? 'print-landscape' : ''}`}>
        {/* 打印头部 */}
        <div className="print-header">
          <div className="print-title">
            {quizData.title || t('quiz_generator.results.default_title')}
          </div>
          <div className="print-subtitle">
            {quizData.subject && quizData.grade && (
              `${quizData.grade} - ${quizData.subject}`
            )}
          </div>
          
          {/* 元数据 */}
          {options.includeMetadata && (
            <div className="print-metadata">
              <div className="print-metadata-item">
                <span>{t("quiz_generator.results.questions_count")}:</span>
                <span>{quizData.questions.length}</span>
              </div>
              {quizData.generatedAt && (
                <div className="print-metadata-item">
                  <span>{t("quiz_generator.results.generated")}:</span>
                  <span>{formatTime(quizData.generatedAt)}</span>
                </div>
              )}
              {quizData.provider && (
                <div className="print-metadata-item">
                  <span>{t("quiz_generator.results.provider")}:</span>
                  <span>{quizData.provider}</span>
                </div>
              )}
              <div className="print-metadata-item">
                <span>{t("export.format")}:</span>
                <span>{options.includeAnswers ? t("export.with_answers") : t("export.without_answers")}</span>
              </div>
            </div>
          )}
        </div>

        {/* 题目列表 */}
        <div className="print-questions">
          {quizData.questions.map((question, index) => {
            // 分页控制
            const shouldPageBreak = options.questionsPerPage !== 'auto' && 
                                  typeof options.questionsPerPage === 'number' &&
                                  index > 0 && 
                                  index % options.questionsPerPage === 0;
            
            return (
              <div key={question.id || index}>
                {shouldPageBreak && <div className="print-page-break"></div>}
                {renderQuestion(question, index)}
              </div>
            );
          })}
        </div>

        {/* 打印页脚 */}
        <div className="print-footer">
          {t("export.footer_text", { 
            count: quizData.questions.length,
            date: new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')
          })}
        </div>
      </div>
    );
  }, [quizData, options, t, locale, dateLocale]);

  const handlePrint = () => {
    onExport();
  };

  const handleDownloadPDF = () => {
    onOptionsChange({ format: 'pdf' });
    onExport();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {t("export.preview_title")}
            </DialogTitle>
            
            {/* 预览控制栏 */}
            <div className="flex items-center gap-2">
              {/* 格式指示 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {options.paperSize}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t(`export.orientation.${options.orientation}`)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {t(`export.layout.${options.layout}`)}
                </Badge>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* 操作按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8"
              >
                <Print className="w-4 h-4 mr-2" />
                {t("export.actions.print")}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="h-8"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("export.actions.download_pdf")}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* 预览内容 */}
        <div className="flex-1 overflow-auto">
          <div className="print-preview-mode">
            <div 
              ref={previewRef}
              className={`print-preview-page ${options.orientation === 'landscape' ? 'landscape' : ''}`}
            >
              {printContent}
            </div>
          </div>
        </div>

        {/* 状态栏 */}
        <div className="flex-shrink-0 border-t pt-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {t("export.preview_info", { 
                  questions: quizData.questions.length,
                  format: options.includeAnswers ? t("export.with_answers") : t("export.without_answers")
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">
                {t("export.print_tip")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 