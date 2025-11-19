import { useState, useEffect } from 'react';
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
import { Plus, Calendar, Heart, ImagePlus, X, MessageCircle, Send, ArrowLeft, Trash2 } from 'lucide-react';

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

interface DailyLifeProps {
  entries: DailyEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DailyEntry[]>>;
}

export function DailyLife({ entries, setEntries }: DailyLifeProps) {
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'good' | 'neutral' | 'bad',
    category: '',
    tags: '',
    images: [] as string[]
  });

  // 다크모드 감지
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // 최근 24시간 이내 작성 여부 확인
  const isRecent = (date: string) => {
    const entryDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - entryDate.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours < 24;
  };

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
      const newMedia = Array.from(files).map(file => {
        const url = URL.createObjectURL(file);
        return url;
      });
      setFormData({...formData, images: [...formData.images, ...newMedia]});
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

  const deleteEntry = (entryId: number) => {
    if (confirm('이 일상 기록을 삭제하시겠습니까?')) {
      setEntries(entries.filter(entry => entry.id !== entryId));
      setSelectedEntry(null);
    }
  };

  const moodStats = {
    good: entries.filter(e => e.mood === 'good').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    bad: entries.filter(e => e.mood === 'bad').length
  };

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
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                      <ImagePlus className="w-4 h-4" />
                      <span className="text-sm">미디어 선택</span>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.images.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {formData.images.length}개 선택됨
                    </span>
                  )}
                </div>
                {formData.images.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {formData.images.map((media, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            {media.includes('video') || media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov') ? (
                              <video
                                src={media}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={media}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1} / {formData.images.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {formData.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
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
                    <SelectContent>
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

      {/* 일상 목록 */}
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const moodData = moodIcons[entry.mood];
          return (
            <AnimatedSection key={entry.id} delay={index * 0.05}>
              <Card 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEntry(entry)}
              >
                {/* 미디어 캐러셀 */}
                {entry.images.length > 0 && (
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {entry.images.map((media, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-video bg-muted relative">
                              {media.includes('video') || media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov') ? (
                                <video
                                  src={media}
                                  controls
                                  className="w-full h-full object-cover"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <img
                                  src={media}
                                  alt={`${entry.title} ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {entry.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {imgIndex + 1} / {entry.images.length}
                                </div>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {entry.images.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2" onClick={(e) => e.stopPropagation()} />
                          <CarouselNext className="right-2" onClick={(e) => e.stopPropagation()} />
                        </>
                      )}
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
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                          {isRecent(entry.date) && (
                            <Badge
                              className={`text-xs px-1.5 py-0.5 ${
                                isDarkMode
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              NEW
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 ml-2 flex-shrink-0">
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
        })}
      </div>

      {/* 상세보기 Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[85vh] p-0 overflow-hidden">
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
                      <div className="flex-1">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteEntry(selectedEntry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* 미디어 */}
                {selectedEntry.images.length > 0 && (
                  <div className="mb-4">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedEntry.images.map((media, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                              {media.includes('video') || media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov') ? (
                                <video
                                  src={media}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={media}
                                  alt={`${selectedEntry.title} ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {selectedEntry.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {imgIndex + 1} / {selectedEntry.images.length}
                                </div>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {selectedEntry.images.length > 1 && (
                        <>
                          <CarouselPrevious />
                          <CarouselNext />
                        </>
                      )}
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