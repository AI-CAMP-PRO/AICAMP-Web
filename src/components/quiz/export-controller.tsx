"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Printer as Print, 
  Download, 
  Eye, 
  Settings, 
  ChevronDown,
  RotateCcw,
  Save
} from "lucide-react";
import { ExportControllerProps } from "@/types/quiz";
import { useExport } from "@/hooks/useExport";
import PrintPreview from "./print-preview";

export default function ExportController({ 
  quizData, 
  onExport,
  className = ""
}: ExportControllerProps) {
  const t = useTranslations();
  const tp = useTranslations('pages.quiz-generator');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const {
    currentOptions,
    isExporting,
    isPreviewOpen,
    canExport,
    updateOptions,
    resetOptions,
    savePreferences,
    openPreview,
    closePreview,
    quickExport,
    exportQuiz,
  } = useExport(quizData);

  // 处理导出
  const handleExport = async (format: 'print' | 'pdf') => {
    try {
      await exportQuiz({ format });
      if (onExport) {
        onExport(currentOptions);
      }
    } catch (error) {
      // 错误处理由Hook自动完成
      console.error('Export failed:', error);
    }
  };

  // 快速操作
  const handleQuickPrint = () => quickExport('print');
  const handleQuickPDF = () => quickExport('pdf');

  if (!quizData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t("export.no_quiz_data")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`shadow-lg border-0 bg-card/80 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Print className="w-5 h-5 text-primary" />
            {t("export.title")}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 快速操作区域 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">
              {t("export.quick_actions")}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={openPreview}
                disabled={!canExport}
                variant="outline"
                className="justify-start"
                title={tp('tooltips.export')}
              >
                <Eye className="w-4 h-4 mr-2" />
                {t("export.actions.preview")}
              </Button>
              
              <Button
                onClick={handleQuickPrint}
                disabled={!canExport || isExporting}
                className="justify-start"
              >
                <Print className="w-4 h-4 mr-2" />
                {t("export.actions.print")}
              </Button>
              
              <Button
                onClick={handleQuickPDF}
                disabled={!canExport || isExporting}
                variant="outline"
                className="justify-start"
                title={tp('tooltips.export')}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("export.actions.download_pdf")}
              </Button>
            </div>
          </div>

          <Separator />

          {/* 高级选项 */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t("export.advanced_options")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              {/* 布局选项 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("export.options.layout")}
                  </Label>
                  <Select
                    value={currentOptions.layout}
                    onValueChange={(value: "standard" | "compact" | "expanded") => 
                      updateOptions({ layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        {t("export.layout.standard")}
                      </SelectItem>
                      <SelectItem value="compact">
                        {t("export.layout.compact")}
                      </SelectItem>
                      <SelectItem value="expanded">
                        {t("export.layout.expanded")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("export.options.orientation")}
                  </Label>
                  <Select
                    value={currentOptions.orientation}
                    onValueChange={(value: "portrait" | "landscape") => 
                      updateOptions({ orientation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">
                        {t("export.orientation.portrait")}
                      </SelectItem>
                      <SelectItem value="landscape">
                        {t("export.orientation.landscape")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 纸张设置 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("export.options.paper_size")}
                  </Label>
                  <Select
                    value={currentOptions.paperSize}
                    onValueChange={(value: "A4" | "Letter" | "Legal") => 
                      updateOptions({ paperSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("export.options.questions_per_page")}
                  </Label>
                  <Select
                    value={currentOptions.questionsPerPage?.toString() || 'auto'}
                    onValueChange={(value) => 
                      updateOptions({ 
                        questionsPerPage: value === 'auto' ? 'auto' : parseInt(value) 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        {t("export.auto")}
                      </SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 内容选项 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("export.options.content")}
                </Label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-answers" className="text-sm">
                      {t("export.options.include_answers")}
                    </Label>
                    <Switch
                      id="include-answers"
                      checked={currentOptions.includeAnswers}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeAnswers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-explanations" className="text-sm">
                      {t("export.options.include_explanations")}
                    </Label>
                    <Switch
                      id="include-explanations"
                      checked={currentOptions.includeExplanations}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeExplanations: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-difficulty" className="text-sm">
                      {t("export.options.include_difficulty")}
                    </Label>
                    <Switch
                      id="include-difficulty"
                      checked={currentOptions.includeDifficulty}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeDifficulty: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-tags" className="text-sm">
                      {t("export.options.include_tags")}
                    </Label>
                    <Switch
                      id="include-tags"
                      checked={currentOptions.includeTags}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeTags: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-metadata" className="text-sm">
                      {t("export.options.include_metadata")}
                    </Label>
                    <Switch
                      id="include-metadata"
                      checked={currentOptions.includeMetadata}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeMetadata: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 选项控制按钮 */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetOptions}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("export.actions.reset")}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={savePreferences}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t("export.actions.save_preferences")}
                </Button>
              </div>

              {/* 自定义导出 */}
              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm font-medium">
                  {t("export.custom_export")}
                </Label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('print')}
                    disabled={!canExport || isExporting}
                    className="justify-start"
                  >
                    <Print className="w-4 h-4 mr-2" />
                    {t("export.actions.print_with_options")}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    disabled={!canExport || isExporting}
                    className="justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("export.actions.pdf_with_options")}
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* 状态信息 */}
          {isExporting && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t("export.processing")}
              </p>
            </div>
          )}

          {/* 测验信息摘要 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>{t("quiz_generator.results.questions_count")}:</span>
              <span>{quizData.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("export.current_options")}:</span>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  {currentOptions.layout}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentOptions.includeAnswers ? t("export.with_answers") : t("export.without_answers")}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 预览对话框 */}
      <PrintPreview
        quizData={quizData}
        options={currentOptions}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        onExport={() => exportQuiz()}
        onOptionsChange={updateOptions}
      />
    </>
  );
} 