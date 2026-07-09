import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Button from './Button';
import Input from './Input';
import { Wallet, Sparkles } from 'lucide-react';

export default function SalaryPrompt() {
    const { currentUser, userProfile } = useAuth();
    const { transactions } = useTransactions();
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userProfile || !transactions) return;

        const hasSalary = transactions.some(t => t.type === 'income' && t.category === 'Salary');

        if (!hasSalary) {
            setIsOpen(true);

            if (userProfile.monthlyIncome) {
                setAmount(userProfile.monthlyIncome.toString());
            }
        } else {
            setIsOpen(false);
        }
    }, [userProfile, transactions]);

    const handleConfirm = async () => {
        if (!amount || !currentUser) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
                type: 'income',
                amount: parseFloat(amount),
                category: 'Salary',
                date: new Date(),
                note: 'Monthly Salary',
                createdAt: serverTimestamp()
            });

            if (parseFloat(amount) !== parseFloat(userProfile.monthlyIncome)) {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    monthlyIncome: parseFloat(amount)
                });
            }

            setIsOpen(false);
        } catch (error) {
            console.error("Error adding salary:", error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border/40 shadow-2xl space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
                
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary shrink-0">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                            New Cycle Started! <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Record your paycheck income for this budget window.
                        </p>
                    </div>
                </div>

                <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-muted-foreground">Income Amount</label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-xs text-muted-foreground font-bold">
                            {userProfile?.currency || '₹'}
                        </span>
                        <Input
                            type="number"
                            className="pl-8 h-11 text-sm font-bold"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="h-9 text-xs rounded-xl border-border/60 hover:bg-muted/40">
                        Skip
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading || !amount} className="h-9 text-xs rounded-xl font-bold">
                        {loading ? 'Confirming...' : 'Confirm Income'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
