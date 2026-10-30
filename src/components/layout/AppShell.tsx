'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { AssessmentWorkspace } from '@/components/assessment/AssessmentWorkspace';
import { MaturityMatrixTable } from '@/components/tables/MaturityMatrixTable';
import { StrategicCycleView } from '@/components/analytics/StrategicCycleView';
import { AboutView } from '@/components/about/AboutView';
import { SettingsView } from '@/components/settings/SettingsView';
import { ExecutiveReportModal } from '@/components/reports/ExecutiveReportModal';
import { CompanySelectorModal } from '@/components/modals/CompanySelectorModal';
import { AssessmentSelectorModal } from '@/components/modals/AssessmentSelectorModal';
import { useAssessment } from '@/context/AssessmentContext';

export const AppShell: React.FC = () => {
  const { activeTab } = useAssessment();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'assessment':
        return <AssessmentWorkspace />;
      case 'tables':
        return <MaturityMatrixTable />;
      case 'analytics':
        return <StrategicCycleView />;
      case 'about':
        return <AboutView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modals */}
      <ExecutiveReportModal />
      <CompanySelectorModal />
      <AssessmentSelectorModal />
    </div>
  );
};
