import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { cn } from '../utils/cn';
import LogoIcon from './LogoIcon';
import LogoText from './LogoText';
import Button from './Button';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { logout, currentUser, userProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

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
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-card/75 backdrop-blur-xl border-r border-border/40 transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/40 relative">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <LogoIcon className="w-8 h-8 shrink-0 animate-pulse" />
          {!isCollapsed && (
            <LogoText className="text-xl tracking-tight transition-opacity duration-300 font-bold" />
          )}
        </Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-md hover:border-primary/50 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              isActive 
                ? "bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20" 
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:scale-105 duration-200",
              "group-hover:text-primary"
            )} />
            {!isCollapsed && (
              <span className="transition-opacity duration-200">{item.label}</span>
            )}
            
            {/* Hover Tooltip when collapsed */}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-popover text-popover-foreground text-xs py-1.5 px-3 rounded-lg border border-border shadow-lg font-normal z-50 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border/40 space-y-3 bg-muted/20">
        {/* Theme switch */}
        <div className={cn(
          "flex items-center rounded-xl p-1 bg-muted/60",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {isCollapsed ? (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          ) : (
            <>
              <button 
                onClick={() => setTheme('light')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                  theme === 'light' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                  theme === 'dark' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </>
          )}
        </div>

        {/* User Card */}
        {currentUser && (
          <div className={cn(
            "flex items-center gap-3 rounded-xl transition-all duration-300",
            isCollapsed ? "justify-center p-1" : "p-2 hover:bg-muted/40"
          )}>
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/10">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">{userProfile?.name || 'FinTracker User'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            )}
            
            {!isCollapsed && (
              <button 
                onClick={handleLogout}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {isCollapsed && currentUser && (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
