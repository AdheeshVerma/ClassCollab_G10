
import React, { ReactNode } from 'react';
import Navbar from '../components/Navigation/Navbar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
