"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface GuideStep {
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
  elementId?: string;
}

interface GuidePopoverProps {
  steps: GuideStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  startAtStep?: number;
}

/**
 * 多步骤引导提示组件
 * 用于为新用户提供功能引导
 */
export default function GuidePopover({
  steps,
  isOpen,
  onClose,
  onComplete,
  startAtStep = 0,
}: GuidePopoverProps) {
  const [currentStep, setCurrentStep] = useState(startAtStep);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  // 获取翻译
  const t = useTranslations();
  
  // 在步骤变化或组件打开时更新位置
  useEffect(() => {
    if (!isOpen || !steps[currentStep].elementId) return;
    
    const updatePosition = () => {
      const targetElement = document.getElementById(steps[currentStep].elementId || "");
      if (!targetElement) return;
      
      const rect = targetElement.getBoundingClientRect();
      const placement = steps[currentStep].placement || "bottom";
      
      switch (placement) {
        case "top":
          setPosition({
            top: rect.top - 10 - 150, // 高度 + 间距
            left: rect.left + rect.width / 2 - 150 // 居中
          });
          break;
        case "right":
          setPosition({
            top: rect.top + rect.height / 2 - 75,
            left: rect.right + 10
          });
          break;
        case "bottom":
          setPosition({
            top: rect.bottom + 10,
            left: rect.left + rect.width / 2 - 150
          });
          break;
        case "left":
          setPosition({
            top: rect.top + rect.height / 2 - 75,
            left: rect.left - 10 - 300
          });
          break;
      }
    };
    
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [currentStep, isOpen, steps]);
  
  // 如果不打开或没有步骤，不渲染
  if (!isOpen || steps.length === 0) {
    return null;
  }
  
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  // 处理下一步
  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) onComplete();
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // 处理上一步
  const handlePrev = () => {
    if (isFirstStep) return;
    setCurrentStep(currentStep - 1);
  };
  
  // 处理跳过
  const handleSkip = () => {
    if (onComplete) onComplete();
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div 
        className="absolute pointer-events-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: "all 0.3s ease-in-out",
          minWidth: "300px",
          maxWidth: "400px",
        }}
      >
        <Card className="shadow-lg border-primary/20 backdrop-blur-sm overflow-hidden">
          <div className="p-4">
            {/* 标题和关闭按钮 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onClose}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">{t('common.close', { defaultMessage: 'Close' })}</span>
              </Button>
            </div>
            
            {/* 内容 */}
            <div className="text-sm text-muted-foreground mb-4">
              {step.content}
            </div>
            
            {/* 导航按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    className="text-xs h-7 px-2"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    {t('common.previous', { defaultMessage: 'Previous' })}
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-xs h-7 px-2"
                >
                  {t('common.skip', { defaultMessage: 'Skip' })}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                  className="text-xs h-7 px-2"
                >
                  {isLastStep 
                    ? t('common.finish', { defaultMessage: 'Finish' }) 
                    : t('common.next', { defaultMessage: 'Next' })
                  }
                  {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* 进度指示器 */}
          <div className="bg-muted h-1.5 w-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all" 
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`
              }}
            ></div>
          </div>
        </Card>
      </div>
    </div>
  );
} 