import React, { useMemo } from 'react';
import { Users, Wallet, Calendar, Inbox } from 'lucide-react';
import { Member, Transaction, EventItem, Aspiration } from './types';
import { FinanceChart } from './FinanceChart';
import { MemberChart } from './MemberChart';

interface DashboardOverviewProps {
    members: Member[];
    transactions: Transaction[];
    events: EventItem[];
    aspirations: Aspiration[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    members,
    transactions,
    events,
    aspirations
}) => {
    const currency = useMemo(() => new Intl.NumberFormat('id-ID'), []);
    const stats = useMemo(() => {
        const totalMembers = members.length;

        const income = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
        const balance = income - expense;

        const activeEvents = events.length; // Simplified for now
        const pendingAspirations = aspirations.filter(a => a.status !== 'Selesai').length;

        return { totalMembers, balance, activeEvents, pendingAspirations };
    }, [members, transactions, events, aspirations]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Kader</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalMembers}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/70 shadow-sm flex items-start gap-4 lg:col-span-2">
                    <div className="p-3 rounded-full bg-white shadow-inner text-emerald-600 dark:bg-slate-900/60 dark:text-emerald-300">
                        <Wallet size={24} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="inline-flex items-center gap-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Saldo Kas</p>
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">Kas Aktif</span>
                        </div>
                        <p
                            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight break-words"
                            title={`Rp${currency.format(stats.balance)}`}
                        >
                            Rp{currency.format(stats.balance)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Termasuk pemasukan & pengeluaran terbaru</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Event Aktif</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeEvents}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <Inbox size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Aspirasi Pending</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingAspirations}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinanceChart transactions={transactions} />
                <MemberChart members={members} />
            </div>
        </div>
    );
};
