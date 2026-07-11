import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PieChart, Shield, Sparkles, Zap, Lock, WalletCards, LineChart, DollarSign, Activity, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogoText from '../components/LogoText';
import LogoIcon from '../components/LogoIcon';

export default function Landing() {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden relative">
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 md:py-32 flex flex-col md:flex-row items-center gap-12 text-center md:text-left relative z-10">
                <div className="flex-1 space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                        <Sparkles className="w-3.5 h-3.5" /> Introducing FinTracker Workspace
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
                        Financial Freedom, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 drop-shadow-sm">Reimagined.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
                        Experience the next generation of personal capital management with <LogoText />. Smart real-time tracking, custom salary cycles, and intelligent AI insights built for creators.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                        <Link to={currentUser ? "/dashboard" : "/signup"}>
                            <Button size="lg" className="h-12 px-8 text-sm gap-2 shadow-xl shadow-primary/25 rounded-full w-full sm:w-auto">
                                {currentUser ? "Go to Workspace" : "Start Free Journey"} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        {!currentUser && (
                          <Link to="/login">
                              <Button variant="outline" size="lg" className="h-12 px-8 text-sm rounded-full w-full sm:w-auto border-border/80 hover:bg-muted/40">
                                  Sign In
                              </Button>
                          </Link>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-muted-foreground pt-4 justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Free Forever
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Bank-Grade Security
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> AI-Powered Insights
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-md md:max-w-xl relative flex justify-center items-center h-[350px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 rounded-full blur-3xl -z-10 animate-pulse-ring" />
                    <div className="relative z-10 animate-float flex items-center justify-center">
                        <div className="w-48 h-48 bg-card border border-border/50 rounded-full shadow-2xl flex items-center justify-center relative">
                            <WalletCards className="w-20 h-20 text-emerald-500 drop-shadow-xl" strokeWidth={1.5} />
                            <div className="absolute -top-4 -right-4 p-4 bg-background border border-border/50 rounded-2xl shadow-lg animate-bounce">
                                <LineChart className="w-8 h-8 text-sky-500" strokeWidth={2} />
                            </div>
                            <div className="absolute -bottom-2 -left-4 p-3 bg-background border border-border/50 rounded-2xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                                <DollarSign className="w-6 h-6 text-emerald-400" strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features section */}
            <section className="bg-muted/30 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
                            Why Choose <LogoText />?
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            We've built a sleek analytics board to fit your real paycheck lifestyle, keeping your balances accurate.
                        </p>
                    </div>

                    {/* Feature 1 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
                        <div className="order-2 md:order-1 glass-panel p-6 rounded-3xl border border-border/30 shadow-2xl relative group overflow-hidden flex items-center justify-center min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                                <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full animate-pulse-ring" />
                                <PieChart className="w-32 h-32 text-sky-500 relative z-10 drop-shadow-lg" strokeWidth={1.2} />
                                <div className="absolute -right-8 -top-4 p-4 bg-card rounded-full shadow-lg border border-border/40">
                                   <Activity className="w-8 h-8 text-emerald-400" />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-500">
                                    <PieChart className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Crystal Clear Analytics</h3>
                            </div>
                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                Visualize your capital structure with interactive charts. Our ledger engine delivers details on where your expenses flow, helping you curb spend patterns.
                            </p>
                            <ul className="space-y-3.5 text-sm font-medium text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/50" />
                                    Monthly spending breakdown by category
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/50" />
                                    Dynamic trend overlays
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/50" />
                                    Income vs Expense cash flow rates
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-500">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Salary Cycles That Align</h3>
                            </div>
                            <p className="text-muted-foreground text-base leading-relaxed font-light">
                                Most apps assume your cycle starts on the 1st. We don't. <LogoText /> maps to your custom salary date, calculating active balances dynamically.
                            </p>
                            <ul className="space-y-3.5 text-sm font-medium text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
                                    Fully customizable paycheck boundaries
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
                                    Automated cycle balance updates
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50" />
                                    Integrated cycle history logs
                                </li>
                            </ul>
                        </div>
                        <div className="glass-panel p-6 rounded-3xl border border-border/30 shadow-2xl relative group overflow-hidden flex items-center justify-center min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center animate-float" style={{ animationDelay: '1.2s' }}>
                                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse-ring" />
                                <TrendingUp className="w-32 h-32 text-emerald-500 relative z-10 drop-shadow-lg" strokeWidth={1.2} />
                                <div className="absolute -left-6 bottom-0 p-4 bg-card rounded-2xl shadow-lg border border-border/40">
                                   <Sparkles className="w-8 h-8 text-sky-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
