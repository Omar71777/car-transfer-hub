
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { 
  CheckCircle, ArrowRight, Briefcase, CalendarIcon, 
  CreditCard, Globe, PanelTop, TrendingUp, 
  Users, Shield, Star, Rocket, Package, Mouse
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { subscriptionPlans, SubscriptionPlan } from '@/components/subscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LandingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const yearlyPrice = (price: string): string => {
    const numericPrice = parseFloat(price.replace('€', ''));
    const yearlyPrice = Math.round(numericPrice * 10);
    return `€${yearlyPrice}`;
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Navigation */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ibiza Transfer Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Características</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Precios</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">Cómo funciona</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonios</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">
              Iniciar Sesión
            </Link>
            <Button asChild>
              <Link to="/auth?tab=register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-blue-50 -z-10"></div>
        <div className="absolute inset-0 opacity-10 -z-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                Gestión de traslados simplificada
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                La plataforma completa para tu <span className="text-primary">negocio de traslados</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Optimiza tus servicios de transporte en Ibiza con nuestra solución todo en uno: gestión de traslados, facturación, cobros y mucho más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth?tab=register">
                    Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">Ver cómo funciona</a>
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>14 días de prueba gratuita</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-primary/10 opacity-80"></div>
              <div className="relative p-2">
                <img 
                  src="/placeholder.svg" 
                  alt="Ibiza Transfer Hub Dashboard" 
                  className="rounded-xl shadow-lg border border-primary/10"
                />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="500+" label="Empresas" />
            <StatCard number="10k+" label="Traslados gestionados" />
            <StatCard number="98%" label="Satisfacción" />
            <StatCard number="40%" label="Ahorro de tiempo" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" id="features">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Todo lo que necesitas para gestionar tu negocio"
            subtitle="Herramientas diseñadas para los profesionales del transporte en Ibiza"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<PanelTop className="h-10 w-10 text-primary" />}
              title="Panel intuitivo"
              description="Visualiza todos tus servicios y ganancias en un panel de control sencillo e intuitivo."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Gestión de traslados"
              description="Registra orígenes, destinos y detalles de cada servicio fácilmente."
              highlighted={true}
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
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Gestión de colaboradores"
              description="Administra fácilmente a los conductores y colaboradores de tu empresa."
              highlighted={true}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Cómo funciona"
            subtitle="Comienza a utilizar Ibiza Transfer Hub en tres sencillos pasos"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <StepCard
              number={1}
              title="Regístrate y configura"
              description="Crea tu cuenta, configura tu perfil y personaliza las preferencias de tu empresa."
              icon={<Rocket className="h-8 w-8 text-primary" />}
            />
            <StepCard
              number={2}
              title="Añade tus servicios"
              description="Comienza a registrar tus traslados, disposiciones y otros servicios en la plataforma."
              icon={<Package className="h-8 w-8 text-primary" />}
            />
            <StepCard
              number={3}
              title="Gestiona y factura"
              description="Genera facturas, controla pagos y visualiza informes de rendimiento fácilmente."
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
            />
          </div>
          
          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link to="/auth?tab=register">
                Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Planes que se adaptan a tu negocio"
            subtitle="Elige el plan que mejor se adapte a las necesidades de tu negocio"
          />
          
          <div className="flex justify-center mt-8 mb-12">
            <Tabs 
              defaultValue="monthly" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'monthly' | 'yearly')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Mensual</TabsTrigger>
                <TabsTrigger value="yearly">
                  Anual <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Ahorra 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan: SubscriptionPlan) => (
              <Card key={plan.id} className={`border-2 ${plan.isPopular ? 'border-primary' : 'border-muted'} relative`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full font-medium text-sm">
                    Más popular
                  </div>
                )}
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{plan.title}</h3>
                    <div className="mt-4 mb-4">
                      <span className="text-4xl font-bold">{activeTab === 'monthly' ? plan.price : yearlyPrice(plan.price)}</span>
                      <span className="text-muted-foreground">/{activeTab === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.isPopular ? "default" : "outline"} 
                    className="w-full mt-8" 
                    asChild
                  >
                    <Link to={`/auth?tab=register&plan=${plan.id}`}>
                      Seleccionar plan
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30" id="testimonials">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Lo que dicen nuestros clientes"
            subtitle="Empresas que confían en Ibiza Transfer Hub para gestionar su negocio"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <TestimonialCard
              quote="Desde que uso esta plataforma, he reducido un 40% el tiempo que dedicaba a la gestión administrativa."
              author="María López"
              company="Ibiza VIP Transfers"
              rating={5}
            />
            <TestimonialCard
              quote="La facturación automática y el seguimiento de pagos han cambiado completamente la forma en que gestiono mi negocio."
              author="Carlos Martínez"
              company="CM Transport"
              rating={5}
            />
            <TestimonialCard
              quote="El soporte al cliente es excepcional, siempre respondiendo rápidamente a cualquier consulta."
              author="Ana García"
              company="Balearic Transfers"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Preguntas frecuentes"
            subtitle="Resolvemos tus dudas sobre Ibiza Transfer Hub"
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

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para optimizar tu negocio de transfers?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete hoy mismo y disfruta de 14 días de prueba gratuita en cualquier plan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?tab=register">
                Comenzar prueba gratuita <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <a href="#pricing">Ver planes y precios</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Características</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Precios</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonios</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
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
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
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
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
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
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">Ibiza Transfer Hub</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Ibiza Transfer Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  highlighted = false 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}) => {
  return (
    <Card className={`transition-all hover:shadow-md ${highlighted ? 'border-primary/50 shadow-lg' : ''} hover:-translate-y-1 duration-300`}>
      <CardContent className="pt-6">
        <div className={`mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center ${highlighted ? 'bg-primary/10' : 'bg-muted'}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard = ({ 
  quote, 
  author, 
  company, 
  rating 
}: { 
  quote: string;
  author: string;
  company: string;
  rating: number;
}) => {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-5 w-5 ${i < rating ? 'text-primary fill-primary' : 'text-muted'}`}
            />
          ))}
        </div>
        <p className="mb-6 text-lg">{quote}</p>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const StepCard = ({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="p-6 border rounded-xl hover:border-primary/50 transition-all hover:shadow-sm">
      <h3 className="text-lg font-bold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
};

export default LandingPage;
