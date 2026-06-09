import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Delete, X, Terminal, ArrowRight, Lock } from 'lucide-react';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPasscodeModal({ isOpen, onClose, onSuccess }: AdminPasscodeModalProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Clear states when model is opened/closed
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
    }
  }, [isOpen]);

  const handleKeyPress = (num: string) => {
    setError(null);
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(null);
    setPin('');
  };

  const handleSubmit = () => {
    // Correct passcode: 1234
    if (pin === '1234' || pin === 'CAKE2026') {
      onSuccess();
      onClose();
    } else {
      setError('Invalid staff authorization passcode');
      setIsShaking(true);
      setPin('');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop overlay blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3a2034]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{ duration: isShaking ? 0.4 : 0.3 }}
          className="relative bg-white w-full max-w-[420px] rounded-3xl p-8 shadow-[0_20px_50px_rgba(58,32,52,0.25)] border border-brand-outline-variant/30 text-center text-brand-on-surface overflow-hidden"
        >
          {/* Subtle design crown decorative */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-primary-container to-brand-primary" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-surface-low text-brand-on-surface-variant transition-colors"
            aria-label="Close Authentication Gateway"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Secure Icon */}
          <div className="mx-auto w-14 h-14 bg-brand-primary-fixed/30 text-brand-primary rounded-2xl flex items-center justify-center mb-5">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-xl font-bold text-brand-primary mb-1">
            Staff Authentication
          </h3>
          <p className="text-xs text-brand-on-surface-variant/85 max-w-[280px] mx-auto mb-6">
            Enter your 4-digit security code to access the kitchen logs and recipe matrices.
          </p>

          {/* PIN Display boxes */}
          <div className="flex justify-center gap-3.5 mb-5">
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-lg font-bold font-sans transition-all duration-150 ${
                    hasDigit
                      ? 'border-brand-primary bg-brand-primary-fixed/20 text-brand-primary scale-105'
                      : 'border-brand-outline-variant/50 bg-brand-surface-low text-transparent'
                  }`}
                >
                  {hasDigit ? '•' : ''}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          <div className="h-4 mb-4">
            {error ? (
              <p className="text-red-600 text-xs font-semibold tracking-wide animate-pulse">
                {error}
              </p>
            ) : (
              <p className="text-[11px] text-brand-outline font-medium tracking-wide">
                Staff passcode: <span className="font-bold underline text-brand-primary">1234</span>
              </p>
            )}
          </div>

          {/* Luxury POS-style Keypad */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 max-w-[290px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-12 rounded-xl bg-brand-surface-low hover:bg-brand-primary-fixed/40 active:bg-brand-primary-fixed/60 text-brand-primary font-bold text-base transition-colors duration-150 flex items-center justify-center shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-brand-surface-low hover:bg-brand-outline-variant/30 active:bg-brand-outline-variant/50 text-brand-on-surface-variant font-medium text-xs transition-colors duration-150 flex items-center justify-center shadow-xs"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-xl bg-brand-surface-low hover:bg-brand-primary-fixed/40 active:bg-brand-primary-fixed/60 text-brand-primary font-bold text-base transition-colors duration-150 flex items-center justify-center shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-brand-surface-low hover:bg-brand-outline-variant/30 active:bg-brand-outline-variant/50 text-brand-on-surface-variant transition-colors duration-150 flex items-center justify-center shadow-xs"
              aria-label="Delete last digit"
            >
              <Delete className="w-5 h-5 text-brand-outline" />
            </button>
          </div>

          {/* Verification triggers */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pin.length === 0}
            className={`w-full py-3.5 rounded-xl font-semibold tracking-wider text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
              pin.length > 0
                ? 'bg-brand-primary text-white hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-brand-outline-variant/40 text-brand-outline cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Authorize staff entry
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
