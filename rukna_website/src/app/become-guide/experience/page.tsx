'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const translations = {
  en: {
    title: 'Host an Experience',
    subtitle: 'Fill out the form below to create your experience.',
    experienceTitle: 'Experience Title',
    experienceTitleHint: 'e.g., "Cultural Wedding in Aseer", "Traditional Baloot Game Night"',
    description: 'Description',
    descriptionHint: 'Describe the experience in detail. What will guests do? What makes it unique?',
    category: 'Category',
    selectCategory: 'Select a category',
    adventure: 'Adventure',
    cultural: 'Cultural',
    food: 'Food',
    nature: 'Nature',
    historical: 'Historical',
    spiritual: 'Spiritual',
    durationHours: 'Duration (in hours)',
    pricePerPerson: 'Price per Person (in SAR)',
    minParticipants: 'Min. Participants',
    maxParticipants: 'Max. Participants',
    includedServices: 'Included Services',
    includedServicesHint: 'Comma-separated, e.g., guide, transportation, lunch',
    excludedServices: 'Excluded Services',
    excludedServicesHint: 'Comma-separated, e.g., flights, insurance',
    meetingPoint: 'Meeting Point',
    difficultyLevel: 'Difficulty Level',
    selectDifficulty: 'Select a difficulty level',
    easy: 'Easy',
    moderate: 'Moderate',
    challenging: 'Challenging',
    yourInformation: 'Your Information',
    yourInformationHint: "We need this to create an account for you if you don't have one.",
    hostName: 'Full Name',
    hostEmail: 'Email',
    hostPhone: 'Phone Number',
    submit: 'Submit Experience',
    submitting: 'Submitting...',
    error: 'Something went wrong',
    language: 'العربية',
  },
  ar: {
    title: 'ودك تسوي تجربة؟',
    subtitle: 'عبّي ذا النموذج عشان تسوي تجربتك.',
    experienceTitle: 'ايش اسم التجربة؟',
    experienceTitleHint: 'مثلاً: "عرس عسيري"، "لعبة بلوت على أصولها"',
    description: 'علمنا عن التجربة',
    descriptionHint: 'اشرح لنا التجربة بالتفصيل. ايش بيسوون الضيوف؟ وايش اللي يخليها تجربة ما تنتسي؟',
    category: 'نوعها',
    selectCategory: 'اختر نوع التجربة',
    adventure: 'مغامرة',
    cultural: 'ثقافة',
    food: 'أكل',
    nature: 'طبيعة',
    historical: 'تاريخ',
    spiritual: 'روحانيات',
    durationHours: 'كم ساعة تاخذ؟',
    pricePerPerson: 'كم السعر للشخص الواحد؟ (بالريال)',
    minParticipants: 'أقل عدد للضيوف',
    maxParticipants: 'أكثر عدد للضيوف',
    includedServices: 'ايش بتقدم لهم؟',
    includedServicesHint: 'اكتبها وبينها فاصلة، مثلا: مرشد، مواصلات، غداء',
    excludedServices: 'ايش اللي ما بتقدمه؟',
    excludedServicesHint: 'اكتبها وبينها فاصلة، مثلا: تذاكر طيران، تأمين',
    meetingPoint: 'وين بتتقابلون؟',
    difficultyLevel: 'صعوبتها',
    selectDifficulty: 'اختر صعوبة التجربة',
    easy: 'سهلة',
    moderate: 'متوسطة',
    challenging: 'صعبة',
    yourInformation: 'معلوماتك الشخصية',
    yourInformationHint: 'نحتاجها عشان نسوي لك حساب لو ما عندك واحد.',
    hostName: 'اسمك الكامل',
    hostEmail: 'ايميلك',
    hostPhone: 'رقم جوالك',
    submit: 'أرسل التجربة',
    submitting: 'لحظة... نرسل التجربة',
    error: 'صارت مشكلة',
    language: 'English',
  },
};

export default function ExperienceSignUpPage() {
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
    router.push(`/become-guide/experience?lang=${newLang}`);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    durationHours: 0,
    pricePerPerson: 0,
    maxParticipants: 1,
    minParticipants: 1,
    includedServices: '',
    excludedServices: '',
    meetingPoint: '',
    difficultyLevel: '',
    hostName: '',
    hostEmail: '',
    hostPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/become-guide/experience', {
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
            <Label htmlFor="title">{t.experienceTitle}</Label>
            <Input id="title" name="title" type="text" required onChange={handleChange} value={formData.title} />
            <p className="mt-2 text-sm text-gray-500">
              {t.experienceTitleHint}
            </p>
          </div>
          <div>
            <Label htmlFor="description">{t.description}</Label>
            <Textarea id="description" name="description" required onChange={handleChange} value={formData.description} />
            <p className="mt-2 text-sm text-gray-500">
              {t.descriptionHint}
            </p>
          </div>
          <div>
            <Label htmlFor="category">{t.category}</Label>
            <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">{t.adventure}</SelectItem>
                <SelectItem value="cultural">{t.cultural}</SelectItem>
                <SelectItem value="food">{t.food}</SelectItem>
                <SelectItem value="nature">{t.nature}</SelectItem>
                <SelectItem value="historical">{t.historical}</SelectItem>
                <SelectItem value="spiritual">{t.spiritual}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="durationHours">{t.durationHours}</Label>
            <Input id="durationHours" name="durationHours" type="number" required onChange={handleChange} value={formData.durationHours} />
          </div>
          <div>
            <Label htmlFor="pricePerPerson">{t.pricePerPerson}</Label>
            <Input id="pricePerPerson" name="pricePerPerson" type="number" required onChange={handleChange} value={formData.pricePerPerson} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minParticipants">{t.minParticipants}</Label>
              <Input id="minParticipants" name="minParticipants" type="number" required onChange={handleChange} value={formData.minParticipants} />
            </div>
            <div>
              <Label htmlFor="maxParticipants">{t.maxParticipants}</Label>
              <Input id="maxParticipants" name="maxParticipants" type="number" required onChange={handleChange} value={formData.maxParticipants} />
            </div>
          </div>
          <div>
            <Label htmlFor="includedServices">{t.includedServices}</Label>
            <Input id="includedServices" name="includedServices" type="text" required onChange={handleChange} value={formData.includedServices} />
            <p className="mt-2 text-sm text-gray-500">
              {t.includedServicesHint}
            </p>
          </div>
          <div>
            <Label htmlFor="excludedServices">{t.excludedServices}</Label>
            <Input id="excludedServices" name="excludedServices" type="text" required onChange={handleChange} value={formData.excludedServices} />
             <p className="mt-2 text-sm text-gray-500">
              {t.excludedServicesHint}
            </p>
          </div>
          <div>
            <Label htmlFor="meetingPoint">{t.meetingPoint}</Label>
            <Input id="meetingPoint" name="meetingPoint" type="text" required onChange={handleChange} value={formData.meetingPoint} />
          </div>
          <div>
            <Label htmlFor="difficultyLevel">{t.difficultyLevel}</Label>
            <Select onValueChange={(value) => handleSelectChange('difficultyLevel', value)} value={formData.difficultyLevel}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectDifficulty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">{t.easy}</SelectItem>
                <SelectItem value="moderate">{t.moderate}</SelectItem>
                <SelectItem value="challenging">{t.challenging}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div>
            <h2 className="text-xl font-bold">{t.yourInformation}</h2>
            <p className="text-sm text-gray-600">
              {t.yourInformationHint}
            </p>
          </div>
          <div>
            <Label htmlFor="hostName">{t.hostName}</Label>
            <Input id="hostName" name="hostName" type="text" required onChange={handleChange} value={formData.hostName} />
          </div>
          <div>
            <Label htmlFor="hostEmail">{t.hostEmail}</Label>
            <Input id="hostEmail" name="hostEmail" type="email" required onChange={handleChange} value={formData.hostEmail} />
          </div>
          <div>
            <Label htmlFor="hostPhone">{t.hostPhone}</Label>
            <Input id="hostPhone" name="hostPhone" type="tel" required onChange={handleChange} value={formData.hostPhone} />
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}