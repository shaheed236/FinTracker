import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { Wallet, CheckCircle2, ChevronRight, User, DollarSign, Calendar } from 'lucide-react';

export default function Onboarding() {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        monthlyIncome: '',
        currency: '₹',
        salaryDate: 1
    });

    useEffect(() => {
        if (userProfile?.name) {
            setFormData(prev => ({ ...prev, name: userProfile.name }));
        }
    }, [userProfile]);

    const currencies = [
        { label: 'INR (₹)', value: '₹' },
        { label: 'USD ($)', value: '$' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setLoading(true);
            const userRef = doc(db, 'users', currentUser.uid);

            await setDoc(userRef, {
                name: formData.name,
                monthlyIncome: parseFloat(formData.monthlyIncome),
                currency: formData.currency,
                salaryDate: formData.salaryDate || 1,
                isOnboarded: true,
                photoURL: currentUser.photoURL || '',
                provider: currentUser.providerData[0]?.providerId || 'email',
                updatedAt: serverTimestamp()
            }, { merge: true });

            await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
                type: 'income',
                amount: parseFloat(formData.monthlyIncome),
                category: 'Salary',
                date: new Date(),
                note: 'Initial Salary from Onboarding',
                createdAt: serverTimestamp()
            });

            navigate('/');
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 select-none relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 -z-10" />

            <div className="w-full max-w-lg space-y-6 glass-panel p-8 md:p-10 rounded-3xl border border-border/40 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3.5 rounded-2xl mb-4 border border-primary/20">
                        <Wallet className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome to FinTracker</h2>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Configure your base financial parameters to start mapping your capital growth.
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2.5 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                step >= i 
                                    ? 'bg-gradient-to-r from-primary to-secondary' 
                                    : 'bg-muted'
                            }`}
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: User Name */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" /> What should we call you?
                                </label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your name"
                                    autoFocus
                                    className="h-11"
                                />
                            </div>
                            <Button type="button" className="w-full h-11 text-xs gap-1" onClick={() => setStep(2)} disabled={!formData.name}>
                                Continue <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Currency */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5" /> Select your operating currency
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {currencies.map((curr) => (
                                        <button
                                            key={curr.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, currency: curr.value })}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                formData.currency === curr.value
                                                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                                                    : 'border-border/60 hover:border-primary/40 bg-muted/10'
                                            }`}
                                        >
                                            <span className="text-xs font-bold">{curr.label}</span>
                                            {formData.currency === curr.value && (
                                                <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 text-xs">
                                    Back
                                </Button>
                                <Button type="button" onClick={() => setStep(3)} className="flex-1 h-11 text-xs gap-1">
                                    Continue <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Paycheck Cycle start date */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> When do you receive your salary?
                                </label>
                                <div className="space-y-2">
                                    <Input
                                        required
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.salaryDate}
                                        onChange={(e) => setFormData({ ...formData, salaryDate: Math.max(1, Math.min(31, parseInt(e.target.value) || 1)) })}
                                        placeholder="1"
                                        className="h-11"
                                    />
                                    <p className="text-[10px] text-muted-foreground leading-normal">
                                        Your monthly balance calculation cycle will boundaries around this date (e.g., 25th of one month to 24th of the next).
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 text-xs">
                                    Back
                                </Button>
                                <Button type="button" onClick={() => setStep(4)} className="flex-1 h-11 text-xs gap-1">
                                    Continue <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Paycheck Income */}
                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5" /> What is your monthly income?
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-3.5 text-muted-foreground text-sm font-bold">
                                        {formData.currency}
                                    </span>
                                    <Input
                                        required
                                        type="number"
                                        className="pl-8 h-12 text-base font-bold"
                                        value={formData.monthlyIncome}
                                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-normal">
                                    This amount is registered as your primary monthly cycle income, forming the threshold of your savings calculations.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11 text-xs">
                                    Back
                                </Button>
                                <Button type="submit" disabled={loading || !formData.monthlyIncome} className="flex-1 h-11 text-xs font-semibold">
                                    {loading ? 'Setting up...' : 'Complete Setup'}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
