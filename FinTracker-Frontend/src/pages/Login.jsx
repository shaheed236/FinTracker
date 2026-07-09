import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertCircle, ArrowLeft, TrendingUp, Sparkles, Shield, Wallet, CheckCircle2 } from 'lucide-react';
import LogoText from '../components/LogoText';
import LogoIcon from '../components/LogoIcon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const { login, loginWithGoogle, currentUser } = useAuth();
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
      navigate('/dashboard');
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);
      const user = userCredential.user;

      const checkOnboardingAndRedirect = async (uid) => {
        try {
          handleSuccess();
        } catch (err) {
          console.error("Error checking onboarding:", err);
          handleSuccess();
        }
      };

      await checkOnboardingAndRedirect(user.uid);

    } catch (err) {
      setError('Failed to log in: ' + err.message);
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
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Access Granted</h2>
          <p className="text-muted-foreground text-base">
            Welcome back to <LogoText />
          </p>
          <div className="text-xs font-semibold text-muted-foreground bg-muted/60 py-2.5 px-5 rounded-full inline-block">
            Entering workspace in <span className="text-primary font-bold text-sm">{countdown}</span> seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex select-none">
      
      {/* Left side: Premium Marketing Snippet & Dashboard Mockup */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/20 relative items-center justify-center p-12 overflow-hidden border-r border-border/30">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          {/* Header */}
          <div className="flex items-center gap-3">
            <LogoIcon className="w-10 h-10 animate-pulse" />
            <LogoText className="text-3xl font-bold" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Sophisticated asset intelligence. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Take command.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Log in to access your personal workspace. View cash flow, track paycheck cycles, and review automated insights.
            </p>
          </div>

          {/* Premium UI Mockup Card */}
          <div className="glass-panel p-6 rounded-2xl border border-border/40 shadow-xl space-y-4 max-w-md">
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-xs font-bold text-muted-foreground">WORKSPACE SNAPSHOT</span>
              <span className="text-[10px] text-green-500 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3 h-3" /> Live Syncing
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground">Total Balance</span>
              <div className="text-2xl font-bold text-foreground">₹2,84,500.00</div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">Budget Consumed (Cycle)</span>
                <span className="font-semibold text-foreground">42%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 w-[42%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary mb-6 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Sign in to FinTracker
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/25 text-destructive text-xs p-3.5 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">
                  Forgot?
                </a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <div className="space-y-4 pt-2">
              <Button type="submit" className="w-full text-sm h-11" disabled={loading}>
                {loading ? 'Verifying...' : 'Sign In'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or connect with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 gap-2 text-xs"
                onClick={async () => {
                  setError('');
                  const loginPromise = loginWithGoogle();
                  setLoading(true);
                  try {
                    await loginPromise;
                    handleSuccess();
                  } catch (err) {
                    setError('Failed to login with Google: ' + err.message);
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
                Sign in with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}