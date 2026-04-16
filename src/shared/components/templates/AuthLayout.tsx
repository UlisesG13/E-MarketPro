import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[var(--app-primary-soft)] blur-[128px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[var(--app-secondary-soft)] blur-[128px]" />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
