// 배포 시간 표시
document.addEventListener('DOMContentLoaded', function() {
    const deployTimeElement = document.getElementById('deploy-time');
    if (deployTimeElement) {
        const now = new Date();
        const koreanTime = now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Seoul'
        });
        deployTimeElement.textContent = koreanTime;
    }
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 페이지 로드 시 애니메이션 초기화
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .info');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 간단한 인터랙션 효과
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 콘솔에 배포 정보 출력
console.log('🚀 Test Web 애플리케이션이 로드되었습니다!');
console.log('📦 Kubernetes + ArgoCD + GitHub으로 배포됨');
console.log('⏰ 로드 시간:', new Date().toLocaleString('ko-KR'));
