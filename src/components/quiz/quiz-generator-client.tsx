"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import QuizForm from "./quiz-form";
import QuizResultDisplay from "./quiz-result-display";
import LoadingDisplay from "@/components/ui/loading-display";
import ErrorDisplay from "@/components/ui/error-display";
import HelpTooltip from "./help-tooltip";
import WelcomeModal from "./welcome-modal";
import GuidePopover from "./guide-popover";
import DemoExamples from "./demo-examples";
import { QuizData } from "@/types/quiz";
import { useAsyncRequest } from "@/hooks/useAsyncRequest";
import { useQuizContext } from "@/contexts/quiz";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { getDemoQuiz } from "@/data/demo-quizzes";
import { v4 as uuidv4 } from 'uuid';

export default function QuizGeneratorClient() {
  const t = useTranslations();
  const locale = useLocale();
  const tp = useTranslations('pages.quiz-generator');
  
  // 状态管理
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  
  // 使用Quiz Context
  const { 
    state: { currentQuiz, isLoading: contextLoading, error: contextError },
    setQuiz,
    resetQuiz,
    hasQuiz,
    lastGeneratedTime
  } = useQuizContext();
  
  // 使用用户偏好设置
  const {
    isNewUser,
    shouldShowGuide,
    completeWelcome,
    completeGuide,
    trackDemoUsage,
    trackQuizGeneration,
    preferences
  } = useUserPreferences();
  
  // 使用异步请求Hook
  const quizRequest = useAsyncRequest<QuizData>({
    showToast: true,
    retries: 3,
  });
  
  // 演示数据请求Hook
  const demoRequest = useAsyncRequest<QuizData>({
    showToast: true,
  });

  // 处理生成测验
  const handleGenerate = useCallback(async (grade: string, subject: string) => {
    const generateQuizRequest = async (signal?: AbortSignal) => {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade, subject, locale }),
        signal,
      });

      const result = await response.json();

      if (result.code === 0 && result.data) {
        // 添加ID和标题
        const quizData = {
          ...result.data,
          id: uuidv4(), // 生成唯一ID
          title: `${result.data.grade} - ${result.data.subject} Quiz`,
        };
        return quizData;
      } else {
        throw new Error(result.message || t("quiz_generator.messages.generation_failed"));
      }
    };
    
    try {
      const data = await quizRequest.execute(generateQuizRequest, t("quiz_generator.results.generating"));
      // 保存到Context
      if (data) {
        setQuiz(data);
        // 记录用户生成了测验
        trackQuizGeneration();
      }
    } catch (error) {
      // 错误处理由Hook自动完成
      console.error("Quiz generation failed:", error);
    }
  }, [locale, quizRequest, t, setQuiz, trackQuizGeneration]);
  
  // 处理演示测验
  const handleDemoQuiz = useCallback(async (grade: string, subject: string) => {
    const getDemoQuizRequest = async (signal?: AbortSignal) => {
      // 模拟网络请求，实际上是本地数据
      // 强制使用当前语言环境
      const demoQuizData = getDemoQuiz(grade, subject, locale);
      if (!demoQuizData) {
        throw new Error(t("quiz_generator.messages.generation_failed"));
      }
      
      // 添加一点延迟模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 添加演示提示
      const demoNote = locale === 'zh' 
        ? "这是一个演示测验。尝试编辑问题或导出，体验不同的功能。" 
        : "This is a demo quiz. Try editing questions or exporting to see different features.";
      
      return {...demoQuizData, note: demoNote};
    };
    
    try {
      const data = await demoRequest.execute(getDemoQuizRequest, t("quiz_generator.demo.loading"));
      // 保存到Context
      if (data) {
        setQuiz(data);
        // 记录用户使用了演示
        trackDemoUsage();
      }
    } catch (error) {
      console.error("Demo quiz generation failed:", error);
    }
  }, [locale, demoRequest, t, setQuiz, trackDemoUsage]);

  // 重试函数 - 简单重置让用户重新选择
  const handleRetry = useCallback(() => {
    quizRequest.reset();
  }, [quizRequest]);

  // 开始新测验
  const handleStartNewQuiz = useCallback(() => {
    resetQuiz();
    quizRequest.reset();
  }, [resetQuiz, quizRequest]);
  
  // 同步Context状态和请求状态
  useEffect(() => {
    // 如果Context中有测验但请求状态是空闲，则同步成成功状态
    if (hasQuiz && quizRequest.isIdle) {
      quizRequest.setData(currentQuiz!);
    }
  }, [hasQuiz, currentQuiz, quizRequest]);
  
  // 引导步骤配置
  const guideSteps = [
    {
      title: t("quiz_generator.guide.step1_title"),
      content: t("quiz_generator.guide.step1_content"),
      elementId: "grade-select",
      placement: "right" as const
    },
    {
      title: t("quiz_generator.guide.step2_title"),
      content: t("quiz_generator.guide.step2_content"),
      elementId: "example-math-button",
      placement: "top" as const
    },
    {
      title: t("quiz_generator.guide.step3_title"),
      content: t("quiz_generator.guide.step3_content"),
      placement: "bottom" as const
    },
    {
      title: t("quiz_generator.guide.step4_title"),
      content: t("quiz_generator.guide.step4_content"),
      placement: "bottom" as const
    }
  ];
  
  // 处理欢迎模态框关闭
  const handleWelcomeClose = useCallback(() => {
    completeWelcome();
  }, [completeWelcome]);
  
  // 处理开始引导
  const handleStartGuide = useCallback(() => {
    setShowGuide(true);
    completeWelcome();
  }, [completeWelcome]);
  
  // 处理完成引导
  const handleGuideComplete = useCallback(() => {
    completeGuide();
  }, [completeGuide]);
  
  // 当shouldShowGuide变化时自动显示引导
  useEffect(() => {
    if (shouldShowGuide) {
      setShowGuide(true);
    }
  }, [shouldShowGuide]);

  return (
    <>
      {/* 欢迎模态框 */}
      <WelcomeModal
        isOpen={isNewUser}
        onClose={handleWelcomeClose}
        onStartGuide={handleStartGuide}
        onTryDemo={handleDemoQuiz}
      />
      
      {/* 引导提示 */}
      <GuidePopover
        steps={guideSteps}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onComplete={handleGuideComplete}
        startAtStep={guideStep}
      />
      
      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
      {/* 左侧：表单区域 */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {t("quiz_generator.form.title")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("quiz_generator.form.description")}
              </p>
            </div>
            
            <QuizForm onGenerate={handleGenerate} isLoading={quizRequest.isLoading || demoRequest.isLoading} />
            
            {/* 演示例子区域 - 只在未生成测验时显示 */}
            {preferences.showDemoButtons && quizRequest.isIdle && !hasQuiz && (
              <div className="mt-6">
                <DemoExamples 
                  onSelectDemo={handleDemoQuiz} 
                  isLoading={demoRequest.isLoading || quizRequest.isLoading}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 右侧：结果展示区域 */}
      <div className="lg:col-span-3">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {t("quiz_generator.results.title")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("quiz_generator.results.description")}
              </p>
            </div>
            
            {/* 结果内容区域 */}
            <div className="min-h-[400px] lg:min-h-[500px]">
              {quizRequest.isError && (
                <ErrorDisplay 
                  error={quizRequest.error!}
                  onRetry={handleRetry}
                  onDismiss={quizRequest.reset}
                />
              )}
              
              {(quizRequest.isLoading || demoRequest.isLoading) && (
                <LoadingDisplay 
                  loading={quizRequest.isLoading ? quizRequest.loading : {
                    isLoading: true,
                    stage: "generating",
                    message: t("quiz_generator.demo.loading")
                  }}
                  onCancel={quizRequest.isLoading ? quizRequest.cancel : demoRequest.cancel}
                />
              )}
              
              {quizRequest.isSuccess && quizRequest.data && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    {/* 新测验按钮 */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleStartNewQuiz}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t("quiz_generator.actions.new_quiz")}
                    </Button>
                    
                    {/* 持久化提示 */}
                                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {t("quiz_generator.messages.auto_saved")}
                    <HelpTooltip translationKey="help_text.session_storage" className="ml-1" />
                  </div>
                  </div>
                  
                  <QuizResultDisplay 
                    quizData={quizRequest.data}
                    mode="preview"
                  />
                </>
              )}
              
              {quizRequest.isIdle && !hasQuiz && (
                <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-center text-muted-foreground text-sm sm:text-base max-w-md">
                    {t("quiz_generator.results.placeholder")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
} 