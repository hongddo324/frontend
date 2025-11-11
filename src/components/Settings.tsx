import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AnimatedSection } from './AnimatedSection';
import { useApp } from '../contexts/AppContext';
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
  Smartphone,
  Tags,
  CreditCard as CreditCardIcon,
  Plus,
  X,
  Trash2
} from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
  const {
    expenseCategories,
    incomeCategories,
    addExpenseCategory,
    removeExpenseCategory,
    addIncomeCategory,
    removeIncomeCategory,
    updateExpenseCategoryColor,
    updateIncomeCategoryColor,
    expensePaymentMethods,
    incomePaymentMethods,
    addExpensePaymentMethod,
    removeExpensePaymentMethod,
    addIncomePaymentMethod,
    removeIncomePaymentMethod,
  } = useApp();

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

  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseCategoryColor, setNewExpenseCategoryColor] = useState('#ef4444');
  const [newIncomeCategory, setNewIncomeCategory] = useState('');
  const [newIncomeCategoryColor, setNewIncomeCategoryColor] = useState('#22c55e');
  const [newExpenseMethod, setNewExpenseMethod] = useState('');
  const [newIncomeMethod, setNewIncomeMethod] = useState('');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#6b7280'
  ];

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications({...notifications, [key]: value});
  };

  const updatePrivacy = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy({...privacy, [key]: value});
  };

  const handleAddExpenseCategory = () => {
    if (newExpenseCategory.trim()) {
      addExpenseCategory(newExpenseCategory.trim(), newExpenseCategoryColor);
      setNewExpenseCategory('');
      setNewExpenseCategoryColor('#ef4444');
    }
  };

  const handleAddIncomeCategory = () => {
    if (newIncomeCategory.trim()) {
      addIncomeCategory(newIncomeCategory.trim(), newIncomeCategoryColor);
      setNewIncomeCategory('');
      setNewIncomeCategoryColor('#22c55e');
    }
  };

  const handleAddExpenseMethod = () => {
    if (newExpenseMethod.trim()) {
      addExpensePaymentMethod(newExpenseMethod.trim());
      setNewExpenseMethod('');
    }
  };

  const handleAddIncomeMethod = () => {
    if (newIncomeMethod.trim()) {
      addIncomePaymentMethod(newIncomeMethod.trim());
      setNewIncomeMethod('');
    }
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-900">
              <User className="w-4 h-4 text-blue-600" />
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
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-900">
              <Bell className="w-4 h-4 text-yellow-600" />
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
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-green-900">
              <Shield className="w-4 h-4 text-green-600" />
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
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-900">
              <Palette className="w-4 h-4 text-purple-600" />
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

      {/* 카테고리 관리 */}
      <AnimatedSection delay={0.5}>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-100 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-orange-900">
                <Tags className="w-4 h-4 text-orange-600" />
                카테고리 관리
              </CardTitle>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] mx-4">
                  <DialogHeader>
                    <DialogTitle>카테고리 추가</DialogTitle>
                    <DialogDescription>
                      지출 또는 수입 카테고리를 추가하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>지출 카테고리 추가</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="카테고리 이름"
                          value={newExpenseCategory}
                          onChange={(e) => setNewExpenseCategory(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddExpenseCategory();
                            }
                          }}
                          className="flex-1"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                              <div
                                className="w-5 h-5 rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: newExpenseCategoryColor }}
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="grid grid-cols-6 gap-2">
                              {predefinedColors.map((color) => (
                                <button
                                  key={color}
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    newExpenseCategoryColor === color ? 'border-gray-900' : 'border-gray-200'
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setNewExpenseCategoryColor(color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button onClick={handleAddExpenseCategory} className="shrink-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>수입 카테고리 추가</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="카테고리 이름"
                          value={newIncomeCategory}
                          onChange={(e) => setNewIncomeCategory(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddIncomeCategory();
                            }
                          }}
                          className="flex-1"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                              <div
                                className="w-5 h-5 rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: newIncomeCategoryColor }}
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="grid grid-cols-6 gap-2">
                              {predefinedColors.map((color) => (
                                <button
                                  key={color}
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    newIncomeCategoryColor === color ? 'border-gray-900' : 'border-gray-200'
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setNewIncomeCategoryColor(color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button onClick={handleAddIncomeCategory} className="shrink-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-orange-900">지출 카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {expenseCategories.map((category) => (
                  <Badge
                    key={category.name}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1.5"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-3 h-3 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: category.color }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-6 gap-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${
                                category.color === color ? 'border-gray-900' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => updateExpenseCategoryColor(category.name, color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    {category.name}
                    <button
                      onClick={() => {
                        if (confirm(`${category.name} 카테고리를 삭제하시겠습니까?`)) {
                          removeExpenseCategory(category.name);
                        }
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-orange-900">수입 카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {incomeCategories.map((category) => (
                  <Badge
                    key={category.name}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1.5 bg-green-100"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="w-3 h-3 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: category.color }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-6 gap-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${
                                category.color === color ? 'border-gray-900' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => updateIncomeCategoryColor(category.name, color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    {category.name}
                    <button
                      onClick={() => {
                        if (confirm(`${category.name} 카테고리를 삭제하시겠습니까?`)) {
                          removeIncomeCategory(category.name);
                        }
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 지불수단 관리 */}
      <AnimatedSection delay={0.55}>
        <Card className="bg-gradient-to-br from-cyan-50 to-sky-50 border-2 border-cyan-100 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-cyan-900">
                <CreditCardIcon className="w-4 h-4 text-cyan-600" />
                지불수단 관리
              </CardTitle>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] mx-4">
                  <DialogHeader>
                    <DialogTitle>지불수단 추가</DialogTitle>
                    <DialogDescription>
                      지출 또는 수입 지불수단을 추가하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>지출 지불수단 추가</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="지불수단 이름"
                          value={newExpenseMethod}
                          onChange={(e) => setNewExpenseMethod(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddExpenseMethod();
                            }
                          }}
                        />
                        <Button onClick={handleAddExpenseMethod}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>수입 지불수단 추가</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="지불수단 이름"
                          value={newIncomeMethod}
                          onChange={(e) => setNewIncomeMethod(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddIncomeMethod();
                            }
                          }}
                        />
                        <Button onClick={handleAddIncomeMethod}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-cyan-900">지출 지불수단</h3>
              <div className="flex flex-wrap gap-2">
                {expensePaymentMethods.map((method) => (
                  <Badge
                    key={method}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1"
                  >
                    {method}
                    <button
                      onClick={() => {
                        if (confirm(`${method} 지불수단을 삭제하시겠습니까?`)) {
                          removeExpensePaymentMethod(method);
                        }
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-cyan-900">수입 지불수단</h3>
              <div className="flex flex-wrap gap-2">
                {incomePaymentMethods.map((method) => (
                  <Badge
                    key={method}
                    variant="secondary"
                    className="text-xs px-2 py-1 flex items-center gap-1 bg-green-100"
                  >
                    {method}
                    <button
                      onClick={() => {
                        if (confirm(`${method} 지불수단을 삭제하시겠습니까?`)) {
                          removeIncomePaymentMethod(method);
                        }
                      }}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 지원 */}
      <AnimatedSection delay={0.6}>
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-pink-900">
              <HelpCircle className="w-4 h-4 text-pink-600" />
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
      <AnimatedSection delay={0.65}>
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 shadow-md">
          <CardContent className="p-4">
            <Button
              variant="destructive"
              className="w-full h-12 flex items-center justify-center gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirm('로그아웃하시겠습니까?')) {
                  onLogout();
                }
              }}
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>

      <div className="h-4"></div>
    </div>
  );
}
