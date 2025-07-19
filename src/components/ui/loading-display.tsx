"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Loader2, 
  Clock, 
  Zap, 
  Brain,
  CheckCircle,
  X
} from "lucide-react";
import { LoadingState } from "@/types/api";

interface LoadingDisplayProps {
  loading: LoadingState;
  onCancel?: () => void;
  showProgress?: boolean;
  compact?: boolean;
  className?: string;
}

// 加载阶段图标映射
const StageIconMap = {
  initializing: Clock,
  validating: CheckCircle,
  generating: Brain,
  processing: Zap,
  finalizing: CheckCircle,
};

// 加载阶段描述
const getStageDescription = (stage: string, t: any): string => {
  const descriptions = {
    initializing: t('loading.stages.initializing'),
    validating: t('loading.stages.validating'),
    generating: t('loading.stages.generating'),
    processing: t('loading.stages.processing'),
    finalizing: t('loading.stages.finalizing'),
  };
  return descriptions[stage as keyof typeof descriptions] || t('loading.stages.loading');
};

export default function LoadingDisplay({
  loading,
  onCancel,
  showProgress = true,
  compact = false,
  className = ""
}: LoadingDisplayProps) {
  const t = useTranslations();
  
  if (!loading.isLoading) {
    return null;
  }

  const StageIcon = loading.stage ? StageIconMap[loading.stage] : Loader2;
  const stageDescription = loading.stage ? getStageDescription(loading.stage, t) : t('loading.default');
  const displayMessage = loading.message || stageDescription;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-muted/50 rounded-lg border ${className}`}>
        <div className="flex-shrink-0">
          <StageIcon className="w-5 h-5 animate-spin text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {displayMessage}
          </p>
          {showProgress && loading.progress !== undefined && (
            <Progress value={loading.progress} className="mt-2 h-2" />
          )}
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="py-12">
        <div className="text-center space-y-6">
          {/* 主要加载动画 */}
          <div className="flex justify-center">
            <div className="relative">
              {/* 外圈旋转动画 */}
              <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              
              {/* 中心图标 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <StageIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* 加载文本 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {displayMessage}
            </h3>
            
            {loading.estimatedTime && (
              <p className="text-sm text-muted-foreground">
                {t('loading.estimated_time', { time: loading.estimatedTime })}
              </p>
            )}
          </div>

          {/* 进度指示器 */}
          {showProgress && (
            <div className="space-y-3 max-w-md mx-auto">
              {loading.progress !== undefined ? (
                <div className="space-y-2">
                  <Progress value={loading.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(loading.progress)}% {t('loading.complete')}
                  </p>
                </div>
              ) : (
                // 阶段指示器
                <div className="flex justify-center gap-2">
                  {['initializing', 'validating', 'generating', 'processing', 'finalizing'].map((stage, index) => (
                    <div
                      key={stage}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        loading.stage === stage
                          ? 'bg-primary animate-pulse'
                          : ['initializing', 'validating', 'generating'].indexOf(loading.stage || '') > index
                          ? 'bg-primary/60'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 取消按钮 */}
          {onCancel && (
            <div className="pt-4">
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
            </div>
          )}

          {/* 骨架屏预览 */}
          <div className="mt-8 space-y-4 max-w-2xl mx-auto">
            <div className="text-left">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 