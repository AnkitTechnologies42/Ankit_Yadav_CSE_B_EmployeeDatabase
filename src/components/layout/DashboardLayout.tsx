
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Users, LogOut, UserPlus } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    // Navigate to employees page with a query parameter to indicate we want to add a new employee
    navigate('/employees?action=add');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-900">
        <Sidebar className="bg-slate-800 border-r border-slate-700">
          <SidebarHeader className="p-4 flex flex-col gap-2 items-center border-b border-slate-700">
            <h1 className="text-xl font-bold text-primary">EmpManageHub</h1>
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <span className="bg-green-500 h-2 w-2 rounded-full"></span>
              {user?.username}
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/')} className="hover:bg-slate-700">
                  <Home className="h-5 w-5 mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/employees')} className="hover:bg-slate-700">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Employees</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleAddEmployee} className="hover:bg-slate-700">
                  <UserPlus className="h-5 w-5 mr-2" />
                  <span>Add Employee</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="hover:bg-slate-700 text-red-400">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center px-6">
            <div className="flex-1 flex items-center">
              <SidebarTrigger className="text-white mr-4" />
              <h1 className="text-xl font-bold text-white">TechVista Solutions</h1>
            </div>
            
            <div>
              <Button variant="outline" onClick={logout} className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
