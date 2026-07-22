import Link from 'next/link';
import { Brain, Calendar, ArrowRight } from 'lucide-react';

interface JournalCTAProps {
  locale?: string;
}

export default function JournalCTA({ locale = 'en' }: JournalCTAProps) {
  return (
    <section className="mt-16 rounded-3xl overflow-hidden">
      {/* Gradient border */}
      <div className="relative rounded-3xl p-px bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500">
        <div className="bg-dark-900 rounded-3xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-6">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          
          <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
            了解你的大腦類型
          </h3>
          
          <p className="text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            透過 MBTI 測驗發現你獨特的認知風格與神經優勢，
            開啟更深層的自我覺察之旅。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/mbti`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Brain className="w-5 h-5" />
              開始 MBTI 測驗
            </Link>
            
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-800 border border-white/10 text-white font-medium rounded-xl hover:bg-dark-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              預約 45 分鐘諮詢
            </Link>
          </div>
          
          <p className="text-xs text-slate-500 mt-6">
            專業神經教練為你個人化解讀測驗結果
          </p>
        </div>
      </div>
    </section>
  );
}
