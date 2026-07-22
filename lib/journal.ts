import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JournalArticle, JournalCategory } from '@/types/journal';

const journalDirectory = path.join(process.cwd(), 'content/journal');

export function getAllArticles(): JournalArticle[] {
  // Fallback to sample data if directory doesn't exist
  if (!fs.existsSync(journalDirectory)) {
    return getSampleArticles();
  }

  const fileNames = fs.readdirSync(journalDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(journalDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        category: data.category as JournalCategory,
        author: data.author,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        readingTime: data.readingTime || calculateReadingTime(fileContents),
        featured: data.featured,
        tags: data.tags,
      } as JournalArticle;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return articles;
}

export function getArticleBySlug(slug: string): { article: JournalArticle; content: string } | null {
  if (!fs.existsSync(journalDirectory)) {
    const sample = getSampleArticles().find((a) => a.slug === slug);
    if (!sample) return null;
    return { article: sample, content: getSampleContent(slug) };
  }

  const fullPath = path.join(journalDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const article: JournalArticle = {
    slug,
    title: data.title,
    description: data.description,
    coverImage: data.coverImage,
    category: data.category as JournalCategory,
    author: data.author,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    readingTime: data.readingTime || calculateReadingTime(content),
    featured: data.featured,
    tags: data.tags,
  };

  return { article, content };
}

export function getArticlesByCategory(category: JournalCategory): JournalArticle[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(): JournalArticle[] {
  return getAllArticles().filter((a) => a.featured);
}

export function getAllCategories(): JournalCategory[] {
  return ['具身認知', '迷走神經', '情緒韌性', '腦科學'];
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Sample data fallback for development
function getSampleArticles(): JournalArticle[] {
  return [
    {
      slug: 'vagus-nerve-rest',
      title: '迷走神經：身體的「休息開關」',
      description: '探索迷走神經如何調控壓力反應，以及如何透過日常練習啟動副交感神經系統。',
      category: '迷走神經',
      author: { name: 'Awareness Be Team' },
      publishedAt: '2026-07-15',
      readingTime: 8,
      featured: true,
      tags: ['迷走神經', '副交感神經', '壓力管理'],
    },
    {
      slug: 'embodied-cognition',
      title: '具身認知：身體如何塑造思維',
      description: '從神經科學角度解析身體姿勢、動作如何影響我們的情緒與決策能力。',
      category: '具身認知',
      author: { name: 'Awareness Be Team' },
      publishedAt: '2026-07-10',
      readingTime: 6,
      featured: true,
      tags: ['具身認知', '神經可塑性', ' Embodiment'],
    },
    {
      slug: 'emotional-resilience',
      title: '情緒韌性：面對不確定性的心理盔甲',
      description: '建立情緒韌性的科學方法，讓你在壓力情境中保持清晰的思維與穩定的心態。',
      category: '情緒韌性',
      author: { name: 'Awareness Be Team' },
      publishedAt: '2026-07-05',
      readingTime: 7,
      featured: false,
      tags: ['情緒管理', '韌性', '正念'],
    },
    {
      slug: 'brain-plasticity',
      title: '大腦可塑性：終身成長的神經基礎',
      description: '了解大腦如何在一生中持續變化，以及如何透過有意識的練習優化神經路徑。',
      category: '腦科學',
      author: { name: 'Awareness Be Team' },
      publishedAt: '2026-06-28',
      readingTime: 9,
      featured: true,
      tags: ['神經可塑性', '學習', ' MBTI'],
    },
  ];
}

function getSampleContent(slug: string): string {
  const samples: Record<string, string> = {
    'vagus-nerve-rest': `
## 什麼是迷走神經？

迷走神經（Vagus Nerve）是人體最長的顱神經，從腦幹延伸到腹部，幾乎影響所有主要器官。它被稱為「休息與消化神經」，因為它負責啟動副交感神經系統，幫助身體進入放鬆狀態。

## 迷走神經張力與健康

迷走神經張力（Vagal Tone）是指迷走神經活動的強度和效率。高迷走神經張力與以下健康益處相關：

- **更好的情緒調節能力**
- **降低焦慮和憂鬱風險**
- **改善消化功能**
- **更強的免疫反應**

## 如何提升迷走神經張力

### 1. 深呼吸練習
緩慢的腹式呼吸可以刺激迷走神經。每天練習 5-10 分鐘的深呼吸，吸氣 4 秒，呼氣 6 秒。

### 2. 冷暴露
冷水洗臉或冷敷可以觸發「潛水反射」，激活副交感神經系統。

### 3. 正念冥想
定期冥想被證明可以增加迷走神經張力，提升情緒穩定性。

## 結語

了解並訓練迷走神經，是掌握自我調節能力的關鍵一步。透過日常練習，你可以逐步提升身體的「休息開關」效率，實現更深層的身心平衡。

---

**延伸閱讀**：想了解更多關於性格與大腦的關聯？[MBTI 測驗](/mbti) 幫助你發現獨特的神經認知模式。
`,
    'embodied-cognition': `
## 具身認知是什麼？

具身認知（Embodied Cognition）是認知科學中的一個重要理論，認為我們的思維、情感和決策都深受身體經驗的影響。這不僅僅是抽象的理論，而是有神經科學實證支持的概念。

## 身體如何影響大腦

### 姿勢與自信
研究顯示，展開身體、抬高雙手的「權力姿勢」可以：
- 降低皮質醇（壓力激素）水平
- 提升睪固酮（主導激素）水平
- 增加冒險行為的意願

### 表情與情緒
假笑可以觸發與真笑相同的神經回饋機制。這是因為面部表情會向大腦發送信號，反向影響情緒體驗。

## 日常生活中的應用

1. **站立行走時保持挺拔**
2. **有意識地使用雙手表達**
3. **練習開放的肢體語言**

---

**立即行動**：[MBTI 測驗](/mbti) 探索你的認知風格，開啟自我覺察的旅程。
`,
    'emotional-resilience': `
## 情緒韌性的科學

情緒韌性（Emotional Resilience）是指面對逆境、壓力、創傷時的心理恢復能力。它不是天生的特質，而是可以透過練習培養的技能。

## 核心構成要素

### 1. 覺察力
能夠識別和命名自己的情緒是韌性的基礎。研究顯示，語言化情緒可以降低其強度。

### 2. 接納態度
對負面情緒的抗拒會延長其持續時間。接納不代表認同，而是允許情緒自然流動。

### 3. 認知彈性
能夠從多角度看待問題，發現困境中的意義或機會。

## 實用練習

- **情緒日誌**：每天記錄情緒及其觸發因素
- **身體掃描**：定期覺察身體的緊張部位
- **感恩練習**：每天記錄三件感恩的事

---

**探索更多**：了解你的性格特質如何影響情緒反應，嘗試 [MBTI 測驗](/mbti)。
`,
    'brain-plasticity': `
## 大腦的驚人適應力

神經可塑性（Neuroplasticity）是指大腦根據經驗和學習進行結構和功能改變的能力。這意味著無論年齡，我們都可以持續成長和改變。

## 可塑性的類型

### 結構可塑性
大腦實際結構的變化，如新的神經元誕生（神經生成）或突觸連接的建立。

### 功能可塑性
特定腦區功能分配的改變，例如中風後其他腦區接管受損區域的功能。

## 如何優化大腦可塑性

### 1. 持續學習
學習新技能會刺激新突觸的形成，增強認知儲備。

### 2. 身體運動
有氧運動促進 BDNF（腦源性神經營養因子）的分泌，支持神經健康。

### 3. 優質睡眠
睡眠時大腦會進行記憶鞏固和毒素清除。

### 4. 正念練習
冥想可以增加前額葉皮層的灰質密度。

## 性格與大腦

MBTI 理論提供了理解認知偏好的框架。雖然不是傳統的科學理論，但它可以作為自我探索的起點，幫助你發現適合自己的學習和成長方式。

---

**開始探索**：[MBTI 測驗](/mbti) 揭示你的認知優勢與發展領域。
`,
  };
  return samples[slug] || '';
}
