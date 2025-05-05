
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import NavBar from "@/components/NavBar";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-spybee-dark mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">{t('notFound.message')}</p>
          <Link 
            to="/" 
            className="inline-block bg-spybee-yellow text-spybee-dark px-6 py-3 rounded-md hover:bg-amber-400 transition-colors"
          >
            {t('notFound.returnHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
