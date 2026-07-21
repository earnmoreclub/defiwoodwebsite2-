'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Copy, Users, Eye, EyeOff, HelpCircle, Sparkles, Share2 } from 'lucide-react';

// 16 personality tags with bilingual content
const PERSONALITY_TAGS = [
  { id: 'analytical', en: 'Analytical', zh: '理性', emoji: '🔬' },
  { id: 'compassionate', en: 'Compassionate', zh: '慈悲', emoji: '💜' },
  { id: 'bold', en: 'Bold', zh: '大膽', emoji: '⚡' },
  { id: 'creative', en: 'Creative', zh: '創意', emoji: '🎨' },
  { id: 'reliable', en: 'Reliable', zh: '可靠', emoji: '🏆' },
  { id: 'optimistic', en: 'Optimistic', zh: '樂觀', emoji: '☀️' },
  { id: 'adventurous', en: 'Adventurous', zh: '冒險', emoji: '🗺️' },
  { id: 'patient', en: 'Patient', zh: '耐心', emoji: '🌱' },
  { id: 'charismatic', en: 'Charismatic', zh: '魅力', emoji: '✨' },
  { id: 'humble', en: 'Humble', zh: '謙遜', emoji: '🍃' },
  { id: 'strategic', en: 'Strategic', zh: '策略', emoji: '♟️' },
  { id: 'empathetic', en: 'Empathetic', zh: '同理心', emoji: '💫' },
  { id: 'determined', en: 'Determined', zh: '堅定', emoji: '💪' },
  { id: 'spontaneous', en: 'Spontaneous', zh: '隨性', emoji: '🦋' },
  { id: 'loyal', en: 'Loyal', zh: '忠誠', emoji: '🛡️' },
  { id: 'wise', en: 'Wise', zh: '智慧', emoji: '🦉' },
];

type Language = 'en' | 'zh-TW';

const texts = {
  en: {
    title: 'Johari Window',
    subtitle: 'Discover Your Blind Spots Through Friends',
    step1Title: 'Step 1: Select 5 traits that describe you',
    step2Title: 'Step 2: Share with a friend',
    step3Title: 'Step 3: Compare and discover',
    selectPrompt: 'Choose 5 traits that best describe you',
    selected: 'selected',
    generateLink: 'Generate Shareable Link',
    generating: 'Generating...',
    shareText: 'Share this link with a friend:',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    waitingResponse: 'Waiting for your friend to respond...',
    friendTitle: 'Johari Window - Friend View',
    friendPrompt: 'What 5 traits do you see in this person?',
    submitFriend: 'Submit Your Response',
    submitting: 'Submitting...',
    quadrantOpen: 'Open Self',
    quadrantOpenDesc: 'What you and others see',
    quadrantBlind: 'Blind Self',
    quadrantBlindDesc: 'What others see, but you don\'t',
    quadrantHidden: 'Hidden Self',
    quadrantHiddenDesc: 'What you see, but others don\'t',
    quadrantUnknown: 'Unknown Self',
    quadrantUnknownDesc: 'What neither sees yet',
    viewResults: 'View Results',
    retake: 'Start Over',
    backHome: 'Back to Home',
  },
  'zh-TW': {
    title: '周哈里窗',
    subtitle: '透過好友視角發現你的盲點',
    step1Title: '第一步：選擇 5 個描述你的特質',
    step2Title: '第二步：分享給朋友',
    step3Title: '第三步：比較與發現',
    selectPrompt: '選擇 5 個最能描述你的特質',
    selected: '已選',
    generateLink: '產生分享連結',
    generating: '產生中...',
    shareText: '分享這個連結給朋友：',
    copyLink: '複製連結',
    copied: '已複製！',
    waitingResponse: '等待朋友回應中...',
    friendTitle: '周哈里窗 - 好友視角',
    friendPrompt: '你觀察到這個人有哪 5 個特質？',
    submitFriend: '送出你的回應',
    submitting: '送出中...',
    quadrantOpen: '開放自我',
    quadrantOpenDesc: '你和他人都看到的',
    quadrantBlind: '盲目自我',
    quadrantBlindDesc: '他人看到，你沒發現的',
    quadrantHidden: '隱藏自我',
    quadrantHiddenDesc: '你看到，他人沒注意到的',
    quadrantUnknown: '未知自我',
    quadrantUnknownDesc: '雙方都還沒發現的',
    viewResults: '查看結果',
    retake: '重新開始',
    backHome: '返回首頁',
  },
};

export default function JohariWindow() {
  const params = useParams();
  const locale = (params.locale as Language) || 'en';
  const sessionId = params.sessionId as string | undefined;
  const t = texts[locale];
  const isFriendView = !!sessionId && !sessionId.startsWith('user-');

  const [userTags, setUserTags] = useState<string[]>([]);
  const [friendTags, setFriendTags] = useState<string[] | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'select' | 'share' | 'friend' | 'results'>('select');

  // Load session data if sessionId exists
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/johari?id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.userTags) setUserTags(data.userTags);
          if (data.hasFriendResponse) {
            setFriendTags(data.friendTags);
            setView('results');
          } else {
            setView('friend');
          }
        })
        .catch(console.error);
    }
  }, [sessionId]);

  const toggleTag = (tagId: string, isSelecting: boolean) => {
    if (isSelecting) {
      if (userTags.length < 5 && !userTags.includes(tagId)) {
        setUserTags([...userTags, tagId]);
      }
    } else {
      setUserTags(userTags.filter(t => t !== tagId));
    }
  };

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/johari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'create', tags: userTags }),
      });
      const data = await res.json();
      setGeneratedId(data.id);
      setView('share');
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFriendResponse = async () => {
    if (friendTags?.length !== 5) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/johari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'submit-friend', sessionId, tags: friendTags }),
      });
      setView('results');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined' && generatedId) {
      const url = `${window.location.origin}/${locale}/johari/${generatedId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate quadrants
  const allTagIds = PERSONALITY_TAGS.map(t => t.id);
  const bothSelected = userTags.filter(t => friendTags?.includes(t));
  const onlyFriendSelected = (friendTags || []).filter(t => !userTags.includes(t));
  const onlyUserSelected = userTags.filter(t => !(friendTags || []).includes(t));
  const neitherSelected = allTagIds.filter(t => !userTags.includes(t) && !(friendTags || []).includes(t));

  const getTagById = (id: string) => PERSONALITY_TAGS.find(t => t.id === id);
  const getLabel = (tag: typeof PERSONALITY_TAGS[0]) => locale === 'zh-TW' ? tag.zh : tag.en;

  // Selection View (User picks 5 tags)
  if (view === 'select') {
    return (
      <div className="min-h-screen bg-dark-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 mb-4">
              <Users className="w-4 h-4" />
              <span>Self-Awareness Game</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-slate-400 text-lg">{t.subtitle}</p>
          </div>

          {/* Selection Card */}
          <div className="glass rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-white">{t.step1Title}</h2>
              <span className="text-sm text-slate-400">
                {userTags.length}/5 {t.selected}
              </span>
            </div>
            <p className="text-slate-400 mb-6">{t.selectPrompt}</p>

            {/* Tags Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PERSONALITY_TAGS.map(tag => {
                const isSelected = userTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id, !isSelected)}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-200 text-left
                      ${isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-dark-800/50 border-white/10 text-slate-300 hover:border-purple-500/50 hover:bg-dark-700/50'
                      }
                    `}
                  >
                    <span className="text-2xl mb-2 block">{tag.emoji}</span>
                    <span className="font-medium block">{locale === 'zh-TW' ? tag.zh : tag.en}</span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Generate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={generateShareLink}
                disabled={userTags.length !== 5 || isLoading}
                className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium
                  transition-all duration-300
                  ${userTags.length === 5
                    ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-dark-700 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.generateLink}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Share View
  if (view === 'share' && generatedId) {
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/${locale}/johari/${generatedId}`
      : `/${locale}/johari/${generatedId}`;

    return (
      <div className="min-h-screen bg-dark-950 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-serif text-2xl text-white mb-4">{t.step2Title}</h2>
            <p className="text-slate-400 mb-6">{t.shareText}</p>

            <div className="bg-dark-800 rounded-xl p-4 mb-6 break-all text-left">
              <code className="text-cyan-400 text-sm">{shareUrl}</code>
            </div>

            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? t.copied : t.copyLink}
            </button>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                <Eye className="w-5 h-5" />
                <span>{t.waitingResponse}</span>
              </div>
              <p className="text-slate-500 text-sm">
                {t.step3Title}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Friend View
  if (view === 'friend') {
    return (
      <div className="min-h-screen bg-dark-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 mb-4">
              <Users className="w-4 h-4" />
              <span>Friend View</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
              {t.friendTitle}
            </h1>
            <p className="text-slate-400 text-lg">{t.friendPrompt}</p>
          </div>

          <div className="glass rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-white">{t.step1Title}</h2>
              <span className="text-sm text-slate-400">
                {friendTags?.length || 0}/5 {t.selected}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PERSONALITY_TAGS.map(tag => {
                const isSelected = friendTags?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      if (isSelected) {
                        setFriendTags((friendTags || []).filter(t => t !== tag.id));
                      } else if ((friendTags?.length || 0) < 5) {
                        setFriendTags([...(friendTags || []), tag.id]);
                      }
                    }}
                    className={`
                      relative p-4 rounded-xl border transition-all duration-200 text-left
                      ${isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-dark-800/50 border-white/10 text-slate-300 hover:border-cyan-500/50 hover:bg-dark-700/50'
                      }
                    `}
                  >
                    <span className="text-2xl mb-2 block">{tag.emoji}</span>
                    <span className="font-medium block">{locale === 'zh-TW' ? tag.zh : tag.en}</span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={submitFriendResponse}
                disabled={(friendTags?.length !== 5) || isSubmitting}
                className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium
                  transition-all duration-300
                  ${friendTags?.length === 5
                    ? 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                    : 'bg-dark-700 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {t.submitting}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.submitFriend}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  return (
    <div className="min-h-screen bg-dark-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-slate-400">{t.step3Title}</p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open Self */}
          <div className="glass rounded-2xl p-6 border-2 border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">{t.quadrantOpen}</h3>
                <p className="text-xs text-slate-500">{t.quadrantOpenDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {bothSelected.length > 0 ? bothSelected.map(id => {
                const tag = getTagById(id);
                return tag ? (
                  <span key={id} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                    {tag.emoji} {getLabel(tag)}
                  </span>
                ) : null;
              }) : (
                <span className="text-slate-500 text-sm">—</span>
              )}
            </div>
          </div>

          {/* Blind Self */}
          <div className="glass rounded-2xl p-6 border-2 border-cyan-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">{t.quadrantBlind}</h3>
                <p className="text-xs text-slate-500">{t.quadrantBlindDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {onlyFriendSelected.length > 0 ? onlyFriendSelected.map(id => {
                const tag = getTagById(id);
                return tag ? (
                  <span key={id} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm">
                    {tag.emoji} {getLabel(tag)}
                  </span>
                ) : null;
              }) : (
                <span className="text-slate-500 text-sm">—</span>
              )}
            </div>
          </div>

          {/* Hidden Self */}
          <div className="glass rounded-2xl p-6 border-2 border-amber-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">{t.quadrantHidden}</h3>
                <p className="text-xs text-slate-500">{t.quadrantHiddenDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {onlyUserSelected.length > 0 ? onlyUserSelected.map(id => {
                const tag = getTagById(id);
                return tag ? (
                  <span key={id} className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                    {tag.emoji} {getLabel(tag)}
                  </span>
                ) : null;
              }) : (
                <span className="text-slate-500 text-sm">—</span>
              )}
            </div>
          </div>

          {/* Unknown Self */}
          <div className="glass rounded-2xl p-6 border-2 border-emerald-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">{t.quadrantUnknown}</h3>
                <p className="text-xs text-slate-500">{t.quadrantUnknownDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {neitherSelected.length > 0 ? neitherSelected.map(id => {
                const tag = getTagById(id);
                return tag ? (
                  <span key={id} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm">
                    {tag.emoji} {getLabel(tag)}
                  </span>
                ) : null;
              }) : (
                <span className="text-slate-500 text-sm">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/johari`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl transition-colors"
          >
            {t.retake}
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
