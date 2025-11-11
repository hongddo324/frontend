import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AnimatedSection } from './AnimatedSection';
import { Bell, TrendingUp, TrendingDown, DollarSign, Calendar, Heart, ChevronRight, Briefcase, Wallet, CreditCard } from 'lucide-react';

export function Dashboard() {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  // 한국어 단위로 금액 표시
  function formatKoreanCurrency(amount: number): string {
    const sign = amount < 0 ? '-' : '';
    const n = Math.abs(amount);
    if (n >= 100000000) {
      const eok = Math.floor(n / 100000000);
      const restMan = Math.floor((n % 100000000) / 10000);
      if (restMan > 0) {
        return sign + '₩' + eok.toString() + '억 ' + restMan.toLocaleString() + '만';
      }
      return sign + '₩' + eok.toString() + '억';
    }
    if (n >= 10000) {
      const man = Math.floor(n / 10000);
      const rest = n % 10000;
      if (rest > 0) {
        return sign + '₩' + man.toString() + '만 ' + rest.toLocaleString();
      }
      return sign + '₩' + man.toString() + '만';
    }
    if (n >= 1000) {
      return sign + '₩' + n.toLocaleString();
    }
    return sign + '₩' + n.toLocaleString();
  }

  const daysSince = Math.floor((Date.now() - new Date('2024-09-22').getTime()) / (1000*60*60*24));
  const notifications = [
    {
      id: 1,
      title: '쇼핑 예산 초과',
      message: '쇼핑 카테고리가 예산의 106.7%를 사용했습니다.',
      type: 'warning',
      time: '2시간 전',
      icon: '🛍️',
    },
    {
      id: 2,
      title: '저축 목표 달성!',
      message: '이번 달 저축률 목표 50%를 달성했습니다!',
      type: 'success',
      time: '5시간 전',
      icon: '🎉',
    },
    {
      id: 3,
      title: '월말 예산 알림',
      message: '이번 달 마감이 3일 남았습니다. 지출을 정리해보세요.',
      type: 'info',
      time: '1일 전',
      icon: '💡',
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: '카페에서의 여유',
      content: '오랜만에 친구와 카페에서 수다를 떨었다. 집에서 만든 커피도 좋지만..',
      category: '일상',
      date: '08.14',
      mood: '☕',
    },
    {
      id: 2,
      title: '재택근무 하루',
      content: '집에서 일하니 출퇴근 스트레스가 없어서 좋다. 점심도 직접 해먹고..',
      category: '일상',
      date: '08.13',
      mood: '😊',
    },
  ];

  // 자산 상세 데이터
  const assetDetails = [
    {
      name: '조비에비에션',
      amount: 80000000,
      type: '주식',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'LGCNS',
      amount: 60000000,
      type: '주식',
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      name: '현금',
      amount: 20000000,
      type: '현금',
      icon: Wallet,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      name: '빚',
      amount: -20000000,
      type: '부채',
      icon: CreditCard,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  const totalAssets = assetDetails.reduce((sum, asset) => sum + asset.amount, 0);

  const quickStats = [
    {
      title: '이달 수입',
      value: formatKoreanCurrency(2800000),
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
      clickable: false,
    },
    {
      title: '이달 지출',
      value: formatKoreanCurrency(1300000),
      change: '-8.2%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100',
      clickable: false,
    },
    {
      title: '남은 예산',
      value: formatKoreanCurrency(1500000),
      change: '+20.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      clickable: false,
    },
    {
      title: '현재 자산',
      value: formatKoreanCurrency(totalAssets),
      change: '+5.1%',
      trend: 'up',
      icon: Heart,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      clickable: true,
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <svg className="w-3 h-3 text-red-500 fill-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.716-4.438-9.657-7.379C-.083 11.04-.083 7.96 2.343 5.535c2.121-2.121 5.657-2.121 7.778 0L12 7.414l1.879-1.879c2.121-2.121 5.657-2.121 7.778 0 2.426 2.426 2.426 5.506-.001 8.086C18.716 16.562 12 21 12 21z"/></svg>
                <span>{`+ ${daysSince}일`}</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold">안녕하세요 민수님</h1>
              <p className="text-sm text-muted-foreground">오늘도 현명한 소비를 시작해보세요</p>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
            건강함
          </Badge>
        </div>
      </AnimatedSection>

      {/* 간단한 통계 */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-3 ${stat.clickable ? 'cursor-pointer hover:shadow-lg transition-all' : ''}`}
                onClick={() => stat.clickable && setIsAssetModalOpen(true)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-sm font-semibold">{stat.value}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </AnimatedSection>

      {/* 자산 상세 모달 */}
      <Dialog open={isAssetModalOpen} onOpenChange={setIsAssetModalOpen}>
        <DialogContent className="sm:max-w-[90vw] mx-4">
          <DialogHeader>
            <DialogTitle>자산 상세</DialogTitle>
            <DialogDescription>
              현재 보유 중인 자산 내역입니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {assetDetails.map((asset, index) => {
              const Icon = asset.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${asset.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${asset.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${asset.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatKoreanCurrency(Math.abs(asset.amount))}
                      </p>
                      {asset.amount < 0 && (
                        <p className="text-xs text-red-500">부채</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-base">총 자산</p>
                <p className="font-bold text-lg text-purple-600">
                  {formatKoreanCurrency(totalAssets)}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 알림 센터 */}
      <AnimatedSection delay={0.15}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4" />
                알림
              </CardTitle>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {notifications.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 최근 일상 게시글 */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                최근 일상
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                전체보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{post.mood}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{post.title}</h4>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 ml-2">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
