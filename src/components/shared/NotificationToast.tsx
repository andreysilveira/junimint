import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationToastState } from '@/src/hooks/use-stardew-save';

interface ToastProps {
  notification: NotificationToastState | null;
  onDismiss: () => void;
}

export default function NotificationToast({ notification, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="text-stardew-primary" size={18} />,
    info: <Info className="text-stardew-secondary" size={18} />,
    warning: <AlertTriangle className="text-amber-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
  };

  return (
    <AnimatePresence>
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[100] max-w-md bg-bg-surface border border-border-light rounded-2xl shadow-xl p-4 flex items-start gap-3.5"
      >
        <div className="mt-0.5">{icons[notification.type]}</div>
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">{notification.title}</h4>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-bg-muted transition-colors"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
