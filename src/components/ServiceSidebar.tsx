import { FileText } from 'lucide-react';
import { Badge } from './ui/badge';

interface ServiceSidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export function ServiceSidebar({ 
  currentView = 'registration',
  onNavigate,
}: ServiceSidebarProps) {
  
  const menuItems = [
    {
      id: 'registration',
      label: '注册服务',
      icon: FileText,
      active: currentView === 'registration',
      show: true,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${item.active ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
