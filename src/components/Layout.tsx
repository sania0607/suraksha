import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Siren, User, BarChart3, LogOut, Shield, Map, Bot, Bell, Play, Layers, AlertTriangle } from 'lucide-react';

const Layout = () => {
  const { user, setUser, drillActive } = useApp();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
  };

  const studentNavItems = [
    { icon: Home, label: 'Home', path: '/student' },
    { icon: BookOpen, label: 'Modules', path: '/student/modules' },
    { icon: Play, label: 'Virtual Drills', path: '/student/virtual-drills' },
    { icon: AlertTriangle, label: 'Emergency Center', path: '/student/emergency' },
    { icon: Map, label: 'Campus Map', path: '/student/campus-map' },
    { icon: Bot, label: 'AI Assistant', path: '/student/ai-assistant' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  const adminNavItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Shield, label: 'Analytics Dashboard', path: '/admin/analytics-dashboard' },
    { icon: Shield, label: 'Trigger Drill', path: '/admin/drill' },
    { icon: BookOpen, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bot, label: 'AI Assistant', path: '/admin/ai-assistant' },
  ];

  const navItems = user.role === 'student' ? studentNavItems : adminNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-teal-600" />
                <div className="text-teal-600 font-bold text-xl">Suraksha</div>
              </div>
              {drillActive && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  🚨 DRILL ACTIVE
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
              <span className="px-2 py-1 bg-teal-100 text-teal-600 text-xs rounded-full font-medium">
                {user.role.toUpperCase()}
              </span>
              <Button 
                onClick={handleLogout}
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;