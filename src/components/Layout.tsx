import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Siren, User, BarChart3, LogOut, Shield, Map } from 'lucide-react';

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
    { icon: Shield, label: 'Drills', path: '/student/drills' },
    { icon: Map, label: 'Campus Map', path: '/student/campus-map' },
    { icon: Siren, label: 'SOS', path: '/student/sos' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  const adminNavItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Shield, label: 'Trigger Drill', path: '/admin/drill' },
    { icon: BookOpen, label: 'Analytics', path: '/admin/analytics' },
  ];

  const navItems = user.role === 'student' ? studentNavItems : adminNavItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                🛡️ Suraksha
              </div>
              {drillActive && (
                <div className="bg-emergency text-emergency-foreground px-3 py-1 rounded-full text-sm font-medium emergency-pulse">
                  🚨 DRILL ACTIVE
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {user.role.toUpperCase()}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-card border-r border-border shadow-soft min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;