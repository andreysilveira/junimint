import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Download, 
  ShieldCheck, 
  X, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SaveValidationResult } from '@/src/domain/save/types';
import { CompatibilityReport } from '@/src/infrastructure/save/save-format';

interface SaveValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: SaveValidationResult | null;
  compatibility: CompatibilityReport | null;
  onDownloadModified: () => void;
  onDownloadOriginal: () => void;
  onReset: () => void;
  fileName: string;
}

export default function SaveValidatorModal({
  isOpen,
  onClose,
  validation,
  compatibility,
  onDownloadModified,
  onDownloadOriginal,
  onReset,
  fileName,
}: SaveValidatorModalProps) {
  if (!isOpen) return null;

  const severityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'error':
        return <AlertCircle className="text-red-500 shrink-0" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500 shrink-0" size={16} />;
      case 'info':
      default:
        return <Info className="text-stardew-primary shrink-0" size={16} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-bg-surface border border-border-light rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-border-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-stardew-primary/10 text-stardew-primary flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Save Integrity & Validation</h3>
                <p className="text-xs text-text-secondary">Target file: <span className="font-mono text-text-primary">{fileName}</span></p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-bg-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Status Banner */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              validation?.isValid 
                ? 'bg-stardew-primary/5 border-stardew-primary/20 text-stardew-primary' 
                : (validation?.canExport ? 'bg-amber-500/5 border-amber-500/20 text-amber-600' : 'bg-red-500/5 border-red-500/20 text-red-600')
            }`}>
              <div className="mt-0.5">
                {validation?.isValid ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {validation?.isValid 
                    ? 'All Save Integrity Checks Passed' 
                    : (validation?.canExport ? 'Minor Warnings Detected' : 'Critical Issues Detected')}
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {validation?.isValid
                    ? 'Your save structure is fully valid, consistent, and ready for Stardew Valley.'
                    : (validation?.canExport 
                        ? 'Your save can be exported, but review the warnings below to ensure intended gameplay behavior.'
                        : 'Critical errors must be resolved before downloading to prevent save file corruption.')}
                </p>
              </div>
            </div>

            {/* Validation Issues List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                  Validation Log ({validation?.issues.length || 0})
                </h4>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-stardew-primary/10 text-stardew-primary">{validation?.summary.info || 0} Info</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">{validation?.summary.warnings || 0} Warnings</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">{validation?.summary.errors || 0} Errors</span>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {validation?.issues.map((issue, idx) => (
                  <div
                    key={`${issue.id}-${idx}`}
                    className="p-3.5 rounded-xl bg-bg-muted/50 border border-border-light flex items-start gap-3 text-xs"
                  >
                    <div className="mt-0.5">{severityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-primary">{issue.title}</span>
                        <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">{issue.category}</span>
                      </div>
                      <p className="text-text-secondary mt-0.5 leading-relaxed">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-[11px] text-stardew-primary mt-1 font-medium">Suggestion: {issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility Summary */}
            {compatibility && (
              <div className="p-4 rounded-2xl bg-bg-muted/30 border border-border-light space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-stardew-secondary" />
                    Engine Compatibility
                  </span>
                  <span className="text-stardew-primary font-mono">v{compatibility.version} ({compatibility.isMultiplayer ? 'Multiplayer' : 'Singleplayer'})</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Preserved all original untouched XML nodes during serialization for complete backward & forward compatibility.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="p-6 border-t border-border-light bg-bg-muted/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDownloadOriginal();
                }}
                className="btn-secondary text-xs px-4 py-2 flex items-center gap-2"
                title="Download original unedited save file"
              >
                <Download size={14} />
                Download Original Backup
              </button>
              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 text-text-secondary hover:text-red-500"
                title="Discard all changes"
              >
                <RotateCcw size={14} />
                Reset Changes
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn-secondary text-xs px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                disabled={!validation?.canExport}
                onClick={() => {
                  onDownloadModified();
                  onClose();
                }}
                className={`btn-primary text-xs px-6 py-2.5 flex items-center gap-2 ${
                  !validation?.canExport ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download size={15} />
                Download Modified Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
