import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../organisms/Sidebar';
import Navbar from '../organisms/Navbar';
import { useUIStore } from '../../store/uiStore';

const DashboardLayout: React.FC = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex flex-col min-h-screen"
      >
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
