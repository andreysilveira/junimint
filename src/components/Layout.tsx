import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  Map as MapIcon, 
  TrendingUp, 
  Zap, 
  Download, 
  RotateCcw,
  RotateCw,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SaveValidationResult } from '@/src/domain/save/types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenValidator: () => void;
  hasData: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  validation: SaveValidationResult | null;
  farmerName?: string;
  farmName?: string;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  onOpenValidator, 
  hasData,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  validation,
  farmerName,
  farmName,
}: LayoutProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Farmer & Mastery', icon: User },
    { id: 'inventory', label: 'Backpack', icon: Package },
    { id: 'social', label: 'Social', icon: Heart },
    { id: 'farm', label: 'Farm Map', icon: MapIcon },
    { id: 'world', label: 'World & Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics & Audit', icon: TrendingUp },
    { id: 'hack', label: 'Quick Hacks', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex bg-bg-main text-text-primary">
      {/* Fixed Sidebar */}
      <aside className="w-[72px] flex flex-col items-center py-6 border-r border-border-light bg-bg-surface sticky top-0 h-screen z-50">
        <div className="mb-8">
          <div 
            onClick={() => hasData && setActiveTab('overview')}
            className="w-11 h-11 bg-stardew-primary rounded-2xl flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-white font-black text-xl">S</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => hasData && setActiveTab(item.id)}
              disabled={!hasData}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 group relative ${
                !hasData 
                  ? 'opacity-30 cursor-not-allowed text-text-secondary' 
                  : (activeTab === item.id 
                      ? 'bg-stardew-primary/10 text-stardew-primary shadow-xs' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted')
              }`}
            >
              <item.icon size={20} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-stardew-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-lg">
                {item.label}
              </div>

              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1.5 h-6 bg-stardew-primary rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Validation Status pill in sidebar bottom */}
        {hasData && validation && (
          <div className="mt-auto">
            <button
              onClick={onOpenValidator}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                validation.isValid 
                  ? 'bg-stardew-primary/10 text-stardew-primary hover:bg-stardew-primary/20' 
                  : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
              }`}
              title="Save file integrity status"
            >
              {validation.isValid ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border-light bg-bg-surface flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary text-xs font-medium uppercase tracking-widest">
              <span>Stardew Engine</span>
              <span className="opacity-30">/</span>
              <span className="text-text-primary font-bold">
                {navItems.find(i => i.id === activeTab)?.label || 'Save File'}
              </span>
            </div>

            {farmerName && farmName && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-muted text-xs font-medium text-text-secondary border border-border-light">
                <span className="text-text-primary font-bold">{farmerName}</span>
                <span>•</span>
                <span>{farmName} Farm</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasData && (
              <>
                {/* Undo / Redo controls */}
                <div className="flex items-center gap-1 bg-bg-muted/80 p-1 rounded-xl border border-border-light">
                  <button
                    disabled={!canUndo}
                    onClick={onUndo}
                    className={`p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors ${
                      !canUndo ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    title="Undo Change (Ctrl+Z)"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    disabled={!canRedo}
                    onClick={onRedo}
                    className={`p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors ${
                      !canRedo ? 'opacity-30 cursor-not-allowed' : ''
                    }`}
                    title="Redo Change (Ctrl+Y)"
                  >
                    <RotateCw size={14} />
                  </button>
                </div>

                {/* Validation Status Badge */}
                {validation && (
                  <button
                    onClick={onOpenValidator}
                    className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      validation.isValid
                        ? 'bg-stardew-primary/10 text-stardew-primary hover:bg-stardew-primary/20'
                        : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                    }`}
                  >
                    {validation.isValid ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                    <span>{validation.isValid ? 'Save Valid' : `${validation.summary.warnings} Warnings`}</span>
                  </button>
                )}

                {/* Export Save button */}
                <button 
                  onClick={onOpenValidator}
                  className="btn-primary flex items-center gap-2 text-xs py-2 px-5 shadow-xs"
                >
                  <Download size={14} />
                  Save / Export
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
