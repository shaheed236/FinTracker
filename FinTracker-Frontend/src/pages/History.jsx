import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { format, isSameMonth } from 'date-fns';
import { Calendar as CalendarIcon, ArrowDownLeft, ArrowUpRight, Search, Download, Pencil, Trash2, SlidersHorizontal } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import AddTransactionModal from '../components/AddTransactionModal';

export default function History() {
    const { transactions, loading, deleteTransaction, updateTransaction, addTransaction } = useTransactions();
    const { userProfile } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const currencySymbol = userProfile?.currency || '₹';

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesMonth = isSameMonth(new Date(t.date), new Date(selectedMonth));
            const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.note?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesMonth && matchesSearch && matchesType;
        });
    }, [transactions, selectedMonth, searchTerm, filterType]);

    const stats = useMemo(() => {
        return filteredTransactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            if (curr.type === 'income') {
                acc.income += amount;
            } else {
                acc.expense += amount;
            }
            return acc;
        }, { income: 0, expense: 0 });
    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-xs text-muted-foreground animate-pulse">Loading transaction logs...</p>
            </div>
        );
    }

    const handleExport = () => {
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                format(t.date, 'yyyy-MM-dd'),
                t.type,
                t.category,
                t.amount,
                `"${t.note || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `FinTracker_transactions_${selectedMonth}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
            
            {/* Header controls section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Ledger Logs</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Browse, filter and export your transaction history
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" onClick={handleExport} className="gap-2 h-10 text-xs rounded-xl border-border/60 hover:bg-muted/40">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </Button>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="flex h-10 rounded-xl border border-border/80 bg-background/35 pl-9 pr-4 py-2 text-xs shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer text-foreground"
                        />
                    </div>
                </div>
            </div>

            {/* Income/Expense summary badges cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-card p-5 rounded-2xl border border-border/40 shadow-sm flex items-center justify-between transition-all hover:border-emerald-500/20">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Income (Selected Month)</p>
                        <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">
                            +{currencySymbol}{stats.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 shrink-0">
                        <ArrowDownLeft className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border/40 shadow-sm flex items-center justify-between transition-all hover:border-red-500/20">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Expenses (Selected Month)</p>
                        <h3 className="text-2xl font-extrabold text-red-500 mt-1">
                            -{currencySymbol}{stats.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-red-500 shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Logs controller filter card */}
            <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/40 flex flex-col sm:flex-row gap-3 bg-muted/20">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search category, notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 text-xs"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="relative flex items-center">
                            <SlidersHorizontal className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="h-10 pl-9 pr-8 rounded-xl border border-border/80 bg-background/35 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground cursor-pointer appearance-none min-w-[120px]"
                            >
                                <option value="all">All Logs</option>
                                <option value="income">Incomes</option>
                                <option value="expense">Expenses</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground text-xs leading-normal">
                        No transactions registered matching the active filters.
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`p-2.5 rounded-xl shrink-0 ${
                                        transaction.type === 'income'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                        {transaction.type === 'income' ? <ArrowDownLeft className="w-4.5 h-4.5" /> : <ArrowUpRight className="w-4.5 h-4.5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{transaction.category}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {format(transaction.date, 'MMM dd, yyyy')} • <span className="italic">{transaction.note || 'No note attached'}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <div className={`text-sm font-extrabold ${
                                        transaction.type === 'income'
                                            ? 'text-emerald-500'
                                            : 'text-red-500'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{parseFloat(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this transaction?')) {
                                                    deleteTransaction(transaction.id);
                                                }
                                            }}
                                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={addTransaction}
                onUpdate={updateTransaction}
                initialData={editingTransaction}
            />
        </div>
    );
}
