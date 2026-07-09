import React, { useState, useEffect, useRef } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { getChatResponse } from '../utils/groq';
import { Sparkles, Send, Bot, User as UserIcon, Trash2, BrainCircuit, Lightbulb, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import { cn } from '../utils/cn';

// Simple markdown components for better formatting
const MarkdownText = ({ text }) => {
    const lines = text.split('\n');
    return (
        <div className="space-y-3.5 text-sm">
            {lines.map((line, i) => {
                // Table detection (very basic)
                if (line.includes('|') && line.includes('---')) return null; // skip divider
                if (line.startsWith('|')) {
                    const cells = line.split('|').filter(c => c.trim().length > 0);
                    return (
                        <div key={i} className="flex gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                            {cells.map((cell, ci) => (
                                <div key={ci} className="bg-muted/80 px-3 py-1 rounded-lg text-xs whitespace-nowrap border border-border/30">
                                    {cell.trim()}
                                </div>
                            ))}
                        </div>
                    );
                }

                // Headers
                if (line.startsWith('###')) return <h3 key={i} className="text-sm font-bold text-primary mt-3">{line.replace('###', '').trim()}</h3>;
                if (line.startsWith('##')) return <h2 key={i} className="text-base font-bold text-foreground mt-5 border-b border-border/40 pb-1">{line.replace('##', '').trim()}</h2>;
                if (line.startsWith('#')) return <h1 key={i} className="text-lg font-bold text-foreground mt-6">{line.replace('#', '').trim()}</h1>;

                // Lists
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return (
                        <div key={i} className="flex items-start gap-2 ml-1 text-xs md:text-sm">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-muted-foreground">{line.trim().substring(2)}</span>
                        </div>
                    );
                }

                // Numbered Lists
                if (/^\d+\./.test(line.trim())) {
                    const num = line.match(/^\d+\./)[0];
                    return (
                        <div key={i} className="flex items-start gap-2 ml-1 text-xs md:text-sm">
                            <span className="font-bold text-primary shrink-0">{num}</span>
                            <span className="text-muted-foreground">{line.trim().substring(num.length).trim()}</span>
                        </div>
                    );
                }

                // Bold text
                if (line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/);
                    return (
                        <p key={i} className="text-muted-foreground leading-relaxed text-xs md:text-sm">
                            {parts.map((part, pi) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={pi} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                }

                if (line.trim().length === 0) return null;

                return <p key={i} className="text-muted-foreground leading-relaxed text-xs md:text-sm">{line}</p>;
            })}
        </div>
    );
};

export default function AIInsights() {
    const { userProfile } = useAuth();
    const { transactions, loading: txLoading } = useTransactions();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const initialSummarySent = useRef(false);

    useEffect(() => {
        if (!txLoading && transactions.length > 0 && messages.length === 0 && !initialSummarySent.current) {
            initialSummarySent.current = true;
            handleSend("Provide a comprehensive financial summary and actionable insights based on my data.");
        }
    }, [txLoading, transactions]);

    const handleSend = async (text = input) => {
        const messageText = text.trim();
        if (!messageText) return;

        if (transactions.length === 0) {
            setError("No transactions registered. Add some movements to enable AI analytics.");
            return;
        }

        const newMessages = [...messages, { role: 'user', content: messageText }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await getChatResponse(newMessages, transactions, userProfile);
            setMessages([...newMessages, { role: 'assistant', content: response }]);
        } catch (err) {
            setError(err.message || "Failed to request response. Check API key configuration.");
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Are you sure you want to clear the conversation?")) {
            setMessages([]);
            initialSummarySent.current = false;
        }
    };

    const suggestedQuestions = [
        { label: "Analyze my food spending", icon: TrendingDown },
        { label: "How can I save 10% next month?", icon: Lightbulb },
        { label: "Predict my end-of-month balance", icon: DollarSign },
        { label: "Summarize my recurring expenses", icon: RefreshCw }
    ];

    if (txLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-xs text-muted-foreground animate-pulse">Accessing advisor logs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Advisor Header */}
            <div className="flex items-center justify-between shrink-0 px-2 select-none">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 text-primary shrink-0 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-foreground">
                            FinTracker AI Advisor
                        </h1>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Automated capital intelligence queries
                        </p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearChat}
                    className="text-xs text-muted-foreground hover:text-destructive h-9 rounded-xl"
                >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Reset Chat
                </Button>
            </div>

            {/* Conversation Grid scroll panel */}
            <div className="flex-1 overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-4 md:p-6 shadow-inner relative group custom-scrollbar">
                {messages.length === 0 && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 select-none opacity-80 animate-in fade-in duration-500">
                        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                            <BrainCircuit className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground">Inquire advisor about capital balances</h3>
                            <p className="max-w-xs text-xs text-muted-foreground leading-normal">Formulate queries regarding active cycle margins, expense reductions or category insights.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md mt-6">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q.label)}
                                    className="flex items-center gap-3 p-3 bg-card hover:bg-muted/60 border border-border/40 rounded-xl text-xs transition-all text-left group font-semibold shadow-sm text-foreground"
                                >
                                    <q.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "flex gap-3 max-w-[85%] animate-in fade-in zoom-in-95 duration-200",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs border",
                                    msg.role === 'user' 
                                        ? "bg-primary text-primary-foreground border-primary/20" 
                                        : "bg-muted text-muted-foreground border-border/40"
                                )}>
                                    {msg.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm border",
                                    msg.role === 'user' 
                                        ? "bg-primary/10 border-primary/25 rounded-tr-none" 
                                        : "bg-card/90 border-border/40 rounded-tl-none backdrop-blur-sm"
                                )}>
                                    <MarkdownText text={msg.content} />
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="flex gap-3 max-w-[85%] animate-pulse">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border/40">
                                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                                <div className="p-4 rounded-2xl rounded-tl-none bg-card/90 border border-border/40 flex flex-col items-center justify-center min-w-[200px] backdrop-blur-sm">
                                    <div className="w-24 h-24 relative flex items-center justify-center animate-pulse-ring">
                                        <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl" />
                                        <BrainCircuit className="w-12 h-12 text-sky-500 relative z-10 animate-float" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-semibold mt-1">Analyzing ledger values...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {error ? (
                <div className="bg-destructive/10 border border-destructive/25 rounded-xl p-3.5 flex flex-col gap-2 animate-in fade-in select-none">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-destructive" />
                        <p className="text-xs font-semibold text-destructive">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-xs font-bold hover:underline">Dismiss</button>
                    </div>
                </div>
            ) : null}

            {/* Form messaging bar */}
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="shrink-0 p-1.5 bg-card/65 backdrop-blur-md border border-border/40 rounded-2xl flex gap-2 items-center shadow-md focus-within:ring-2 focus-within:ring-primary/20 transition-all select-none"
            >
                <input 
                    type="text" 
                    placeholder="Formulate ledger queries (e.g. how is my balance?)..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-2 text-xs placeholder:text-muted-foreground text-foreground"
                />
                <Button 
                    type="submit" 
                    size="sm" 
                    disabled={loading || !input.trim()}
                    className="rounded-xl gap-1.5 h-9 px-4 text-xs"
                >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                </Button>
            </form>
        </div>
    );
}
