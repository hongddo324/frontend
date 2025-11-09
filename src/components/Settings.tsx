import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { AnimatedSection } from './AnimatedSection';
import { 
  User, 
  Mail, 
  Bell, 
  Lock, 
  Palette, 
  Database, 
  HelpCircle,
  LogOut,
  Camera,
  ChevronRight,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';

export function Settings() {
  const [profile, setProfile] = useState({
    name: '김가계',
    email: 'budget@example.com',
    phone: '010-1234-5678',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    dailyReminders: true,
    weeklyReports: true,
    emailNotifications: false,
    pushNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    autoBackup: true
  });

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications({...notifications, [key]: value});
  };

  const updatePrivacy = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy({...privacy, [key]: value});
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full pb-24">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="mb-6">
          <h1 className="text-xl font-semibold">설정</h1>
          <p className="text-sm text-muted-foreground">앱 설정 및 프로필 관리</p>
        </div>
      </AnimatedSection>

      {/* 프로필 섹션 */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              프로필
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 프로필 사진 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>

            <Separator />

            {/* 프로필 정보 */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="전화번호를 입력하세요"
                />
              </div>
            </div>

            <Button className="w-full">
              프로필 저장
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 알림 설정 */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">예산 초과 알림</h3>
                <p className="text-xs text-muted-foreground">
                  카테고리별 예산 초과 시 알림
                </p>
              </div>
              <Switch
                checked={notifications.budgetAlerts}
                onCheckedChange={(checked) => updateNotification('budgetAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">일일 리마인더</h3>
                <p className="text-xs text-muted-foreground">
                  매일 저녁 일상 기록 리마인드
                </p>
              </div>
              <Switch
                checked={notifications.dailyReminders}
                onCheckedChange={(checked) => updateNotification('dailyReminders', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">주간 리포트</h3>
                <p className="text-xs text-muted-foreground">
                  매주 지출 리포트 자동 생성
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => updateNotification('weeklyReports', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">이메일 알림</h3>
                <p className="text-xs text-muted-foreground">
                  이메일로 알림 받기
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => updateNotification('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">푸시 알림</h3>
                <p className="text-xs text-muted-foreground">
                  앱 푸시 알림 받기
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => updateNotification('pushNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 보안 및 개인정보 */}
      <AnimatedSection delay={0.3}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              보안 및 개인정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">비밀번호 변경</h3>
                  <p className="text-xs text-muted-foreground">계정 비밀번호 변경</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">데이터 공유</h3>
                <p className="text-xs text-muted-foreground">
                  서비스 개선을 위한 데이터 공유
                </p>
              </div>
              <Switch
                checked={privacy.dataSharing}
                onCheckedChange={(checked) => updatePrivacy('dataSharing', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">사용 분석</h3>
                <p className="text-xs text-muted-foreground">
                  앱 사용 패턴 분석 허용
                </p>
              </div>
              <Switch
                checked={privacy.analytics}
                onCheckedChange={(checked) => updatePrivacy('analytics', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">자동 백업</h3>
                <p className="text-xs text-muted-foreground">
                  데이터 자동 백업 활성화
                </p>
              </div>
              <Switch
                checked={privacy.autoBackup}
                onCheckedChange={(checked) => updatePrivacy('autoBackup', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 기타 설정 */}
      <AnimatedSection delay={0.4}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" />
              앱 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">언어</h3>
                  <p className="text-xs text-muted-foreground">한국어</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Separator />

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">테마</h3>
                  <p className="text-xs text-muted-foreground">라이트 모드</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Separator />

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">데이터 관리</h3>
                  <p className="text-xs text-muted-foreground">백업 및 복원</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 지원 */}
      <AnimatedSection delay={0.5}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              지원
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">도움말</h3>
                  <p className="text-xs text-muted-foreground">사용 가이드 보기</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Separator />

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">문의하기</h3>
                  <p className="text-xs text-muted-foreground">support@example.com</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Separator />

            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <h3 className="font-medium text-sm">앱 정보</h3>
                  <p className="text-xs text-muted-foreground">버전 1.0.0</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 로그아웃 */}
      <AnimatedSection delay={0.6}>
        <Button variant="destructive" className="w-full flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </AnimatedSection>

      <div className="h-4"></div>
    </div>
  );
}
