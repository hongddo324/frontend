import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AnimatedSection } from './AnimatedSection';
import { Lock, Mail, Wallet } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 임시 로그인 로직 (실제로는 API 호출)
    try {
      // 간단한 유효성 검사
      if (!formData.email || !formData.password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('비밀번호는 최소 8자 이상이어야 합니다.');
        setIsLoading(false);
        return;
      }

      // 임시 딜레이 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 로그인 성공
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatedSection>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold mb-1">스마트 가계부</h1>
            <p className="text-sm text-muted-foreground">똑똑한 소비를 위한 첫걸음</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Card>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold">로그인</CardTitle>
              <CardDescription className="text-sm">
                이메일 주소로 로그인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="8자 이상 입력하세요"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => alert('비밀번호 찾기 기능은 준비 중입니다.')}
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => alert('회원가입 기능은 준비 중입니다.')}
              >
                회원가입
              </button>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
