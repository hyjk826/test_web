# Test Web - Kubernetes + ArgoCD + GitHub

이 프로젝트는 간단한 정적 웹페이지를 Kubernetes 클러스터에 ArgoCD와 GitHub Actions를 사용하여 자동으로 배포하는 예제입니다.

## 🏗️ 아키텍처

```
GitHub Repository
       ↓
GitHub Actions (CI/CD)
       ↓
Docker Registry (GHCR)
       ↓
ArgoCD (GitOps)
       ↓
Kubernetes Cluster
```

## 📁 프로젝트 구조

```
test_web/
├── index.html              # 메인 HTML 파일
├── styles.css              # CSS 스타일
├── script.js               # JavaScript
├── Dockerfile              # Docker 이미지 빌드
├── nginx.conf              # Nginx 설정
├── k8s/                    # Kubernetes 매니페스트
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
├── argocd/                 # ArgoCD 설정
│   ├── application.yaml
│   └── app-of-apps.yaml
├── .github/workflows/      # GitHub Actions
│   ├── ci-cd.yml
│   └── argocd-sync.yml
└── README.md
```

## 🚀 배포 방법

### 1. GitHub 저장소 설정

1. 이 프로젝트를 GitHub에 푸시합니다:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/test_web.git
git push -u origin main
```

2. GitHub 저장소 설정에서 다음 시크릿을 추가합니다:
   - `KUBE_CONFIG`: Kubernetes 클러스터 접근을 위한 kubeconfig (base64 인코딩)

### 2. ArgoCD 설정

1. ArgoCD가 설치되어 있는지 확인합니다:
```bash
kubectl get pods -n argocd
```

2. ArgoCD Application을 배포합니다:
```bash
# ArgoCD Application 생성
kubectl apply -f argocd/application.yaml

# 또는 App of Apps 패턴 사용
kubectl apply -f argocd/app-of-apps.yaml
```

3. ArgoCD UI에서 배포 상태를 확인합니다:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
# 브라우저에서 https://localhost:8080 접속
```

### 3. 수동 배포 (ArgoCD 없이)

```bash
# 네임스페이스 생성
kubectl apply -f k8s/namespace.yaml

# 애플리케이션 배포
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

## 🔧 설정 변경

### Docker 이미지 빌드 및 푸시

```bash
# Docker 이미지 빌드
docker build -t test-web:latest .

# GitHub Container Registry에 푸시
docker tag test-web:latest ghcr.io/YOUR_USERNAME/test_web:latest
docker push ghcr.io/YOUR_USERNAME/test_web:latest
```

### Kubernetes 매니페스트 수정

- `k8s/deployment.yaml`: 이미지 태그, 리소스 제한, 환경 변수 등
- `k8s/ingress.yaml`: 도메인, SSL 설정 등
- `k8s/hpa.yaml`: 오토스케일링 설정

### ArgoCD 설정 수정

- `argocd/application.yaml`: GitHub 저장소 URL, 네임스페이스 등

## 📊 모니터링

### 애플리케이션 상태 확인

```bash
# Pod 상태 확인
kubectl get pods -n test-web

# 서비스 상태 확인
kubectl get svc -n test-web

# Ingress 상태 확인
kubectl get ingress -n test-web

# HPA 상태 확인
kubectl get hpa -n test-web
```

### 로그 확인

```bash
# 애플리케이션 로그
kubectl logs -f deployment/test-web -n test-web

# Nginx 로그
kubectl logs -f deployment/test-web -n test-web -c test-web
```

## 🔄 CI/CD 워크플로우

1. **코드 푸시**: GitHub에 코드를 푸시하면 GitHub Actions가 자동으로 실행됩니다.
2. **Docker 빌드**: Docker 이미지가 빌드되고 GitHub Container Registry에 푸시됩니다.
3. **ArgoCD 동기화**: ArgoCD가 새로운 이미지를 감지하고 Kubernetes에 배포합니다.
4. **자동 롤백**: 배포 실패 시 자동으로 이전 버전으로 롤백됩니다.

## 🛠️ 개발 환경

### 로컬 개발

```bash
# Nginx로 로컬 서빙
docker run -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx:alpine

# 또는 Python으로 간단한 서버
python3 -m http.server 8000
```

### Docker Compose (로컬 테스트)

```yaml
version: '3.8'
services:
  test-web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=development
```

## 📝 주요 기능

- ✅ **정적 웹페이지**: HTML, CSS, JavaScript
- ✅ **Docker 컨테이너화**: Nginx 기반
- ✅ **Kubernetes 배포**: Deployment, Service, Ingress, HPA
- ✅ **GitOps**: ArgoCD를 통한 자동 배포
- ✅ **CI/CD**: GitHub Actions 파이프라인
- ✅ **오토스케일링**: HPA를 통한 자동 스케일링
- ✅ **헬스체크**: Liveness 및 Readiness 프로브
- ✅ **보안**: Nginx 보안 헤더 설정

## 🔗 유용한 링크

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [ArgoCD 공식 문서](https://argo-cd.readthedocs.io/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Nginx 공식 문서](https://nginx.org/en/docs/)

## 📞 지원

문제가 발생하거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**Happy Deploying! 🚀**
