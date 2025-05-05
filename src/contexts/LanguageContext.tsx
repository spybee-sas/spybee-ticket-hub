
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.createTicket': 'Create Ticket',
    'nav.checkStatus': 'Check Status',
    'nav.admin': 'Admin',
    
    // Login Form
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.logging': 'Logging in...',
    'login.error': 'Invalid credentials. Please try again.',
    'login.success': 'Login successful!',
    'login.emptyFields': 'Please enter both email and password',
    
    // Admin Portal
    'admin.portal': 'Admin Portal',
    'admin.login': 'Login',
    'admin.signup': 'Sign Up',
    
    // Index Page
    'index.title': 'Spybee Support Center',
    'index.subtitle': 'Need assistance with your Spybee project? Create a support ticket and our team will help you resolve any issues quickly.',
    'index.createTicket': 'Create a Ticket',
    'index.trackTicket': 'Track Your Ticket',
    'index.fastProcess': 'Fast & Easy Process',
    'index.realTime': 'Real-time Updates',
    'index.directComm': 'Direct Communication',
    'index.howItWorks': 'How It Works',
    'index.step1Title': 'Create a Ticket',
    'index.step1Desc': 'Fill out our simple form with details about your issue or question.',
    'index.step2Title': 'We Review',
    'index.step2Desc': 'Our support team reviews your ticket and begins working on a solution.',
    'index.step3Title': 'Get Resolution',
    'index.step3Desc': 'We\'ll keep you updated and work with you until your issue is resolved.',
    'index.footer.rights': '© {year} Spybee. All rights reserved.',
    
    // Language Toggle
    'language.en': 'English',
    'language.es': 'Spanish',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.createTicket': 'Crear Ticket',
    'nav.checkStatus': 'Verificar Estado',
    'nav.admin': 'Administrador',
    
    // Login Form
    'login.email': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.button': 'Iniciar Sesión',
    'login.logging': 'Iniciando sesión...',
    'login.error': 'Credenciales inválidas. Por favor intente de nuevo.',
    'login.success': '¡Inicio de sesión exitoso!',
    'login.emptyFields': 'Por favor ingrese correo electrónico y contraseña',
    
    // Admin Portal
    'admin.portal': 'Portal de Administrador',
    'admin.login': 'Iniciar Sesión',
    'admin.signup': 'Registrarse',
    
    // Index Page
    'index.title': 'Centro de Soporte Spybee',
    'index.subtitle': '¿Necesita ayuda con su proyecto Spybee? Cree un ticket de soporte y nuestro equipo le ayudará a resolver cualquier problema rápidamente.',
    'index.createTicket': 'Crear un Ticket',
    'index.trackTicket': 'Seguir su Ticket',
    'index.fastProcess': 'Proceso Rápido y Fácil',
    'index.realTime': 'Actualizaciones en Tiempo Real',
    'index.directComm': 'Comunicación Directa',
    'index.howItWorks': 'Cómo Funciona',
    'index.step1Title': 'Crear un Ticket',
    'index.step1Desc': 'Complete nuestro simple formulario con detalles sobre su problema o pregunta.',
    'index.step2Title': 'Revisamos',
    'index.step2Desc': 'Nuestro equipo de soporte revisa su ticket y comienza a trabajar en una solución.',
    'index.step3Title': 'Obtener Resolución',
    'index.step3Desc': 'Le mantendremos informado y trabajaremos con usted hasta que su problema sea resuelto.',
    'index.footer.rights': '© {year} Spybee. Todos los derechos reservados.',
    
    // Language Toggle
    'language.en': 'Inglés',
    'language.es': 'Español',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found in ${language} translations`);
      return key;
    }
    
    if (key === 'index.footer.rights') {
      return translation.replace('{year}', new Date().getFullYear().toString());
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
