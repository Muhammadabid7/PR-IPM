import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Member } from './types';

interface MemberChartProps {
    members: Member[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

export const MemberChart: React.FC<MemberChartProps> = ({ members }) => {
    const data = useMemo(() => {
        const statusCounts: Record<string, number> = {
            'Pra-TM': 0,
            'TM1': 0,
            'TM2': 0
        };

        members.forEach((m) => {
            if (statusCounts[m.status] !== undefined) {
                statusCounts[m.status]++;
            }
        });

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [members]);

    return (
        <div className="w-full h-72 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Sebaran Jenjang Kader</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                        itemStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
