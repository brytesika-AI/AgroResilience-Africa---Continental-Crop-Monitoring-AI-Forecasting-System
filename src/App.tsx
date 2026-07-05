import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import CountryAnalytics from './components/CountryAnalytics';
import ZambiaDeepDive from './components/ZambiaDeepDive';
import AIInsights from './components/AIInsights';
import Settings from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigateToZambia={() => setActiveTab('zambia')} />;
      case 'analytics':
        return <CountryAnalytics />;
      case 'zambia':
        return <ZambiaDeepDive />;
      case 'ai':
        return <AIInsights />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview onNavigateToZambia={() => setActiveTab('zambia')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-x-hidden font-sans">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Panel */}
      <main className="flex-1 min-w-0 p-4 lg:p-8 pt-20 lg:pt-8 z-10">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
