# GitOps 배포 가이드

이 문서는 GitLab CI/CD를 사용하여 Kubernetes 클러스터에 애플리케이션을 배포하는 방법을 설명합니다.

## 📋 사전 요구사항

- GitLab 프로젝트
- Kubernetes 클러스터 (main-cluster)
- kubectl 설정
- GitLab Runner (Docker 및 Kubernetes executor)

## 🔧 GitLab 설정

### 1. GitLab Container Registry 활성화
프로젝트 Settings > General > Visibility > Container Registry 활성화

### 2. GitLab CI/CD 변수 설정
프로젝트 Settings > CI/CD > Variables에서 다음 변수 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `KUBE_CONFIG` | (base64 인코딩된 kubeconfig) | Kubernetes 클러스터 접근 정보 |
| `CI_REGISTRY` | registry.gitlab.com | GitLab Container Registry URL |
| `CI_REGISTRY_USER` | gitlab-ci-token | 자동 설정됨 |
| `CI_REGISTRY_PASSWORD` | $CI_JOB_TOKEN | 자동 설정됨 |

### 3. kubeconfig 인코딩 방법
```bash
# Linux/Mac
cat ~/.kube/config | base64 -w 0

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content ~/.kube/config -Raw)))
```

## 🐳 Kubernetes 설정

### 1. GitLab Container Registry Secret 생성
```bash
kubectl create secret docker-registry gitlab-registry-secret \
  --docker-server=registry.gitlab.com \
  --docker-username=<your-gitlab-username> \
  --docker-password=<your-gitlab-personal-access-token> \
  --docker-email=<your-email> \
  -n default
```

### 2. Personal Access Token 생성
GitLab > Settings > Access Tokens에서 생성
- Scopes: `read_registry`, `write_registry`

## 📦 배포 방법

### 자동 배포
1. main 브랜치에 코드 푸시
2. GitLab CI/CD 파이프라인 자동 실행
3. Build 스테이지 자동 실행
4. Deploy 스테이지는 수동으로 실행 (Manual)

### 수동 배포
GitLab > CI/CD > Pipelines에서 deploy 단계 수동 실행

### 로컬에서 수동 배포
```bash
# 1. 이미지 빌드
docker build -t registry.gitlab.com/your-group/family-frontend:latest .

# 2. 이미지 푸시
docker push registry.gitlab.com/your-group/family-frontend:latest

# 3. Kubernetes 배포
kubectl apply -f k8s/deployment.yaml

# 4. 배포 확인
kubectl get pods -n default -l app=family-frontend
kubectl get svc -n default -l app=family-frontend
kubectl get ingress -n default
```

## 🔍 배포 확인

### Pod 상태 확인
```bash
kubectl get pods -n default -l app=family-frontend
```

### 로그 확인
```bash
kubectl logs -f deployment/family-frontend -n default
```

### 서비스 상태 확인
```bash
kubectl get svc family-frontend -n default
```

### Ingress 확인
```bash
kubectl get ingress family-frontend -n default
```

## 🛠️ 트러블슈팅

### 이미지 Pull 실패
```bash
# Secret 확인
kubectl get secret gitlab-registry-secret -n default

# Secret 재생성
kubectl delete secret gitlab-registry-secret -n default
kubectl create secret docker-registry gitlab-registry-secret ...
```

### Pod 재시작
```bash
kubectl rollout restart deployment/family-frontend -n default
```

### 이전 버전으로 롤백
```bash
kubectl rollout undo deployment/family-frontend -n default
```

### 배포 히스토리 확인
```bash
kubectl rollout history deployment/family-frontend -n default
```

## 📝 파일 구조

```
.
├── .gitlab-ci.yml          # GitLab CI/CD 파이프라인
├── Dockerfile              # Docker 이미지 빌드
├── nginx.conf             # Nginx 설정
├── .dockerignore          # Docker 빌드 제외 파일
└── k8s/
    └── deployment.yaml    # Kubernetes 매니페스트
```

## 🚀 CI/CD 파이프라인 단계

### Build Stage
- Docker 이미지 빌드
- GitLab Container Registry에 푸시
- 태그: `latest`, `$CI_COMMIT_SHORT_SHA`

### Deploy Stage
- Kubernetes에 이미지 업데이트
- 롤아웃 상태 확인
- Pod 상태 확인

## 🔐 보안 고려사항

1. **GitLab Container Registry 접근 제어**
   - Private 레지스트리 사용
   - 적절한 권한 설정

2. **Kubernetes Secret 관리**
   - imagePullSecrets 사용
   - RBAC 설정

3. **SSL/TLS 설정**
   - cert-manager로 Let's Encrypt 인증서 자동 발급
   - HTTPS 강제 리다이렉트

## 📊 모니터링

### 리소스 사용량 확인
```bash
kubectl top pods -n default -l app=family-frontend
```

### 이벤트 확인
```bash
kubectl get events -n default --sort-by='.lastTimestamp'
```

## 🔄 업데이트 프로세스

1. 코드 수정
2. Git에 커밋 및 푸시
3. GitLab CI/CD 자동 빌드
4. 수동으로 배포 승인
5. Kubernetes 롤링 업데이트
6. 헬스체크 통과 확인

## 📞 문의

배포 관련 문제가 있을 경우 다음을 확인하세요:
- GitLab CI/CD 로그
- Kubernetes Pod 로그
- Ingress Controller 로그
