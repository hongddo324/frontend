import { useState, useEffect } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { DailyLife } from './components/DailyLife';
import { MonthlyComparison } from './components/MonthlyComparison';
import { Settings } from './components/Settings';
import { Schedule } from './components/Schedule';
import { Login } from './components/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 로그인 상태 확인
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    // 분석 화면 표시
    if (showAnalysis) {
      return <MonthlyComparison selectedDate={selectedDate} onBack={() => setShowAnalysis(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return (
          <ExpenseTracker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onShowAnalysis={() => setShowAnalysis(true)}
          />
        );
      case 'daily':
        return <DailyLife />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x">
      <main className="flex-1 overflow-hidden pb-20">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setShowAnalysis(false); // 탭 변경 시 분석 화면 닫기
      }} />
    </div>
  );
}
