import React from 'react';
import { LayoutGrid, Users, FileCheck, ShieldAlert, LogOut, BarChart3, ClipboardList, Gavel, ShoppingBag } from 'lucide-react';
import Logo from '../../Logo';

export type AdminView = 'dashboard' | 'analytics' | 'users' | 'auctions' | 'add-auction' | 'approvals' | 'compliance' | 'audit' | 'marketplace';

interface AdminSidebarProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col z-10 h-screen transition-all">
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <div className="scale-75 opacity-90">
          <Logo variant="light" showTagline={false} />
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</div>
        <NavItem
          icon={LayoutGrid}
          label="Dashboard"
          active={currentView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem
          icon={BarChart3}
          label="Analytics"
          active={currentView === 'analytics'}
          onClick={() => onNavigate('analytics')}
        />

        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</div>
        <NavItem
          icon={Gavel}
          label="Auctions"
          active={currentView === 'auctions' || currentView === 'add-auction'}
          onClick={() => onNavigate('auctions')}
        />
        <NavItem
          icon={ShoppingBag}
          label="Marketplace"
          active={currentView === 'marketplace'}
          onClick={() => onNavigate('marketplace')}
        />
        <NavItem
          icon={Users}
          label="Users"
          active={currentView === 'users'}
          onClick={() => onNavigate('users')}
        />
        <NavItem
          icon={FileCheck}
          label="Approvals"
          active={currentView === 'approvals'}
          onClick={() => onNavigate('approvals')}
        />
        <NavItem
          icon={ShieldAlert}
          label="Compliance"
          active={currentView === 'compliance'}
          onClick={() => onNavigate('compliance')}
        />
        <NavItem
          icon={ClipboardList}
          label="Audit Trail"
          active={currentView === 'audit'}
          onClick={() => onNavigate('audit')}
        />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${active ? 'bg-slate-800 text-white font-medium shadow-md shadow-black/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span>{label}</span>
    </div>
    {badge && <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">{badge}</span>}
  </button>
);

export default AdminSidebar;