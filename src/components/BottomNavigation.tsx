import { Home, Wallet, BookOpen, Calendar, Settings } from 'lucide-react';
import { cn } from './ui/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const activeSettingsStyle = {
  text: 'text-slate-700 dark:text-slate-300',
  bg: 'bg-slate-100 dark:bg-slate-800/50',
  icon: 'text-slate-600 dark:text-slate-300',
  underline: 'bg-slate-500',
};

const menuItems = [
  { id: 'dashboard', label: '홈', icon: Home },
  { id: 'expenses', label: '가계부', icon: Wallet },
  { id: 'daily', label: '일상', icon: BookOpen },
  { id: 'schedule', label: '일정', icon: Calendar },
  { id: 'settings', label: '설정', icon: Settings },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border">
      <div className="flex items-center justify-around py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200',
                'min-w-0 flex-1 max-w-20',
                isActive
                  ? cn(activeSettingsStyle.text, activeSettingsStyle.bg, 'ring-1 ring-current/20')
                  : 'text-muted-foreground hover:bg-accent/50 active:bg-accent'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-all duration-200',
                  isActive ? cn('scale-110', activeSettingsStyle.icon) : 'scale-100'
                )}
              />
              <span className={cn('text-xs transition-all duration-200 truncate', isActive ? 'font-semibold' : 'font-normal')}>
                {item.label}
              </span>
              {isActive && (
                <div
                  className={cn(
                    'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-t-full',
                    activeSettingsStyle.underline
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
