'use client';

import { useState, useCallback } from 'react';
import styles from './Toast.module.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <Icon size={18} className={styles.icon} />
            <span className={styles.message}>{toast.message}</span>
            <button className={styles.close} onClick={() => onRemove(toast.id)}>
              <X size={14} />
            </button>
            <div
              className={styles.progress}
              style={{ animationDuration: `${toast.duration}ms` }}
            />
          </div>
        );
      })}
    </div>
  );
}
