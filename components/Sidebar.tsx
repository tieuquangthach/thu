import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calculator, GraduationCap, Info, MessageSquare } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-brand-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-brand-50 hover:text-brand-600'
    }`;

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-lg text-slate-800 leading-tight">Toán THCS</h1>
                <p className="text-xs text-slate-500">Thầy Tiêu Quang Thạch</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/" className={navClass}>
          <MessageSquare size={20} />
          <span className="font-medium">Hỏi bài tập</span>
        </NavLink>
        <NavLink to="/quiz" className={navClass}>
          <GraduationCap size={20} />
          <span className="font-medium">Luyện thi</span>
        </NavLink>
        <NavLink to="/about" className={navClass}>
          <Info size={20} />
          <span className="font-medium">Giới thiệu</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
            <p>Học, học nữa, học mãi.</p>
            <p className="mt-2 font-bold text-brand-600">- V.I. Lenin</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;