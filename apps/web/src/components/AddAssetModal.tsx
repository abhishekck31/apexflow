import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, PackagePlus, ShieldAlert } from 'lucide-react';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AddAssetModal({ isOpen, onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState({ sku: '', name: '', quantity: 0 });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(`${API_URL}/api/inventory`, formData);
            onSuccess(); // Refresh the table
            onClose();   // Close modal
            setFormData({ sku: '', name: '', quantity: 0 }); // Reset
        } catch (err: any) {
            setError(err.response?.data?.error || 'System rejection: Check SKU uniqueness.');
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
                <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <PackagePlus className="text-blue-500" />
                                    <Dialog.Title className="text-xl font-bold">Register New Asset</Dialog.Title>
                                </div>
                                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                        <ShieldAlert size={18} /> {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Unique SKU Identifier</label>
                                    <input
                                        required
                                        placeholder="e.g., APX-999"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none"
                                        onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Product Unit Name</label>
                                    <input
                                        required
                                        placeholder="e.g., Titanium Actuator"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none"
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Initial Volume (Units)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none"
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs">
                                        Commit to Database
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}