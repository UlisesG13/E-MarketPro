import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const message =
    error instanceof Error ? error.message : 'Ocurrió un problema inesperado al cargar la vista.';

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-[32px] border border-red-500/20 bg-red-500/5 p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="text-sm uppercase tracking-[0.18em] text-red-300">Error de aplicación</p>
        <h1 className="mt-3 text-4xl font-black text-white">No pudimos cargar esta vista</h1>
        <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-gray-300">{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/store"
            className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Ir a la tienda
          </Link>
          <Link
            to="/error"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Reintentar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
