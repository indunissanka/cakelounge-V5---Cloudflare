import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPasscodeModal({ isOpen, onClose, onSuccess }: AdminPasscodeModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setUsername(''); setPassword(''); setError(''); }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#3a2034]/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white w-full max-w-[400px] rounded-3xl p-8 shadow-[0_20px_50px_rgba(58,32,52,0.25)] border border-brand-outline-variant/30"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-primary-container to-brand-primary rounded-t-3xl" />

          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-surface-low text-brand-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-14 h-14 bg-brand-primary-fixed/30 text-brand-primary rounded-2xl flex items-center justify-center mb-5">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-xl font-bold text-brand-primary mb-1 text-center">Admin Login</h3>
          <p className="text-xs text-brand-on-surface-variant/85 text-center mb-6">Enter your admin credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@cakelounge.lk"
                className="w-full px-4 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm"
                required autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-on-surface/85 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-4 pr-12 py-3 bg-brand-surface rounded-xl border border-brand-outline-variant/20 focus:border-brand-primary focus:outline-none text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-brand-on-surface-variant/60 hover:text-brand-primary">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-xs font-semibold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Verifying…' : 'Sign In to Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
