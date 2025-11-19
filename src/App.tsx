import { useState, useEffect } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { DailyLife } from './components/DailyLife';
import { MonthlyComparison } from './components/MonthlyComparison';
import { Settings } from './components/Settings';
import { Schedule } from './components/Schedule';
import { Login } from './components/Login';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar: string;
}

interface DailyEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  mood: 'good' | 'neutral' | 'bad';
  category: string;
  tags: string[];
  images: string[];
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // 일상 기록 상태를 App 레벨로 관리하여 Dashboard와 DailyLife 간 동기화
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([
    {
      id: 1,
      date: '2025-08-14',
      title: '카페에서의 여유',
      content: '오랜만에 친구와 카페에서 수다를 떨었다. 집에서 만든 커피도 좋지만, 가끔은 이런 여유도 필요하다는 걸 느꼈다. 새로운 메뉴도 맛있었고 분위기도 좋았다.',
      mood: 'good',
      category: '일상',
      tags: ['카페', '친구', '휴식'],
      images: [],
      likes: 12,
      liked: false,
      comments: [
        {
          id: 1,
          author: '김민지',
          content: '좋은 시간 보내셨네요! 저도 가끔 그런 여유가 필요해요 😊',
          date: '2025-08-14',
          avatar: '👩'
        },
        {
          id: 2,
          author: '이준호',
          content: '어느 카페인가요? 분위기 좋아 보이네요!',
          date: '2025-08-14',
          avatar: '👨'
        }
      ]
    },
    {
      id: 2,
      date: '2025-08-13',
      title: '재택근무 하루',
      content: '집에서 일하니 출퇴근 스트레스가 없어서 좋다. 점심도 직접 해먹고 집중도도 높았다. 저녁에는 운동도 할 수 있어서 건강한 하루를 보냈다.',
      mood: 'good',
      category: '일상',
      tags: ['재택근무', '건강', '운동'],
      images: [],
      likes: 8,
      liked: true,
      comments: []
    },
    {
      id: 3,
      date: '2025-08-12',
      title: '독서하는 주말',
      content: '주말 내내 읽고 싶었던 책을 다 읽었다. 자기계발서였는데 재정 관리에 대한 좋은 인사이트를 많이 얻었다. 실천해봐야겠다.',
      mood: 'good',
      category: '취미',
      tags: ['독서', '자기계발', '주말'],
      images: [],
      likes: 15,
      liked: false,
      comments: [
        {
          id: 1,
          author: '박지영',
          content: '무슨 책인지 궁금해요! 추천해주세요 📚',
          date: '2025-08-12',
          avatar: '👩‍💼'
        }
      ]
    }
  ]);

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
      return <MonthlyComparison onBack={() => setShowAnalysis(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard dailyEntries={dailyEntries} />;
      case 'expenses':
        return <ExpenseTracker onShowAnalysis={() => setShowAnalysis(true)} />;
      case 'daily':
        return <DailyLife entries={dailyEntries} setEntries={setDailyEntries} />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Dashboard dailyEntries={dailyEntries} />;
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