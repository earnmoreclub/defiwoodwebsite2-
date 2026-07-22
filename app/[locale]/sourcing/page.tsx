import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'zh-TW' ? '我們的標準 · Awareness Be' : 'Our Standard · Awareness Be',
  };
}

export default async function SourcingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === 'zh-TW';

  const principles = isZh
    ? [
        { tag: '01', title: '少量而慎重', body: '每一個被引入的成分都必須有一個被理解的理由。我們偏少的目錄，是刻意的。' },
        { tag: '02', title: '從田野到瓶子', body: '從種植者到實驗室，我們親自走訪每一條供應鏈。透明度不是口號。' },
        { tag: '03', title: '古老知識，新近研究', body: '每一種植物都被兩種標準看待：傳統使用的智慧，與當代研究的證據。' },
        { tag: '04', title: '包裝作為承諾', body: '玻璃、鋁、再生紙。沒有塑料的未來，是我們對包裝的唯一標準。' },
      ]
    : [
        { tag: '01', title: 'Few, considered', body: 'Every ingredient introduced must have a reason that is understood. Our small catalogue is deliberate.' },
        { tag: '02', title: 'Field to bottle', body: 'From grower to lab, we walk every link of the supply chain in person. Transparency is not a slogan.' },
        { tag: '03', title: 'Old knowledge, current evidence', body: 'Each botanical is held to two standards: traditional wisdom and contemporary research.' },
        { tag: '04', title: 'Packaging as promise', body: 'Glass, aluminum, recycled paper. A future without plastic is the only standard for our packaging.' },
      ];

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal font-sans">
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="absolute inset-0 bg-cream-50/70 backdrop-blur-md border-b border-charcoal/5" />
        <nav className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href={isZh ? '/' : '/en'} className="font-serif text-lg tracking-wide">
              AWARENESS BE
              <span className="ml-3 text-[10px] uppercase tracking-editorial text-charcoal/40">
                EST. 2026
              </span>
            </Link>
            <Link
              href={isZh ? '/philosophy' : '/en/philosophy'}
              className="text-xs uppercase tracking-editorial text-charcoal/60 hover:text-charcoal"
            >
              ← {isZh ? '回到理念' : 'Back to philosophy'}
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-40 pb-24 max-w-3xl mx-auto px-6">
        <div className="text-[10px] uppercase tracking-editorial text-sage-600 mb-6">
          {isZh ? '我們的標準' : 'Our standard'}
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-balance">
          {isZh ? '我們如何選擇。' : 'How we choose.'}
        </h1>
        <p className="mt-8 text-lg text-charcoal/70 leading-relaxed max-w-xl">
          {isZh
            ? '這是一份持續被修訂的文件，記載 Awareness Be 對每一種原料、每一個包裝、每一個合作對象的篩選標準。'
            : 'A document we keep revising. It records the standards by which Awareness Be selects every ingredient, every package, every partner.'}
        </p>

        <div className="mt-20 space-y-12">
          {principles.map((p) => (
            <article key={p.tag} className="border-l-2 border-sage-200 pl-8">
              <div className="text-[10px] uppercase tracking-editorial text-charcoal/40 mb-2">
                {p.tag}
              </div>
              <h2 className="font-serif text-2xl text-charcoal">{p.title}</h2>
              <p className="mt-3 text-charcoal/70 leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}