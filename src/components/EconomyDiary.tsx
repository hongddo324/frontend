import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Plus, Calendar, TrendingUp, Target, Heart, DollarSign } from 'lucide-react';

interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  mood: 'good' | 'neutral' | 'bad';
  category: string;
  tags: string[];
  financialGoal?: string;
  achievement?: string;
}

export function EconomyDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: 1,
      date: '2025-08-14',
      title: '커피값 줄이기 시작',
      content: '오늘부터 매일 사던 스타벅스 커피를 줄이기로 했다. 집에서 커피를 만들어 마시니 하루에 6,500원씩 절약할 수 있다. 한 달이면 약 20만원을 절약할 수 있을 것 같다. 작은 습관 변화로도 큰 차이를 만들 수 있다는 걸 느꼈다.',
      mood: 'good',
      category: '절약',
      tags: ['커피', '습관변화', '절약'],
      financialGoal: '월 20만원 식비 절약',
      achievement: '첫 번째 날 성공'
    },
    {
      id: 2,
      date: '2025-08-13',
      title: '영화관 대신 넷플릭스',
      content: '친구들과 영화를 보러 갈 뻔했는데, 집에서 넷플릭스로 같이 보기로 했다. 영화표값 15,000원과 팝콘값을 절약했다. 집에서도 충분히 즐거웠고, 더 편안하게 영화를 감상할 수 있었다.',
      mood: 'good',
      category: '문화생활',
      tags: ['영화', '대안선택', '절약'],
      achievement: '3만원 절약'
    },
    {
      id: 3,
      date: '2025-08-12',
      title: '부업 수입 첫 달성',
      content: '드디어 부업으로 15만원을 벌었다! 주말에 온라인 과외를 하면서 용돈을 벌 수 있게 되었다. 이 돈으로 비상금을 늘려나가고 싶다. 시간 관리가 조금 힘들지만 목표를 위해 계속 해보려고 한다.',
      mood: 'good',
      category: '수입',
      tags: ['부업', '과외', '목표달성'],
      financialGoal: '월 부업 수입 20만원',
      achievement: '첫 달 15만원 달성'
    },
    {
      id: 4,
      date: '2025-08-11',
      title: '충동구매 반성',
      content: '오늘 쿠팡에서 필요하지도 않은 물건을 충동적으로 샀다. 8만원이나 되는 금액이었는데, 사고 나서 후회가 밀려왔다. 앞으로는 장바구니에 담고 하루 정도 기다려보는 규칙을 만들어야겠다.',
      mood: 'bad',
      category: '반성',
      tags: ['충동구매', '온라인쇼핑', '후회'],
      financialGoal: '충동구매 줄이기'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'good' | 'neutral' | 'bad',
    category: '',
    tags: '',
    financialGoal: '',
    achievement: ''
  });

  const categories = [
    '절약', '투자', '수입', '지출관리', '목표설정', '반성', '문화생활', '계획', '성취', '기타'
  ];

  const moodIcons = {
    good: { icon: '😊', color: 'text-green-600', bg: 'bg-green-100' },
    neutral: { icon: '😐', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    bad: { icon: '😞', color: 'text-red-600', bg: 'bg-red-100' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: DiaryEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      content: formData.content,
      mood: formData.mood,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      financialGoal: formData.financialGoal || undefined,
      achievement: formData.achievement || undefined
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      title: '',
      content: '',
      mood: 'neutral',
      category: '',
      tags: '',
      financialGoal: '',
      achievement: ''
    });
    setIsDialogOpen(false);
  };

  const moodStats = {
    good: entries.filter(e => e.mood === 'good').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    bad: entries.filter(e => e.mood === 'bad').length
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">경제 일기</h1>
          <p className="text-sm text-muted-foreground">재정 관리 여정을 기록하세요</p>
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg z-10 bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 경제 일기</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="오늘의 경제 활동 제목"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="오늘의 경제 활동과 생각을 자유롭게 적어보세요..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mood">기분</Label>
                <Select 
                  value={formData.mood} 
                  onValueChange={(value: 'good' | 'neutral' | 'bad') => 
                    setFormData({...formData, mood: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">😊 좋음</SelectItem>
                    <SelectItem value="neutral">😐 보통</SelectItem>
                    <SelectItem value="bad">😞 아쉬움</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="태그들을 쉼표로 구분 (예: 절약, 투자)"
              />
            </div>

            <Button type="submit" className="w-full">
              일기 저장
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 통계 카드 - 모바일 최적화 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">총 일기</p>
              <p className="text-sm font-semibold">{entries.length}개</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">긍정적인 날</p>
              <p className="text-sm font-semibold text-green-600">{moodStats.good}일</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 일기 목록 */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const moodData = moodIcons[entry.mood];
          return (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${moodData.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-sm">{moodData.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 ml-2">
                      {entry.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.date}</span>
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="flex gap-1">
                        {entry.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{entry.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {(entry.financialGoal || entry.achievement) && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      {entry.financialGoal && (
                        <div className="flex items-center gap-1 mb-1">
                          <Target className="w-3 h-3 text-blue-600" />
                          <p className="text-xs text-blue-600 truncate">{entry.financialGoal}</p>
                        </div>
                      )}
                      {entry.achievement && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <p className="text-xs text-green-600 truncate">{entry.achievement}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}