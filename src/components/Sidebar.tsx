import React from 'react';
import { LayoutDashboard, Globe2, Map, BrainCircuit, Settings as SettingsIcon, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', name: 'Country Analytics', icon: Globe2 },
    { id: 'zambia', name: 'Zambia Deep-Dive', icon: Map },
    { id: 'ai', name: 'AI Insights', icon: BrainCircuit },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border w-full fixed top-0 left-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌍</span>
          <span className="font-bold text-white tracking-wider">AgroResilience</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-text-secondary hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-screen z-30 bg-card border-r border-border flex flex-col transition-all duration-300
        ${isOpen ? 'w-64 translate-x-0' : 'w-16 lg:w-64 translate-x-0 lg:translate-x-0 -translate-x-full'}
        pt-16 lg:pt-0
      `}>
        {/* Brand Identity */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white text-lg font-bold shadow-md shadow-brand-primary/20">
            AR
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide leading-none">AgroResilience</h1>
            <span className="text-xs text-text-muted">Africa Hub v1.0</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary shadow-sm shadow-brand-primary/5' 
                    : 'text-text-secondary hover:bg-border/30 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-brand-primary' : 'text-text-secondary'} />
                <span className={`${!isOpen && 'lg:inline hidden'}`}>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-border mt-auto">
          <div className={`flex items-center gap-3 ${!isOpen && 'lg:flex hidden'}`}>
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-sm font-semibold text-text-primary">
              BS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Bright Sikazwe</p>
              <p className="text-[10px] text-text-muted truncate">PhD Res. UJ</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${isOpen ? 'w-64' : 'w-16 lg:w-64'}`} />
    </>
  );
}
