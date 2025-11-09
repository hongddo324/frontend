import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Plus,
  Settings,
  Clock,
  Trash2
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info' | 'alert';
  category: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

interface NotificationSettings {
  budgetAlerts: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  goalReminders: boolean;
  unusualSpending: boolean;
  billReminders: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: '쇼핑 예산 초과 경고',
      message: '이달 쇼핑 지출이 예산의 107%에 도달했습니다. 남은 기간 동안 신중한 소비를 권장합니다.',
      type: 'warning',
      category: '예산 관리',
      timestamp: '2025-08-14 14:30',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: 2,
      title: '일기 작성 리마인더',
      message: '오늘의 경제 일기를 아직 작성하지 않으셨습니다. 하루를 마무리하며 재정 활동을 기록해보세요.',
      type: 'info',
      category: '일기',
      timestamp: '2025-08-14 20:00',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: '목표 달성 축하',
      message: '식비 절약 목표를 달성했습니다! 이번 달 커피값 절약으로 20만원을 아꼈습니다.',
      type: 'success',
      category: '목표 달성',
      timestamp: '2025-08-14 09:15',
      isRead: true,
      priority: 'low'
    },
    {
      id: 4,
      title: '카드값 결제일 알림',
      message: '신용카드 결제일이 3일 후입니다. 결제 계좌 잔액을 확인해주세요.',
      type: 'alert',
      category: '결제 알림',
      timestamp: '2025-08-13 10:00',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: 5,
      title: '주간 리포트 생성',
      message: '이번 주 지출 리포트가 생성되었습니다. 지출 패턴을 확인해보세요.',
      type: 'info',
      category: '리포트',
      timestamp: '2025-08-12 18:00',
      isRead: true,
      priority: 'low'
    },
    {
      id: 6,
      title: '이상 지출 감지',
      message: '평소보다 높은 금액의 온라인 쇼핑이 감지되었습니다. 계획에 없던 구매인지 확인해주세요.',
      type: 'warning',
      category: '이상 지출',
      timestamp: '2025-08-11 15:45',
      isRead: false,
      priority: 'medium'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    budgetAlerts: true,
    dailyReminders: true,
    weeklyReports: true,
    goalReminders: true,
    unusualSpending: true,
    billReminders: true
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'info' as 'warning' | 'success' | 'info' | 'alert',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const notificationIcons = {
    warning: { icon: AlertTriangle, color: 'text-orange-600' },
    success: { icon: CheckCircle, color: 'text-green-600' },
    info: { icon: Info, color: 'text-blue-600' },
    alert: { icon: Bell, color: 'text-red-600' }
  };

  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-gray-200 bg-gray-50'
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const notification: Notification = {
      id: Date.now(),
      title: newAlert.title,
      message: newAlert.message,
      type: newAlert.type,
      category: newAlert.category,
      timestamp: new Date().toLocaleString('ko-KR'),
      isRead: false,
      priority: newAlert.priority
    };

    setNotifications([notification, ...notifications]);
    setNewAlert({
      title: '',
      message: '',
      type: 'info',
      category: '',
      priority: 'medium'
    });
    setIsDialogOpen(false);
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            알림 센터
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">가계부 관련 알림을 관리하세요</p>
        </div>
      </div>

      {/* 플로팅 설정 버튼 */}
      <Button 
        variant="outline" 
        size="sm"
        className="fixed bottom-24 right-4 w-12 h-12 rounded-full shadow-lg z-10 p-0"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* 요약 카드 - 모바일 최적화 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">총 알림</p>
              <p className="text-sm font-semibold">{notifications.length}개</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-xs text-muted-foreground">읽지 않음</p>
              <p className="text-sm font-semibold text-orange-600">{unreadCount}개</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 빠른 액션 */}
      {unreadCount > 0 && (
        <div className="mb-4">
          <Button variant="outline" onClick={markAllAsRead} className="w-full">
            모든 알림 읽음 처리
          </Button>
        </div>
      )}

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="text-xs">알림 목록</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* 조치 필요한 알림 */}
          {notifications.filter(n => n.actionRequired && !n.isRead).length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  조치 필요
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications
                  .filter(n => n.actionRequired && !n.isRead)
                  .map((notification) => {
                    const IconComponent = notificationIcons[notification.type].icon;
                    return (
                      <div key={notification.id} className="p-3 rounded-lg bg-white border border-red-200">
                        <div className="flex items-start gap-3">
                          <IconComponent className={`w-4 h-4 mt-0.5 ${notificationIcons[notification.type].color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm mb-1">{notification.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                                className="h-7 text-xs"
                              >
                                확인
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}

          {/* 모든 알림 */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type].icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`p-4 transition-all ${
                    notification.isRead 
                      ? 'bg-muted/30 opacity-75' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-4 h-4 mt-0.5 ${notificationIcons[notification.type].color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium text-sm ${notification.isRead ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {notification.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-7 px-2 text-xs"
                            >
                              읽음
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-7 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">예산 초과 알림</h3>
                  <p className="text-xs text-muted-foreground">
                    카테고리별 예산 초과 시 알림
                  </p>
                </div>
                <Switch
                  checked={settings.budgetAlerts}
                  onCheckedChange={(checked) => updateSettings('budgetAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">일일 리마인더</h3>
                  <p className="text-xs text-muted-foreground">
                    매일 저녁 경제 일기 작성 리마인드
                  </p>
                </div>
                <Switch
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => updateSettings('dailyReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">주간 리포트</h3>
                  <p className="text-xs text-muted-foreground">
                    매주 지출 리포트 자동 생성
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSettings('weeklyReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">목표 달성 알림</h3>
                  <p className="text-xs text-muted-foreground">
                    저축/절약 목표 달성 시 축하 메시지
                  </p>
                </div>
                <Switch
                  checked={settings.goalReminders}
                  onCheckedChange={(checked) => updateSettings('goalReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">이상 지출 감지</h3>
                  <p className="text-xs text-muted-foreground">
                    평소와 다른 지출 패턴 감지 시 알림
                  </p>
                </div>
                <Switch
                  checked={settings.unusualSpending}
                  onCheckedChange={(checked) => updateSettings('unusualSpending', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">청구서 알림</h3>
                  <p className="text-xs text-muted-foreground">
                    카드 결제일/공과금 납부일 알림
                  </p>
                </div>
                <Switch
                  checked={settings.billReminders}
                  onCheckedChange={(checked) => updateSettings('billReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            설정 저장
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}