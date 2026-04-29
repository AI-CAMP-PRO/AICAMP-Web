"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface HelpTooltipProps {
  content?: string;
  translationKey?: string;
  translationNamespace?: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/**
 * 帮助提示组件，显示带有问号图标的工具提示
 */
export default function HelpTooltip({
  content = "",
  translationKey,
  translationNamespace = "pages.quiz-generator",
  side = "top",
  className = ""
}: HelpTooltipProps) {
  // 如果提供了翻译键，使用翻译；否则使用原始内容
  const t = useTranslations(translationNamespace);
  const tooltipContent = translationKey ? t(translationKey) : content;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={`inline-flex items-center justify-center focus:outline-none ${className}`}>
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            <span className="sr-only">Help</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 