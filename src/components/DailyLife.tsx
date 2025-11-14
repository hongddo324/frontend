import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { AnimatedSection } from './AnimatedSection';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Calendar, Heart, ImagePlus, X, MessageCircle, Send, ArrowLeft, Search } from 'lucide-react';

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

export function DailyLife() {
  const [entries, setEntries] = useState<DailyEntry[]>([
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

  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'tag' | 'date'>('title');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'good' | 'neutral' | 'bad',
    category: '',
    tags: '',
    images: [] as string[]
  });

  const categories = [
    '일상', '취미', '여행', '운동', '음식', '친구', '가족', '자기개발', '기타'
  ];

  const moodIcons = {
    good: { icon: '😊', color: 'text-green-600', bg: 'bg-green-100' },
    neutral: { icon: '😐', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    bad: { icon: '😞', color: 'text-red-600', bg: 'bg-red-100' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: DailyEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      content: formData.content,
      mood: formData.mood,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      images: formData.images,
      likes: 0,
      liked: false,
      comments: []
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      title: '',
      content: '',
      mood: 'neutral',
      category: '',
      tags: '',
      images: []
    });
    setIsDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({...formData, images: [...formData.images, ...newImages]});
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const toggleLike = (entryId: number) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          liked: !entry.liked,
          likes: entry.liked ? entry.likes - 1 : entry.likes + 1
        };
      }
      return entry;
    }));

    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry({
        ...selectedEntry,
        liked: !selectedEntry.liked,
        likes: selectedEntry.liked ? selectedEntry.likes - 1 : selectedEntry.likes + 1
      });
    }
  };

  const addComment = (entryId: number) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: '나',
      content: commentText,
      date: new Date().toISOString().split('T')[0],
      avatar: '😊'
    };

    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: [...entry.comments, newComment]
        };
      }
      return entry;
    }));

    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry({
        ...selectedEntry,
        comments: [...selectedEntry.comments, newComment]
      });
    }

    setCommentText('');
  };

  const moodStats = {
    good: entries.filter(e => e.mood === 'good').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    bad: entries.filter(e => e.mood === 'bad').length
  };

  // 검색 필터링
  const filteredEntries = entries.filter(entry => {
    if (searchType === 'date') {
      // 날짜 범위 검색
      if (!startDate && !endDate) return true;

      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return entryDate >= start && entryDate <= end;
      } else if (start) {
        return entryDate >= start;
      } else if (end) {
        return entryDate <= end;
      }
      return true;
    } else {
      if (!searchTerm) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();

      switch (searchType) {
        case 'title':
          return entry.title.toLowerCase().includes(lowerSearchTerm);
        case 'tag':
          return entry.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
        default:
          return true;
      }
    }
  });

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">일상</h1>
            <p className="text-sm text-muted-foreground">소중한 순간들을 기록하세요</p>
          </div>
        </div>
      </AnimatedSection>

      {/* 일상 기록 버튼 */}
      <AnimatedSection delay={0.05}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 mb-4 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              일상 기록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] max-w-[425px] mx-auto max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle>새 일상 기록</DialogTitle>
              <DialogDescription>오늘의 일상을 기록해보세요.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="오늘의 제목"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="오늘의 일상을 기록해보세요..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>사진 추가</Label>
                <div className="flex items-center gap-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                      <ImagePlus className="w-4 h-4" />
                      <span className="text-sm">사진 선택</span>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.images.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {formData.images.length}장 선택됨
                    </span>
                  )}
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="good">😊 좋음</SelectItem>
                      <SelectItem value="neutral">😐 보통</SelectItem>
                      <SelectItem value="bad">😞 안좋음</SelectItem>
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
                    <SelectContent className="bg-white dark:bg-gray-800">
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
                  placeholder="태그들을 쉼표로 구분 (예: 카페, 친구)"
                />
              </div>

              <Button type="submit" className="w-full">
                기록 저장
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </AnimatedSection>

      {/* 통계 카드 */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">총 기록</p>
                <p className="text-sm font-semibold">{entries.length}개</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">행복한 날</p>
                <p className="text-sm font-semibold text-green-600">{moodStats.good}일</p>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* 검색 */}
      <AnimatedSection delay={0.15}>
        <Card className="p-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">검색</h3>
            </div>
            <div className="flex gap-2">
              <Select value={searchType} onValueChange={(value: 'title' | 'tag' | 'date') => setSearchType(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="title">제목</SelectItem>
                  <SelectItem value="tag">태그</SelectItem>
                  <SelectItem value="date">날짜</SelectItem>
                </SelectContent>
              </Select>
              {searchType === 'date' ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="date"
                      placeholder="시작일"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 min-w-0 text-sm"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">~</span>
                    <Input
                      type="date"
                      placeholder="종료일"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 min-w-0 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative flex-1">
                  <Input
                    placeholder={
                      searchType === 'title' ? '제목 검색...' :
                      '태그 검색...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            {(searchTerm || startDate || endDate) && (
              <p className="text-xs text-muted-foreground">
                {filteredEntries.length}개의 결과를 찾았습니다.
              </p>
            )}
          </div>
        </Card>
      </AnimatedSection>

      {/* 일상 목록 */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? '검색 결과가 없습니다.' : '기록된 일상이 없습니다.'}
              </p>
            </div>
          </Card>
        ) : (
          filteredEntries.map((entry, index) => {
            const moodData = moodIcons[entry.mood];
            return (
              <AnimatedSection key={entry.id} delay={index * 0.05}>
                <Card 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEntry(entry)}
              >
                {/* 이미지 캐러셀 */}
                {entry.images.length > 0 && (
                  <div className="relative px-12">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {entry.images.map((img, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-video bg-muted">
                              <img
                                src={img}
                                alt={`${entry.title} ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </div>
                )}

                {/* 콘텐츠 */}
                <div className="p-4">
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
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className={`w-3 h-3 ${entry.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{entry.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{entry.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          );
        })
        )}
      </div>

      {/* 상세보기 Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="sm:max-w-[90vw] max-w-[425px] mx-auto max-h-[85vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
            <ScrollArea className="max-h-[85vh]">
              <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start gap-3 mb-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setSelectedEntry(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-full ${moodIcons[selectedEntry.mood].bg} flex items-center justify-center`}>
                        <span className="text-lg">{moodIcons[selectedEntry.mood].icon}</span>
                      </div>
                      <div>
                        <h2 className="font-semibold">{selectedEntry.title}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{selectedEntry.date}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {selectedEntry.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 이미지 */}
                {selectedEntry.images.length > 0 && (
                  <div className="mb-4">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedEntry.images.map((img, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={img}
                                alt={`${selectedEntry.title} ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                )}

                {/* 본문 */}
                <div className="mb-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedEntry.content}
                  </p>
                </div>

                {/* 태그 */}
                {selectedEntry.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {selectedEntry.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator className="my-4" />

                {/* 좋아요 및 댓글 버튼 */}
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => toggleLike(selectedEntry.id)}
                  >
                    <Heart className={`w-4 h-4 ${selectedEntry.liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{selectedEntry.likes}</span>
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedEntry.comments.length}개의 댓글</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* 댓글 목록 */}
                <div className="space-y-4 mb-4">
                  <h3 className="font-medium">댓글</h3>
                  {selectedEntry.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      첫 댓글을 남겨보세요!
                    </p>
                  ) : (
                    selectedEntry.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">{comment.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 댓글 작성 */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="댓글을 입력하세요..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(selectedEntry.id);
                      }
                    }}
                  />
                  <Button 
                    size="icon"
                    onClick={() => addComment(selectedEntry.id)}
                    disabled={!commentText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}