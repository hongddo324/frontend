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
import { Plus, Calendar, Heart, ImagePlus, X, MessageCircle, Send, ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Reply {
  id: number;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface Comment {
  id: number;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  replies: Reply[];
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface DailyEntry {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  media?: MediaItem[];
  caption: string;
  mood: 'good' | 'neutral' | 'bad';
  category: string;
  date: string;
  likes: string[]; // array of user IDs who liked
  comments: Comment[];
}

export function DailyLife() {
  const currentUserId = 'user_123'; // Current logged-in user
  const [entries, setEntries] = useState<DailyEntry[]>([
    {
      id: 1,
      userId: 'user_456',
      userName: '홍길동',
      userAvatar: '👨',
      date: '2025-08-14',
      title: '친구와 함께한 카페 나들이',
      caption: '오랜만에 친구와 카페에서 수다를 떨었다. 집에서 만든 커피도 좋지만, 가끔은 이런 여유도 필요하다는 걸 느꼈다. 새로운 메뉴도 맛있었고 분위기도 좋았다.',
      mood: 'good',
      category: '일상',
      media: [],
      likes: ['user_789', 'user_101', 'user_102'],
      comments: [
        {
          id: 1,
          userId: 'user_789',
          userName: '김민지',
          text: '좋은 시간 보내셨네요! 저도 가끔 그런 여유가 필요해요',
          timestamp: '2025-08-14',
          replies: [
            {
              id: 1,
              userId: 'user_456',
              userName: '홍길동',
              text: '감사합니다! 다음에 같이 가요',
              timestamp: '2025-08-14'
            }
          ]
        },
        {
          id: 2,
          userId: 'user_101',
          userName: '이준호',
          text: '어느 카페인가요? 분위기 좋아 보이네요!',
          timestamp: '2025-08-14',
          replies: []
        }
      ]
    },
    {
      id: 2,
      userId: 'user_123',
      userName: '나',
      userAvatar: '😊',
      date: '2025-08-13',
      title: '재택근무로 얻은 여유로운 하루',
      caption: '집에서 일하니 출퇴근 스트레스가 없어서 좋다. 점심도 직접 해먹고 집중도도 높았다. 저녁에는 운동도 할 수 있어서 건강한 하루를 보냈다.',
      mood: 'good',
      category: '일상',
      media: [],
      likes: ['user_123', 'user_456', 'user_789'],
      comments: []
    },
    {
      id: 3,
      userId: 'user_999',
      userName: '김철수',
      userAvatar: '👨‍💼',
      date: '2025-08-12',
      title: '재정 관리 자기계발서 완독',
      caption: '주말 내내 읽고 싶었던 책을 다 읽었다. 자기계발서였는데 재정 관리에 대한 좋은 인사이트를 많이 얻었다. 실천해봐야겠다.',
      mood: 'good',
      category: '취미',
      media: [],
      likes: ['user_123', 'user_456'],
      comments: [
        {
          id: 1,
          userId: 'user_789',
          userName: '박지영',
          text: '무슨 책인지 궁금해요! 추천해주세요',
          timestamp: '2025-08-12',
          replies: []
        }
      ]
    }
  ]);

  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ entryId: number; commentId: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'tag' | 'date'>('title');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState<{ [key: number]: boolean }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'good' | 'neutral' | 'bad',
    category: '',
    tags: '',
    media: [] as MediaItem[]
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
      userId: currentUserId,
      userName: '나',
      userAvatar: '😊',
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      caption: formData.content,
      mood: formData.mood,
      category: formData.category,
      media: formData.media,
      likes: [],
      comments: []
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      title: '',
      content: '',
      mood: 'neutral',
      category: '',
      tags: '',
      media: []
    });
    setIsDialogOpen(false);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
      setFormData({...formData, media: [...formData.media, ...newMedia]});
    }
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  const toggleLike = (entryId: number) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        const hasLiked = entry.likes.includes(currentUserId);
        return {
          ...entry,
          likes: hasLiked
            ? entry.likes.filter(id => id !== currentUserId)
            : [...entry.likes, currentUserId]
        };
      }
      return entry;
    }));

    if (selectedEntry && selectedEntry.id === entryId) {
      const hasLiked = selectedEntry.likes.includes(currentUserId);
      setSelectedEntry({
        ...selectedEntry,
        likes: hasLiked
          ? selectedEntry.likes.filter(id => id !== currentUserId)
          : [...selectedEntry.likes, currentUserId]
      });
    }
  };

  const addComment = (entryId: number) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      userId: currentUserId,
      userName: '나',
      text: commentText,
      timestamp: new Date().toISOString().split('T')[0],
      replies: []
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

  const addReply = (entryId: number, commentId: number) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: Date.now(),
      userId: currentUserId,
      userName: '나',
      text: replyText,
      timestamp: new Date().toISOString().split('T')[0]
    };

    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: entry.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, newReply]
              };
            }
            return comment;
          })
        };
      }
      return entry;
    }));

    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry({
        ...selectedEntry,
        comments: selectedEntry.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        })
      });
    }

    setReplyText('');
    setReplyingTo(null);
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
          return entry.title.toLowerCase().includes(lowerSearchTerm) || entry.caption.toLowerCase().includes(lowerSearchTerm);
        case 'tag':
          return entry.category.toLowerCase().includes(lowerSearchTerm);
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
          <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[80vh] overflow-y-auto">
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
                <Label>사진/동영상 추가</Label>
                <div className="flex items-center gap-2">
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                      <ImagePlus className="w-4 h-4" />
                      <span className="text-sm">사진/동영상 선택</span>
                    </div>
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.media.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {formData.media.length}개 선택됨
                    </span>
                  )}
                </div>
                {formData.media.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.media.map((item, index) => (
                      <div key={index} className="relative aspect-square">
                        {item.type === 'video' ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
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

      {/* 검색 - Collapsible */}
      <AnimatedSection delay={0.15}>
        <Card className="mb-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">검색</h3>
            </div>
            {isSearchOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {isSearchOpen && (
            <div className="px-4 pb-4 space-y-3">
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
          )}
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
            const hasLiked = entry.likes.includes(currentUserId);
            const visibleComments = showAllComments[entry.id] ? entry.comments : entry.comments.slice(0, 2);

            // 3일 이내 글인지 확인
            const entryDate = new Date(entry.date);
            const now = new Date();
            const diffInDays = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
            const isNew = diffInDays <= 3;

            return (
              <AnimatedSection key={entry.id} delay={index * 0.05}>
                <Card className="overflow-hidden bg-white border border-gray-200">
                  {/* Instagram-style Header */}
                  <div className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-lg">{entry.userAvatar}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{entry.userName}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isNew && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-red-500">
                          NEW
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="px-4 pb-2">
                    <h3 className="text-lg font-bold">{entry.title}</h3>
                  </div>

                  {/* Media Area */}
                  {entry.media && entry.media.length > 0 && (
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {entry.media.map((item, mediaIndex) => (
                            <CarouselItem key={mediaIndex}>
                              <div className="aspect-square bg-gray-100">
                                {item.type === 'video' ? (
                                  <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    controls
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={item.url}
                                    alt={`Post ${mediaIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {entry.media.length > 1 && (
                          <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="px-4 pt-3">

                    {/* Caption */}
                    <p className="text-sm text-gray-700 mb-3">{entry.caption}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(entry.id);
                        }}
                        className="hover:opacity-60 transition-opacity"
                      >
                        <Heart
                          className={`w-6 h-6 ${hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
                        />
                      </button>
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="hover:opacity-60 transition-opacity"
                      >
                        <MessageCircle className="w-6 h-6 text-gray-900" />
                      </button>
                      <button className="hover:opacity-60 transition-opacity">
                        <Send className="w-6 h-6 text-gray-900" />
                      </button>
                    </div>

                    {/* Like Count */}
                    {entry.likes.length > 0 && (
                      <p className="font-semibold text-sm mb-2">
                        좋아요 {entry.likes.length}개
                      </p>
                    )}

                    {/* View Comments Link */}
                    {entry.comments.length > 2 && !showAllComments[entry.id] && (
                      <button
                        onClick={() => setShowAllComments({ ...showAllComments, [entry.id]: true })}
                        className="text-sm text-gray-500 mb-2"
                      >
                        댓글 {entry.comments.length}개 모두 보기
                      </button>
                    )}

                    {/* Comments Preview */}
                    {visibleComments.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {visibleComments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5 flex-shrink-0">
                              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <span className="text-[10px]">👤</span>
                              </div>
                            </div>
                            <p className="text-sm flex-1">
                              <span className="font-semibold mr-2">{comment.userName}</span>
                              <span className="text-gray-900">{comment.text}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="border-t pt-3 pb-2">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="댓글 달기..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(entry.id);
                            }
                          }}
                          className="border-none focus-visible:ring-0 px-0 text-sm"
                        />
                        {commentText && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addComment(entry.id)}
                            className="text-blue-500 hover:text-blue-600 font-semibold"
                          >
                            게시
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            );
          })
        )}
      </div>

      {/* 상세보기 Dialog - Instagram Style */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[85vh] p-0 overflow-hidden bg-white">
            <ScrollArea className="max-h-[85vh]">
              <div className="p-0">
                {/* Header */}
                <div className="p-4 flex items-center gap-3 border-b">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedEntry(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-lg">{selectedEntry.userAvatar}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{selectedEntry.userName}</p>
                    <p className="text-xs text-gray-500">{selectedEntry.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedEntry.category}
                  </Badge>
                </div>

                {/* Title */}
                <div className="px-4 pt-2">
                  <h2 className="text-xl font-bold">{selectedEntry.title}</h2>
                </div>

                {/* Media */}
                {selectedEntry.media && selectedEntry.media.length > 0 && (
                  <div className="relative mt-3">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedEntry.media.map((item, mediaIndex) => (
                          <CarouselItem key={mediaIndex}>
                            <div className="aspect-square bg-gray-100">
                              {item.type === 'video' ? (
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  controls
                                  playsInline
                                />
                              ) : (
                                <img
                                  src={item.url}
                                  alt={`Post ${mediaIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {selectedEntry.media.length > 1 && (
                        <>
                          <CarouselPrevious />
                          <CarouselNext />
                        </>
                      )}
                    </Carousel>
                  </div>
                )}

                <div className="p-4">

                  {/* Caption */}
                  <p className="text-sm text-gray-700 mb-4">{selectedEntry.caption}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => toggleLike(selectedEntry.id)}
                      className="hover:opacity-60 transition-opacity"
                    >
                      <Heart
                        className={`w-7 h-7 ${selectedEntry.likes.includes(currentUserId) ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
                      />
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                      <MessageCircle className="w-7 h-7 text-gray-900" />
                    </button>
                    <button className="hover:opacity-60 transition-opacity">
                      <Send className="w-7 h-7 text-gray-900" />
                    </button>
                  </div>

                  {/* Like Count */}
                  {selectedEntry.likes.length > 0 && (
                    <p className="font-semibold text-sm mb-3">
                      좋아요 {selectedEntry.likes.length}개
                    </p>
                  )}

                  <Separator className="my-4" />

                  {/* Comments Section */}
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-sm">댓글</h3>
                    {selectedEntry.comments.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        첫 댓글을 남겨보세요!
                      </p>
                    ) : (
                      selectedEntry.comments.map((comment) => {
                        const replyKey = `${selectedEntry.id}-${comment.id}`;
                        return (
                          <div key={comment.id} className="space-y-2">
                            {/* Main Comment */}
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5 flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                  <span className="text-xs">👤</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 rounded-2xl px-3 py-2">
                                  <p className="font-semibold text-sm">{comment.userName}</p>
                                  <p className="text-sm text-gray-900">{comment.text}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 px-3">
                                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                  <button
                                    onClick={() => setReplyingTo({ entryId: selectedEntry.id, commentId: comment.id })}
                                    className="text-xs text-gray-500 font-semibold hover:text-gray-700"
                                  >
                                    답글 달기
                                  </button>
                                  {comment.replies.length > 0 && (
                                    <button
                                      onClick={() => setShowReplies({ ...showReplies, [replyKey]: !showReplies[replyKey] })}
                                      className="text-xs text-gray-500 font-semibold hover:text-gray-700"
                                    >
                                      {showReplies[replyKey] ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
                                    </button>
                                  )}
                                </div>

                                {/* Replies */}
                                {showReplies[replyKey] && comment.replies.length > 0 && (
                                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="flex items-start gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 p-0.5 flex-shrink-0">
                                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <span className="text-xs">👤</span>
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="bg-gray-50 rounded-2xl px-3 py-2">
                                            <p className="font-semibold text-xs">{reply.userName}</p>
                                            <p className="text-xs text-gray-900">{reply.text}</p>
                                          </div>
                                          <span className="text-xs text-gray-500 ml-3 mt-1 inline-block">
                                            {reply.timestamp}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Reply Input */}
                                {replyingTo?.entryId === selectedEntry.id && replyingTo?.commentId === comment.id && (
                                  <div className="mt-2 flex items-center gap-2 pl-4">
                                    <Input
                                      placeholder="답글 달기..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          addReply(selectedEntry.id, comment.id);
                                        }
                                      }}
                                      className="text-sm"
                                      autoFocus
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => addReply(selectedEntry.id, comment.id)}
                                      disabled={!replyText.trim()}
                                    >
                                      <Send className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                    >
                                      취소
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="댓글 달기..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addComment(selectedEntry.id);
                          }
                        }}
                        className="border-none focus-visible:ring-0 px-0"
                      />
                      {commentText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addComment(selectedEntry.id)}
                          className="text-blue-500 hover:text-blue-600 font-semibold"
                        >
                          게시
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}