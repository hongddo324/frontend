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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">스마트 가계부</h1>
            <p className="text-gray-600">똑똑한 소비를 위한 첫걸음</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">로그인</CardTitle>
              <CardDescription>
                이메일 주소로 로그인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
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
                  <Label htmlFor="password">비밀번호</Label>
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
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
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => alert('회원가입 기능은 준비 중입니다.')}
              >
                회원가입
              </button>
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              로그인하시면{' '}
              <a href="#" className="text-primary hover:underline">이용약관</a>
              {' '}및{' '}
              <a href="#" className="text-primary hover:underline">개인정보처리방침</a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
