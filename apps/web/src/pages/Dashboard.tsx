import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, AlertTriangle, Package, Database,
    LogOut, LayoutDashboard, Settings, Activity, PackagePlus,
    Minus, Plus, Trash2
} from 'lucide-react';
import SidebarLink from '../components/SidebarLink';
import StatCard from '../components/StatCard';
import AddAssetModal from '../components/AddAssetModal';

// API Configuration for Production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    status: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

    // Professional Data Fetching
    const fetchInventory = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/inventory`);
            setInventory(res.data);
        } catch (err) {
            console.error("Database Connection Error:", err);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAdjust = async (id: string, amount: number) => {
        try {
            await axios.patch(`${API_URL}/api/inventory/${id}/adjust`, { amount });
            fetchInventory(); // Refresh data
        } catch (err) {
            console.error("Adjustment failed", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to decommission this asset?")) return;
        try {
            await axios.delete(`${API_URL}/api/inventory/${id}`);
            fetchInventory(); // Refresh data
        } catch (err) {
            alert("Authorization failed: Only Admins can delete assets.");
        }
    };

    const filteredItems = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = inventory.filter(item => item.quantity < 5).length;
    const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
            {/* 1. Integrated Add Asset Modal */}
            <AddAssetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchInventory}
            />

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                        <Activity size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter">ApexFlow</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active />
                    <SidebarLink icon={<Package size={18} />} label="Inventory" />
                    <SidebarLink icon={<Database size={18} />} label="Database" />
                    <SidebarLink icon={<Settings size={18} />} label="Settings" />
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Terminate Session</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Command Center</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">PostgreSQL Cluster: Synced</p>
                        </div>
                    </div>

                    {/* 2. Primary Action: Register Asset */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <PackagePlus size={18} />
                        <span className="text-sm">Register Asset</span>
                    </button>
                </header>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Global Inventory" value={inventory.length} icon={<Package className="text-blue-400" />} />
                    <StatCard title="Critical Alerts" value={lowStockCount} icon={<AlertTriangle className="text-red-400" />} highlight={lowStockCount > 0} />
                    <StatCard title="Total Capacity" value={totalUnits} icon={<Database className="text-emerald-400" />} />
                </div>

                {/* Search */}
                <div className="relative mb-8 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Scan by Serial Number or Product Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all backdrop-blur-sm"
                    />
                </div>

                {/* Data Table */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/40 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Serial / SKU</th>
                                <th className="px-8 py-5">Product Identifier</th>
                                <th className="px-8 py-5">Volume</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredItems.map(item => (
                                <tr key={item.id} className={`group transition-all hover:bg-blue-500/[0.03] ${item.quantity < 5 ? 'bg-red-500/5' : ''}`}>
                                    <td className="px-8 py-5 font-mono text-blue-400 text-sm tracking-tighter">{item.sku}</td>
                                    <td className="px-8 py-5 font-bold text-slate-200">
                                        {item.name}
                                        {item.quantity < 5 && <span className="ml-3 text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse shadow-lg shadow-red-500/20">LOW STOCK</span>}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleAdjust(item.id, -1)}
                                                className="p-1 hover:bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition-all"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={`font-mono w-12 text-center ${item.quantity < 5 ? 'text-red-400 font-black' : 'text-slate-400'}`}>
                                                {item.quantity.toString().padStart(3, '0')}
                                            </span>
                                            <button
                                                onClick={() => handleAdjust(item.id, 1)}
                                                className="p-1 hover:bg-slate-800 rounded border border-slate-700 text-slate-400 hover:text-white transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-lg transition-all"
                                                title="Decommission Asset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredItems.length === 0 && (
                        <div className="p-24 text-center">
                            <Package className="mx-auto text-slate-800 mb-4" size={48} />
                            <p className="text-slate-500 font-medium italic">No assets detected matching your query.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}