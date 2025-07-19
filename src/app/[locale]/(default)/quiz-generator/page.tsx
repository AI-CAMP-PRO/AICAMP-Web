import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Crumb from "@/components/blocks/crumb";
import QuizGeneratorClient from "@/components/quiz/quiz-generator-client";
import { QuizProvider } from "@/contexts/quiz";

// 动态元数据生成
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  // 直接使用getTranslations方法获取翻译
  const t = await getTranslations({ locale: params.locale, namespace: 'pages.quiz-generator' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function QuizGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  // 面包屑导航配置
  const crumbItems = [
    {
      title: t("quiz_generator.breadcrumb.home"),
      url: locale === "en" ? "/" : `/${locale}`,
      is_active: false,
    },
    {
      title: t("quiz_generator.breadcrumb.quiz_generator"),
      url: "",
      is_active: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 主容器 */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* 面包屑导航 */}
        <div className="mb-6 sm:mb-8">
          <Crumb items={crumbItems} />
        </div>

        {/* 页面标题和描述 */}
        <div className="mb-8 sm:mb-12 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {t("quiz_generator.title")}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-3xl mx-auto lg:mx-0 leading-relaxed">
            {t("quiz_generator.description")}
          </p>
              </div>

      {/* 主要内容区域 - 包裹在QuizProvider中 */}
      <QuizProvider>
        <QuizGeneratorClient />
      </QuizProvider>
    </div>
    </div>
  );
} 