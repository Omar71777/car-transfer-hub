
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <p className="text-gray-500 mb-8">
          Lo sentimos, no pudimos encontrar la página "{location.pathname}"
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
