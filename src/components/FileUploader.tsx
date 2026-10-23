import React, { useCallback } from 'react';
import { Upload, FileWarning, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export default function FileUploader({ onFileSelect, isLoading, error }: FileUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div className="max-w-4xl mx-auto mt-32 px-10">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stardew-primary/10 border border-stardew-primary/20 text-stardew-primary text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm">
          <Sparkles size={12} />
          Ultimate Save Editor
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6">Initialize your farm</h1>
        <p className="text-text-secondary text-xl max-w-2xl mx-auto leading-relaxed">
          Upload your Stardew Valley save file to unlock advanced analytics and management tools in a sophisticated dashboard.
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-16 text-center relative overflow-hidden group bg-bg-surface"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-stardew-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative z-10"
        >
          <div className="mb-10 flex justify-center">
            <div className="w-24 h-24 bg-bg-muted rounded-[2rem] flex items-center justify-center text-stardew-primary border border-border-light group-hover:border-stardew-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
              {isLoading ? (
                <Loader2 className="animate-spin" size={36} />
              ) : (
                <Upload size={36} />
              )}
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-2xl font-bold text-text-primary">
              {isLoading ? 'Processing save data...' : 'Drop your save file here'}
            </h3>
            <p className="text-text-secondary text-base">
              Supports character save files from all platforms.
            </p>
          </div>

          <div className="relative inline-block">
            <input 
              type="file" 
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              accept=".xml,*"
            />
            <button className="btn-primary px-12 py-4 text-base relative z-10 pointer-events-none shadow-md">
              Select File
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-4 justify-center text-sm font-bold shadow-sm"
          >
            <FileWarning size={20} />
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Path Helpers */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { os: 'Windows', path: '%AppData%\\StardewValley\\Saves' },
          { os: 'macOS', path: '~/.config/StardewValley/Saves' },
          { os: 'Linux', path: '~/.config/StardewValley/Saves' },
        ].map((item, i) => (
          <motion.div 
            key={item.os}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-6 bg-bg-muted/50 border border-border-light rounded-2xl shadow-sm"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-3">{item.os}</h4>
            <code className="text-xs text-text-primary font-mono break-all leading-relaxed">{item.path}</code>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
