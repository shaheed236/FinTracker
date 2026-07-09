import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, DollarSign, Wallet, ShieldAlert, KeyRound, AlertTriangle } from 'lucide-react';

export default function Profile() {
    const { currentUser, updateUserPassword, reauthenticate, deleteUserAccount } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        monthlyIncome: '',
        currency: '₹',
        salaryDate: 1
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const isGoogle = currentUser.providerData.some(
                (provider) => provider.providerId === 'google.com'
            );
            setIsGoogleUser(isGoogle);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchProfile() {
            if (!currentUser) return;
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile({
                        name: data.name || '',
                        email: currentUser.email || '',
                        monthlyIncome: data.monthlyIncome || '',
                        currency: data.currency || '₹',
                        salaryDate: data.salaryDate || 1
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
            setInitialLoading(false);
        }

        fetchProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                name: profile.name,
                monthlyIncome: parseFloat(profile.monthlyIncome) || 0,
                currency: profile.currency,
                salaryDate: profile.salaryDate || 1
            });
            setSuccessMessage('Profile details updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setPasswordLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            setPasswordLoading(false);
            return;
        }

        try {
            if (!isGoogleUser) {
                await reauthenticate(passwordData.currentPassword);
            }
            await updateUserPassword(passwordData.newPassword);
            setPasswordSuccess("Password updated successfully");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError("Failed to update password. Check your current password.");
        }
        setPasswordLoading(false);
    };

    const handleDeleteAccount = async () => {
        setDeleteError('');
        setDeleteLoading(true);
        try {
            await deleteUserAccount(deletePassword);
        } catch (error) {
            console.error("Error deleting account:", error);
            setDeleteError("Failed to delete account. Double check credentials.");
            setDeleteLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-xs text-muted-foreground animate-pulse">Accessing account variables...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-16">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Account Configuration</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Customize your profile values, paycheck cycles, and security variables
                </p>
            </div>

            {/* Profile detail card */}
            <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border/40">
                    <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-3.5 rounded-2xl text-white shadow-md shadow-indigo-500/10 shrink-0">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold truncate text-foreground">{profile.name || 'User'}</h2>
                        <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                        {isGoogleUser && (
                            <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2 py-0.5 mt-1.5 text-[10px] font-bold text-primary border border-primary/25">
                                Google Authentication Active
                            </span>
                        )}
                    </div>
                </div>

                {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs p-3.5 rounded-xl animate-in fade-in duration-200">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Full name
                            </label>
                            <Input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Account email
                            </label>
                            <Input
                                value={profile.email}
                                disabled
                                className="bg-muted/30 opacity-60 cursor-not-allowed border-border/30"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5" /> Monthly income cycle threshold
                            </label>
                            <Input
                                type="number"
                                value={profile.monthlyIncome}
                                onChange={(e) => setProfile({ ...profile, monthlyIncome: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5" /> Core currency
                            </label>
                            <div className="relative">
                                <select
                                    className="flex h-10 w-full rounded-xl border border-border/80 bg-background/35 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground cursor-pointer appearance-none"
                                    value={profile.currency}
                                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                                >
                                    <option value="₹">INR (₹)</option>
                                    <option value="$">USD ($)</option>
                                    <option value="€">EUR (€)</option>
                                    <option value="£">GBP (£)</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5" /> Salary Cycle reset date
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max="31"
                            value={profile.salaryDate}
                            onChange={(e) => setProfile({ ...profile, salaryDate: Math.max(1, Math.min(31, parseInt(e.target.value) || 1)) })}
                            placeholder="1"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Calculated budgets will reset automatically on this day.
                        </p>
                    </div>

                    <div className="pt-3 flex justify-end">
                        <Button type="submit" disabled={loading} className="rounded-xl text-xs px-4 h-10">
                            {loading ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Password security update card */}
            <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 text-primary shrink-0">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold">Password & Security</h2>
                            <p className="text-[11px] text-muted-foreground">
                                {isGoogleUser
                                    ? "Assign email credentials to log in without Google"
                                    : "Rotate and update your security credentials"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="text-xs h-9 rounded-xl border-border/60 hover:bg-muted/40"
                    >
                        {showPasswordSection ? 'Collapse' : (isGoogleUser ? 'Set Password' : 'Change Password')}
                    </Button>
                </div>

                {showPasswordSection && (
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 animate-in slide-in-from-top-2 duration-300 border-t border-border/40 pt-5">
                        {passwordError && (
                            <div className="bg-destructive/10 border border-destructive/25 text-destructive text-xs p-3 rounded-xl">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs p-3 rounded-xl">
                                {passwordSuccess}
                            </div>
                        )}

                        {!isGoogleUser && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">New Password</label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Confirm New Password</label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={passwordLoading} className="text-xs h-9 rounded-xl">
                                {passwordLoading ? 'Rotating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Danger Zone Account Deletion */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 text-destructive shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-destructive">Danger Zone</h2>
                            <p className="text-[11px] text-destructive/80">
                                Permanently wipe out your user details and ledger history
                            </p>
                        </div>
                    </div>
                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-xs h-9 rounded-xl"
                        >
                            Delete Account
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteError('');
                                setDeletePassword('');
                            }}
                            className="text-xs h-9 rounded-xl border-border/60 hover:bg-muted/40"
                        >
                            Cancel
                        </Button>
                    )}
                </div>

                {showDeleteConfirm && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 border-t border-destructive/15 pt-5">
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 rounded-xl flex gap-2">
                            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">Critical Alert:</span> This action wipes out transaction databases permanently. Recovering history is impossible.
                            </div>
                        </div>

                        {deleteError && (
                            <div className="bg-destructive text-destructive-foreground text-xs p-3 rounded-xl">
                                {deleteError}
                            </div>
                        )}

                        {!isGoogleUser && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">
                                    Confirm with Password
                                </label>
                                <Input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    className="border-destructive/30 focus-visible:ring-destructive/30"
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading || (!isGoogleUser && !deletePassword)}
                                className="text-xs h-9 rounded-xl font-bold"
                            >
                                {deleteLoading ? 'Wiping databases...' : 'Confirm Permanent Deletion'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
