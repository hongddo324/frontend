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
import { Plus, Calendar, Users, Heart, MessageCircle, Send, Trash2, Edit2 } from 'lucide-react';
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
    { value: 'bg-blue-500', label: '파랑' },
    { value: 'bg-green-500', label: '초록' },
    { value: 'bg-red-500', label: '빨강' },
    { value: 'bg-yellow-500', label: '노랑' },
    { value: 'bg-purple-500', label: '보라' },
    { value: 'bg-pink-500', label: '분홍' },
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

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => event.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  // 달력에 이벤트가 있는 날짜를 표시하기 위한 함수
  const modifiers = {
    hasEvent: events.map(event => new Date(event.date)),
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%',
    },
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
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-8 h-8 rounded-full ${color.value} ${
                          formData.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                      />
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
        <Card>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0 w-full"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* 선택된 날짜의 일정 목록 */}
      <AnimatedSection delay={0.2}>
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {selectedDate ? format(selectedDate, 'M월 d일 일정', { locale: ko }) : '날짜를 선택하세요'}
            <Badge variant="secondary" className="ml-auto">
              {eventsForSelectedDate.length}개
            </Badge>
          </h2>

          {eventsForSelectedDate.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>이 날짜에 일정이 없습니다</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventDialogOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-1 h-16 rounded-full ${event.color}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className={`w-3 h-3 ${event.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{event.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{event.comments.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.author.name}</span>
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
                    <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {format(new Date(selectedEvent.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-1">
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
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </Avatar>
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
