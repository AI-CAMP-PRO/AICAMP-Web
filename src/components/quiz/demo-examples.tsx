"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SparklesIcon, FlaskConical, BookOpen, Calculator } from "lucide-react";
import { getAvailableDemoSubjects } from "@/data/demo-quizzes";

interface DemoExamplesProps {
  onSelectDemo: (grade: string, subject: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * 演示示例组件
 * 显示可用的演示测验供用户选择
 */
export default function DemoExamples({
  onSelectDemo,
  isLoading = false,
  className = ""
}: DemoExamplesProps) {
  const t = useTranslations();
  const locale = useLocale();
  
  // 获取当前语言的可用演示科目
  const demoSubjects = getAvailableDemoSubjects(locale);
  
  // 如果没有演示数据，不显示组件
  if (demoSubjects.length === 0) return null;
  
  // 科目图标映射
  const subjectIcons: Record<string, React.ReactNode> = {
    "math": <Calculator className="h-4 w-4" />,
    "science": <FlaskConical className="h-4 w-4" />,
    "english": <BookOpen className="h-4 w-4" />,
    "social_studies": <BookOpen className="h-4 w-4" />
  };
  
  return (
    <Card className={`border-dashed bg-accent/30 ${className}`}>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            {t("quiz_generator.demo.title")}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {t("quiz_generator.demo.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-3">
        <div className="flex flex-col space-y-3">
          {/* 数学演示按钮 */}
          {demoSubjects.includes("math") && (
            <Button
              id="example-math-button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onSelectDemo("3", "math")}
              className="w-full justify-start h-auto py-3 px-4"
            >
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-900 h-10 w-10 flex items-center justify-center mr-3">
                  {subjectIcons["math"]}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {t("quiz_generator.demo.math_title")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {t("quiz_generator.demo.math_desc")}
                  </span>
                </div>
              </div>
            </Button>
          )}
          
          {/* 科学演示按钮 */}
          {demoSubjects.includes("science") && (
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onSelectDemo("5", "science")}
              className="w-full justify-start h-auto py-3 px-4"
            >
              <div className="flex items-center w-full">
                <div className="flex-shrink-0 rounded-full bg-cyan-100 dark:bg-cyan-900 h-10 w-10 flex items-center justify-center mr-3">
                  {subjectIcons["science"]}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {t("quiz_generator.demo.science_title")}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {t("quiz_generator.demo.science_desc")}
                  </span>
                </div>
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 