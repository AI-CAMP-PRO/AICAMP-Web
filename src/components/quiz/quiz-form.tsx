"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import HelpTooltip from "./help-tooltip";

// 年级选项
const gradeOptions = [
  { value: "k", key: "kindergarten" },
  { value: "1", key: "grade_1" },
  { value: "2", key: "grade_2" },
  { value: "3", key: "grade_3" },
  { value: "4", key: "grade_4" },
  { value: "5", key: "grade_5" },
  { value: "6", key: "grade_6" },
];

// 科目选项
const subjectOptions = [
  { value: "math", key: "math" },
  { value: "science", key: "science" },
  { value: "english", key: "english" },
  { value: "social_studies", key: "social_studies" },
];

interface QuizFormProps {
  onGenerate: (grade: string, subject: string) => void;
  isLoading?: boolean;
}

export default function QuizForm({ onGenerate, isLoading = false }: QuizFormProps) {
  const t = useTranslations();
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const handleGenerate = () => {
    if (selectedGrade && selectedSubject) {
      onGenerate(selectedGrade, selectedSubject);
    }
  };

  const isFormValid = selectedGrade && selectedSubject;

  // 使用页面特定的翻译
  const tp = useTranslations('pages.quiz-generator');

  return (
    <div className="space-y-6">
      {/* 年级选择 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label 
            htmlFor="grade-select" 
            className="text-sm font-medium text-foreground flex items-center gap-2"
            aria-label={tp('aria_labels.grade_select')}
          >
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t("quiz_generator.form.grade_label")}
          </Label>
          <HelpTooltip translationKey="help_text.grade_selection" />
        </div>
        <Select
          value={selectedGrade}
          onValueChange={setSelectedGrade}
        >
          <SelectTrigger 
            id="grade-select" 
            className="w-full h-12 border-2 border-border/50 hover:border-border transition-colors focus:ring-2 focus:ring-primary/20"
          >
            <SelectValue placeholder={t("quiz_generator.form.grade_placeholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {gradeOptions.map((grade) => (
              <SelectItem 
                key={grade.value} 
                value={grade.value}
                className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                {t(`quiz_generator.grades.${grade.key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 科目选择 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label 
            htmlFor="subject-select" 
            className="text-sm font-medium text-foreground flex items-center gap-2"
            aria-label={tp('aria_labels.subject_select')}
          >
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {t("quiz_generator.form.subject_label")}
          </Label>
          <HelpTooltip translationKey="help_text.subject_selection" />
        </div>
        <Select
          value={selectedSubject}
          onValueChange={setSelectedSubject}
        >
          <SelectTrigger 
            id="subject-select" 
            className="w-full h-12 border-2 border-border/50 hover:border-border transition-colors focus:ring-2 focus:ring-primary/20"
          >
            <SelectValue placeholder={t("quiz_generator.form.subject_placeholder")} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {subjectOptions.map((subject) => (
              <SelectItem 
                key={subject.value} 
                value={subject.value}
                className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                {t(`quiz_generator.subjects.${subject.key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 生成按钮 */}
      <div className="pt-6">
        <Button
          onClick={handleGenerate}
          disabled={!isFormValid || isLoading}
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
          aria-label={tp('aria_labels.generate_button')}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t("quiz_generator.form.generating")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{t("quiz_generator.form.generate_button")}</span>
            </div>
          )}
        </Button>
      </div>

      {/* 表单提示 */}
      <div className="text-center">
        {!isFormValid && !isLoading && (
          <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg py-3 px-4">
            {t("quiz_generator.form.validation_message")}
          </p>
        )}
        
        {isFormValid && !isLoading && (
          <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg py-3 px-4">
            ✓ {t("quiz_generator.form.ready_message")}
          </p>
        )}
      </div>

      {/* 快速示例按钮 */}
      <div className="pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center mb-3">
          {t("quiz_generator.form.try_example")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedGrade("3");
              setSelectedSubject("math");
            }}
            disabled={isLoading}
            className="text-xs h-9 border-dashed"
            title={tp('examples.grade3_math.description')}
            id="example-math-button"
          >
            {t("quiz_generator.form.example_math")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedGrade("5");
              setSelectedSubject("science");
            }}
            disabled={isLoading}
            className="text-xs h-9 border-dashed"
            title={tp('examples.grade5_science.description')}
            id="example-science-button"
          >
            {t("quiz_generator.form.example_science")}
          </Button>
        </div>
      </div>
    </div>
  );
} 