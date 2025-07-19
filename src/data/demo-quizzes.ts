import { QuizData } from "@/types/quiz";

// 生成唯一ID的简单函数
const generateId = () => Math.random().toString(36).substring(2, 15);

/**
 * 演示测验数据集合
 * 按语言、年级和科目组织的高质量测验示例
 */
export const demoQuizzes: Record<string, Record<string, QuizData[]>> = {
  // 英文测验
  "en": {
    // 数学测验示例
    "math": [
      {
        id: generateId(),
        title: "Grade 3 Basic Math Quiz",
        grade: "3",
        subject: "math",
        totalQuestions: 5,
        generatedAt: new Date().toISOString(),
        modelProvider: "demo",
        questions: [
          {
            id: 1,
            question: "What is 25 + 18?",
            options: ["33", "43", "52", "42"],
            correctAnswer: 1,
            explanation: "To add 25 + 18, we can break it down: 25 + 18 = 25 + 10 + 8 = 35 + 8 = 43",
            difficulty: "easy"
          },
          {
            id: 2,
            question: "If you have 24 cookies and want to share them equally among 6 friends, how many cookies does each friend get?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1,
            explanation: "To divide 24 cookies among 6 friends, we calculate 24 ÷ 6 = 4. So each friend gets 4 cookies.",
            difficulty: "medium"
          },
          {
            id: 3,
            question: "What is the next number in the pattern: 5, 10, 15, 20, ___?",
            options: ["21", "25", "30", "35"],
            correctAnswer: 1,
            explanation: "This pattern increases by 5 each time. After 20, the next number would be 20 + 5 = 25.",
            difficulty: "easy"
          },
          {
            id: 4,
            question: "A rectangle has a length of 7 cm and a width of 4 cm. What is its perimeter?",
            options: ["11 cm", "22 cm", "28 cm", "16 cm"],
            correctAnswer: 1,
            explanation: "The perimeter of a rectangle is calculated as 2 × (length + width). So 2 × (7 + 4) = 2 × 11 = 22 cm.",
            difficulty: "medium"
          },
          {
            id: 5,
            question: "What is 42 - 17?",
            options: ["15", "25", "27", "32"],
            correctAnswer: 1,
            explanation: "To subtract 17 from 42, we can do 42 - 10 = 32, then 32 - 7 = 25.",
            difficulty: "easy"
          }
        ],
        note: "This is a demo quiz. You can edit questions, view answers, and test export functionality."
      }
    ],
    // 科学测验示例
    "science": [
      {
        id: generateId(),
        title: "Grade 5 Science Quiz",
        grade: "5",
        subject: "science",
        totalQuestions: 5,
        generatedAt: new Date().toISOString(),
        modelProvider: "demo",
        questions: [
          {
            id: 1,
            question: "Which of the following is NOT a renewable energy source?",
            options: ["Solar power", "Wind power", "Natural gas", "Hydropower"],
            correctAnswer: 2,
            explanation: "Natural gas is a fossil fuel formed over millions of years from ancient organic matter. It is not renewable within a human lifetime, unlike solar, wind, and hydropower which are constantly replenished.",
            difficulty: "medium",
            tags: ["energy", "natural resources"]
          },
          {
            id: 2,
            question: "What is the process called when plants make their own food using sunlight?",
            options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
            correctAnswer: 1,
            explanation: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create glucose (food) and oxygen.",
            difficulty: "easy",
            tags: ["plants", "biology"]
          },
          {
            id: 3,
            question: "Which part of the plant absorbs water and nutrients from soil?",
            options: ["Leaves", "Stems", "Roots", "Flowers"],
            correctAnswer: 2,
            explanation: "Roots are specialized plant structures that grow underground and absorb water and dissolved minerals from the soil.",
            difficulty: "easy",
            tags: ["plants", "biology"]
          },
          {
            id: 4,
            question: "What is the Earth's largest ecosystem?",
            options: ["Tropical rainforest", "Desert", "Ocean", "Tundra"],
            correctAnswer: 2,
            explanation: "Oceans cover about 71% of Earth's surface and contain 97% of Earth's water, making them the largest ecosystem on our planet.",
            difficulty: "medium",
            tags: ["ecosystems", "earth science"]
          },
          {
            id: 5,
            question: "Which of these states of matter has particles that are packed tightly together but can still flow?",
            options: ["Solid", "Liquid", "Gas", "Plasma"],
            correctAnswer: 1,
            explanation: "Liquids have particles close together like solids, but they can flow and take the shape of their container because the particles can move past each other.",
            difficulty: "medium",
            tags: ["matter", "physics"]
          }
        ],
        note: "This is a demo quiz. Try editing questions or exporting to see different features."
      }
    ]
  },
  // 中文测验
  "zh": {
    // 数学测验示例
    "math": [
      {
        id: generateId(),
        title: "三年级基础数学测验",
        grade: "3",
        subject: "math",
        totalQuestions: 5,
        generatedAt: new Date().toISOString(),
        modelProvider: "demo",
        questions: [
          {
            id: 1,
            question: "25 + 18 等于多少？",
            options: ["33", "43", "52", "42"],
            correctAnswer: 1,
            explanation: "计算 25 + 18，可以这样拆分：25 + 18 = 25 + 10 + 8 = 35 + 8 = 43",
            difficulty: "easy"
          },
          {
            id: 2,
            question: "如果你有24块饼干，想平均分给6位朋友，每人能得到几块饼干？",
            options: ["3块", "4块", "5块", "6块"],
            correctAnswer: 1,
            explanation: "要将24块饼干平均分给6位朋友，计算 24 ÷ 6 = 4。所以每人得到4块饼干。",
            difficulty: "medium"
          },
          {
            id: 3,
            question: "在这个数列中，下一个数字是什么：5, 10, 15, 20, ___?",
            options: ["21", "25", "30", "35"],
            correctAnswer: 1,
            explanation: "这个数列每次增加5。在20之后，下一个数字应该是 20 + 5 = 25。",
            difficulty: "easy"
          },
          {
            id: 4,
            question: "一个长方形的长是7厘米，宽是4厘米，它的周长是多少？",
            options: ["11厘米", "22厘米", "28厘米", "16厘米"],
            correctAnswer: 1,
            explanation: "长方形的周长计算公式是2 ×（长 + 宽）。所以 2 ×（7 + 4）= 2 × 11 = 22厘米。",
            difficulty: "medium"
          },
          {
            id: 5,
            question: "42 - 17 等于多少？",
            options: ["15", "25", "27", "32"],
            correctAnswer: 1,
            explanation: "要从42中减去17，可以这样算：42 - 10 = 32，然后 32 - 7 = 25。",
            difficulty: "easy"
          }
        ],
        note: "这是一个演示测验。您可以编辑问题、查看答案和测试导出功能。"
      }
    ],
    // 科学测验示例
    "science": [
      {
        id: generateId(),
        title: "五年级科学测验",
        grade: "5",
        subject: "science",
        totalQuestions: 5,
        generatedAt: new Date().toISOString(),
        modelProvider: "demo",
        questions: [
          {
            id: 1,
            question: "下列哪项不是可再生能源？",
            options: ["太阳能", "风能", "天然气", "水力发电"],
            correctAnswer: 2,
            explanation: "天然气是化石燃料，由古代有机物经过数百万年形成。它不像太阳能、风能和水力发电那样可以在人类生命周期内不断补充，因此不是可再生能源。",
            difficulty: "medium",
            tags: ["能源", "自然资源"]
          },
          {
            id: 2,
            question: "植物利用阳光制造自己的食物的过程叫什么？",
            options: ["呼吸作用", "光合作用", "消化作用", "发酵作用"],
            correctAnswer: 1,
            explanation: "光合作用是植物利用阳光、水和二氧化碳创造葡萄糖（食物）和氧气的过程。",
            difficulty: "easy",
            tags: ["植物", "生物学"]
          },
          {
            id: 3,
            question: "植物的哪个部分吸收土壤中的水分和养分？",
            options: ["叶子", "茎", "根", "花"],
            correctAnswer: 2,
            explanation: "根是植物的特殊结构，生长在地下，吸收土壤中的水和溶解的矿物质。",
            difficulty: "easy",
            tags: ["植物", "生物学"]
          },
          {
            id: 4,
            question: "地球上最大的生态系统是什么？",
            options: ["热带雨林", "沙漠", "海洋", "苔原"],
            correctAnswer: 2,
            explanation: "海洋覆盖了地球表面约71%的面积，包含了地球上97%的水，使其成为我们星球上最大的生态系统。",
            difficulty: "medium",
            tags: ["生态系统", "地球科学"]
          },
          {
            id: 5,
            question: "以下哪种物质状态的粒子紧密排列但仍能流动？",
            options: ["固态", "液态", "气态", "等离子态"],
            correctAnswer: 1,
            explanation: "液体的粒子像固体一样紧密排列，但它们可以流动并呈现容器的形状，因为粒子可以彼此滑过。",
            difficulty: "medium",
            tags: ["物质", "物理学"]
          }
        ],
        note: "这是一个演示测验。尝试编辑问题或导出，体验不同的功能。"
      }
    ]
  }
};

/**
 * 获取指定年级、科目和语言的演示测验
 */
export function getDemoQuiz(grade: string, subject: string, locale: string = "en"): QuizData | null {
  // 确保使用有效的语言代码
  const validLocale = locale in demoQuizzes ? locale : "en";
  
  // 如果有完全匹配的演示，返回它
  if (
    demoQuizzes[validLocale] && 
    demoQuizzes[validLocale][subject] && 
    demoQuizzes[validLocale][subject].some(quiz => quiz.grade === grade)
  ) {
    return { 
      ...demoQuizzes[validLocale][subject].find(quiz => quiz.grade === grade)!,
      id: generateId(), // 确保每次都生成新ID
      generatedAt: new Date().toISOString() // 更新生成时间
    };
  }
  
  // 如果没有完全匹配，返回同一科目的任何演示
  if (demoQuizzes[validLocale] && demoQuizzes[validLocale][subject]?.length > 0) {
    return {
      ...demoQuizzes[validLocale][subject][0],
      id: generateId(),
      grade,
      title: `${grade} ${demoQuizzes[validLocale][subject][0].subject} Quiz`,
      generatedAt: new Date().toISOString()
    };
  }
  
  // 找不到任何匹配，返回任何可用演示
  for (const subj in demoQuizzes[validLocale]) {
    if (demoQuizzes[validLocale][subj]?.length > 0) {
      return {
        ...demoQuizzes[validLocale][subj][0],
        id: generateId(),
        grade,
        subject,
        title: `${grade} ${subject} Quiz`,
        generatedAt: new Date().toISOString()
      };
    }
  }
  
  // 完全没有演示数据可用
  return null;
}

/**
 * 获取所有可用的演示科目
 */
export function getAvailableDemoSubjects(locale: string = "en"): string[] {
  const validLocale = locale in demoQuizzes ? locale : "en";
  return Object.keys(demoQuizzes[validLocale] || {});
}

/**
 * 获取指定科目的可用演示年级
 */
export function getAvailableDemoGrades(subject: string, locale: string = "en"): string[] {
  const validLocale = locale in demoQuizzes ? locale : "en";
  if (demoQuizzes[validLocale] && demoQuizzes[validLocale][subject]) {
    return demoQuizzes[validLocale][subject].map(quiz => quiz.grade);
  }
  return [];
} 