
import React from 'react';
import { SectionHeader } from '../SectionHeader';
import { FAQItem } from '../FAQItem';

export const FAQSection = () => {
  return (
    <section className="py-20 px-4" id="faq">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader
          title="Preguntas frecuentes"
          subtitle="Resolvemos tus dudas sobre CTHub"
        />
        
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <FAQItem
            question="¿Cómo funciona la prueba gratuita?"
            answer="La prueba gratuita dura 14 días y te permite acceder a todas las funcionalidades de la plataforma sin compromiso. No necesitas introducir datos de pago para comenzar."
          />
          <FAQItem
            question="¿Puedo cambiar de plan en cualquier momento?"
            answer="Sí, puedes actualizar o cambiar tu plan en cualquier momento desde la sección de suscripción en tu panel de control."
          />
          <FAQItem
            question="¿Ofrecen soporte técnico?"
            answer="Todos los planes incluyen soporte técnico. Los planes Estándar y Premium cuentan con soporte prioritario para resolver tus consultas más rápidamente."
          />
          <FAQItem
            question="¿Cómo funciona la facturación?"
            answer="Las facturas se generan automáticamente según el ciclo de facturación de tu plan. El pago se procesa automáticamente con el método de pago que hayas configurado."
          />
          <FAQItem
            question="¿Puedo exportar mis datos?"
            answer="Sí, la plataforma permite exportar tus datos en diferentes formatos, como PDF y CSV, para facilitar su uso en otras aplicaciones."
          />
          <FAQItem
            question="¿Es compatible con dispositivos móviles?"
            answer="Sí, nuestra plataforma está optimizada para funcionar perfectamente en ordenadores, tablets y teléfonos móviles, permitiéndote gestionar tu negocio desde cualquier lugar."
          />
        </div>
      </div>
    </section>
  );
};
