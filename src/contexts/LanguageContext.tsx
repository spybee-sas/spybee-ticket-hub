
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    
    // Ticket Status Page
    'tickets.title': 'Track Your Tickets',
    'tickets.subtitle': 'Enter your email address to view the status of all your support tickets.',
    'tickets.emailPlaceholder': 'Enter your email address',
    'tickets.search': 'Search Tickets',
    'tickets.searching': 'Searching...',
    'tickets.yourTickets': 'Your Tickets',
    'tickets.noTickets': 'No tickets found',
    'tickets.noTicketsDesc': 'We couldn\'t find any tickets associated with this email address.',
    'tickets.createNew': 'Create a New Ticket',
    
    // Create Ticket Page
    'createTicket.title': 'Create a Support Ticket',
    'createTicket.subtitle': 'Fill out the form below to submit a new support ticket. Our team will respond as soon as possible.',
    
    // Ticket Details Page
    'ticketDetails.title': 'Ticket Details',
    'ticketDetails.back': '← Back to tickets',
    'ticketDetails.notFound': 'Ticket Not Found',
    'ticketDetails.notFoundDesc': 'Sorry, we couldn\'t find the ticket you\'re looking for.',
    'ticketDetails.backToStatus': 'Back to Ticket Status',
    'ticketDetails.loading': 'Loading ticket details...',
    
    // Not Found Page
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home',
    
    // Ticket Form
    'ticket.fullName': 'Full Name',
    'ticket.fullNamePlaceholder': 'John Doe',
    'ticket.email': 'Email',
    'ticket.emailPlaceholder': 'john@example.com',
    'ticket.projectName': 'Project Name',
    'ticket.projectNamePlaceholder': 'Website Redesign',
    'ticket.category': 'Category',
    'ticket.selectCategory': 'Select a category',
    'ticket.categoryBug': 'Bug',
    'ticket.categoryComplaint': 'Complaint',
    'ticket.categoryDelivery': 'Delivery Issue',
    'ticket.categoryOther': 'Other',
    'ticket.description': 'Description',
    'ticket.descriptionPlaceholder': 'Please describe your issue in detail...',
    'ticket.attachments': 'Attachments (Optional)',
    'ticket.file': 'file',
    'ticket.files': 'files',
    'ticket.remove': 'Remove',
    'ticket.submit': 'Submit Ticket',
    'ticket.submitting': 'Submitting...',
    'ticket.submitSuccess': 'Ticket submitted successfully!',
    'ticket.id': 'Ticket ID'
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
    
    // Ticket Status Page
    'tickets.title': 'Seguimiento de sus Tickets',
    'tickets.subtitle': 'Ingrese su dirección de correo electrónico para ver el estado de todos sus tickets de soporte.',
    'tickets.emailPlaceholder': 'Ingrese su dirección de correo electrónico',
    'tickets.search': 'Buscar Tickets',
    'tickets.searching': 'Buscando...',
    'tickets.yourTickets': 'Sus Tickets',
    'tickets.noTickets': 'No se encontraron tickets',
    'tickets.noTicketsDesc': 'No pudimos encontrar tickets asociados con esta dirección de correo electrónico.',
    'tickets.createNew': 'Crear un Nuevo Ticket',
    
    // Create Ticket Page
    'createTicket.title': 'Crear un Ticket de Soporte',
    'createTicket.subtitle': 'Complete el formulario a continuación para enviar un nuevo ticket de soporte. Nuestro equipo responderá lo antes posible.',
    
    // Ticket Details Page
    'ticketDetails.title': 'Detalles del Ticket',
    'ticketDetails.back': '← Volver a tickets',
    'ticketDetails.notFound': 'Ticket No Encontrado',
    'ticketDetails.notFoundDesc': 'Lo sentimos, no pudimos encontrar el ticket que está buscando.',
    'ticketDetails.backToStatus': 'Volver a Estado de Tickets',
    'ticketDetails.loading': 'Cargando detalles del ticket...',
    
    // Not Found Page
    'notFound.message': '¡Ups! Página no encontrada',
    'notFound.returnHome': 'Volver al Inicio',
    
    // Ticket Form
    'ticket.fullName': 'Nombre Completo',
    'ticket.fullNamePlaceholder': 'Juan Pérez',
    'ticket.email': 'Correo Electrónico',
    'ticket.emailPlaceholder': 'juan@ejemplo.com',
    'ticket.projectName': 'Nombre del Proyecto',
    'ticket.projectNamePlaceholder': 'Rediseño del Sitio Web',
    'ticket.category': 'Categoría',
    'ticket.selectCategory': 'Seleccione una categoría',
    'ticket.categoryBug': 'Error',
    'ticket.categoryComplaint': 'Queja',
    'ticket.categoryDelivery': 'Problema de Entrega',
    'ticket.categoryOther': 'Otro',
    'ticket.description': 'Descripción',
    'ticket.descriptionPlaceholder': 'Por favor describa su problema en detalle...',
    'ticket.attachments': 'Archivos Adjuntos (Opcional)',
    'ticket.file': 'archivo',
    'ticket.files': 'archivos',
    'ticket.remove': 'Eliminar',
    'ticket.submit': 'Enviar Ticket',
    'ticket.submitting': 'Enviando...',
    'ticket.submitSuccess': '¡Ticket enviado con éxito!',
    'ticket.id': 'ID del Ticket'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('spybee_language');
    return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage : 'en';
  });

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('spybee_language', language);
  }, [language]);

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
