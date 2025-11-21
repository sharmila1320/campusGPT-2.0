import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, GraduationCap, LayoutDashboard, MessageSquare } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: 'chat' | 'community';
  onTabChange: (tab: 'chat' | 'community') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-600 p-2 rounded-lg text-white">
          <GraduationCap size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Campus<span className="text-brand-600">GPT</span></h1>
      </div>

      <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>
        <button
          onClick={() => onTabChange('community')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'community' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Community</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;