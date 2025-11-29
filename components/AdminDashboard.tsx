import React from 'react';
import { AdminFeatureWorkspace } from './AdminFeatureWorkspace';

export const AdminDashboard: React.FC = () => {
  return (
    <>
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminFeatureWorkspace />
        </div>
      </section>
    </>
  );
};
