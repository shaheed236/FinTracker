import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  X, 
  LayoutDashboard, 
  History, 
  PieChart, 
  Sparkles, 
  User, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../utils/cn';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LogoIcon from './LogoIcon';
import LogoText from './LogoText';
import Button from './Button';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebar_collapsed") === "true"
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { logout, currentUser, userProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSidebarCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
    localStorage.setItem("sidebar_collapsed", collapsed);
  };

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

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      
      {/* Collapsible Sidebar (Desktop) */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={handleSidebarCollapse} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Floating Top Navbar */}
        <Navbar onMobileMenuToggle={() => setIsMobileDrawerOpen(true)} />

        {/* Dynamic Outlet main page render wrapper */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Slide-over Menu */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-card border-r border-border p-5 shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border/40">
              <Link 
                to="/" 
                className="flex items-center gap-3"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                <LogoIcon className="w-8 h-8" />
                <LogoText className="text-lg font-bold" />
              </Link>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-border/40 space-y-4">
              {currentUser && userProfile?.name && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex-1 justify-center gap-2 h-9 border border-border/30 rounded-xl"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 gap-2 h-9 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
