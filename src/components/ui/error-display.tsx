"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Wifi, 
  Clock, 
  Server, 
  Shield, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ApiError } from "@/types/api";
import { useState } from "react";

interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
  className?: string;
}

// 错误图标映射
const ErrorIconMap = {
  network: Wifi,
  timeout: Clock,
  server: Server,
  quota: Shield,
  validation: AlertTriangle,
  unknown: AlertTriangle,
};

// 错误严重程度颜色映射
const SeverityVariantMap = {
  info: "default",
  warning: "default", 
  error: "destructive",
  critical: "destructive",
} as const;

export default function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  compact = false,
  className = ""
}: ErrorDisplayProps) {
  const t = useTranslations();
  const [showDetails, setShowDetails] = useState(false);
  
  const Icon = ErrorIconMap[error.type] || AlertTriangle;
  const severityVariant = SeverityVariantMap[error.severity];

  if (compact) {
    return (
      <Alert variant={error.severity === 'error' || error.severity === 'critical' ? 'destructive' : 'default'} className={className}>
        <Icon className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          {error.canRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {t('common.retry')}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`border-destructive/20 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* 错误图标 */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              error.severity === 'critical' 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : error.severity === 'error'
                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' 
                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* 错误内容 */}
          <div className="flex-1 min-w-0">
            {/* 错误头部 */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t(`errors.titles.${error.type}`, { fallback: t('errors.titles.unknown') })}
              </h3>
              <Badge variant={error.severity === 'error' || error.severity === 'critical' ? 'destructive' : 'default'} className="text-xs">
                {t(`errors.severity.${error.severity}`)}
              </Badge>
            </div>

            {/* 错误消息 */}
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {error.message}
            </p>

            {/* 错误详情 */}
            {error.details && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                >
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  )}
                  {showDetails ? t('common.hide_details') : t('common.show_details')}
                </Button>
                
                {showDetails && (
                  <div className="mt-2 p-3 bg-muted/50 rounded border text-sm text-muted-foreground font-mono">
                    {error.details}
                  </div>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2">
              {error.canRetry && onRetry && (
                <Button onClick={onRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('common.retry')}
                  {error.retryCount !== undefined && error.maxRetries && (
                    <span className="ml-1 text-xs opacity-70">
                      ({error.retryCount}/{error.maxRetries})
                    </span>
                  )}
                </Button>
              )}

              {error.type === 'quota' && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/pricing" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('errors.actions.upgrade')}
                  </a>
                </Button>
              )}

              {error.type === 'network' && (
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('errors.actions.refresh_page')}
                </Button>
              )}

              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  {t('common.dismiss')}
                </Button>
              )}
            </div>

            {/* 建议操作 */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{t('errors.suggestions.title')}:</strong>{' '}
                {t(`errors.suggestions.${error.type}`, { 
                  fallback: t('errors.suggestions.unknown') 
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 