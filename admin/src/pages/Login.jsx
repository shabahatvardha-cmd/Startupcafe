import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  X,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email OTP Recovery Modal states
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState('EMAIL'); // 'EMAIL' | 'OTP' | 'PASSWORD'
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [recoveryResetToken, setRecoveryResetToken] = useState('');
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetNotice, setResetNotice] = useState('');

  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/sc-portal/workspace';

  const [activeAdminEmail, setActiveAdminEmail] = useState(
    import.meta.env.VITE_ADMIN_EMAIL || 'shabahatvardha@gmail.com'
  );
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Authenticate against server (checks custom updated password)
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        loginAdmin();
        navigate(from, { replace: true });
        return;
      }

      if (!res.ok || (data && !data.success)) {
        setError(data?.message || 'Invalid credentials. Check your email and password.');
        setIsLoading(false);
        return;
      }
    } catch (networkErr) {
      console.warn('Backend auth unreachable, falling back to local credentials...', networkErr);
    }

    // 2. Safe Fallback: verify against environment if server was unreachable
    setTimeout(() => {
      const matchEmail = email.trim().toLowerCase() === activeAdminEmail.trim().toLowerCase();
      const matchPass = password === expectedPassword;

      if (matchEmail && matchPass) {
        loginAdmin();
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials. Check your email and password.');
        setIsLoading(false);
      }
    }, 300);
  };

  const fillDemoCredentials = () => {
    setEmail(activeAdminEmail);
    setPassword(expectedPassword);
    setError('');
  };

  // Load configured admin email if updated
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.email) {
          setActiveAdminEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  const openRecoveryModal = () => {
    setShowResetModal(true);
    setRecoveryStep('EMAIL');
    setRecoveryEmail(email || activeAdminEmail || '');
    setRecoveryOtp('');
    setRecoveryResetToken('');
    setResetNewPass('');
    setResetConfirmPass('');
    setResetError('');
    setResetNotice('');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setResetError('');
    setResetNotice('');

    if (!recoveryEmail.trim()) {
      setResetError('Please enter your admin email address.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setRecoveryStep('OTP');
        setCooldownTimer(data.cooldownSeconds || 60);
        setResetNotice(data.message || 'If this email is authorized, a verification code has been sent.');
      } else {
        setResetError(data?.message || 'Failed to send verification code. Please try again.');
        if (data?.cooldownSeconds) {
          setCooldownTimer(data.cooldownSeconds);
        }
      }
    } catch (err) {
      setResetError('Server connection error. Please make sure the backend is running.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setResetError('');
    setResetNotice('');

    if (!recoveryOtp.trim() || recoveryOtp.trim().length !== 6) {
      setResetError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail.trim(),
          otp: recoveryOtp.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.resetToken) {
        setRecoveryResetToken(data.resetToken);
        setRecoveryStep('PASSWORD');
        setResetError('');
        setResetNotice('');
      } else {
        setResetError(data?.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setResetError('Server connection error. Please make sure the backend is running.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    if (e) e.preventDefault();
    setResetError('');

    if (!resetNewPass || resetNewPass.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setResetError('New password and confirm password do not match.');
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: recoveryResetToken,
          newPassword: resetNewPass,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setShowResetModal(false);
        setPassword(''); // Do not pre-fill password for security; require manual entry
        setEmail(recoveryEmail);
        setResetSuccess('Password reset successfully! Please enter your new password to sign in.');
        setError('');
        // Clean up
        setRecoveryEmail('');
        setRecoveryOtp('');
        setRecoveryResetToken('');
        setResetNewPass('');
        setResetConfirmPass('');
      } else {
        setResetError(data?.message || 'Failed to reset password. The recovery session may have expired.');
      }
    } catch (err) {
      setResetError('Server connection error. Please make sure the backend is running.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#050505] text-[#f8fafc]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-cyan-500/15 blur-[140px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sign in to manage Startup Cafe settings, leads, and content.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {resetSuccess && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium flex items-center justify-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shabahatvardha@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openRecoveryModal}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Badge (Dev only) */}
          {import.meta.env.DEV && (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Configured via <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded text-[11px]">admin/.env</code>
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Auto-fill default credentials (Dev only)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔐 EMAIL OTP PASSWORD RECOVERY MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-white/15 shadow-[0_0_60px_rgba(168,85,247,0.3)] relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Step Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className={`h-1.5 rounded-full transition-all duration-300 ${recoveryStep === 'EMAIL' ? 'w-8 bg-purple-500' : 'w-3 bg-purple-500/40'}`} />
              <span className={`h-1.5 rounded-full transition-all duration-300 ${recoveryStep === 'OTP' ? 'w-8 bg-purple-500' : 'w-3 bg-purple-500/40'}`} />
              <span className={`h-1.5 rounded-full transition-all duration-300 ${recoveryStep === 'PASSWORD' ? 'w-8 bg-purple-500' : 'w-3 bg-purple-500/40'}`} />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                {recoveryStep === 'EMAIL' && <Mail size={26} />}
                {recoveryStep === 'OTP' && <KeyRound size={26} />}
                {recoveryStep === 'PASSWORD' && <Lock size={26} />}
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {recoveryStep === 'EMAIL' && 'Recover Admin Access'}
                {recoveryStep === 'OTP' && 'Verify 6-Digit Code'}
                {recoveryStep === 'PASSWORD' && 'Set New Password'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {recoveryStep === 'EMAIL' && 'Enter your registered admin email address to receive a single-use verification code.'}
                {recoveryStep === 'OTP' && `Enter the 6-digit verification code sent to ${recoveryEmail}. It expires in 5 minutes.`}
                {recoveryStep === 'PASSWORD' && 'Identity verified successfully! Enter a strong new password for your admin account.'}
              </p>
            </div>

            {/* Error Notification */}
            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium animate-in fade-in duration-200">
                {resetError}
              </div>
            )}

            {/* Informational Notice */}
            {resetNotice && (
              <div className="mb-4 p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs text-center font-medium animate-in fade-in duration-200">
                {resetNotice}
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {recoveryStep === 'EMAIL' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="shabahatvardha@gmail.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    We'll dispatch a 6-digit OTP code to this email address if authorized.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold border border-white/20 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting || cooldownTimer > 0}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {isResetting ? (
                      <span>Sending Code...</span>
                    ) : cooldownTimer > 0 ? (
                      <span>Wait {cooldownTimer}s</span>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Send Code</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {recoveryStep === 'OTP' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 text-center">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="••••••"
                      className="w-full py-3.5 px-4 rounded-xl bg-black/70 border border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 text-center font-mono text-2xl tracking-[10px] sm:tracking-[14px] text-white placeholder-slate-600 outline-none transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryStep('EMAIL');
                        setResetError('');
                        setResetNotice('');
                      }}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Edit email
                    </button>
                    {cooldownTimer > 0 ? (
                      <span className="text-purple-400 font-medium">Resend in {cooldownTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isResetting}
                        className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold border border-white/20 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting || recoveryOtp.trim().length !== 6}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {isResetting ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Verify Code</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {recoveryStep === 'PASSWORD' && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type={showResetPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoFocus
                      value={resetNewPass}
                      onChange={(e) => setResetNewPass(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      {showResetPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type={showResetConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={resetConfirmPass}
                      onChange={(e) => setResetConfirmPass(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(!showResetConfirm)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      {showResetConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetNewPass && resetConfirmPass && resetNewPass === resetConfirmPass && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                  {resetNewPass && resetConfirmPass && resetNewPass !== resetConfirmPass && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold border border-white/20 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting || resetNewPass.length < 6 || resetNewPass !== resetConfirmPass}
                    className="w-1/2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {isResetting ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Save Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
