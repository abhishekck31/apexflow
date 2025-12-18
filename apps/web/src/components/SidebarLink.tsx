import React from 'react';

interface SidebarLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

export default function SidebarLink({ icon, label, active = false }: SidebarLinkProps) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}>
            {icon}
            <span className="text-sm font-semibold">{label}</span>
        </div>
    );
}
