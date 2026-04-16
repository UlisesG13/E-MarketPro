import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

const DashboardLayout: React.FC = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="app-shell min-h-screen">
      <Sidebar />
      <div
        className={cn(
          'ml-0 flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out',
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-20'
        )}
      >
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
