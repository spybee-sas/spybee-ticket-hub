
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage} 
      className="flex items-center gap-1 text-spybee-dark hover:text-spybee-yellow"
    >
      <Globe size={16} />
      <span>{language === 'en' ? t('language.es') : t('language.en')}</span>
    </Button>
  );
};

export default LanguageToggle;
