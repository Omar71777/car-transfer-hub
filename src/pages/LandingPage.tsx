
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { CheckCircle, ArrowRight, Briefcase, CalendarIcon, CreditCard, Globe, PanelTop, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ibiza Transfer Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:underline">
              Iniciar Sesión
            </Link>
            <Button asChild>
              <Link to="/auth?tab=register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Gestiona tus transfers con facilidad
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Simplifica la gestión de traslados, facturación y cobros con nuestra plataforma completa diseñada para profesionales del transporte en Ibiza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth?tab=register">
                Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Ver características</a>
            </Button>
          </div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-12 bottom-0 top-auto"></div>
            <img 
              src="/placeholder.svg" 
              alt="Ibiza Transfer Hub Dashboard" 
              className="rounded-lg shadow-xl mx-auto border border-gray-200"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" id="features">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Todo lo que necesitas para gestionar tu negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<PanelTop className="h-10 w-10 text-primary" />}
              title="Panel intuitivo"
              description="Visualiza todos tus servicios y ganancias en un panel de control sencillo e intuitivo."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Gestión de traslados"
              description="Registra orígenes, destinos y detalles de cada servicio fácilmente."
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-primary" />}
              title="Facturación integrada"
              description="Genera facturas profesionales con un solo clic y envíalas directamente a tus clientes."
            />
            <FeatureCard
              icon={<CalendarIcon className="h-10 w-10 text-primary" />}
              title="Programación de servicios"
              description="Organiza tus traslados por fecha y hora con recordatorios automáticos."
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Análisis de rendimiento"
              description="Monitorea tus ingresos, gastos y rentabilidad con informes detallados."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Seguimiento de pagos"
              description="Controla el estado de pagos y mantén tus finanzas organizadas."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-muted py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Planes que se adaptan a tu negocio</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu negocio y empieza a optimizar tu gestión hoy mismo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="border-2 border-muted">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold">Básico</h3>
                  <div className="mt-4 mb-4">
                    <span className="text-4xl font-bold">€19</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="text-muted-foreground mb-6">Ideal para profesionales independientes</p>
                </div>
                <ul className="space-y-3">
                  <PricingListItem>Hasta 50 traslados al mes</PricingListItem>
                  <PricingListItem>Gestión de clientes</PricingListItem>
                  <PricingListItem>Facturación básica</PricingListItem>
                  <PricingListItem>Soporte por email</PricingListItem>
                </ul>
                <Button variant="outline" className="w-full mt-8" asChild>
                  <Link to="/auth?tab=register&plan=basic">Seleccionar plan</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Standard Plan */}
            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full font-medium text-sm">
                Más popular
              </div>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold">Estándar</h3>
                  <div className="mt-4 mb-4">
                    <span className="text-4xl font-bold">€39</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="text-muted-foreground mb-6">Perfecto para empresas pequeñas</p>
                </div>
                <ul className="space-y-3">
                  <PricingListItem>Traslados ilimitados</PricingListItem>
                  <PricingListItem>Gestión avanzada de clientes</PricingListItem>
                  <PricingListItem>Facturación completa con PDF</PricingListItem>
                  <PricingListItem>Gestión de gastos</PricingListItem>
                  <PricingListItem>Soporte prioritario</PricingListItem>
                </ul>
                <Button className="w-full mt-8" asChild>
                  <Link to="/auth?tab=register&plan=standard">Seleccionar plan</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-muted">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold">Premium</h3>
                  <div className="mt-4 mb-4">
                    <span className="text-4xl font-bold">€79</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <p className="text-muted-foreground mb-6">Para empresas con múltiples colaboradores</p>
                </div>
                <ul className="space-y-3">
                  <PricingListItem>Todo lo del plan Estándar</PricingListItem>
                  <PricingListItem>Gestión de colaboradores ilimitados</PricingListItem>
                  <PricingListItem>Análisis avanzado de rentabilidad</PricingListItem>
                  <PricingListItem>Acceso API</PricingListItem>
                  <PricingListItem>Soporte 24/7</PricingListItem>
                </ul>
                <Button variant="outline" className="w-full mt-8" asChild>
                  <Link to="/auth?tab=register&plan=premium">Seleccionar plan</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Desde que uso esta plataforma, he reducido un 40% el tiempo que dedicaba a la gestión administrativa."
              author="María López"
              company="Ibiza VIP Transfers"
            />
            <TestimonialCard
              quote="La facturación automática y el seguimiento de pagos han cambiado completamente la forma en que gestiono mi negocio."
              author="Carlos Martínez"
              company="CM Transport"
            />
            <TestimonialCard
              quote="El soporte al cliente es excepcional, siempre respondiendo rápidamente a cualquier consulta."
              author="Ana García"
              company="Balearic Transfers"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para optimizar tu negocio de transfers?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete hoy mismo y disfruta de 14 días de prueba gratuita en cualquier plan
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth?tab=register">
              Comenzar prueba gratuita <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Características</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Precios</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Sobre nosotros</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contacto</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Términos de servicio</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Política de privacidad</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Ibiza Transfer Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ quote, author, company }: { 
  quote: string;
  author: string;
  company: string; 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-muted-foreground/30 mb-4"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
        <p className="mb-4 italic">{quote}</p>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const PricingListItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="flex items-center">
      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
};

export default LandingPage;
