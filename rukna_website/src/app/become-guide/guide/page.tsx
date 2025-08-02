'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const translations = {
  en: {
    title: 'Become a Guide',
    subtitle: 'Fill out the form below to create your guide profile.',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    bio: 'Bio',
    bioHint: 'Tell us a little about yourself, your interests, and what makes you a great guide.',
    specialties: 'Specialties',
    specialtiesHint: 'Comma-separated, e.g., hiking, photography, history',
    languagesSpoken: 'Languages Spoken',
    languagesSpokenHint: 'Comma-separated, e.g., Arabic, English',
    yearsExperience: 'Years of Experience',
    serviceAreas: 'Service Areas',
    serviceAreasHint: 'Comma-separated, e.g., Abha, Al Namas',
    maxGroupSize: 'Max Group Size',
    hasTransportation: 'I have my own transportation',
    preferences: 'Your Preferences',
    preferencesHint: 'Help us match you with the right travelers.',
    families: 'Families',
    familiesHint: 'Are you comfortable guiding families with children?',
    women: 'Women',
    womenHint: 'Are you comfortable guiding solo female travelers or groups of women?',
    men: 'Men',
    menHint: 'Are you comfortable guiding solo male travelers or groups of men?',
    submit: 'Submit Application',
    submitting: 'Submitting...',
    error: 'Something went wrong',
    language: 'العربية',
  },
  ar: {
    title: 'ودك تصير مرشد؟',
    subtitle: 'عبّي ذا النموذج عشان تسوي ملفك كمرشد.',
    fullName: 'اسمك الكامل',
    email: 'ايميلك',
    phone: 'رقم جوالك',
    bio: 'علمنا عنك',
    bioHint: 'اكتب لنا عنك، واهتماماتك، وليش تشوف نفسك مرشد سياحي صامل.',
    specialties: 'تخصصاتك',
    specialtiesHint: 'اكتبها وبينها فاصلة، مثلا: تمشية في الجبال، تصوير، تاريخ',
    languagesSpoken: 'اللغات اللي ترمس بها',
    languagesSpokenHint: 'اكتبها وبينها فاصلة، مثلا: عربي، انجليزي',
    yearsExperience: 'كم لك سنة في ذا الشغلة؟',
    serviceAreas: 'وين الأماكن اللي ترشد فيها؟',
    serviceAreasHint: 'اكتبها وبينها فاصلة، مثلا: أبها، النماص',
    maxGroupSize: 'كم أكبر عدد للمجموعة؟',
    hasTransportation: 'عندي موتر للتنقل',
    preferences: 'ايش تفضل؟',
    preferencesHint: 'عشان نساعدك تلاقي السياح اللي يناسبونك.',
    families: 'عوائل',
    familiesHint: 'يمديك ترشد عوائل معهم ورعان؟',
    women: 'حريم',
    womenHint: 'يمديك ترشد حريم لحالهم أو قروبات حريم؟',
    men: 'رجال',
    menHint: 'يمديك ترشد رجال لحالهم أو قروبات رجال؟',
    submit: 'أرسل طلبك',
    submitting: 'لحظة... نرسل طلبك',
    error: 'صارت مشكلة',
    language: 'English',
  },
};

export default function GuideSignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = translations[lang];

  useEffect(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang === 'ar' || urlLang === 'en') {
      setLang(urlLang);
    }
  }, [searchParams]);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    router.push(`/become-guide/guide?lang=${newLang}`);
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    specialties: '',
    languagesSpoken: '',
    yearsExperience: 0,
    serviceAreas: '',
    maxGroupSize: 8,
    hasTransportation: false,
    preferences: {
      families: false,
      women: false,
      men: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name in formData.preferences) {
      setFormData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/become-guide/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || t.error);
      }

      router.push(`/auth/signin?message=Application submitted! Please sign up or sign in to complete the process.&lang=${lang}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {t.language}
        </Button>
      </div>
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t.subtitle}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <Label htmlFor="fullName">{t.fullName}</Label>
            <Input id="fullName" name="fullName" type="text" required onChange={handleChange} value={formData.fullName} />
          </div>
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" required onChange={handleChange} value={formData.email} />
          </div>
          <div>
            <Label htmlFor="phone">{t.phone}</Label>
            <Input id="phone" name="phone" type="tel" required onChange={handleChange} value={formData.phone} />
          </div>
          <div>
            <Label htmlFor="bio">{t.bio}</Label>
            <Textarea id="bio" name="bio" required onChange={handleChange} value={formData.bio} />
            <p className="mt-2 text-sm text-gray-500">
              {t.bioHint}
            </p>
          </div>
          <div>
            <Label htmlFor="specialties">{t.specialties}</Label>
            <Input id="specialties" name="specialties" type="text" required onChange={handleChange} value={formData.specialties} />
            <p className="mt-2 text-sm text-gray-500">
              {t.specialtiesHint}
            </p>
          </div>
          <div>
            <Label htmlFor="languagesSpoken">{t.languagesSpoken}</Label>
            <Input id="languagesSpoken" name="languagesSpoken" type="text" required onChange={handleChange} value={formData.languagesSpoken} />
             <p className="mt-2 text-sm text-gray-500">
              {t.languagesSpokenHint}
            </p>
          </div>
          <div>
            <Label htmlFor="yearsExperience">{t.yearsExperience}</Label>
            <Input id="yearsExperience" name="yearsExperience" type="number" required onChange={handleChange} value={formData.yearsExperience} />
          </div>
          <div>
            <Label htmlFor="serviceAreas">{t.serviceAreas}</Label>
            <Input id="serviceAreas" name="serviceAreas" type="text" required onChange={handleChange} value={formData.serviceAreas} />
            <p className="mt-2 text-sm text-gray-500">
              {t.serviceAreasHint}
            </p>
          </div>
          <div>
            <Label htmlFor="maxGroupSize">{t.maxGroupSize}</Label>
            <Input id="maxGroupSize" name="maxGroupSize" type="number" required onChange={handleChange} value={formData.maxGroupSize} />
          </div>
          <div className="flex items-center">
            <Checkbox id="hasTransportation" name="hasTransportation" checked={formData.hasTransportation} onCheckedChange={(checked) => setFormData(prev => ({...prev, hasTransportation: Boolean(checked)}))} />
            <Label htmlFor="hasTransportation" className="ml-2">{t.hasTransportation}</Label>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-bold">{t.preferences}</h2>
            <p className="text-sm text-gray-600">
              {t.preferencesHint}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <Checkbox id="families" name="families" checked={formData.preferences.families} onCheckedChange={(checked) => setFormData(prev => ({...prev, preferences: {...prev.preferences, families: Boolean(checked)}}))} />
              <div className="ml-3 text-sm">
                <Label htmlFor="families" className="font-medium text-gray-700">{t.families}</Label>
                <p className="text-gray-500">{t.familiesHint}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Checkbox id="women" name="women" checked={formData.preferences.women} onCheckedChange={(checked) => setFormData(prev => ({...prev, preferences: {...prev.preferences, women: Boolean(checked)}}))} />
              <div className="ml-3 text-sm">
                <Label htmlFor="women" className="font-medium text-gray-700">{t.women}</Label>
                <p className="text-gray-500">{t.womenHint}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Checkbox id="men" name="men" checked={formData.preferences.men} onCheckedChange={(checked) => setFormData(prev => ({...prev, preferences: {...prev.preferences, men: Boolean(checked)}}))} />
              <div className="ml-3 text-sm">
                <Label htmlFor="men" className="font-medium text-gray-700">{t.men}</Label>
                <p className="text-gray-500">{t.menHint}</p>
              </div>
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}