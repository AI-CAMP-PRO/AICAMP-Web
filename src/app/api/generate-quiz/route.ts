import {
  LanguageModelV1,
  generateText,
} from "ai";
import { respData, respErr } from "@/lib/resp";

import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";

// 年级对应的描述
const gradeDescriptions: Record<string, string> = {
  "k": "kindergarten (ages 5-6)",
  "1": "1st grade (ages 6-7)",
  "2": "2nd grade (ages 7-8)", 
  "3": "3rd grade (ages 8-9)",
  "4": "4th grade (ages 9-10)",
  "5": "5th grade (ages 10-11)",
  "6": "6th grade (ages 11-12)",
};

// 科目对应的描述
const subjectDescriptions: Record<string, string> = {
  "math": "Mathematics",
  "science": "Science",
  "english": "English Language Arts",
  "social_studies": "Social Studies",
};

// 生成测验提示模板
function generateQuizPrompt(grade: string, subject: string, locale: string = 'en'): string {
  const gradeDesc = gradeDescriptions[grade] || grade;
  const subjectDesc = subjectDescriptions[subject] || subject;
  
  const isChineseLocale = locale === 'zh';
  const languageInstruction = isChineseLocale ? 
    'Generate questions and explanations in Chinese (中文). All content should be in simplified Chinese.' :
    'Generate questions and explanations in English.';
  
  return `You are an experienced elementary school teacher. Create a 5-question multiple choice quiz for ${gradeDesc} students on ${subjectDesc}.

IMPORTANT: ${languageInstruction}

Requirements:
- Questions must be age-appropriate and align with ${gradeDesc} curriculum standards
- Each question should have exactly 4 answer choices (A, B, C, D)
- Only one correct answer per question
- Questions should be clear, engaging, and educational
- Cover fundamental concepts appropriate for this grade level
- Use simple, clear language that ${gradeDesc} students can understand
- CRITICAL: Double-check all mathematical calculations before providing answers
- CRITICAL: Verify that the correctAnswer index matches the actual correct option
- For math problems, show your calculation step-by-step in the explanation

Please return the quiz in this EXACT JSON format:
{
  "quiz": {
    "grade": "${grade}",
    "subject": "${subject}",
    "questions": [
      {
        "id": 1,
        "question": "Question text here",
        "options": [
          "Option A text",
          "Option B text", 
          "Option C text",
          "Option D text"
        ],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why this is correct"
      }
    ]
  }
}

The correctAnswer should be the index (0, 1, 2, or 3) of the correct option.

IMPORTANT VERIFICATION STEPS:
1. For math problems: Calculate the answer yourself step by step
2. Find which option contains your calculated result  
3. Set correctAnswer to that option's index (0=first, 1=second, 2=third, 3=fourth)
4. Double-check: options[correctAnswer] should equal your calculated result

Make sure to return ONLY valid JSON with no additional text or formatting.`;
}

// 生成演示数据的函数
function generateDemoQuiz(grade: string, subject: string) {
  const gradeDesc = gradeDescriptions[grade] || grade;
  const subjectDesc = subjectDescriptions[subject] || subject;
  
  const demoQuestions = {
    math: [
      {
        id: 1,
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "5 + 3 = 8. When we add 5 and 3 together, we get 8."
      },
      {
        id: 2,
        question: "Which shape has 4 equal sides?",
        options: ["Triangle", "Circle", "Square", "Rectangle"],
        correctAnswer: 2,
        explanation: "A square has 4 equal sides and 4 right angles."
      },
      {
        id: 3,
        question: "What is 10 - 4?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
        explanation: "10 - 4 = 6. When we subtract 4 from 10, we get 6."
      },
      {
        id: 4,
        question: "How many minutes are in 1 hour?",
        options: ["50", "60", "70", "80"],
        correctAnswer: 1,
        explanation: "There are 60 minutes in 1 hour."
      },
      {
        id: 5,
        question: "What is 2 × 4?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "2 × 4 = 8. Two groups of four equals eight."
      }
    ],
    science: [
      {
        id: 1,
        question: "What do plants need to grow?",
        options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"],
        correctAnswer: 2,
        explanation: "Plants need water, sunlight, and air (carbon dioxide) to grow through photosynthesis."
      },
      {
        id: 2,
        question: "Which of these is a mammal?",
        options: ["Fish", "Bird", "Dog", "Insect"],
        correctAnswer: 2,
        explanation: "A dog is a mammal because it has fur, is warm-blooded, and feeds milk to its babies."
      },
      {
        id: 3,
        question: "What happens to water when it gets very cold?",
        options: ["It disappears", "It turns to ice", "It turns to gas", "It changes color"],
        correctAnswer: 1,
        explanation: "When water gets very cold (below 0°C or 32°F), it freezes and turns to ice."
      },
      {
        id: 4,
        question: "Which planet is closest to the Sun?",
        options: ["Earth", "Mercury", "Venus", "Mars"],
        correctAnswer: 1,
        explanation: "Mercury is the planet closest to the Sun in our solar system."
      },
      {
        id: 5,
        question: "What do we call baby frogs?",
        options: ["Puppies", "Kittens", "Tadpoles", "Cubs"],
        correctAnswer: 2,
        explanation: "Baby frogs are called tadpoles. They live in water and have tails before becoming adult frogs."
      }
    ],
    english: [
      {
        id: 1,
        question: "Which word rhymes with 'cat'?",
        options: ["Dog", "Hat", "Car", "Run"],
        correctAnswer: 1,
        explanation: "Hat rhymes with cat because they both end with the same sound '-at'."
      },
      {
        id: 2,
        question: "What is the plural of 'child'?",
        options: ["Childs", "Children", "Childes", "Child"],
        correctAnswer: 1,
        explanation: "The plural of 'child' is 'children'. This is an irregular plural form."
      },
      {
        id: 3,
        question: "Which sentence is correct?",
        options: ["I are happy", "I am happy", "I is happy", "I be happy"],
        correctAnswer: 1,
        explanation: "'I am happy' is correct. We use 'am' with the pronoun 'I'."
      },
      {
        id: 4,
        question: "What type of word is 'quickly'?",
        options: ["Noun", "Verb", "Adjective", "Adverb"],
        correctAnswer: 3,
        explanation: "'Quickly' is an adverb because it describes how something is done."
      },
      {
        id: 5,
        question: "Which letter comes after 'M' in the alphabet?",
        options: ["L", "N", "O", "P"],
        correctAnswer: 1,
        explanation: "N comes after M in the alphabet. The sequence is L, M, N, O."
      }
    ],
    social_studies: [
      {
        id: 1,
        question: "What is a community?",
        options: ["A single house", "A group of people living together", "A type of food", "A kind of animal"],
        correctAnswer: 1,
        explanation: "A community is a group of people who live and work together in the same area."
      },
      {
        id: 2,
        question: "Who helps keep our community safe?",
        options: ["Only teachers", "Police officers and firefighters", "Only doctors", "Only parents"],
        correctAnswer: 1,
        explanation: "Police officers and firefighters are community helpers who work to keep everyone safe."
      },
      {
        id: 3,
        question: "What is a rule?",
        options: ["Something we do for fun", "A guideline that helps keep order", "A type of game", "A kind of food"],
        correctAnswer: 1,
        explanation: "A rule is a guideline that helps keep order and helps people know how to behave."
      },
      {
        id: 4,
        question: "Which is an example of being a good citizen?",
        options: ["Throwing trash on the ground", "Helping others", "Being mean to friends", "Breaking rules"],
        correctAnswer: 1,
        explanation: "Helping others is an example of being a good citizen and contributing positively to the community."
      },
      {
        id: 5,
        question: "What do we call the leader of a city?",
        options: ["Teacher", "Mayor", "Doctor", "Farmer"],
        correctAnswer: 1,
        explanation: "The mayor is the leader of a city who helps make important decisions for the community."
      }
    ]
  };

  const questions = demoQuestions[subject as keyof typeof demoQuestions] || demoQuestions.math;
  
  return {
    grade,
    subject,
    questions: questions.map(q => ({
      ...q,
      question: `[${gradeDesc} ${subjectDesc}] ${q.question}`
    }))
  };
}

export async function POST(req: Request) {
  let grade: string = "";
  let subject: string = "";
  let locale: string = "en";
  
  try {
    const requestData = await req.json();
    grade = requestData.grade;
    subject = requestData.subject;
    locale = requestData.locale || 'en';
    
    // 参数验证
    if (!grade || !subject) {
      return respErr("Missing required parameters: grade and subject");
    }

    // 验证年级
    if (!gradeDescriptions[grade]) {
      return respErr("Invalid grade. Must be one of: k, 1, 2, 3, 4, 5, 6");
    }

    // 验证科目
    if (!subjectDescriptions[subject]) {
      return respErr("Invalid subject. Must be one of: math, science, english, social_studies");
    }

    // 生成提示
    const prompt = generateQuizPrompt(grade, subject, locale);

    // 配置AI模型 (优先使用DeepSeek，降级到OpenAI)
    let textModel: LanguageModelV1;
    let modelProvider = "deepseek";

    // 优先尝试DeepSeek (免费额度，更稳定)
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        textModel = deepseek("deepseek-chat");
        console.log("Using DeepSeek for quiz generation");
      } catch (error) {
        console.log("DeepSeek not available, falling back to OpenAI");
        if (process.env.OPENAI_API_KEY) {
          textModel = openai("gpt-4o-mini");
          modelProvider = "openai";
        } else {
          return respErr("No AI API keys configured. Please set DEEPSEEK_API_KEY or OPENAI_API_KEY");
        }
      }
    } else if (process.env.OPENAI_API_KEY) {
      try {
        textModel = openai("gpt-4o-mini");
        modelProvider = "openai";
        console.log("Using OpenAI for quiz generation");
      } catch (error) {
        return respErr("OpenAI API configuration error");
      }
    } else {
      return respErr("No AI API keys configured. Please set DEEPSEEK_API_KEY or OPENAI_API_KEY");
    }

    console.log(`Generating quiz using ${modelProvider} for grade ${grade}, subject ${subject}`);

    // 调用AI生成内容
    let text: string;
    let warnings: any[] = [];
    
    try {
      const result = await generateText({
        model: textModel,
        prompt: prompt,
        temperature: 0.7, // 适中的创造性
        maxTokens: 2000,   // 限制token使用
      });
      text = result.text;
      warnings = result.warnings || [];
    } catch (aiError: any) {
      console.error(`${modelProvider} API call failed:`, aiError);
      
      // 如果当前是DeepSeek失败，尝试降级到OpenAI
      if (modelProvider === "deepseek" && process.env.OPENAI_API_KEY) {
        console.log("DeepSeek failed, trying OpenAI fallback");
        try {
          textModel = openai("gpt-4o-mini");
          modelProvider = "openai";
          
          const result = await generateText({
            model: textModel,
            prompt: prompt,
            temperature: 0.7,
            maxTokens: 2000,
          });
          text = result.text;
          warnings = result.warnings || [];
        } catch (fallbackError: any) {
          console.error("OpenAI fallback also failed:", fallbackError);
          if (fallbackError.message?.includes('quota')) {
            return respErr("AI service quota exceeded. Please check your API billing or try again later.");
          }
          throw fallbackError;
        }
      } else {
        // 如果是OpenAI失败或者没有其他备选，直接抛出错误
        if (aiError.message?.includes('quota')) {
          return respErr("AI service quota exceeded. Please check your API billing or try again later.");
        }
        throw aiError;
      }
    }

    if (warnings && warnings.length > 0) {
      console.log("AI generation warnings:", warnings);
    }

    // 解析AI返回的JSON
    let quizData;
    try {
      // 清理可能的额外文本和格式
      let cleanText = text.trim();
      
      // 如果包含代码块标记，移除它们
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      quizData = JSON.parse(cleanText);
      
      // 验证返回数据结构
      if (!quizData.quiz || !quizData.quiz.questions || !Array.isArray(quizData.quiz.questions)) {
        throw new Error("Invalid quiz data structure");
      }

      // 验证每个问题的结构
      for (const question of quizData.quiz.questions) {
        if (!question.question || !question.options || !Array.isArray(question.options) || 
            question.options.length !== 4 || typeof question.correctAnswer !== 'number') {
          throw new Error("Invalid question structure");
        }
      }

    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("AI response text:", text);
      return respErr("Failed to generate valid quiz format. Please try again.");
    }

    // 添加生成时间戳和元数据
    const result = {
      ...quizData.quiz,
      generatedAt: new Date().toISOString(),
      modelProvider,
      totalQuestions: quizData.quiz.questions.length,
    };

    return respData(result);

  } catch (error: any) {
    console.error("Quiz generation failed:", error);
    
    // 只有在有有效参数时才生成演示数据
    if (!grade || !subject) {
      return respErr("Invalid request parameters. Please provide grade and subject.");
    }
    
    // 在所有AI服务都失败时，提供示例数据进行演示
    console.log("All AI services failed, using demo quiz data");
    
    // 直接生成演示数据
    const gradeDesc = gradeDescriptions[grade] || grade;
    const subjectDesc = subjectDescriptions[subject] || subject;
    const isChineseLocale = locale === 'zh';
    
    const demoQuestions = isChineseLocale ? {
      math: [
        { id: 1, question: "5 + 3 等于多少？", options: ["6", "7", "8", "9"], correctAnswer: 2, explanation: "5 + 3 = 8。我们把5和3相加得到8。" },
        { id: 2, question: "哪个图形有4条相等的边？", options: ["三角形", "圆形", "正方形", "长方形"], correctAnswer: 2, explanation: "正方形有4条相等的边和4个直角。" },
        { id: 3, question: "10 - 4 等于多少？", options: ["5", "6", "7", "8"], correctAnswer: 1, explanation: "10 - 4 = 6。从10中减去4得到6。" },
        { id: 4, question: "1小时有多少分钟？", options: ["50", "60", "70", "80"], correctAnswer: 1, explanation: "1小时有60分钟。" },
        { id: 5, question: "2 × 4 等于多少？", options: ["6", "7", "8", "9"], correctAnswer: 2, explanation: "2 × 4 = 8。两个4相加等于8。" }
      ],
      science: [
        { id: 1, question: "植物生长需要什么？", options: ["只要水", "只要阳光", "水、阳光和空气", "只要土壤"], correctAnswer: 2, explanation: "植物需要水、阳光和空气来进行光合作用。" },
        { id: 2, question: "下面哪个是哺乳动物？", options: ["鱼", "鸟", "狗", "昆虫"], correctAnswer: 2, explanation: "狗是哺乳动物，因为它有毛发，是温血动物，给幼崽喂奶。" },
        { id: 3, question: "水在非常冷的时候会怎样？", options: ["消失", "变成冰", "变成气体", "变颜色"], correctAnswer: 1, explanation: "当水非常冷时（低于0°C），它会结冰。" },
        { id: 4, question: "哪个行星离太阳最近？", options: ["地球", "水星", "金星", "火星"], correctAnswer: 1, explanation: "水星是太阳系中离太阳最近的行星。" },
        { id: 5, question: "小青蛙叫什么？", options: ["小狗", "小猫", "蝌蚪", "小熊"], correctAnswer: 2, explanation: "小青蛙叫蝌蚪，它们生活在水中，有尾巴。" }
      ],
      english: [
        { id: 1, question: "哪个单词与'cat'押韵？", options: ["Dog", "Hat", "Car", "Run"], correctAnswer: 1, explanation: "Hat与cat押韵，因为它们都以'-at'音结尾。" },
        { id: 2, question: "'child'的复数形式是什么？", options: ["Childs", "Children", "Childes", "Child"], correctAnswer: 1, explanation: "'child'的复数形式是'children'，这是不规则复数形式。" },
        { id: 3, question: "哪个句子是正确的？", options: ["I are happy", "I am happy", "I is happy", "I be happy"], correctAnswer: 1, explanation: "'I am happy'是正确的语法，'I'要用'am'。" },
        { id: 4, question: "'quickly'是什么词性？", options: ["名词", "动词", "形容词", "副词"], correctAnswer: 3, explanation: "'quickly'是副词，用来描述动作的方式。" },
        { id: 5, question: "字母'M'后面是什么字母？", options: ["L", "N", "O", "P"], correctAnswer: 1, explanation: "字母表中M后面是N。顺序是L、M、N、O。" }
      ],
      social_studies: [
        { id: 1, question: "什么是社区？", options: ["一栋房子", "一群生活在一起的人", "一种食物", "一种动物"], correctAnswer: 1, explanation: "社区是一群在同一地区生活和工作的人。" },
        { id: 2, question: "谁帮助保护我们的安全？", options: ["只有老师", "警察和消防员", "只有医生", "只有父母"], correctAnswer: 1, explanation: "警察和消防员是社区帮手，他们努力保护每个人的安全。" },
        { id: 3, question: "什么是规则？", options: ["有趣的事情", "维持秩序的准则", "一种游戏", "一种食物"], correctAnswer: 1, explanation: "规则是帮助维持秩序的准则，让人们知道如何行为。" },
        { id: 4, question: "什么体现了良好的公民素养？", options: ["乱扔垃圾", "帮助他人", "对朋友不好", "违反规则"], correctAnswer: 1, explanation: "帮助他人体现了良好的公民素养，对社区有积极贡献。" },
        { id: 5, question: "谁领导一个城市？", options: ["老师", "市长", "医生", "农民"], correctAnswer: 1, explanation: "市长是城市的领导者，帮助为社区做重要决定。" }
      ]
    } : {
      math: [
        { id: 1, question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correctAnswer: 2, explanation: "5 + 3 = 8. Adding numbers together." },
        { id: 2, question: "Which shape has 4 equal sides?", options: ["Triangle", "Circle", "Square", "Rectangle"], correctAnswer: 2, explanation: "A square has 4 equal sides." },
        { id: 3, question: "What is 10 - 4?", options: ["5", "6", "7", "8"], correctAnswer: 1, explanation: "10 - 4 = 6. Subtraction example." },
        { id: 4, question: "How many minutes in 1 hour?", options: ["50", "60", "70", "80"], correctAnswer: 1, explanation: "There are 60 minutes in 1 hour." },
        { id: 5, question: "What is 2 × 4?", options: ["6", "7", "8", "9"], correctAnswer: 2, explanation: "2 × 4 = 8. Multiplication example." }
      ],
      science: [
        { id: 1, question: "What do plants need to grow?", options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"], correctAnswer: 2, explanation: "Plants need water, sunlight, and air to grow." },
        { id: 2, question: "Which is a mammal?", options: ["Fish", "Bird", "Dog", "Insect"], correctAnswer: 2, explanation: "A dog is a mammal." },
        { id: 3, question: "What happens to water when very cold?", options: ["Disappears", "Turns to ice", "Turns to gas", "Changes color"], correctAnswer: 1, explanation: "Water freezes into ice when very cold." },
        { id: 4, question: "Which planet is closest to the Sun?", options: ["Earth", "Mercury", "Venus", "Mars"], correctAnswer: 1, explanation: "Mercury is closest to the Sun." },
        { id: 5, question: "What are baby frogs called?", options: ["Puppies", "Kittens", "Tadpoles", "Cubs"], correctAnswer: 2, explanation: "Baby frogs are called tadpoles." }
      ],
      english: [
        { id: 1, question: "Which word rhymes with 'cat'?", options: ["Dog", "Hat", "Car", "Run"], correctAnswer: 1, explanation: "Hat rhymes with cat." },
        { id: 2, question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Child"], correctAnswer: 1, explanation: "The plural of 'child' is 'children'." },
        { id: 3, question: "Which sentence is correct?", options: ["I are happy", "I am happy", "I is happy", "I be happy"], correctAnswer: 1, explanation: "'I am happy' is correct grammar." },
        { id: 4, question: "What type of word is 'quickly'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: 3, explanation: "'Quickly' is an adverb." },
        { id: 5, question: "Which letter comes after 'M'?", options: ["L", "N", "O", "P"], correctAnswer: 1, explanation: "N comes after M in the alphabet." }
      ],
      social_studies: [
        { id: 1, question: "What is a community?", options: ["A single house", "A group of people living together", "A type of food", "A kind of animal"], correctAnswer: 1, explanation: "A community is a group of people living together." },
        { id: 2, question: "Who helps keep us safe?", options: ["Only teachers", "Police officers and firefighters", "Only doctors", "Only parents"], correctAnswer: 1, explanation: "Police and firefighters help keep us safe." },
        { id: 3, question: "What is a rule?", options: ["Something fun", "A guideline for order", "A type of game", "A kind of food"], correctAnswer: 1, explanation: "A rule is a guideline that helps keep order." },
        { id: 4, question: "What shows good citizenship?", options: ["Throwing trash", "Helping others", "Being mean", "Breaking rules"], correctAnswer: 1, explanation: "Helping others shows good citizenship." },
        { id: 5, question: "Who leads a city?", options: ["Teacher", "Mayor", "Doctor", "Farmer"], correctAnswer: 1, explanation: "The mayor leads a city." }
      ]
    };

    const questions = demoQuestions[subject as keyof typeof demoQuestions] || demoQuestions.math;
    const demoLabel = isChineseLocale ? '演示' : 'Demo';
    const demoQuizData = {
      grade,
      subject,
      questions: questions.map(q => ({
        ...q,
        question: `[${gradeDesc} ${subjectDesc} ${demoLabel}] ${q.question}`
      }))
    };
    const result = {
      ...demoQuizData,
      generatedAt: new Date().toISOString(),
      modelProvider: "demo",
      totalQuestions: demoQuizData.questions.length,
      note: "This is demo data generated when AI services are unavailable."
    };

    return respData(result);
  }
} 