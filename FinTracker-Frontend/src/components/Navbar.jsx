import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  History,
  PieChart,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Search,
  Bell,
  Plus,
  Compass,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { cn } from '../utils/cn';
import Button from './Button';
import LogoText from './LogoText';
import LogoIcon from './LogoIcon';

export default function Navbar({ onMobileMenuToggle }) {
  const { logout, currentUser, userProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: Sparkles, label: 'AI Insights', path: '/ai-insights' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Resolve current page title for the header
  const getPageTitle = () => {
    const item = navItems.find(item => item.path === location.pathname);
    return item ? item.label : 'Overview';
  };

  const isPublicPage = location.pathname === '/';

  // Public Landing Page Navbar
  if (isPublicPage || !currentUser) {
    return (
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50 w-full select-none">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8" />
            <LogoText className="text-xl font-bold" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="default" size="sm" className="gap-2">
                    Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu for Public view */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-4 animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="justify-start gap-3 w-full"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </Button>
              
              {currentUser ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full">Go to Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                  <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }

  // Dashboard / Auth Pages Floating Header
  return (
    <header className="px-4 pt-3 pb-1 select-none z-20 shrink-0">
      <div className="glass-panel rounded-2xl px-4 h-14 flex items-center justify-between shadow-sm relative">
        
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-sm font-semibold text-foreground">{getPageTitle()}</h2>
            <span className="text-[10px] text-muted-foreground">FinTracker Workspace</span>
          </div>
        </div>

        {/* Center: Sleek Search Bar */}
        <div className="hidden sm:flex items-center w-full max-w-xs relative mx-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workspace... (⌘K)"
            disabled
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/40 bg-muted/30 text-xs placeholder:text-muted-foreground focus:outline-none cursor-not-allowed opacity-80"
          />
        </div>

        {/* Right: Quick actions, notifications, user profile */}
        <div className="flex items-center gap-2">
          
          {/* Quick Actions Dropdown */}
          <div className="relative">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="h-9 px-3 gap-1 rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Quick Actions</span>
            </Button>

            {isQuickActionsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsQuickActionsOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-card border border-border/50 shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground border-b border-border/40">
                    Navigate Workspace
                  </div>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsQuickActionsOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-xs text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    Go to Dashboard
                  </Link>
                  <Link 
                    to="/ai-insights" 
                    onClick={() => setIsQuickActionsOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-xs text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Ask AI Advisor
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsQuickActionsOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-xs text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-500" />
                    Update Settings
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="w-9 h-9 relative rounded-xl border border-border/30"
            >
              <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </Button>

            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-card border border-border/50 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40">
                    <span className="text-xs font-semibold">Notifications</span>
                    <span className="text-[10px] text-primary hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="p-2 bg-muted/30 rounded-lg border border-border/30 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-indigo-500 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" /> AI Insight Available
                      </div>
                      <p className="text-muted-foreground leading-snug">"Analyze your food expenses" is ready. Check AI Insights.</p>
                      <span className="text-[9px] text-muted-foreground block text-right">Just now</span>
                    </div>
                    <div className="p-2 bg-muted/10 rounded-lg text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-green-500 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" /> Balance Restored
                      </div>
                      <p className="text-muted-foreground leading-snug">Your monthly salary has been logged. Happy budgeting!</p>
                      <span className="text-[9px] text-muted-foreground block text-right">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User profile avatar info */}
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/10 border border-border/20">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-foreground truncate max-w-[80px]">{userProfile?.name?.split(' ')[0] || 'User'}</span>
              <span className="text-[9px] text-muted-foreground leading-none">Level 1</span>
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
}