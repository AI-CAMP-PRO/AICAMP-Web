import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ExportOptions, ExportState, QuizData } from '@/types/quiz';

// 默认导出选项
const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'print',
  layout: 'standard',
  includeAnswers: true,
  includeExplanations: true,
  includeDifficulty: true,
  includeTags: false,
  includeMetadata: true,
  paperSize: 'A4',
  orientation: 'portrait',
  questionsPerPage: 'auto',
};

// 导出钩子
export function useExport(quizData?: QuizData) {
  const t = useTranslations();
  
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    isPreviewOpen: false,
    currentOptions: DEFAULT_EXPORT_OPTIONS,
  });

  // 更新导出选项
  const updateOptions = useCallback((updates: Partial<ExportOptions>) => {
    setExportState(prev => ({
      ...prev,
      currentOptions: { ...prev.currentOptions, ...updates }
    }));
  }, []);

  // 重置选项为默认值
  const resetOptions = useCallback(() => {
    setExportState(prev => ({
      ...prev,
      currentOptions: DEFAULT_EXPORT_OPTIONS
    }));
  }, []);

  // 打开预览
  const openPreview = useCallback(() => {
    if (!quizData) {
      toast.error(t('export.errors.no_data'));
      return;
    }
    
    setExportState(prev => ({
      ...prev,
      isPreviewOpen: true,
      error: undefined,
    }));
  }, [quizData, t]);

  // 关闭预览
  const closePreview = useCallback(() => {
    setExportState(prev => ({
      ...prev,
      isPreviewOpen: false,
    }));
  }, []);

  // 检测浏览器支持
  const checkBrowserSupport = useCallback(() => {
    const isSupported = typeof window !== 'undefined' && 
                       window.print && 
                       typeof window.print === 'function';
    
    if (!isSupported) {
      toast.error(t('export.errors.browser_not_supported'));
      return false;
    }
    
    return true;
  }, [t]);

  // 应用打印样式
  const applyPrintStyles = useCallback(() => {
    if (typeof document === 'undefined') return null;

    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.id = 'quiz-print-styles';
    
    // 注入打印CSS
    fetch('/print.css')
      .then(response => response.text())
      .then(css => {
        styleElement.textContent = css;
      })
      .catch(() => {
        // 如果无法加载CSS文件，使用内联样式
        styleElement.textContent = `
          @media print {
            .no-print { display: none !important; }
            .print-container { width: 100% !important; max-width: none !important; }
          }
        `;
      });

    document.head.appendChild(styleElement);
    return styleElement;
  }, []);

  // 移除打印样式
  const removePrintStyles = useCallback((styleElement: HTMLStyleElement | null) => {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  }, []);

  // 准备打印内容
  const preparePrintContent = useCallback((content: HTMLElement) => {
    const { currentOptions } = exportState;
    
    // 添加布局类
    content.className = `print-container print-layout-${currentOptions.layout}`;
    
    // 处理横向布局
    if (currentOptions.orientation === 'landscape') {
      content.classList.add('print-landscape');
    }
    
    // 隐藏不需要的元素
    const elementsToHide = [
      ...(currentOptions.includeAnswers ? [] : ['.print-option-correct', '.print-option-indicator']),
      ...(currentOptions.includeExplanations ? [] : ['.print-explanation']),
      ...(currentOptions.includeDifficulty ? [] : ['.print-badge-difficulty-easy', '.print-badge-difficulty-medium', '.print-badge-difficulty-hard']),
      ...(currentOptions.includeTags ? [] : ['.print-tags']),
      ...(currentOptions.includeMetadata ? [] : ['.print-metadata']),
    ];
    
    elementsToHide.forEach(selector => {
      const elements = content.querySelectorAll(selector);
      elements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    });
    
    return content;
  }, [exportState]);

  // 执行打印
  const executePrint = useCallback(async () => {
    if (!checkBrowserSupport()) return;
    if (!quizData) {
      toast.error(t('export.errors.no_data'));
      return;
    }

    setExportState(prev => ({
      ...prev,
      isExporting: true,
      error: undefined,
      progress: 0,
    }));

    try {
      // 应用打印样式
      const styleElement = applyPrintStyles();
      
      // 模拟进度
      setExportState(prev => ({ ...prev, progress: 30 }));
      
      // 等待样式加载
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setExportState(prev => ({ ...prev, progress: 60 }));
      
      // 执行打印
      window.print();
      
      setExportState(prev => ({ ...prev, progress: 100 }));
      
      // 显示成功消息
      toast.success(t('export.success.print_dialog_opened'));
      
      // 清理样式
      setTimeout(() => {
        removePrintStyles(styleElement);
      }, 1000);
      
    } catch (error) {
      console.error('Print error:', error);
      toast.error(t('export.errors.print_failed'));
      setExportState(prev => ({
        ...prev,
        error: t('export.errors.print_failed'),
      }));
    } finally {
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: undefined,
      }));
    }
  }, [quizData, exportState, checkBrowserSupport, applyPrintStyles, removePrintStyles, t]);

  // 导出为PDF（使用浏览器打印）
  const exportToPDF = useCallback(async () => {
    if (!checkBrowserSupport()) return;
    
    // 更新格式为PDF
    updateOptions({ format: 'pdf' });
    
    // 显示说明提示
    toast.info(t('export.info.pdf_instructions'), {
      duration: 5000,
    });
    
    // 执行打印（用户可以在打印对话框中选择"保存为PDF"）
    await executePrint();
  }, [checkBrowserSupport, updateOptions, executePrint, t]);

  // 主导出函数
  const exportQuiz = useCallback(async (options?: Partial<ExportOptions>) => {
    if (options) {
      updateOptions(options);
    }
    
    const { format } = exportState.currentOptions;
    
    switch (format) {
      case 'print':
        await executePrint();
        break;
      case 'pdf':
        await exportToPDF();
        break;
      default:
        toast.error(t('export.errors.unsupported_format'));
    }
  }, [exportState.currentOptions, updateOptions, executePrint, exportToPDF, t]);

  // 快速导出（使用默认设置）
  const quickExport = useCallback(async (format: 'print' | 'pdf' = 'print') => {
    await exportQuiz({ format });
  }, [exportQuiz]);

  // 保存用户偏好
  const savePreferences = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('quiz-export-preferences', JSON.stringify(exportState.currentOptions));
      toast.success(t('export.success.preferences_saved'));
    }
  }, [exportState.currentOptions, t]);

  // 加载用户偏好
  const loadPreferences = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('quiz-export-preferences');
        if (saved) {
          const preferences = JSON.parse(saved);
          updateOptions(preferences);
          return true;
        }
      } catch (error) {
        console.warn('Failed to load export preferences:', error);
      }
    }
    return false;
  }, [updateOptions]);

  // 页面加载时加载偏好设置
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    // 状态
    ...exportState,
    
    // 选项管理
    updateOptions,
    resetOptions,
    savePreferences,
    loadPreferences,
    
    // 预览控制
    openPreview,
    closePreview,
    
    // 导出功能
    exportQuiz,
    quickExport,
    executePrint,
    exportToPDF,
    
    // 工具函数
    checkBrowserSupport,
    preparePrintContent,
    
    // 便利属性
    canExport: !!quizData,
    hasValidOptions: exportState.currentOptions.format && exportState.currentOptions.layout,
  };
} 