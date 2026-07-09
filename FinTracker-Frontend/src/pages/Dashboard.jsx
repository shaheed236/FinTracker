import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Pencil, 
  Trash2, 
  PiggyBank, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import AddTransactionModal from '../components/AddTransactionModal';
import { format } from 'date-fns';
import SalaryPrompt from '../components/SalaryPrompt';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const { transactions, totalBalance, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const summary = transactions.reduce((acc, curr) => {
    const amount = parseFloat(curr.amount);
    if (curr.type === 'income') {
      acc.income += amount;
      acc.balance += amount;
    } else {
      acc.expense += amount;
      acc.balance -= amount;
    }
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  const recentTransactions = transactions.slice(0, 5);

  const currencySymbol = userProfile?.currency || '₹';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-xs text-muted-foreground animate-pulse">Syncing transactions...</p>
      </div>
    );
  }

  // Calculate budget statistics
  const monthlyIncome = userProfile?.monthlyIncome || 0;
  const budgetRatio = monthlyIncome > 0 ? (summary.expense / monthlyIncome) * 100 : 0;
  const isBudgetWarning = budgetRatio >= 85;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
      
      {/* Greetings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Greetings, {userProfile?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's the summary of your capital cycle active bounds.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="gap-2 shadow-lg self-start sm:self-auto rounded-xl text-xs h-10 px-4"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Balance Card */}
        <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="flex flex-row items-center justify-between pb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</span>
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/10">
              <Wallet className="h-4.5 w-4.5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-foreground">
            {totalBalance >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(totalBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-medium">
            All-time registered capital accumulation
          </p>
        </div>

        {/* Monthly Income Card */}
        <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex flex-row items-center justify-between pb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Income this month</span>
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/10">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-500">
            +{currencySymbol}{summary.income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-medium">
            Total active earnings inside current cycle
          </p>
        </div>

        {/* Monthly Expenses Card */}
        <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors" />
          <div className="flex flex-row items-center justify-between pb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expenses this month</span>
            <div className="bg-red-500/10 p-2 rounded-xl border border-red-500/10">
              <TrendingDown className="h-4.5 w-4.5 text-red-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-red-500">
            -{currencySymbol}{summary.expense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 font-medium">
            Total registered expenditure inside current cycle
          </p>
        </div>
      </div>

      {/* Budget Progress panel */}
      {monthlyIncome > 0 && (
        <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-bold tracking-tight">Active Cycle Budget Overview</h3>
              <p className="text-[11px] text-muted-foreground">Calculated limit threshold based on registered monthly salary paycheck.</p>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border/30">
              Paycheck: {currencySymbol}{monthlyIncome.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Cycle Budget Consumed</span>
                <span className={isBudgetWarning ? 'text-red-500' : 'text-primary'}>
                  {Math.round(budgetRatio)}% Used
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/20 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${
                    isBudgetWarning 
                      ? 'from-red-500 to-rose-600 shadow-md shadow-red-500/20' 
                      : 'from-primary via-indigo-500 to-cyan-400 shadow-md shadow-primary/20'
                  }`}
                  style={{ width: `${Math.min(budgetRatio, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-2 border-t border-border/20">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiggyBank className="w-4 h-4 text-primary" />
                Remaining cycle budget:
              </div>
              <div className={`text-sm font-extrabold ${(monthlyIncome - summary.expense) < 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                {currencySymbol}{(monthlyIncome - summary.expense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent cycle movements
          </h2>
          <Link to="/history" className="text-xs font-semibold text-primary hover:underline">
            View full history
          </Link>
        </div>

        <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-4">
              <div className="bg-muted p-4 rounded-full border border-border/30">
                <Wallet className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">No movements registered yet</p>
                <p className="text-xs text-muted-foreground">Transactions you log this month will appear here.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="rounded-xl text-xs px-3">
                Log first transaction
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {recentTransactions.map((transaction) => (
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
                      <p className="text-[10px] text-muted-foreground mt-0.5">{format(transaction.date, 'MMM dd, yyyy')}</p>
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
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={addTransaction}
        onUpdate={updateTransaction}
        initialData={editingTransaction}
      />
      <SalaryPrompt />
    </div>
  );
}