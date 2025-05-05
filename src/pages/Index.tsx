
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-spybee-grey-light py-16 md:py-24">
          <div className="spybee-container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-spybee-dark mb-4">
                  {t('index.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md">
                  {t('index.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/create-ticket">
                    <Button className="bg-spybee-yellow text-spybee-dark hover:bg-amber-400 font-medium text-lg">
                      {t('index.createTicket')}
                    </Button>
                  </Link>
                  <Link to="/ticket-status">
                    <Button variant="outline" className="border-spybee-yellow text-spybee-dark font-medium text-lg">
                      {t('index.trackTicket')}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-spybee-grey-light">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-spybee-yellow rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">{t('index.fastProcess')}</h3>
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-spybee-yellow rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">{t('index.realTime')}</h3>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-spybee-yellow rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">{t('index.directComm')}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="spybee-container">
            <h2 className="text-3xl font-bold text-center text-spybee-dark mb-12">
              {t('index.howItWorks')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-spybee-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-spybee-dark">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('index.step1Title')}</h3>
                <p className="text-gray-600">
                  {t('index.step1Desc')}
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-spybee-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-spybee-dark">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('index.step2Title')}</h3>
                <p className="text-gray-600">
                  {t('index.step2Desc')}
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-spybee-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-spybee-dark">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('index.step3Title')}</h3>
                <p className="text-gray-600">
                  {t('index.step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-spybee-dark text-white py-8">
        <div className="spybee-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-spybee-yellow rounded-md flex items-center justify-center">
                  <span className="font-bold text-xs text-spybee-dark">SB</span>
                </div>
                <span className="font-bold">Spybee Support</span>
              </div>
              <p className="text-sm mt-2">{t('index.footer.rights')}</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="hover:text-spybee-yellow">{t('nav.home')}</Link>
              <Link to="/create-ticket" className="hover:text-spybee-yellow">{t('nav.createTicket')}</Link>
              <Link to="/ticket-status" className="hover:text-spybee-yellow">{t('nav.checkStatus')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
