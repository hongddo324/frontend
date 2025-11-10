import { 
  Home, 
  Wallet, 
  BookOpen, 
  TrendingUp, 
  Bell,
  PiggyBank
} from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: '대시보드', icon: Home },
  { id: 'expenses', label: '가계부', icon: Wallet },
  { id: 'diary', label: '경제 일기', icon: BookOpen },
  { id: 'comparison', label: '월별 비교', icon: TrendingUp },
  { id: 'notifications', label: '알림', icon: Bell },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">또또 블로그</h1>
            <p className="text-muted-foreground text-sm">일상 기록</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-accent/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            이달 총 지출
          </p>
          <p className="text-xl font-semibold text-primary">₩1,284,000</p>
        </div>
      </div>
    </div>
  );
}