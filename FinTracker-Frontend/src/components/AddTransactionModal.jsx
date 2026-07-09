import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, DollarSign, Tag, Calendar, PencilLine } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export default function AddTransactionModal({ isOpen, onClose, onAdd, onUpdate, initialData }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type,
                amount: initialData.amount,
                category: initialData.category,
                note: initialData.note || '',
                date: initialData.date instanceof Date
                    ? initialData.date.toISOString().split('T')[0]
                    : new Date(initialData.date).toISOString().split('T')[0]
            });
        } else {
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                note: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await onUpdate(initialData.id, formData);
            } else {
                await onAdd(formData);
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-card border border-border/40 rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/40">
                    <h2 className="text-sm font-extrabold text-foreground">{initialData ? 'Edit Transaction' : 'Record Transaction'}</h2>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Toggle tab select */}
                    <div className="flex gap-2 p-1 bg-muted/40 rounded-xl border border-border/30">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border ${
                                formData.type === 'income'
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25 shadow-sm font-extrabold'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent'
                            }`}
                            onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
                        >
                            <ArrowDownLeft className="w-3.5 h-3.5" /> Income
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 border ${
                                formData.type === 'expense'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/25 shadow-sm font-extrabold'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent'
                            }`}
                            onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                        >
                            <ArrowUpRight className="w-3.5 h-3.5" /> Expense
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" /> Amount
                        </label>
                        <Input
                            type="number"
                            required
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="h-10 text-sm font-semibold"
                        />
                    </div>

                    {/* Category Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" /> Category
                        </label>
                        <Input
                            required
                            placeholder="e.g. Food, Rent, Entertainment"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="h-10 text-xs"
                        />
                    </div>

                    {/* Date Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Date
                        </label>
                        <Input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="h-10 text-xs text-foreground cursor-pointer"
                        />
                    </div>

                    {/* Note Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <PencilLine className="w-3.5 h-3.5" /> Note (Optional)
                        </label>
                        <Input
                            placeholder="e.g. Weekly grocery shopping"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="h-10 text-xs"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-3 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1 h-10 text-xs rounded-xl" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-10 text-xs rounded-xl font-bold">
                            {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Save Changes' : 'Confirm Entry')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
