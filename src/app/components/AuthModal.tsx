import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Compass, 
  LogOut,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  firebaseAuthService, 
  type UserProfile 
} from '../services/firebaseAuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  initialMode?: 'signin' | 'signup' | 'forgot';
  onAuthSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  initialMode = 'signin',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Subscribe to auth state
  useEffect(() => {
    const unsub = firebaseAuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg(isHindi ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const res = await firebaseAuthService.loginWithEmail(email, password);
    setLoading(false);

    if (res.success && res.user) {
      toast.success(
        isHindi 
          ? `नमस्ते, ${res.user.displayName || 'यात्री'}! सफलतापूर्वक साइन इन हुआ।`
          : `Welcome back, ${res.user.displayName || 'Traveler'}!`
      );
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error || (isHindi ? 'साइन इन असफल रहा।' : 'Sign-in failed. Please try again.'));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password || !fullName) {
      setErrorMsg(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(isHindi ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await firebaseAuthService.registerWithEmail(email, password, fullName, phoneNumber);
    setLoading(false);

    if (res.success && res.user) {
      toast.success(
        isHindi 
          ? `स्वागत है ${res.user.displayName}! आपका दर्शन 360 खाता बन गया है।`
          : `Account created successfully! Welcome to Darshan 360, ${res.user.displayName}.`
      );
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error || (isHindi ? 'पंजीकरण असफल रहा।' : 'Registration failed.'));
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await firebaseAuthService.loginWithGoogle();
    setLoading(false);

    if (res.success && res.user) {
      toast.success(
        isHindi 
          ? `गूगल द्वारा साइन इन हुआ: ${res.user.displayName}`
          : `Google Sign-In successful: ${res.user.displayName}`
      );
      if (onAuthSuccess) onAuthSuccess(res.user);
      onClose();
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg(isHindi ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your registered email address.');
      return;
    }

    setLoading(true);
    const res = await firebaseAuthService.sendPasswordReset(email);
    setLoading(false);

    if (res.success) {
      toast.success(
        isHindi 
          ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है!'
          : 'Password reset link sent to your email!'
      );
      setMode('signin');
    } else {
      setErrorMsg(res.error || 'Failed to dispatch reset email.');
    }
  };

  const handleGuestLogin = () => {
    const guestUser = firebaseAuthService.loginAsGuest(
      isHindi ? 'श्रद्धालु अतिथि' : 'Sacred Yatri'
    );
    toast.info(
      isHindi 
        ? 'अतिथि यात्री के रूप में प्रवेश किया गया!' 
        : 'Logged in with Guest Yatri Pass!'
    );
    if (onAuthSuccess) onAuthSuccess(guestUser);
    onClose();
  };

  const handleSignOut = async () => {
    await firebaseAuthService.signOut();
    toast.info(isHindi ? 'आप सफलतापूर्वक साइन आउट हो गए।' : 'Signed out successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Mobile Sheet Container */}
      <div 
        className="relative w-full sm:max-w-md bg-[var(--bg-primary,#ffffff)] dark:bg-stone-900 border border-amber-500/20 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col transition-all duration-300"
        style={{
          boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 0 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-3 mb-1" />

        {/* Header with Brand & Close Button */}
        <div className="relative px-6 pt-4 pb-4 border-b border-amber-500/15 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Darshan 360
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Firebase
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isHindi ? 'सुरक्षित यात्रा एवं तीर्थ ऑथेंटिकेशन' : 'Sacred Travel & Heritage Authentication'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-100px)]">
          {/* If already signed in, show profile card */}
          {currentUser && (
            <div className="space-y-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-800/80 dark:to-stone-800/40 border border-amber-500/20">
              <div className="flex items-center gap-3.5">
                <img
                  src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.displayName || 'Yatri')}`}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                      {currentUser.displayName || 'Sacred Yatri'}
                    </h3>
                    {currentUser.isAnonymous && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                        Guest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    {currentUser.email || 'Temporary Pilgrim Session'}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    {isHindi ? 'सक्रिय एवं सुरक्षित सत्र' : 'Active Authenticated Session'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {isHindi ? 'साइन आउट' : 'Sign Out'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isHindi ? 'जारी रखें' : 'Continue to App'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Mode Switch Tabs */}
          {!currentUser && (
            <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {isHindi ? 'साइन इन' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {isHindi ? 'नया खाता बनाएं' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google 1-Tap OAuth Button */}
          {!currentUser && (
            <div className="space-y-3 mb-6">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isHindi ? 'गूगल के साथ जारी रखें' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
                <span className="bg-[var(--bg-primary,#ffffff)] dark:bg-stone-900 px-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  {isHindi ? 'या ईमेल से' : 'or with email'}
                </span>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && !currentUser && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yatri@darshan360.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {isHindi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(null); }}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    {isHindi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.99] transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isHindi ? 'साइन इन करें' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && !currentUser && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isHindi ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yatri@darshan360.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isHindi ? 'मोबाइल नंबर (ऐच्छिक)' : 'Mobile Number (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isHindi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isHindi ? 'पुष्टि करें' : 'Confirm'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.99] transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>{isHindi ? 'खाता बनाएं एवं शुरू करें' : 'Create Sacred Account'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Forgot Password View */}
          {mode === 'forgot' && !currentUser && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {isHindi ? 'पासवर्ड रीसेट करें' : 'Reset your Password'}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {isHindi 
                    ? 'अपना पंजीकृत ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने के लिए एक सुरक्षित लिंक भेजेंगे।' 
                    : 'Enter your email address and we will dispatch a secure link to reset your password.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yatri@darshan360.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400 transition"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  {isHindi ? 'वापस' : 'Back to Login'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Sending...' : (isHindi ? 'लिंक भेजें' : 'Send Reset Link')}
                </button>
              </div>
            </form>
          )}

          {/* Quick 1-Click Guest Access Option */}
          {!currentUser && (
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>{isHindi ? 'बिना खाते के देखना चाहते हैं?' : 'Want to explore first?'}</span>
                <span className="font-bold underline decoration-amber-500/40 group-hover:decoration-amber-500">
                  {isHindi ? 'अतिथि पास से प्रवेश करें' : 'Continue as Guest Yatri'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Security & Mission Shakti Trust Badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-stone-400 dark:text-stone-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>
              {isHindi 
                ? '256-बिट फायरबेस एन्क्रिप्शन • मिशन शक्ति 1090 द्वारा सुरक्षित' 
                : '256-Bit Firebase Encryption • Mission Shakti 1090 Protected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
