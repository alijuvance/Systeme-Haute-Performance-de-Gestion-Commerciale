'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ─── Icon / Color map ────────────────────────────────────
const toastConfig: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; text: string; bar: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    bar: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    bar: 'bg-blue-500',
  },
};

const confirmVariantConfig: Record<string, { button: string; icon: React.ReactNode }> = {
  danger: { button: 'bg-red-600 hover:bg-red-700 text-white', icon: <XCircle className="w-6 h-6 text-red-500" /> },
  warning: { button: 'bg-amber-500 hover:bg-amber-600 text-white', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
  info: { button: 'bg-gray-900 hover:bg-gray-800 text-white', icon: <Info className="w-6 h-6 text-gray-900" /> },
};

// ─── Provider ────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const idCounter = useRef(0);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = `toast-${++idCounter.current}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const success = useCallback((m: string) => addToast(m, 'success'), [addToast]);
  const error = useCallback((m: string) => addToast(m, 'error'), [addToast]);
  const warning = useCallback((m: string) => addToast(m, 'warning'), [addToast]);
  const info = useCallback((m: string) => addToast(m, 'info'), [addToast]);

  const confirmFn = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const handleConfirmResponse = (result: boolean) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  const variant = confirmState?.variant || 'danger';
  const variantCfg = confirmVariantConfig[variant];

  return (
    <ToastContext.Provider value={{ success, error, warning, info, confirm: confirmFn }}>
      {children}

      {/* ─── Toast Stack ─── */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const cfg = toastConfig[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg border bg-white ${cfg.border} transition-all duration-300 ease-out ${
                toast.exiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0 animate-slide-in'
              }`}
            >
              <div className={`flex-shrink-0 p-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                {cfg.icon}
              </div>
              <p className="text-sm font-medium flex-1 leading-snug mt-1 text-gray-900">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Confirm Dialog ─── */}
      {confirmState && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => handleConfirmResponse(false)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  {variantCfg.icon}
                </div>
                <div className="flex-1 mt-1">
                  <h3 className="text-lg font-semibold text-gray-900">{confirmState.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{confirmState.message}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={() => handleConfirmResponse(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                {confirmState.cancelText || 'Annuler'}
              </button>
              <button
                onClick={() => handleConfirmResponse(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm ${variantCfg.button}`}
              >
                {confirmState.confirmText || 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
