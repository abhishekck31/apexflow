import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    highlight?: boolean;
}

export default function StatCard({ title, value, icon, highlight = false }: StatCardProps) {
    return (
        <div className={`p-8 rounded-3xl border transition-all duration-500 group relative overflow-hidden ${highlight
            ? 'bg-red-900/10 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.05)]'
            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 backdrop-blur-sm'
            }`}>
            <div className="flex justify-between items-start mb-6">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
                <div className="p-3 bg-slate-800/80 rounded-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
            </div>
            <p className="text-5xl font-black tracking-tighter tabular-nums">{value}</p>
        </div>
    );
}
