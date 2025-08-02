'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    title: 'Join Our Community',
    subtitle: 'Share your local expertise and passion with travelers from around the world.',
    becomeGuide: 'Become a Guide',
    hostExperience: 'Host an Experience',
    language: 'العربية',
  },
  ar: {
    title: 'الله يحييكم في مجتمعنا',
    subtitle: 'شاركونا خبراتكم وشغفكم بذا الديرة مع الزوار من كل مكان.',
    becomeGuide: 'ودك تصير مرشد؟',
    hostExperience: 'ودك تسوي تجربة؟',
    language: 'English',
  },
};

export default function BecomeGuidePage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {t.language}
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {t.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
          {t.subtitle}
        </p>
      </div>
      <div className={`flex mt-10 space-x-4 ${lang === 'ar' ? 'space-x-reverse' : ''}`}>
        <Link href={`/become-guide/guide?lang=${lang}`}>
          <Button size="lg">{t.becomeGuide}</Button>
        </Link>
        <Link href={`/become-guide/experience?lang=${lang}`}>
          <Button size="lg" variant="outline">
            {t.hostExperience}
          </Button>
        </Link>
      </div>
    </div>
  );
}
