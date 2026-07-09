import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertCircle, ArrowLeft, CheckCircle2, Sparkles, Shield, Lock, Users } from 'lucide-react';
import LogoText from '../components/LogoText';
import LogoIcon from '../components/LogoIcon';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const { signup, loginWithGoogle: signupWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !showSuccess) {
      handleSuccess();
    }
  }, [currentUser]);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      navigate('/onboarding');
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
        isOnboarded: false
      });

      handleSuccess();

    } catch (err) {
      setError('Failed to create an account: ' + err.message);
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    setCountdown(5);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in zoom-in duration-300 border border-border/60">
          <div className="w-32 h-32 mx-auto relative flex items-center justify-center animate-pulse-ring">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
            <CheckCircle2 className="w-24 h-24 text-emerald-500 drop-shadow-xl relative z-10 animate-draw-chart" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Account Created!</h2>
          <p className="text-muted-foreground text-base">
            Welcome to the <LogoText /> family.
          </p>
          <div className="text-xs font-semibold text-muted-foreground bg-muted/60 py-2.5 px-5 rounded-full inline-block">
            Redirecting in <span className="text-primary font-bold text-sm">{countdown}</span> seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex select-none">
      
      {/* Left side: Signup Marketing & Social Proof */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/20 relative items-center justify-center p-12 overflow-hidden border-r border-border/30 order-last">
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/10 to-cyan-500/10" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          {/* Header */}
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 animate-pulse" />
            <LogoText className="text-3xl font-bold" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Join the future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">personal capital.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Create an account in less than a minute. Secure firestore storage, customizable budgets, and AI reports are waiting for you.
            </p>
          </div>

          {/* Core features indicators list */}
          <div className="space-y-4 max-w-md pt-4">
            <div className="flex items-start gap-3 p-3 bg-card/65 rounded-xl border border-border/30 shadow-md">
              <Shield className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Secure & Private Data</h4>
                <p className="text-xs text-muted-foreground">Every ledger activity is isolated and encrypted using Firestore rules.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card/65 rounded-xl border border-border/30 shadow-md">
              <Sparkles className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-foreground">AI Powered Financial Insights</h4>
                <p className="text-xs text-muted-foreground">Automated advisor queries analyze and highlight saving patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Signup Forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary mb-6 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline transition-colors">
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/25 text-destructive text-xs p-3.5 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="FinTracker User"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-4 pt-2">
              <Button type="submit" className="w-full text-sm h-11" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or signup with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 gap-2 text-xs"
                onClick={async () => {
                  setError('');
                  const loginPromise = signupWithGoogle();
                  setLoading(true);
                  try {
                    await loginPromise;
                    handleSuccess();
                  } catch (err) {
                    setError('Failed to sign up with Google: ' + err.message);
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}