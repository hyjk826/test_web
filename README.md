# 정적 웹페이지 - ArgoCD + GitHub Actions + Kubernetes + GHCR.io + Helm Chart

이 프로젝트는 정적 웹페이지를 위한 완전한 CI/CD 파이프라인을 제공합니다.

## 🏗️ 아키텍처

```
GitHub Repository
       ↓
GitHub Actions (CI/CD)
       ↓
GHCR.io (Container Registry)
       ↓
ArgoCD (GitOps)
       ↓
Kubernetes (Orchestration)
       ↓
정적 웹페이지 (Nginx)
```

## 📁 프로젝트 구조

```
.
├── web/                          # 정적 웹페이지 파일
│   ├── index.html               # 메인 HTML 파일
│   ├── style.css               # CSS 스타일
│   └── script.js               # JavaScript
├── helm/                        # Helm Chart
│   └── static-web/
│       ├── Chart.yaml          # Chart 메타데이터
│       ├── values.yaml         # 기본 값
│       └── templates/          # Kubernetes 템플릿
├── argocd/                      # ArgoCD 설정
│   ├── application.yaml        # ArgoCD 애플리케이션
│   ├── app-of-apps.yaml        # App of Apps 패턴
│   └── project.yaml            # ArgoCD 프로젝트
├── .github/workflows/           # GitHub Actions
│   └── ci.yml                  # CI/CD 워크플로우
├── Dockerfile                   # Docker 이미지 빌드
└── README.md                    # 이 파일
```

## 🚀 주요 기능

### 1. 정적 웹페이지
- **HTML5**: 현대적인 웹 표준
- **CSS3**: 반응형 디자인과 애니메이션
- **JavaScript**: 인터랙티브 기능
- **Nginx**: 고성능 웹 서버

### 2. CI/CD 파이프라인
- **GitHub Actions**: 자동화된 빌드 및 배포
- **GHCR.io**: GitHub Container Registry
- **Multi-platform**: AMD64, ARM64 지원
- **Security**: Trivy 취약점 스캔

### 3. GitOps 배포
- **ArgoCD**: GitOps 기반 배포 자동화
- **Helm Chart**: Kubernetes 애플리케이션 패키징
- **App of Apps**: 중앙 집중식 애플리케이션 관리

### 4. Kubernetes 운영
- **HPA**: 자동 스케일링
- **NetworkPolicy**: 네트워크 보안
- **ServiceAccount**: RBAC
- **ConfigMap**: 설정 관리

## 🛠️ 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| **Nginx** | stable-alpine | 웹 서버 |
| **Kubernetes** | 1.28+ | 컨테이너 오케스트레이션 |
| **Helm** | 3.12+ | 패키지 관리 |
| **ArgoCD** | 2.8+ | GitOps |
| **GitHub Actions** | Latest | CI/CD |
| **GHCR.io** | Latest | 컨테이너 레지스트리 |

## 📋 사전 요구사항

### 로컬 개발 환경
- Docker 20.10+
- kubectl 1.28+
- Helm 3.12+
- Git 2.30+

### Kubernetes 클러스터
- Kubernetes 1.28+
- Ingress Controller (Traefik/Nginx)
- ArgoCD 2.8+

### GitHub 설정
- GitHub Repository
- GitHub Actions 활성화
- GHCR.io 접근 권한

## 🚀 배포 가이드

### 1. 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/hyjk826/test_web.git
cd test_web

# Docker 이미지 빌드
docker build -t static-web:latest .

# 로컬 실행
docker run -p 8080:80 static-web:latest
```

### 2. Helm Chart 배포

```bash
# Helm Chart 패키징
helm package helm/static-web

# Helm Chart 설치
helm install static-web ./static-web-0.1.0.tgz \
  --namespace web \
  --create-namespace \
  --set image.tag=latest
```

### 3. ArgoCD 배포

```bash
# ArgoCD 프로젝트 생성
kubectl apply -f argocd/project.yaml

# ArgoCD 애플리케이션 생성
kubectl apply -f argocd/application.yaml

# 배포 상태 확인
kubectl get applications -n argocd
```

## 🔧 설정

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `IMAGE_TAG` | latest | Docker 이미지 태그 |
| `NAMESPACE` | web | Kubernetes 네임스페이스 |
| `INGRESS_HOST` | web.example.local | Ingress 호스트 |

### Helm Values

```yaml
# helm/static-web/values.yaml
replicaCount: 1
image:
  repository: ghcr.io/hyjk826/static-web
  tag: latest
ingress:
  enabled: true
  hosts:
    - host: web.example.local
      paths:
        - path: /
          pathType: Prefix
```

## 📊 모니터링

### 메트릭
- **Prometheus**: 애플리케이션 메트릭
- **Grafana**: 시각화
- **AlertManager**: 알림

### 로그
- **Fluentd**: 로그 수집
- **Elasticsearch**: 로그 저장
- **Kibana**: 로그 분석

## 🔒 보안

### 컨테이너 보안
- **Non-root**: 비루트 사용자 실행
- **Read-only**: 읽기 전용 파일시스템
- **Capabilities**: 최소 권한 원칙

### 네트워크 보안
- **NetworkPolicy**: 네트워크 트래픽 제어
- **TLS**: 암호화 통신
- **Security Headers**: 웹 보안 헤더

## 🚨 문제 해결

### 일반적인 문제

1. **이미지 Pull 실패**
   ```bash
   # 이미지 Pull Secret 확인
   kubectl get secrets -n web
   kubectl describe secret ghcr-creds -n web
   ```

2. **Ingress 접근 불가**
   ```bash
   # Ingress Controller 확인
   kubectl get pods -n ingress-nginx
   kubectl get ingress -n web
   ```

3. **ArgoCD 동기화 실패**
   ```bash
   # ArgoCD 애플리케이션 상태 확인
   kubectl get applications -n argocd
   kubectl describe application static-web -n argocd
   ```

### 로그 확인

```bash
# 애플리케이션 로그
kubectl logs -f deployment/static-web -n web

# ArgoCD 로그
kubectl logs -f deployment/argocd-server -n argocd
```

## 📈 성능 최적화

### 리소스 튜닝
```yaml
resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

### HPA 설정
```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

문제가 있거나 질문이 있으시면 다음을 통해 연락해주세요:

- **Issues**: [GitHub Issues](https://github.com/hyjk826/test_web/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hyjk826/test_web/discussions)

---

**Happy Coding! 🚀**
