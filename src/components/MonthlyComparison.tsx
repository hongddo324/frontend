import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AnimatedSection } from './AnimatedSection';
import { Calendar, Target, TrendingDown, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MonthlyComparison() {
  // 현재 달과 지난 달 지출 데이터
  const monthlyData = [
    { month: '6월', 식비: 380000, 교통비: 120000, 쇼핑: 250000, 문화생활: 180000, 기타: 150000 },
    { month: '7월', 식비: 420000, 교통비: 160000, 쇼핑: 320000, 문화생활: 200000, 기타: 180000 },
    { month: '8월', 식비: 420000, 교통비: 180000, 쇼핑: 320000, 문화생활: 150000, 기타: 214000 },
    { month: '9월 (예상)', 식비: 350000, 교통비: 150000, 쇼핑: 280000, 문화생활: 160000, 기타: 180000 },
  ];

  // 카테고리별 비교 데이터
  const categoryComparison = [
    { 
      category: '식비', 
      current: 420000, 
      predicted: 350000, 
      budget: 500000,
      trend: 'down',
      change: -16.7 
    },
    { 
      category: '교통비', 
      current: 180000, 
      predicted: 150000, 
      budget: 200000,
      trend: 'down',
      change: -16.7 
    },
    { 
      category: '쇼핑', 
      current: 320000, 
      predicted: 280000, 
      budget: 300000,
      trend: 'down',
      change: -12.5 
    },
    { 
      category: '문화생활', 
      current: 150000, 
      predicted: 160000, 
      budget: 200000,
      trend: 'up',
      change: 6.7 
    },
    { 
      category: '기타', 
      current: 214000, 
      predicted: 180000, 
      budget: 250000,
      trend: 'down',
      change: -15.9 
    },
  ];

  // 일별 지출 추이 (현재 달)
  const dailySpending = [
    { day: 1, amount: 45000 },
    { day: 2, amount: 32000 },
    { day: 3, amount: 67000 },
    { day: 4, amount: 28000 },
    { day: 5, amount: 89000 },
    { day: 6, amount: 42000 },
    { day: 7, amount: 55000 },
    { day: 8, amount: 38000 },
    { day: 9, amount: 71000 },
    { day: 10, amount: 45000 },
    { day: 11, amount: 52000 },
    { day: 12, amount: 63000 },
    { day: 13, amount: 29000 },
    { day: 14, amount: 48000 },
  ];

  // 예산 대비 실제 지출 비율 계산
  const totalCurrent = categoryComparison.reduce((sum, item) => sum + item.current, 0);
  const totalPredicted = categoryComparison.reduce((sum, item) => sum + item.predicted, 0);
  const totalBudget = categoryComparison.reduce((sum, item) => sum + item.budget, 0);

  // 파이 차트 색상
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  // 현재 달 카테고리별 지출 (파이 차트용)
  const pieData = categoryComparison.map((item, index) => ({
    name: item.category,
    value: item.current,
    color: COLORS[index]
  }));

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="mb-4">
          <h1 className="text-xl font-semibold">월별 분석</h1>
          <p className="text-sm text-muted-foreground">8월과 9월 지출 패턴을 분석합니다</p>
        </div>
      </AnimatedSection>

      {/* 요약 카드 - 모바일 최적화 */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3">
            <div className="text-center">
              <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">8월 지출</div>
              <div className="text-sm font-semibold">₩{(totalCurrent / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">
                예산의 {Math.round((totalCurrent / totalBudget) * 100)}%
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <Target className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">9월 예상</div>
              <div className="text-sm font-semibold text-green-600">₩{(totalPredicted / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-green-600">
                -₩{((totalCurrent - totalPredicted) / 1000).toFixed(0)}K 절약
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* 카드사별 결제 금액 */}
      <AnimatedSection delay={0.15}>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">카드사별 8월 결제 금액</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { company: '삼성카드', amount: 520000, color: 'bg-blue-500' },
              { company: '신한카드', amount: 380000, color: 'bg-red-500' },
              { company: '현대카드', amount: 284000, color: 'bg-purple-500' },
            ].map((card, index) => {
              const totalCardSpending = 1184000;
              const percentage = (card.amount / totalCardSpending) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${card.color}`} />
                      <span className="font-medium text-sm">{card.company}</span>
                    </div>
                    <div className="font-semibold text-sm">
                      ₩{(card.amount / 1000)}K
                    </div>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>전체 카드 지출의 {percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">총 카드 결제</span>
                <span className="font-semibold">₩1,184K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison" className="text-xs">비교</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">추이</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">분석</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          {/* 카테고리별 비교 - 모바일 최적화 */}
          <div className="space-y-3">
            {categoryComparison.map((item, index) => {
              const budgetUsage = (item.predicted / item.budget) * 100;
              const isOverBudget = budgetUsage > 100;
              
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                      <span className="font-medium text-sm">{item.category}</span>
                      {item.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingUp className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <Badge variant={item.trend === 'down' ? 'default' : 'destructive'} className="text-xs">
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">8월</p>
                      <p className="text-sm font-semibold">₩{(item.current / 1000)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">9월 예상</p>
                      <p className="text-sm font-semibold text-green-600">₩{(item.predicted / 1000)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">예산</p>
                      <p className="text-sm font-semibold">₩{(item.budget / 1000)}K</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>예산 사용률 (9월 예상)</span>
                      <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
                        {budgetUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(budgetUsage, 100)} 
                      className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base">8월 일별 지출 추이</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => `₩${(value / 1000)}K`} />
                  <Tooltip 
                    formatter={(value) => [`₩${Number(value).toLocaleString()}`, '지출액']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base">월별 총 지출 추이</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData.map(item => ({
                  month: item.month,
                  total: item.식비 + item.교통비 + item.쇼핑 + item.문화생활 + item.기타
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₩${(value / 1000000)}M`} />
                  <Tooltip 
                    formatter={(value) => [`₩${Number(value).toLocaleString()}`, '총 지출']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-3">
          <Card className="border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2 text-sm">긍정적인 변화</h3>
                <ul className="space-y-1 text-green-700 text-xs">
                  <li>• 9월 예상 지출이 8월 대비 10.8% 감소 예정</li>
                  <li>• 식비와 쇼핑에서 큰 절약 효과 기대</li>
                  <li>• 전체적으로 예산 준수율 개선</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">개선 권장사항</h3>
                <ul className="space-y-1 text-blue-700 text-xs">
                  <li>• 문화생활비 증가 추세 - 예산 재검토 필요</li>
                  <li>• 쇼핑 지출 예산 초과 가능성 - 계획적 소비</li>
                  <li>• 주말 지출 관리 강화 권장</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2 text-sm">주의사항</h3>
                <ul className="space-y-1 text-orange-700 text-xs">
                  <li>• 8월 중순 이후 일별 지출 변동성이 큼</li>
                  <li>• 충동구매 패턴 관찰 - 계획적 소비 필요</li>
                  <li>• 비상금 확보 권장</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base">9월 목표 설정</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2 text-sm">재정 목표</h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• 총 지출 ₩1.12M 이하 유지</li>
                    <li>• 식비 20% 추가 절약 달성</li>
                    <li>• 예산 준수율 90% 이상</li>
                    <li>• 비상금 ₩500K 적립</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm">실행 계획</h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• 주 2회 이상 집에서 요리하기</li>
                    <li>• 온라인 쇼핑 24시간 대기 규칙</li>
                    <li>• 주말 지출 한도 ₩100K 설정</li>
                    <li>• 매주 가계부 리뷰 및 조정</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}