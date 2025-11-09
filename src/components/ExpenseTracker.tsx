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
import { Plus, Search, TrendingUp, TrendingDown, Calendar, ChevronDown, CreditCard, AlertTriangle, Edit2, Trash2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from './ui/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  isAutoClassified?: boolean;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

interface ExpenseTrackerProps {
  onShowAnalysis: () => void;
}

export function ExpenseTracker({ onShowAnalysis }: ExpenseTrackerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: '급여', amount: 2800000, category: '급여', date: '2025-08-01', type: 'income' },
    { id: 2, description: '스타벅스 커피', amount: 6500, category: '식비', date: '2025-08-14', type: 'expense', isAutoClassified: true },
    { id: 3, description: '지하철 교통카드', amount: 1400, category: '교통비', date: '2025-08-14', type: 'expense', isAutoClassified: true },
    { id: 4, description: '쿠팡 온라인 쇼핑', amount: 89000, category: '쇼핑', date: '2025-08-13', type: 'expense', isAutoClassified: true },
    { id: 5, description: 'CGV 영화관', amount: 15000, category: '문화생활', date: '2025-08-13', type: 'expense', isAutoClassified: true },
    { id: 6, description: '부업 수입', amount: 150000, category: '기타수입', date: '2025-08-12', type: 'income' },
    { id: 7, description: '마트 장보기', amount: 45000, category: '식비', date: '2025-08-12', type: 'expense' },
    { id: 8, description: '택시비', amount: 12000, category: '교통비', date: '2025-08-11', type: 'expense', isAutoClassified: true },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    expense: ['식비', '교통비', '쇼핑', '문화생활', '의료비', '공과금', '보험', '기타'],
    income: ['급여', '부업', '투자수익', '기타수입']
  };

  const autoClassifyTransaction = (description: string): { category: string; isAutoClassified: boolean } => {
    const keywords = {
      '식비': ['스타벅스', '맥도날드', '버거킹', '카페', '마트', '편의점', '음식', '커피', '치킨', '피자'],
      '교통비': ['지하철', '버스', '택시', '주차', '기름', '톨게이트', '교통카드'],
      '쇼핑': ['쿠팡', '11번가', '옥션', '이마트', '홈플러스', '의류', '화장품', '온라인'],
      '문화생활': ['CGV', '롯데시네마', '메가박스', '영화', '공연', '콘서트', '전시회', '도서'],
      '의료비': ['병원', '약국', '치과', '의료', '진료'],
      '공과금': ['전기', '가스', '수도', '통신', '인터넷', '휴대폰'],
    };

    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => description.toLowerCase().includes(keyword.toLowerCase()))) {
        return { category, isAutoClassified: true };
      }
    }
    return { category: '기타', isAutoClassified: false };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransaction) {
      // 수정 모드
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? {
              ...t,
              description: formData.description,
              amount: parseInt(formData.amount),
              category: formData.category || t.category,
              type: formData.type,
              date: formData.date,
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
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categorySpending = [
    { name: '식비', spent: 420000, budget: 500000, color: '#3b82f6' },
    { name: '교통비', spent: 180000, budget: 200000, color: '#10b981' },
    { name: '쇼핑', spent: 320000, budget: 300000, color: '#ef4444' },
    { name: '문화생활', spent: 150000, budget: 200000, color: '#8b5cf6' },
    { name: '기타', spent: 214000, budget: 250000, color: '#f59e0b' },
  ];

  // 도넛 차트 데이터
  const pieChartData = categorySpending.map(cat => ({
    name: cat.name,
    value: cat.spent,
  }));

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
              <PopoverContent className="w-auto p-0 shadow-lg border-2" align="end">
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
                />
              </PopoverContent>
            </Popover>
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
            <DialogTitle>{editingTransaction ? '거래 수정' : '새 거래 추가'}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? '거래 내역을 수정하세요.' : '새로운 거래를 추가하여 가계부를 관리하세요.'}
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
                <SelectContent>
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
                <SelectContent>
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

            <Button type="submit" className="w-full">
              {editingTransaction ? '수정하기' : '추가하기'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 도넛 차트 */}
      <AnimatedSection delay={0.1}>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">8월 지출 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => `₩${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {categorySpending.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: CHART_COLORS[index] }}
                  />
                  <span className="text-xs">{cat.name}</span>
                  <span className="text-xs font-medium ml-auto">₩{(cat.spent / 1000)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 요약 카드 */}
      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-3">
            <div className="text-center">
              <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">수입</div>
              <div className="text-sm font-semibold text-green-600">
                +₩{(totalIncome / 1000000).toFixed(1)}M
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="text-center">
              <TrendingDown className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <div className="text-xs text-muted-foreground">지출</div>
              <div className="text-sm font-semibold text-red-600">
                -₩{(totalExpense / 1000000).toFixed(1)}M
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
                ₩{((totalIncome - totalExpense) / 1000000).toFixed(1)}M
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
                        ₩{(category.spent / 1000)}K
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-1.5 ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>₩{((category.budget - category.spent) / 1000)}K 남음</span>
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
