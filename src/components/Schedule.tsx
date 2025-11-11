import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar as CalendarComponent } from './ui/calendar';
import { AnimatedSection } from './AnimatedSection';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Plus, Calendar, Users, Heart, MessageCircle, Send, Trash2, Edit2, Share2, Copy, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScheduleEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  color: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  author: {
    name: string;
    avatar: string;
  };
}

interface Comment {
  id: number;
  author: string;
  authorId: number;
  content: string;
  date: string;
  avatar: string;
}

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: 1,
      date: '2025-11-15',
      title: '팀 회의',
      description: '월간 팀 회의 및 프로젝트 진행 상황 공유',
      color: 'bg-blue-500',
      likes: 5,
      liked: false,
      comments: [
        {
          id: 1,
          author: '김민수',
          authorId: 2,
          content: '참석하겠습니다!',
          date: '2025-11-09',
          avatar: '',
        },
      ],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 2,
      date: '2025-11-20',
      title: '생일 파티',
      description: '친구 생일 파티 🎉',
      color: 'bg-pink-500',
      likes: 12,
      liked: true,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 3,
      date: '2025-11-15',
      title: '운동',
      description: '헬스장 가기',
      color: 'bg-green-500',
      likes: 3,
      liked: false,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 4,
      date: '2025-11-18',
      title: '병원 예약',
      description: '오후 3시 정기 검진',
      color: 'bg-red-500',
      likes: 1,
      liked: false,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 5,
      date: '2025-11-22',
      title: '프로젝트 마감',
      description: '최종 제출 및 발표 준비',
      color: 'bg-purple-500',
      likes: 8,
      liked: false,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 6,
      date: '2025-11-25',
      title: '저녁 약속',
      description: '친구들과 저녁 식사',
      color: 'bg-orange-500',
      likes: 6,
      liked: true,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
    {
      id: 7,
      date: '2025-11-15',
      title: '독서',
      description: '저녁 독서 시간',
      color: 'bg-yellow-500',
      likes: 2,
      liked: false,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    color: 'bg-blue-500',
  });

  const colorOptions = [
    { value: 'bg-blue-500', label: '파랑', hex: '#3b82f6' },
    { value: 'bg-green-500', label: '초록', hex: '#22c55e' },
    { value: 'bg-red-500', label: '빨강', hex: '#ef4444' },
    { value: 'bg-yellow-500', label: '노랑', hex: '#eab308' },
    { value: 'bg-purple-500', label: '보라', hex: '#a855f7' },
    { value: 'bg-pink-500', label: '분홍', hex: '#ec4899' },
    { value: 'bg-orange-500', label: '주황', hex: '#f97316' },
    { value: 'bg-gray-500', label: '회색', hex: '#6b7280' },
  ];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ScheduleEvent = {
      id: Date.now(),
      date: formData.date,
      title: formData.title,
      description: formData.description,
      color: formData.color,
      likes: 0,
      liked: false,
      comments: [],
      author: {
        name: '김가계',
        avatar: '',
      },
    };
    setEvents([...events, newEvent]);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      color: 'bg-blue-500',
    });
    setIsAddDialogOpen(false);
  };

  const handleLike = (eventId: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          liked: !event.liked,
          likes: event.liked ? event.likes - 1 : event.likes + 1,
        };
      }
      return event;
    }));

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        liked: !selectedEvent.liked,
        likes: selectedEvent.liked ? selectedEvent.likes - 1 : selectedEvent.likes + 1,
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedEvent) return;

    const comment: Comment = {
      id: Date.now(),
      author: '김가계',
      authorId: 1,
      content: newComment,
      date: format(new Date(), 'yyyy-MM-dd'),
      avatar: '',
    };

    const updatedEvent = {
      ...selectedEvent,
      comments: [...selectedEvent.comments, comment],
    };

    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: number) => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      comments: selectedEvent.comments.filter(c => c.id !== commentId),
    };

    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      setEvents(events.filter(e => e.id !== eventId));
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  // 공유 기능 핸들러
  const handleShareURL = (event: ScheduleEvent) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?schedule=${event.id}&date=${event.date}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('일정 링크가 클립보드에 복사되었습니다!');
    }).catch(() => {
      alert('링크 복사에 실패했습니다.');
    });
  };

  const handleShareKakao = (event: ScheduleEvent) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?schedule=${event.id}&date=${event.date}`;
    const text = `${event.title}\n${event.description}\n${format(new Date(event.date), 'yyyy년 M월 d일 (E)', { locale: ko })}`;

    // 카카오톡 웹 공유 URL 스킴 사용
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=YOUR_APP_KEY&validation_action=share&validation_params=${encodeURIComponent(JSON.stringify({ url: shareUrl, text: text }))}`;

    // 모바일 환경에서는 직접 앱 열기, 데스크톱에서는 알림
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(kakaoUrl, '_blank');
    } else {
      // 데스크톱에서는 URL을 복사하고 안내 메시지 표시
      navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      alert('일정 정보가 복사되었습니다!\n카카오톡에 붙여넣기 해주세요.');
    }
  };

  const handleShareTelegram = (event: ScheduleEvent) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?schedule=${event.id}&date=${event.date}`;
    const text = `${event.title}\n${event.description}\n${format(new Date(event.date), 'yyyy년 M월 d일 (E)', { locale: ko })}`;

    // 텔레그램 공유 URL
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => event.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  // 특정 날짜의 이벤트 목록을 가져오는 함수
  const getEventsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateString);
  };

  // 색상 클래스를 실제 색상 코드로 변환하는 함수
  const getColorFromClass = (colorClass: string): string => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-pink-500': '#ec4899',
      'bg-orange-500': '#f97316',
      'bg-gray-500': '#6b7280',
    };
    return colorMap[colorClass] || '#3b82f6';
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full pb-24">
      {/* 헤더 */}
      <AnimatedSection>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">일정</h1>
            <p className="text-sm text-muted-foreground">공유 달력으로 일정을 관리하세요</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                일정 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] mx-4">
              <DialogHeader>
                <DialogTitle>새 일정 추가</DialogTitle>
                <DialogDescription>
                  공유 달력에 새로운 일정을 추가하세요
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="일정 제목을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="일정 설명을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">날짜</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>색상</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                          formData.color === color.value
                            ? 'border-primary bg-primary/5 scale-105'
                            : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${color.value} shadow-sm`} />
                        <span className="text-xs font-medium">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  일정 추가
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      {/* 달력 */}
      <AnimatedSection delay={0.1}>
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-purple-900 font-semibold">공유 달력</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100/50">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0 w-full"
                locale={ko}
                components={{
                  DayContent: ({ date }) => {
                    const dayEvents = getEventsForDate(date);
                    return (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <span>{date.getDate()}</span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5 absolute bottom-0.5">
                            {dayEvents.slice(0, 3).map((event, index) => (
                              <div
                                key={event.id}
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: getColorFromClass(event.color) }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 선택된 날짜의 일정 목록 */}
      <AnimatedSection delay={0.2}>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-900">
            <Calendar className="w-5 h-5 text-green-600" />
            {selectedDate ? format(selectedDate, 'M월 d일 일정', { locale: ko }) : '날짜를 선택하세요'}
            <Badge variant="secondary" className="ml-auto bg-green-600 text-white hover:bg-green-700">
              {eventsForSelectedDate.length}개
            </Badge>
          </h2>

          {eventsForSelectedDate.length === 0 ? (
            <Card className="p-8 bg-white border-green-100">
              <div className="text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50 text-green-300" />
                <p>이 날짜에 일정이 없습니다</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-white border-2 border-transparent hover:border-green-200"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventDialogOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-1.5 h-16 rounded-full ${event.color} shadow-md`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full">
                            <Heart className={`w-3 h-3 ${event.liked ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
                            <span className="font-medium text-red-600">{event.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span className="font-medium text-blue-600">{event.comments.length}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                            <Users className="w-3 h-3 text-purple-400" />
                            <span className="font-medium text-purple-600">{event.author.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* 일정 상세 모달 */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] mx-4 max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedEvent.color} shadow-sm`} />
                      <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                    </div>
                    <DialogDescription className="mt-2">
                      {format(new Date(selectedEvent.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareURL(selectedEvent);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          URL 복사
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareKakao(selectedEvent);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          카카오톡 공유
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareTelegram(selectedEvent);
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          텔레그램 공유
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('수정 기능은 준비 중입니다.');
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(selectedEvent.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* 일정 내용 */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm">일정 내용</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>

                <Separator />

                {/* 작성자 정보 */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedEvent.author.avatar} />
                    <AvatarFallback>{selectedEvent.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedEvent.author.name}</p>
                    <p className="text-xs text-muted-foreground">작성자</p>
                  </div>
                </div>

                <Separator />

                {/* 좋아요 */}
                <div>
                  <Button
                    variant={selectedEvent.liked ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLike(selectedEvent.id)}
                    className="w-full"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${selectedEvent.liked ? 'fill-white' : ''}`} />
                    좋아요 {selectedEvent.likes}
                  </Button>
                </div>

                <Separator />

                {/* 댓글 섹션 */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    댓글 {selectedEvent.comments.length}
                  </h4>

                  {/* 댓글 목록 */}
                  <div className="space-y-3 mb-4">
                    {selectedEvent.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5 flex-shrink-0">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            {comment.avatar ? (
                              <img src={comment.avatar} alt={comment.author} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <Avatar className="w-full h-full">
                                <AvatarFallback className="text-xs bg-transparent">{comment.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-accent rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{comment.author}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-600"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 ml-1">{comment.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 댓글 입력 */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
