import React, { useState, useEffect } from 'react';
import { AdminView } from './AdminSidebar';
import AdminSidebar from './AdminSidebar';
import Logo from '../../Logo';
import { AuditService, AuditLogEntry } from '../../../utils/audit';
import { AuthService } from '../../services/AuthService';
import { AuctionService } from '../../services/AuctionService';
import AddAuction from './AddAuction';
import MarketplaceManagement from './MarketplaceManagement';
import RiskMonitorWidget from './RiskMonitorWidget';
import { Search, Download, Filter, Power, Eye, Shield, MapPin, ChevronDown, X, CheckSquare, UserCheck, UserX, Menu, Calendar, Trash2, Mail, Phone, ChevronUp, Check, FileText, ChevronLeft, ChevronRight, AlertTriangle, Info, Plus, Gavel, Clock, Pencil } from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [currentView, setCurrentView] = useState<AdminView>('dashboard');
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [auctionsList, setAuctionsList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Responsive Sidebar State
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Track which user is currently being updated for loading state
    const [actioningUser, setActioningUser] = useState<string | null>(null);

    // View User Details State
    const [viewUser, setViewUser] = useState<any | null>(null);

    // Auction Edit State
    const [auctionToEdit, setAuctionToEdit] = useState<any | null>(null);

    // Bulk Action State
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmLabel: '',
        isDangerous: false,
        onConfirm: () => { }
    });

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        role: 'all',
        status: 'all',
        startDate: '',
        endDate: ''
    });

    // Data Refresh Logic
    useEffect(() => {
        const fetchData = async () => {
            const users = await AuthService.getUsers();
            setUsersList(users);

            const auctions = await AuctionService.getAuctions();
            setAuctionsList(auctions); // Using 'any' for now to match flexible types

            if (currentView === 'audit') {
                setAuditLogs(AuditService.getLogs());
            }
        };

        fetchData();

        if (currentView === 'users') {
            setSelectedUsers([]); // Reset selection when view refreshes
            setCurrentPage(1); // Reset page on view refresh
        }
        // Close sidebar on view change (mobile)
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, [currentView]);

    // Reset pagination when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeFilters]);

    // Single User Status Change
    const handleToggleUserStatus = (email: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        const actionName = newStatus === 'active' ? 'Activate' : 'Disable';

        setConfirmModal({
            isOpen: true,
            title: `${actionName} User Account`,
            message: newStatus === 'disabled'
                ? `Are you sure you want to disable access for ${email}? The user will no longer be able to log in.`
                : `Are you sure you want to activate access for ${email}?`,
            confirmLabel: `${actionName} Account`,
            isDangerous: newStatus === 'disabled',
            onConfirm: () => executeUserStatusChange(email, currentStatus, newStatus)
        });
    };

    const executeUserStatusChange = async (email: string, currentStatus: string, newStatus: string) => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setActioningUser(email);

        try {
            const success = await AuthService.updateUserStatus(email, newStatus as any);
            if (success) {
                setUsersList(prev => prev.map(u => u.email === email ? { ...u, status: newStatus } : u));
                AuditService.logAction({
                    adminName: 'Super Admin',
                    action: newStatus === 'active' ? 'User Activation' : 'User Deactivation',
                    target: email,
                    details: `Changed account status from ${currentStatus} to ${newStatus} by administrator`,
                    status: 'Success'
                });

                // If modal is open, update it too
                if (viewUser && viewUser.email === email) {
                    setViewUser((prev: any) => ({ ...prev, status: newStatus }));
                }
            }
        } finally {
            setActioningUser(null);
        }
    };

    // Auction Deletion
    const handleDeleteAuction = (auction: any) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Auction',
            message: `Are you sure you want to delete the auction "${auction.title}"? This action cannot be undone.`,
            confirmLabel: 'Delete Auction',
            isDangerous: true,
            onConfirm: () => executeAuctionDelete(auction)
        });
    };

    const executeAuctionDelete = async (auction: any) => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));

        const success = await AuctionService.removeAuction(auction.id);
        if (success) {
            setAuctionsList(prev => prev.filter(a => a.id !== auction.id));
            AuditService.logAction({
                adminName: 'Super Admin',
                action: 'Delete Auction',
                target: `Auction: ${auction.title}`,
                details: `Deleted auction ID #${auction.id}`,
                status: 'Success'
            });
        }
    };

    // Auction Edit
    const handleEditAuction = (auction: any) => {
        setAuctionToEdit(auction);
        setCurrentView('add-auction');
    };

    const clearFilters = () => {
        setActiveFilters({ role: 'all', status: 'all', startDate: '', endDate: '' });
        setSearchTerm('');
    };

    const hasActiveFilters = activeFilters.role !== 'all' || activeFilters.status !== 'all' || activeFilters.startDate !== '' || activeFilters.endDate !== '';

    const filteredUsers = usersList.filter(user => {
        // Real-time search across Name, Email, Phone, and Type
        const term = searchTerm.toLowerCase();
        const matchesSearch = (user.fullName?.toLowerCase() || '').includes(term) ||
            (user.email?.toLowerCase() || '').includes(term) ||
            (user.phone?.toLowerCase() || '').includes(term) ||
            (user.type?.toLowerCase() || '').includes(term);

        const matchesRole = activeFilters.role === 'all' || user.type === activeFilters.role;
        const matchesStatus = activeFilters.status === 'all' || user.status === activeFilters.status;
        let matchesDate = true;
        if (activeFilters.startDate) matchesDate = matchesDate && (user.joinDate >= activeFilters.startDate);
        if (activeFilters.endDate) matchesDate = matchesDate && (user.joinDate <= activeFilters.endDate);
        return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // Bulk Action Handlers
    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.email));
        }
    };

    const toggleSelectUser = (email: string) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(prev => prev.filter(e => e !== email));
        } else {
            setSelectedUsers(prev => [...prev, email]);
        }
    };

    const handleBulkStatusChange = (newStatus: 'active' | 'disabled') => {
        if (selectedUsers.length === 0) return;

        const actionName = newStatus === 'active' ? 'Activate' : 'Disable';
        setConfirmModal({
            isOpen: true,
            title: `Bulk ${actionName} Users`,
            message: `You are about to ${newStatus === 'disabled' ? 'disable' : 'activate'} ${selectedUsers.length} selected user accounts. This action affects multiple users.`,
            confirmLabel: `${actionName} All`,
            isDangerous: newStatus === 'disabled',
            onConfirm: () => executeBulkStatusChange(newStatus)
        });
    };

    const executeBulkStatusChange = async (newStatus: 'active' | 'disabled') => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsBulkProcessing(true);

        try {
            let count = 0;
            // Execute in parallel
            const results = await Promise.all(selectedUsers.map(email => AuthService.updateUserStatus(email, newStatus)));
            count = results.filter(Boolean).length;

            setUsersList(prev => prev.map(u => selectedUsers.includes(u.email) ? { ...u, status: newStatus } : u));
            AuditService.logAction({
                adminName: 'Super Admin',
                action: `Bulk ${newStatus === 'active' ? 'Activation' : 'Deactivation'}`,
                target: `${count} Users`,
                details: `Bulk status update applied to: ${selectedUsers.join(', ')}`,
                status: 'Success'
            });
            setSelectedUsers([]);
        } finally {
            setIsBulkProcessing(false);
        }
    };

    const handleBulkExport = () => {
        if (selectedUsers.length === 0) return;
        const usersToExport = usersList.filter(u => selectedUsers.includes(u.email));
        const headers = ['Full Name', 'Email', 'Phone', 'Type', 'Address', 'Status', 'Join Date'];
        const rows = usersToExport.map(u => [u.fullName, u.email, u.phone, u.type, u.address, u.status, u.joinDate]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        AuditService.logAction({
            adminName: 'Super Admin',
            action: 'Bulk Data Export',
            target: `${usersToExport.length} Users`,
            details: 'Exported selected user records to CSV',
            status: 'Success'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans relative">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Component with Mobile Logic */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
                <div className="h-full flex flex-col">
                    <AdminSidebar
                        currentView={currentView === 'add-auction' ? 'auctions' : currentView}
                        onNavigate={(view) => {
                            setCurrentView(view);
                            if (view !== 'add-auction') setAuctionToEdit(null); // Reset edit state if navigating away
                        }}
                        onLogout={onLogout}
                    />
                </div>
                {/* Mobile Close Button */}
                <button
                    aria-label="Close Sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            aria-label="Open Sidebar"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 capitalize truncate">
                            {currentView === 'audit' ? 'Audit Trail' :
                                currentView === 'users' ? 'User Management' :
                                    currentView === 'add-auction' ? (auctionToEdit ? 'Edit Auction' : 'Create Auction') :
                                        `${currentView} Overview`}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-white shadow-sm text-xs">
                                AD
                            </div>
                            <div className="hidden md:block pr-2">
                                <p className="text-sm font-bold text-gray-800">Admin User</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in-up">

                    {currentView === 'dashboard' && (
                        <>
                            {/* Risk Monitor & KPI Cards */}
                            <div className="space-y-6 mb-8">
                                <RiskMonitorWidget />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                    <KpiCard label="Total Users" value={usersList.length.toString()} change="Real-time" color="bg-blue-500" />
                                    <KpiCard label="Active Auctions" value={auctionsList.length.toString()} change="Active" color="bg-eco-green" />
                                    <KpiCard label="Pending Approvals" value={usersList.filter(u => u.status === 'pending').length.toString()} change="Awaiting Action" color="bg-orange-500" />
                                    <KpiCard label="Total Revenue" value="₹ 0" change="E-Waste Sales" color="bg-purple-600" />
                                </div>
                            </div>

                            {/* Recent Registrations Table - Responsive Headers */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">Pending Approvals</h3>
                                    <button
                                        onClick={() => setCurrentView('approvals')}
                                        className="text-sm text-blue-600 font-medium hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4 whitespace-nowrap">Company Name</th>
                                                <th className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">Type</th>
                                                <th className="hidden md:table-cell px-6 py-4 whitespace-nowrap">Submitted</th>
                                                <th className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">Documents</th>
                                                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                    No pending approvals found.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {currentView === 'add-auction' && (
                        <AddAuction
                            onBack={() => {
                                setAuctionToEdit(null);
                                setCurrentView('auctions');
                            }}
                            editData={auctionToEdit}
                        />
                    )}

                    {currentView === 'marketplace' && (
                        <MarketplaceManagement />
                    )}

                    {currentView === 'auctions' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Auction Management</h3>
                                    <p className="text-sm text-gray-500">Create, edit and manage waste auctions.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setAuctionToEdit(null);
                                        setCurrentView('add-auction');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-eco-green text-white rounded-lg font-bold shadow-lg shadow-eco-green/30 hover:bg-eco-darkGreen transition-all active:scale-95"
                                >
                                    <Plus size={20} />
                                    Create New Auction
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Auction Title</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Current Bid</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {auctionsList.map(auction => (
                                                <tr key={auction.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${auction.image && !auction.image.startsWith('http') && !auction.image.startsWith('data:') ? auction.image : 'from-gray-400 to-gray-500'} flex-shrink-0 relative overflow-hidden`}>
                                                                {auction.image && (auction.image.startsWith('http') || auction.image.startsWith('data:')) && (
                                                                    <img src={auction.image} alt="" className="w-full h-full object-cover" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm">{auction.title}</p>
                                                                <p className="text-xs text-gray-500">{auction.location} • ID: #{auction.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold border border-gray-200">
                                                            {auction.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-medium text-gray-700">
                                                        ₹{auction.currentBid.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                            Live
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditAuction(auction)}
                                                                className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                                title="Edit Details"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAuction(auction)}
                                                                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                                title="Delete Auction"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {auctionsList.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-12 text-gray-400">
                                                        No active auctions found. Create one to get started.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'users' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
                            {/* Modern Toolbar */}
                            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-20">
                                {/* Title & Description */}
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">User Management</h3>
                                    <p className="text-sm text-gray-500">View, search and manage system users</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search */}
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, phone..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-10 py-2 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                        />
                                        {searchTerm && (
                                            <button
                                                aria-label="Clear Search"
                                                onClick={() => setSearchTerm('')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Filter Toggle */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 shadow-sm ${showFilters || hasActiveFilters
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Filter size={18} />
                                        <span>Filters</span>
                                        {(Object.values(activeFilters).some(v => v !== 'all' && v !== '')) && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold ml-1">
                                                {Object.values(activeFilters).filter(v => v !== 'all' && v !== '').length}
                                            </span>
                                        )}
                                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    {/* Default Export (visible when no bulk selection) */}
                                    {selectedUsers.length === 0 && (
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm justify-center">
                                            <Download size={18} />
                                            <span className="hidden sm:inline">Export</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Filter Panel */}
                            <div className={`
                    bg-slate-50/50 border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden
                    ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-none'}
                `}>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Role Selection */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Shield size={14} /> Role
                                            </label>
                                            <div className="relative">
                                                <select
                                                    aria-label="Filter by Role"
                                                    value={activeFilters.role}
                                                    onChange={(e) => setActiveFilters({ ...activeFilters, role: e.target.value })}
                                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700 font-medium shadow-sm cursor-pointer"
                                                >
                                                    <option value="all">All Roles</option>
                                                    <option value="Recycler">Recycler</option>
                                                    <option value="Generator">Generator</option>
                                                    <option value="Transporter">Transporter</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            </div>
                                        </div>

                                        {/* Status Segmented Control */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Power size={14} /> Status
                                            </label>
                                            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                                                {['all', 'active', 'disabled'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setActiveFilters({ ...activeFilters, status: s })}
                                                        className={`flex-1 capitalize text-sm py-2 rounded-md font-medium transition-all duration-200 ${activeFilters.status === s
                                                            ? 'bg-slate-100 text-slate-900 shadow-sm ring-1 ring-black/5'
                                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date Range Inputs */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Calendar size={14} /> Registered Between
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        aria-label="Filter by Start Date"
                                                        type="date"
                                                        value={activeFilters.startDate}
                                                        max={activeFilters.endDate}
                                                        onChange={(e) => setActiveFilters({ ...activeFilters, startDate: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-700 font-medium shadow-sm"
                                                    />
                                                </div>
                                                <span className="text-gray-300 font-medium">–</span>
                                                <div className="relative flex-1">
                                                    <input
                                                        aria-label="Filter by End Date"
                                                        type="date"
                                                        value={activeFilters.endDate}
                                                        min={activeFilters.startDate}
                                                        onChange={(e) => setActiveFilters({ ...activeFilters, endDate: e.target.value })}
                                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-700 font-medium shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters & Reset */}
                                    {hasActiveFilters && (
                                        <div className="mt-6 pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Active:</span>

                                                {activeFilters.role !== 'all' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                        {activeFilters.role}
                                                        <button aria-label="Remove Role Filter" onClick={() => setActiveFilters({ ...activeFilters, role: 'all' })} className="ml-2 hover:text-blue-900 rounded-full hover:bg-blue-100 p-0.5">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                )}
                                                {activeFilters.status !== 'all' && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                        Status: {activeFilters.status}
                                                        <button aria-label="Remove Status Filter" onClick={() => setActiveFilters({ ...activeFilters, status: 'all' })} className="ml-2 hover:text-purple-900 rounded-full hover:bg-purple-100 p-0.5">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                )}
                                                {(activeFilters.startDate || activeFilters.endDate) && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
                                                        {activeFilters.startDate || 'Start'} - {activeFilters.endDate || 'Today'}
                                                        <button aria-label="Remove Date Filter" onClick={() => setActiveFilters({ ...activeFilters, startDate: '', endDate: '' })} className="ml-2 hover:text-orange-900 rounded-full hover:bg-orange-100 p-0.5">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={clearFilters}
                                                className="text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                Reset All
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bulk Actions Toolbar */}
                            {selectedUsers.length > 0 && (
                                <div className="bg-blue-50/95 backdrop-blur-md px-6 py-3 border-b border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in sticky top-0 z-10 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-900">
                                        <CheckSquare size={18} className="text-blue-600" />
                                        <span className="font-bold text-sm">{selectedUsers.length} Users Selected</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                                        <button
                                            onClick={() => handleBulkStatusChange('active')}
                                            disabled={isBulkProcessing}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 whitespace-nowrap shadow-sm transition-colors"
                                        >
                                            <UserCheck size={16} />
                                            Enable
                                        </button>
                                        <button
                                            onClick={() => handleBulkStatusChange('disabled')}
                                            disabled={isBulkProcessing}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 whitespace-nowrap shadow-sm transition-colors"
                                        >
                                            <UserX size={16} />
                                            Disable
                                        </button>
                                        <div className="h-6 w-px bg-blue-200 mx-1 hidden sm:block"></div>
                                        <button
                                            onClick={handleBulkExport}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm whitespace-nowrap transition-colors"
                                        >
                                            <Download size={16} />
                                            Export Selected
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100 sticky top-0 z-0">
                                        <tr>
                                            <th className="px-3 md:px-6 py-3 md:py-4 w-12 text-center bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    aria-label="Select all users"
                                                    title="Select all users"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                    onChange={toggleSelectAll}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </th>
                                            <th className="px-3 md:px-6 py-3 md:py-4 bg-gray-50">User Details</th>
                                            <th className="hidden md:table-cell px-6 py-4 bg-gray-50">Role / Type</th>
                                            <th className="hidden lg:table-cell px-6 py-4 bg-gray-50">Location</th>
                                            <th className="hidden xl:table-cell px-6 py-4 bg-gray-50">Registration Date</th>
                                            <th className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 bg-gray-50">Status</th>
                                            <th className="px-3 md:px-6 py-3 md:py-4 text-right bg-gray-50">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-24 text-center text-gray-400">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                            <Search size={32} className="text-gray-300" />
                                                        </div>
                                                        <p className="text-gray-600 font-bold text-lg">No users found</p>
                                                        <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                                                            We couldn't find any users matching your current search or filters.
                                                        </p>
                                                        <button
                                                            onClick={clearFilters}
                                                            className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                                                        >
                                                            Clear All Filters
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedUsers.map((user, idx) => (
                                                <tr
                                                    key={idx}
                                                    onClick={() => setViewUser(user)}
                                                    className={`transition-colors group cursor-pointer ${selectedUsers.includes(user.email) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            aria-label={`Select ${user.fullName}`}
                                                            title={`Select ${user.fullName}`}
                                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            checked={selectedUsers.includes(user.email)}
                                                            onChange={() => toggleSelectUser(user.email)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs md:text-sm shadow-sm border border-slate-200 group-hover:bg-white group-hover:border-blue-200 transition-colors">
                                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm md:text-base group-hover:text-blue-700 transition-colors">{user.fullName}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                                {/* Mobile Only Info Stack */}
                                                                <div className="md:hidden mt-1.5 flex flex-col gap-1">
                                                                    <div className="flex flex-wrap gap-2 items-center">
                                                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${user.type === 'Recycler' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                            user.type === 'Generator' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                                'bg-orange-50 text-orange-700 border-orange-200'
                                                                            }`}>
                                                                            {user.type || 'User'}
                                                                        </span>
                                                                        {/* Status Badge in Stack (Only visible on small screens where main column is hidden) */}
                                                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold capitalize sm:hidden ${user.status === 'disabled'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-green-100 text-green-700'
                                                                            }`}>
                                                                            {user.status === 'disabled' ? 'Disabled' : 'Active'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                                                        {user.address && (
                                                                            <div className="flex items-center gap-1">
                                                                                <MapPin size={10} />
                                                                                <span className="truncate max-w-[100px]">{user.address}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar size={10} />
                                                                            <span>{user.joinDate}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider ${user.type === 'Recycler' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            user.type === 'Generator' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-orange-50 text-orange-700 border-orange-200'
                                                            }`}>
                                                            {user.type || 'User'}
                                                        </span>
                                                    </td>
                                                    <td className="hidden lg:table-cell px-6 py-4 text-gray-600 text-sm font-medium">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} className="text-gray-400" />
                                                            {user.address || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="hidden xl:table-cell px-6 py-4 text-gray-500 text-sm">
                                                        {user.joinDate || 'Oct 24, 2023'}
                                                    </td>
                                                    <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4">
                                                        <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${user.status === 'disabled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'disabled' ? 'bg-red-500' : 'bg-green-500'
                                                                }`}></span>
                                                            {user.status === 'disabled' ? 'Disabled' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 md:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setViewUser(user); }}
                                                                title="View Details"
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleUserStatus(user.email, user.status); }}
                                                                disabled={actioningUser === user.email}
                                                                title={user.status === 'disabled' ? "Enable Account" : "Disable Account"}
                                                                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm border ${user.status === 'disabled'
                                                                    ? 'bg-white border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50'
                                                                    : 'bg-white border-gray-200 text-green-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                                                                    } ${actioningUser === user.email ? 'opacity-70 cursor-not-allowed bg-gray-50' : ''}`}
                                                            >
                                                                {actioningUser === user.email ? (
                                                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                                                ) : (
                                                                    <Power size={16} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            {filteredUsers.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                                    <div className="text-sm text-gray-500">
                                        Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-gray-900">{filteredUsers.length}</span> results
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            aria-label="Previous Page"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-medium text-gray-700 px-2">Page {currentPage} of {totalPages}</span>
                                        </div>

                                        <button
                                            aria-label="Next Page"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'audit' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">Activity Logs</h3>
                                    <p className="text-sm text-gray-500">Track all administrative actions.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button aria-label="Download Logs" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 md:px-6 py-4 whitespace-nowrap">Timestamp</th>
                                            <th className="hidden md:table-cell px-6 py-4 whitespace-nowrap">Admin User</th>
                                            <th className="px-4 md:px-6 py-4 whitespace-nowrap">Action</th>
                                            <th className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">Target</th>
                                            <th className="hidden sm:table-cell px-6 py-4">Details</th>
                                            <th className="px-4 md:px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {auditLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                    No logs found.
                                                </td>
                                            </tr>
                                        ) : (
                                            auditLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 md:px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                                        <span className="md:hidden block font-medium text-gray-900">{log.action}</span>
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className="hidden md:table-cell px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                                {log.adminName.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">{log.adminName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-gray-700 text-sm font-medium whitespace-nowrap">
                                                        <span className="md:block hidden">{log.action}</span>
                                                        <span className="md:hidden block text-xs text-gray-500">{log.adminName}</span>
                                                    </td>
                                                    <td className="hidden lg:table-cell px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                                        {log.target}
                                                    </td>
                                                    <td className="hidden sm:table-cell px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={log.details}>
                                                        {log.details}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-right">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other views */}
                    {currentView !== 'dashboard' && currentView !== 'audit' && currentView !== 'users' && currentView !== 'auctions' && currentView !== 'add-auction' && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl m-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Logo variant="dark" showTagline={false} className="scale-50 opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2 capitalize">{currentView} Module</h3>
                            <p className="text-gray-400">Development in progress</p>
                        </div>
                    )}

                </main>

                {/* User Details Modal */}
                {viewUser && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
                        onClick={() => setViewUser(null)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Background */}
                            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                                <button aria-label="Close Modal" onClick={() => setViewUser(null)} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-8 pb-8">
                                {/* Avatar */}
                                <div className="relative -mt-12 mb-6">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-500">
                                            {viewUser.fullName ? viewUser.fullName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">{viewUser.fullName}</h2>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                        <Mail size={16} />
                                        <span className="text-sm">{viewUser.email}</span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${viewUser.type === 'Recycler' ? 'bg-green-50 text-green-700 border-green-200' :
                                            viewUser.type === 'Generator' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                            {viewUser.type}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${viewUser.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                            {viewUser.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Grid Details */}
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Phone size={12} /> Phone
                                        </p>
                                        <p className="font-medium text-gray-900">{viewUser.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <MapPin size={12} /> Location
                                        </p>
                                        <p className="font-medium text-gray-900 truncate" title={viewUser.address}>{viewUser.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Calendar size={12} /> Joined
                                        </p>
                                        <p className="font-medium text-gray-900">{viewUser.joinDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Shield size={12} /> User ID
                                        </p>
                                        <p className="font-medium text-gray-900 font-mono text-xs">
                                            USR-{viewUser.email?.substring(0, 3).toUpperCase()}{viewUser.phone ? viewUser.phone.slice(-4) : 'XXXX'}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setViewUser(null)}
                                        className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleToggleUserStatus(viewUser.email, viewUser.status);
                                        }}
                                        className={`px-5 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-current/20 transition-all active:scale-95 text-sm flex items-center gap-2 ${viewUser.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {viewUser.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                        {viewUser.status === 'active' ? 'Disable Account' : 'Activate Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                            <div className="p-6 text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.isDangerous ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {confirmModal.isDangerous ? <AlertTriangle size={32} /> : <Info size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
                                <p className="text-gray-500 mb-8">{confirmModal.message}</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        className="px-5 py-2.5 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmModal.onConfirm}
                                        className={`px-5 py-2.5 text-white font-bold rounded-lg transition-colors shadow-lg ${confirmModal.isDangerous ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                                    >
                                        {confirmModal.confirmLabel}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const KpiCard = ({ label, value, change, color }: { label: string, value: string, change: string, color: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
        <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold">
                <span className={`${change.includes('Inactive') || change.includes('No data') ? 'text-gray-400 bg-gray-100' : change === 'Urgent' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'} px-2 py-1 rounded-md`}>
                    {change}
                </span>
            </div>
        </div>
    </div>
);

export default AdminDashboard;