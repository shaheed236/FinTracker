import React, { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#38bdf8', '#8b5cf6', '#14b8a6', '#818cf8'];

export default function Analytics() {
    const { transactions, loading } = useTransactions();
    const { userProfile } = useAuth();
    
    const currencySymbol = userProfile?.currency || '₹';

    const categoryData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const categories = expenses.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            acc[curr.category] = (acc[curr.category] || 0) + amount;
            return acc;
        }, {});

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    const trendData = useMemo(() => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dayTransactions = transactions.filter(t =>
                isSameDay(new Date(t.date), day) && t.type === 'expense'
            );
            const total = dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
            return {
                date: format(day, 'dd MMM'),
                amount: total
            };
        }).filter(d => d.amount > 0 || true);
    }, [transactions]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-xs text-muted-foreground animate-pulse">Analyzing spendings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Capital Analytics</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Interactive visualizations mapping your cash flow movements.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Category Pie Chart Card */}
                <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden group">
                    <h3 className="text-base font-bold tracking-tight mb-6">Expense distribution by Category</h3>
                    
                    <div className="h-[300px] w-full">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(18, 18, 21, 0.85)', 
                                            backdropFilter: 'blur(12px)',
                                            borderColor: 'rgba(255, 255, 255, 0.08)', 
                                            borderRadius: '12px',
                                            color: '#e2e8f0',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Legend 
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs text-muted-foreground font-semibold">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                                No registered cycle expense data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Spending Trend Bar Chart Card */}
                <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden group">
                    <h3 className="text-base font-bold tracking-tight mb-6">Daily cycle spending trend</h3>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: '500' }}
                                    interval={4}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: '500' }}
                                    tickFormatter={(value) => `${currencySymbol}${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(18, 18, 21, 0.85)', 
                                        backdropFilter: 'blur(12px)',
                                        borderColor: 'rgba(255, 255, 255, 0.08)', 
                                        borderRadius: '12px',
                                        color: '#e2e8f0',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}
                                    formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Spent']}
                                />
                                <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
