import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Calendar,
  ShieldAlert,
  Send,
  RefreshCw,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export default function SecurityTab() {
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasCustomPassword, setHasCustomPassword] = useState(false);

  // Authentication mode: 'otp' (Gmail OTP verification) or 'password' (standard current password)
  const [authMode, setAuthMode] = useState('otp');

  // OTP verification states
  const [otpStep, setOtpStep] = useState('send'); // 'send' | 'enter'
  const [otpCode, setOtpCode] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingViaOtp, setIsResettingViaOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');

  // Visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Load current auth status from backend
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldown]);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/status`);
      const data = await res.json();
      if (data?.success) {
        setAdminEmail(data.email || 'shabahatvardha@gmail.com');
        setHasCustomPassword(!!data.hasCustomPassword);
        setLastUpdated(data.lastUpdated || null);
      }
    } catch (err) {
      console.warn('Could not load auth status:', err);
      setAdminEmail('shabahatvardha@gmail.com');
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-white/10' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-400', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-400', text: 'text-blue-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength(newPassword);
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  // Handle standard password change submission (using Current Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStatusMessage({ type: '', text: '' });

    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password to authorize changes.' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword: newPassword || undefined,
          newEmail: adminEmail,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Credentials updated and saved successfully!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchAuthStatus();
      } else {
        setStatusMessage({
          type: 'error',
          text: data?.message || 'Failed to update credentials. Check your current password.',
        });
      }
    } catch (err) {
      console.error('Password change error:', err);
      setStatusMessage({
        type: 'error',
        text: 'Server connection error. Please make sure the backend server is running.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch OTP to Admin Gmail
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setOtpError('');
    setOtpNotice('');
    setIsSendingOtp(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setOtpStep('enter');
        setOtpCooldown(data.cooldownSeconds || 60);
        setOtpNotice(data.message || `A 6-digit verification code was sent to ${adminEmail}`);
      } else {
        setOtpError(data?.message || 'Failed to send verification code. Please try again.');
        if (data?.cooldownSeconds) setOtpCooldown(data.cooldownSeconds);
      }
    } catch (err) {
      setOtpError('Server connection error. Make sure the backend server is running.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and Save New Password
  const handleResetViaOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpNotice('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setOtpError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setOtpError('New password and confirmation do not match.');
      return;
    }

    setIsResettingViaOtp(true);

    try {
      // 1. Verify OTP code to acquire single-use token
      const verifyRes = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          otp: otpCode.trim(),
        }),
      });

      const verifyData = await verifyRes.json().catch(() => null);

      if (!verifyRes.ok || !verifyData?.success || !verifyData?.resetToken) {
        setOtpError(verifyData?.message || 'Invalid or expired verification code.');
        setIsResettingViaOtp(false);
        return;
      }

      // 2. Set new password with the single-use token
      const resetRes = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: verifyData.resetToken,
          newPassword,
        }),
      });

      const resetData = await resetRes.json().catch(() => null);

      if (resetRes.ok && resetData?.success) {
        setStatusMessage({
          type: 'success',
          text: 'Admin password updated successfully via Gmail OTP!',
        });
        setOtpNotice('Password saved successfully! Your new password is now active.');
        setNewPassword('');
        setConfirmPassword('');
        setOtpCode('');
        setOtpStep('send');
        fetchAuthStatus();
      } else {
        setOtpError(resetData?.message || 'Failed to update password. Session may have expired.');
      }
    } catch (err) {
      setOtpError('Server connection error. Make sure the backend server is running.');
    } finally {
      setIsResettingViaOtp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <ShieldCheck size={20} />
            </span>
            Account &amp; Password Security
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage your admin access credentials, update login password, and configure session security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            {hasCustomPassword ? 'Custom Password Active' : 'Default Credentials'}
          </span>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-start gap-3 animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm">{statusMessage.text}</div>
          <button
            type="button"
            onClick={() => setStatusMessage({ type: '', text: '' })}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Form & Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Password & Security Panel */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-7 rounded-2xl border border-white/10 bg-black/40">
          {/* Method Switcher: Preserves original while introducing OTP */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-6 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setOtpError('');
                setOtpNotice('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-neon-purple text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Mail size={14} className={authMode === 'otp' ? 'text-white' : 'text-purple-400'} />
              <span>Verify via Gmail OTP</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                New
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setStatusMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'password'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-neon-purple text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Lock size={14} />
              <span>Use Current Password</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* MODE 1: GMAIL OTP FLOW (NEW FEATURE - NO PASSWORD REQUIRED)               */}
          {/* ========================================================================= */}
          {authMode === 'otp' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Notification Banner */}
              {otpNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="flex-1">{otpNotice}</span>
                </div>
              )}
              {otpError && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <span className="flex-1">{otpError}</span>
                </div>
              )}

              {/* Admin Email Target */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Admin Gmail Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="shabahatvardha@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  The 6-digit OTP verification code will be sent to this registered Gmail address.
                </p>
              </div>

              {/* STEP 1: Dispatch OTP */}
              {otpStep === 'send' && (
                <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                      <Send size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Request Security Verification Code</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Click below to receive a 6-digit verification code directly in your Gmail inbox. This lets you set a new password without needing your previous password.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || otpCooldown > 0}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-neon-purple hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Dispatching Code to Gmail...</span>
                      </>
                    ) : otpCooldown > 0 ? (
                      <>
                        <Clock size={14} />
                        <span>Resend Available in {otpCooldown}s</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send 6-Digit OTP to Gmail</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2: Enter OTP & Create New Password */}
              {otpStep === 'enter' && (
                <form onSubmit={handleResetViaOtp} className="space-y-4 pt-2">
                  {/* OTP Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Enter 6-Digit Code <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || otpCooldown > 0}
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend Code'}
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-purple-500/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-base font-mono tracking-[6px] text-white placeholder-slate-600 transition-all outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Check your Gmail inbox for the 6-digit code. Valid for 5 minutes.
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        New Password <span className="text-rose-400">*</span>
                      </label>
                      {newPassword && (
                        <span className={`text-[11px] font-bold ${strength.text}`}>
                          Strength: {strength.label}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new secure password"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength visualizer */}
                    {newPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                          <div className={`rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-white/10'}`} />
                          <div className={`rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-white/10'}`} />
                          <div className={`rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-white/10'}`} />
                          <div className={`rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-white/10'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Confirm New Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type your new password"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Match feedback */}
                    {isMatch && (
                      <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                        <CheckCircle2 size={13} /> Passwords match.
                      </p>
                    )}
                    {isMismatch && (
                      <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        <XCircle size={13} /> Passwords do not match.
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isResettingViaOtp || otpCode.length !== 6 || !newPassword || newPassword !== confirmPassword}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-neon-purple hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResettingViaOtp ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Verifying &amp; Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Verify OTP &amp; Save New Password</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('send');
                        setOtpCode('');
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer py-2 px-3"
                    >
                      <ArrowLeft size={13} /> Change Email / Start Over
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: CURRENT PASSWORD FLOW (ORIGINAL CODEBASE - 100% PRESERVED)         */}
          {/* ========================================================================= */}
          {authMode === 'password' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
              {/* Admin Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="shabahatvardha@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  This is the primary login email used to access the admin dashboard.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10" />

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Current Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your existing password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required to verify identity before saving any updates.
                </p>
              </div>

              {/* New Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    New Password
                  </label>
                  {newPassword && (
                    <span className={`text-[11px] font-bold ${strength.text}`}>
                      Strength: {strength.label}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength Visualizer */}
                {newPassword && (
                  <div className="mt-2.5 space-y-2">
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                      <div className={`rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-white/10'}`} />
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                      <span className={newPassword.length >= 6 ? 'text-emerald-400 font-semibold' : ''}>
                        ✓ 6+ chars
                      </span>
                      <span>•</span>
                      <span className={/[0-9]/.test(newPassword) ? 'text-emerald-400 font-semibold' : ''}>
                        ✓ Number
                      </span>
                      <span>•</span>
                      <span className={/[A-Z]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-400 font-semibold' : ''}>
                        ✓ Special / Uppercase
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    disabled={!newPassword}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none disabled:opacity-40"
                  />
                  <button
                    type="button"
                    disabled={!newPassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer disabled:opacity-40"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Match Feedback */}
                {isMatch && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} /> Passwords match perfectly.
                  </p>
                )}
                {isMismatch && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                    <XCircle size={13} /> Passwords do not match.
                  </p>
                )}
              </div>

              {/* Save Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-neon-purple hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Saving Updates...</span>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Save Password &amp; Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Col: Info, Status & Factory Reset */}
        <div className="space-y-5">
          {/* Account Overview Box */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-black/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert size={15} className="text-neon-purple" />
              Security Overview
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Current Login:</span>
                <span className="text-white font-mono font-semibold truncate max-w-[170px]" title={adminEmail}>
                  {adminEmail}
                </span>
              </div>

              {lastUpdated && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar size={13} /> Updated:
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    {new Date(lastUpdated).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Security Tips */}
          <div className="p-4 rounded-2xl border border-white/10 bg-purple-950/20 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles size={14} /> Security Recommendations
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Use a password with a minimum of 8 characters.</li>
              <li>Include numbers and special symbols for stronger protection.</li>
              <li>Keep your password private and do not share admin access.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
