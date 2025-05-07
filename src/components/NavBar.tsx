
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const NavBar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-spybee-grey-light">
      <div className="spybee-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="public/lovable-uploads/b9a59ae1-5da2-4f4a-9433-a99f0c4dbb65.png" 
              alt="Spybee Logo" 
              className="h-8" 
            />
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={cn(
                "font-medium transition-colors hover:text-spybee-yellow",
                isActive('/') ? "text-spybee-yellow" : "text-spybee-dark"
              )}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/create-ticket" 
              className={cn(
                "font-medium transition-colors hover:text-spybee-yellow",
                isActive('/create-ticket') ? "text-spybee-yellow" : "text-spybee-dark"
              )}
            >
              {t('nav.createTicket')}
            </Link>
            <Link 
              to="/ticket-status" 
              className={cn(
                "font-medium transition-colors hover:text-spybee-yellow",
                isActive('/ticket-status') ? "text-spybee-yellow" : "text-spybee-dark"
              )}
            >
              {t('nav.checkStatus')}
            </Link>
          </div>
          
          {/* Language Toggle Only - Admin Link Removed */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
