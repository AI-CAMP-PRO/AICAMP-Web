import { getTranslations } from "next-intl/server";
import Crumb from "@/components/blocks/crumb";
import { Card } from "@/components/ui/card";

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
    <div className="container mx-auto py-8 px-4">
      {/* 面包屑导航 */}
      <div className="mb-6">
        <Crumb items={crumbItems} />
      </div>

      {/* 页面标题和描述 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("quiz_generator.title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("quiz_generator.description")}
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：表单区域 */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("quiz_generator.form.title")}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t("quiz_generator.form.description")}
            </p>
            {/* 表单内容将在下个任务中添加 */}
            <div className="text-center py-8 text-muted-foreground">
              {t("quiz_generator.form.coming_soon")}
            </div>
          </Card>
        </div>

        {/* 右侧：结果展示区域 */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("quiz_generator.results.title")}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t("quiz_generator.results.description")}
            </p>
            {/* 结果内容将在后续任务中添加 */}
            <div className="text-center py-12 text-muted-foreground">
              {t("quiz_generator.results.placeholder")}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 