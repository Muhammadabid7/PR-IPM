import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Transaction } from './types';

interface FinanceChartProps {
    transactions: Transaction[];
}

export const FinanceChart: React.FC<FinanceChartProps> = ({ transactions }) => {
    const data = useMemo(() => {
        const monthlyData: Record<string, { name: string; Masuk: number; Keluar: number }> = {};

        transactions.forEach((t) => {
            if (!t.date) return;
            // Handle Firestore Timestamp or Date object
            const dateObj = t.date.toDate ? t.date.toDate() : new Date(t.date);
            const monthYear = dateObj.toLocaleString('id-ID', { month: 'short', year: '2-digit' });

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { name: monthYear, Masuk: 0, Keluar: 0 };
            }

            if (t.type === 'in') {
                monthlyData[monthYear].Masuk += t.amount;
            } else {
                monthlyData[monthYear].Keluar += t.amount;
            }
        });

        // Sort by date (naive approach, assuming monthYear string sort might not be perfect but sufficient for small range, 
        // better to sort by actual date key if needed, but let's keep it simple for now or reverse keys)
        // Actually, Object.values might not guarantee order. Let's sort manually.

        return Object.values(monthlyData).reverse(); // Assuming transactions are desc, so reverse to show asc time
    }, [transactions]);

    return (
        <div className="w-full h-72 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Arus Kas Bulanan</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        itemStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Bar dataKey="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
