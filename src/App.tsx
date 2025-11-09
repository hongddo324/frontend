import { useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { DailyLife } from './components/DailyLife';
import { MonthlyComparison } from './components/MonthlyComparison';
import { Settings } from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpenseTracker />;
      case 'daily':
        return <DailyLife />;
      case 'comparison':
        return <MonthlyComparison />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto border-x">
      <main className="flex-1 overflow-hidden pb-20">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}