"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, BookOpen, PenLine, Download } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGuide: () => void;
  onTryDemo: (grade: string, subject: string) => void;
}

/**
 * 欢迎模态框组件
 * 为首次访问的用户提供引导和演示选项
 */
export default function WelcomeModal({
  isOpen,
  onClose,
  onStartGuide,
  onTryDemo,
}: WelcomeModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("welcome");
  
  // 演示数据选项
  const demoOptions = [
    { grade: "3", subject: "math", icon: "🧮", title: t("quiz_generator.welcome.math_demo_title"), description: t("quiz_generator.welcome.math_demo_desc") },
    { grade: "5", subject: "science", icon: "🔬", title: t("quiz_generator.welcome.science_demo_title"), description: t("quiz_generator.welcome.science_demo_desc") },
  ];
  
  // 核心功能特性
  const features = [
    { 
      icon: <BookOpen className="h-5 w-5 text-primary" />, 
      title: t("quiz_generator.welcome.feature1_title"),
      description: t("quiz_generator.welcome.feature1_desc")
    },
    { 
      icon: <PenLine className="h-5 w-5 text-primary" />, 
      title: t("quiz_generator.welcome.feature2_title"),
      description: t("quiz_generator.welcome.feature2_desc") 
    },
    { 
      icon: <Download className="h-5 w-5 text-primary" />, 
      title: t("quiz_generator.welcome.feature3_title"),
      description: t("quiz_generator.welcome.feature3_desc") 
    },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="welcome">{t("quiz_generator.welcome.welcome_tab")}</TabsTrigger>
            <TabsTrigger value="demo">{t("quiz_generator.welcome.demo_tab")}</TabsTrigger>
          </TabsList>
          
          {/* 欢迎标签内容 */}
          <TabsContent value="welcome" className="pt-4">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl">
                {t("quiz_generator.welcome.title")}
              </DialogTitle>
              <DialogDescription className="text-base">
                {t("quiz_generator.welcome.subtitle")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              {/* 主要特性列表 */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setActiveTab("demo")}>
                {t("quiz_generator.welcome.try_demo_button")}
              </Button>
              <Button onClick={onStartGuide}>
                {t("quiz_generator.welcome.start_guide_button")}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          {/* 演示标签内容 */}
          <TabsContent value="demo" className="pt-4">
            <DialogHeader>
              <DialogTitle>{t("quiz_generator.welcome.demo_title")}</DialogTitle>
              <DialogDescription>
                {t("quiz_generator.welcome.demo_description")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoOptions.map((demo, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-accent/50 hover:border-primary/50 cursor-pointer transition-all"
                  onClick={() => onTryDemo(demo.grade, demo.subject)}
                >
                  <div className="text-2xl mb-2">{demo.icon}</div>
                  <h3 className="text-base font-medium mb-2">{demo.title}</h3>
                  <p className="text-sm text-muted-foreground">{demo.description}</p>
                  <div className="mt-3 text-xs flex items-center gap-1 text-primary">
                    <CheckCircle className="h-3 w-3" />
                    <span>{t("quiz_generator.welcome.instant_demo")}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setActiveTab("welcome")}>
                {t("common.back")}
              </Button>
              <Button onClick={onClose}>
                {t("common.start")}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 