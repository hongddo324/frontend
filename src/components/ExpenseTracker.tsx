import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AnimatedSection } from './AnimatedSection';
import { Progress } from './ui/progress';
import { Plus, Search, TrendingUp, TrendingDown, Calendar, ChevronDown, ChevronUp, CreditCard, AlertTriangle, Edit2, Trash2, BarChart3, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from './ui/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { useApp } from '../contexts/AppContext';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  isAutoClassified?: boolean;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

interface ExpenseTrackerProps {
  onShowAnalysis: () => void;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

// 한국어 단위로 금액 표시
function formatKoreanCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const n = Math.abs(amount);
  if (n >= 100000000) {
    const eok = Math.floor(n / 100000000);
    const restMan = Math.floor((n % 100000000) / 10000);
    if (restMan > 0) {
      return sign + eok.toString() + '억 ' + restMan.toLocaleString() + '만';
    }
    return sign + eok.toString() + '억';
  }
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    const rest = n % 10000;
    if (rest > 0) {
      return sign + man.toString() + '만 ' + rest.toLocaleString();
    }
    return sign + man.toString() + '만';
  }
  return sign + n.toLocaleString();
}

export function ExpenseTracker({ onShowAnalysis, selectedDate: controlledDate, onDateChange }: ExpenseTrackerProps) {
  const { expenseCategories, incomeCategories, expensePaymentMethods, incomePaymentMethods, getCategoryColor } = useApp();

  const [transactions, setTransactions] = useState<Transaction[]>([
  { id: 1, description: 'Salary', amount: 2800000, category: '급여', date: '2025-08-01', type: 'income' },
  { id: 2, description: 'Coffee', amount: 6500, category: '식비', date: '2025-08-14', type: 'expense', isAutoClassified: true },
  { id: 3, description: 'Subway', amount: 1400, category: '교통', date: '2025-08-14', type: 'expense', isAutoClassified: true },
  { id: 4, description: 'Coupang', amount: 89000, category: '쇼핑', date: '2025-08-13', type: 'expense', isAutoClassified: true },
  { id: 5, description: 'Cinema', amount: 15000, category: '문화생활', date: '2025-08-13', type: 'expense', isAutoClassified: true }
]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalDate, setInternalDate] = useState<Date | undefined>(new Date());
  const selectedDate = controlledDate ?? internalDate;
  const setSelectedDate = (d?: Date) => {
    if (onDateChange) onDateChange(d);
    else setInternalDate(d);
  };
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
  });

  const categories = {
    expense: expenseCategories.map(c => c.name),
    income: incomeCategories.map(c => c.name)
  };

  const paymentMethods = {
    expense: expensePaymentMethods,
    income: incomePaymentMethods
  };

  const autoClassifyTransaction = (description: string): { category: string; isAutoClassified: boolean } => {
    const keywords: Record<string, string[]> = {
      '식비': ['스타벅스','맥도날드','버거','카페','마트','음식','커피','치킨'],
      '교통': ['지하철','버스','택시','주차','기름','교통카드'],
      '쇼핑': ['쿠팡','11번가','옥션','의류','화장품'],
      '문화생활': ['CGV','영화','공연','콘서트','도서'],
    };
    for (const [category, list] of Object.entries(keywords)) {
      if (list.some(k => description.toLowerCase().includes(k.toLowerCase()))) {
        return { category, isAutoClassified: true };
      }
    }
    return { category: '기타', isAutoClassified: false };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTransaction) {
      // 편집 모드
      setTransactions(transactions.map(t =>
        t.id === editingTransaction.id
          ? {
              ...t,
              description: formData.description,
              amount: parseInt(formData.amount),
              category: formData.category || t.category,
              type: formData.type,
              date: formData.date,
              paymentMethod: formData.paymentMethod,
            }
          : t
      ));
      setEditingTransaction(null);
    } else {
      // 새로 추가
      const { category: autoCategory, isAutoClassified } = formData.category
        ? { category: formData.category, isAutoClassified: false }
        : autoClassifyTransaction(formData.description);

      const newTransaction: Transaction = {
        id: Date.now(),
        description: formData.description,
        amount: parseInt(formData.amount),
        category: autoCategory,
        date: formData.date,
        type: formData.type,
        paymentMethod: formData.paymentMethod,
        isAutoClassified
      };

      setTransactions([newTransaction, ...transactions]);
    }

    setFormData({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      paymentMethod: transaction.paymentMethod || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    // 날짜 필터링
    if (selectedDate) {
      const transactionDate = new Date(transaction.date);
      const selected = new Date(selectedDate);

      // 날짜만 비교 (시간 제외)
      const isSameDate =
        transactionDate.getFullYear() === selected.getFullYear() &&
        transactionDate.getMonth() === selected.getMonth() &&
        transactionDate.getDate() === selected.getDate();

      return matchesSearch && isSameDate;
    }

    return matchesSearch;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 월별 지출 집계 (선택 달 기준)
  const monthlyExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    if (!selectedDate) return true;
    const d = new Date(t.date);
    return d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth();
  });
  const expenseByCategory: Record<string, number> = {};
  for (const t of monthlyExpenses) {
    expenseByCategory[t.category] = (expenseByCategory[t.category] ?? 0) + t.amount;
  }
  const computedCategories = Object.keys(expenseByCategory).map((name, idx) => ({
    name,
    spent: expenseByCategory[name],
    budget: 300000,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));
  const categorySpending = computedCategories.length > 0 ? computedCategories : [
    { name: '식비', spent: 420000, budget: 500000, color: '#3b82f6' },
    { name: '교통', spent: 180000, budget: 200000, color: '#10b981' },
    { name: '쇼핑', spent: 320000, budget: 300000, color: '#ef4444' },
    { name: '문화생활', spent: 150000, budget: 200000, color: '#8b5cf6' },
    { name: '기타', spent: 214000, budget: 250000, color: '#f59e0b' },
  ];

  // 도넛 차트 데이터 및 필터 상태
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const pieSource = categorySpending;
  const filtered = activeCategories.length > 0 ? pieSource.filter(c => activeCategories.includes(c.name)) : pieSource;
  const pieTotal = filtered.reduce((s, c) => s + c.spent, 0) || 1;
  const pieChartData = filtered.map(cat => ({ name: cat.name, value: cat.spent }));

  const getTransactionsByCategory = (categoryName: string) => {
    return monthlyExpenses.filter(t => t.category === categoryName);
  };

  // 날짜별 거래 건수 계산
  const getTransactionCountByDate = (date: Date) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === date.getFullYear() &&
             transactionDate.getMonth() === date.getMonth() &&
             transactionDate.getDate() === date.getDate();
    }).length;
  };

  // 날짜별 카테고리 색상 가져오기
  const getCategoriesForDate = (date: Date) => {
    const trans = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === date.getFullYear() &&
             transactionDate.getMonth() === date.getMonth() &&
             transactionDate.getDate() === date.getDate();
    });

    const uniqueCategories = [...new Set(trans.map(t => t.category))];
    return uniqueCategories.map(cat => {
      const transaction = trans.find(t => t.category === cat);
      return {
        name: cat,
        color: getCategoryColor(cat, transaction?.type || 'expense')
      };
    }).slice(0, 3); // 최대 3개만 표시
  };


  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold">가계부</h1>
              <p className="text-sm text-muted-foreground">수입과 지출을 관리하세요</p>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 bg-blue-50 border-blue-200 hover:bg-blue-100"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      {selectedDate ? format(selectedDate, 'M월 d일', { locale: ko }) : '날짜 선택'}
                    </span>
                    <ChevronDown className="w-3 h-3 ml-1 text-blue-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-3 shadow-xl border-2 !z-[100] bg-white dark:bg-gray-800"
                  align="end"
                  sideOffset={8}
                >
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }
                    }}
                    initialFocus
                    locale={ko}
                    className="rounded-md"
                    modifiers={{
                      hasTransactions: (date) => getTransactionCountByDate(date) > 0
                    }}
                    modifiersClassNames={{
                      hasTransactions: "bg-blue-100 font-bold"
                    }}
                    components={{
                      DayContent: ({ date }) => {
                        const count = getTransactionCountByDate(date);
                        const categories = getCategoriesForDate(date);

                        return (
                          <div className="relative w-full h-full flex flex-col items-center justify-center">
                            <div className="flex items-center gap-0.5 absolute top-0.5 left-1">
                              {categories.map((cat, idx) => (
                                <div
                                  key={idx}
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                              ))}
                            </div>
                            <span>{date.getDate()}</span>
                            {count > 0 && (
                              <span className="absolute bottom-0 right-0.5 text-[8px] bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
                                {count}
                              </span>
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setSelectedDate(undefined)}
                  title="날짜 필터 제거"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {/* 분석 버튼 */}
          <Button
            variant="outline"
            className="w-full bg-purple-50 border-purple-200 hover:bg-purple-100"
            onClick={onShowAnalysis}
          >
            <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-purple-700 font-medium">월별 분석 보기</span>
          </Button>
        </div>
      </AnimatedSection>

      {/* 가계부 작성 버튼 */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingTransaction(null);
          setFormData({
            description: '',
            amount: '',
            category: '',
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: '',
          });
        }
      }}>
        <DialogTrigger asChild>
          <Button className="w-full h-12 mb-4 bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            가계부 작성
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[90vw] mx-4">
          <DialogHeader>
            <DialogTitle>{editingTransaction ? '거래 편집' : '새 거래 추가'}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? '거래 내역을 편집하세요' : '새로운 거래를 추가하여 가계부를 관리하세요.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">유형</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'income' | 'expense') =>
                  setFormData({...formData, type: value, category: ''})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="expense">지출</SelectItem>
                  <SelectItem value="income">수입</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">내용</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="거래 내용을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">금액</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="금액을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="자동 분류 또는 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {categories[formData.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!editingTransaction && (
                <p className="text-xs text-muted-foreground">
                  비워두면 자동으로 분류됩니다
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">지불방법</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="지불방법 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {paymentMethods[formData.type].map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              {editingTransaction ? '편집하기' : '추가하기'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 파이 차트 */}
      <AnimatedSection delay={0.1}>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{selectedDate ? `${selectedDate.getMonth()+1}월 지출 분석` : "지출 분석"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => {
                      return percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : '';
                    }}
                    labelLine={false}
                    style={{ fontSize: '11px' }}
                    onClick={(data: any) => {
                      setSelectedCategory(data.name);
                      setIsCategoryModalOpen(true);
                    }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => `₩${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 파이 차트 중앙에 총 지출 금액 표시 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-medium">총 지출</p>
                  <p className="text-lg font-bold text-red-600">
                    ₩{formatKoreanCurrency(totalExpense)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-2"
              >
                <span>{showFilters ? '필터 접기' : '필터 펼치기'}</span>
                {showFilters ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
              </Button>
              {showFilters && (
                <div className="flex flex-wrap gap-2">
                  {categorySpending.map((cat) => {
                    const active = activeCategories.length === 0 || activeCategories.includes(cat.name);
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setActiveCategories((prev) => {
                            if (prev.includes(cat.name)) {
                              return prev.filter((c) => c !== cat.name);
                            } else {
                              return [...prev, cat.name];
                            }
                          });
                        }}
                        className={cn("px-2 py-1 rounded-full text-xs border", (activeCategories.length === 0 || activeCategories.includes(cat.name)) ? "bg-slate-100 border-slate-300" : "bg-transparent border-slate-300 text-slate-500")}>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {categorySpending.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index] }}
                  />
                  <span className="text-xs">{cat.name}</span>
                  <span className="text-xs font-medium ml-auto">₩{formatKoreanCurrency(cat.spent)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 카테고리별 거래 내역 모달 */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory} 지출 내역</DialogTitle>
            <DialogDescription>
              {selectedCategory} 카테고리의 거래 내역입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedCategory && getTransactionsByCategory(selectedCategory).map((transaction) => (
              <Card key={transaction.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">{transaction.date}</div>
                  </div>
                  <div className="font-semibold text-sm text-red-600">
                    -₩{formatKoreanCurrency(transaction.amount)}
                  </div>
                </div>
              </Card>
            ))}
            {selectedCategory && getTransactionsByCategory(selectedCategory).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                거래 내역이 없습니다.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 요약 카드 */}
      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-3">
            <div className="text-center">
              <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">수입</div>
              <div className="text-sm font-semibold text-green-600">
                +₩{formatKoreanCurrency(totalIncome)}
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <TrendingDown className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">지출</div>
              <div className="text-sm font-semibold text-red-600">
                -₩{formatKoreanCurrency(totalExpense)}
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">잔액</div>
              <div className={`text-sm font-semibold ${
                totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₩{formatKoreanCurrency(totalIncome - totalExpense)}
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* 카테고리별 지출 현황 */}
      <AnimatedSection delay={0.2}>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              카테고리별 지출
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categorySpending.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              const isOverBudget = percentage > 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="font-medium text-sm">{category.name}</span>
                      {isOverBudget && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        ₩{formatKoreanCurrency(category.spent)}
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-1.5 ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>₩{formatKoreanCurrency(category.budget - category.spent)} 남음</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 검색 */}
      <AnimatedSection delay={0.25}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="거래 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </AnimatedSection>

      {/* 거래 내역 */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <AnimatedSection key={transaction.id} delay={0.3 + (index * 0.03)}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="font-medium text-sm">{transaction.description}</div>
                    {transaction.isAutoClassified && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        자동분류
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {transaction.category}
                    </Badge>
                    {transaction.paymentMethod && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50">
                        {transaction.paymentMethod}
                      </Badge>
                    )}
                    <span>{transaction.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`font-semibold text-sm whitespace-nowrap ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₩{transaction.amount.toLocaleString()}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
