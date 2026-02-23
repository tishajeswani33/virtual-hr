import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, MessageSquare, LogOut, Mic } from 'lucide-react';
import { cn } from '../utils/cn';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/employees': return 'Employee Directory';
      case '/candidates': return 'Recruitment Pipeline';
      case '/ai-assistant': return 'AI HR Assistant';
      case '/interview': return 'AI Voice Interview';
      default: return 'HR Portal';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">VirtuHR</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/employees" icon={Users} label="Employees" />
          <SidebarItem to="/candidates" icon={UserPlus} label="Recruitment" />
          <SidebarItem to="/ai-assistant" icon={MessageSquare} label="AI Assistant" />
          <SidebarItem to="/interview" icon={Mic} label="Voice Interview" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">Admin User</p>
                <p className="text-xs text-slate-500">Head of HR</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
