import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AnimatedSection } from './AnimatedSection';
import { TrendingDown, TrendingUp, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyComparisonProps {
  onBack?: () => void;
  selectedDate?: Date;
}

export function MonthlyComparison({ onBack, selectedDate }: MonthlyComparisonProps) {
  const selectedMonthLabel = selectedDate ? `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}` : 'current';

  const monthlyData = [
  { month: 'Jun', food: 380000, transport: 120000, shopping: 250000, culture: 180000, other: 150000 },
  { month: 'Jul', food: 420000, transport: 160000, shopping: 320000, culture: 200000, other: 180000 },
  { month: 'Aug', food: 420000, transport: 180000, shopping: 320000, culture: 150000, other: 214000 },
  { month: 'Sep (Est)', food: 350000, transport: 150000, shopping: 280000, culture: 160000, other: 180000 },
];

  const categoryComparison = [
  { category: 'Food', current: 420000, predicted: 350000, budget: 500000, trend: 'down' as const, change: -16.7 },
  { category: 'Transport', current: 180000, predicted: 150000, budget: 200000, trend: 'down' as const, change: -16.7 },
  { category: 'Shopping', current: 320000, predicted: 280000, budget: 300000, trend: 'down' as const, change: -12.5 },
  { category: 'Culture', current: 150000, predicted: 160000, budget: 200000, trend: 'up' as const, change: 6.7 },
  { category: 'Other', current: 214000, predicted: 180000, budget: 250000, trend: 'down' as const, change: -15.9 },
];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];
  const lineData = monthlyData.map((m) => ({ month: m.month, total: m.food + m.transport + m.shopping + m.culture + m.other }));

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <AnimatedSection>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {onBack && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Monthly Analysis - {selectedMonthLabel}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Selected month breakdown</p>
        </div>
      </AnimatedSection>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison" className="text-xs">비교</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs">Trends</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="space-y-3">
            {categoryComparison.map((item, index) => {
              const budgetUsage = (item.predicted / item.budget) * 100;
              const isOverBudget = budgetUsage > 100;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="font-medium text-sm">{item.category}</span>
                      {item.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingUp className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{item.change > 0 ? '+' : ''}{item.change}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">현재</p>
                      <p className="text-sm font-semibold">{Math.round(item.current / 1000)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">예상</p>
                      <p className="text-sm font-semibold text-green-600">{Math.round(item.predicted / 1000)}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">예산</p>
                      <p className="text-sm font-semibold">{Math.round(item.budget / 1000)}K</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">예상/예산</span>
                      <span className={isOverBudget ? 'text-red-600 font-medium' : 'font-medium'}>
                        {budgetUsage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-blue-500" style={{ width: `${Math.min(100, budgetUsage)}%` }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base">월별 총지출 추이</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₩${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [`₩${Number(value).toLocaleString()}`, '총지출']} />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-3">
          <Card className="border-green-200 bg-green-50 p-4">
            <div className="text-sm text-green-800">이번 달은 전월 대비 지출이 안정적입니다.</div>
          </Card>
          <Card className="border-blue-200 bg-blue-50 p-4">
            <div className="text-sm text-blue-800">쇼핑과 문화생활 카테고리를 중심으로 관리해 보세요.</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


