// 정적 웹페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 정적 웹페이지가 로드되었습니다!');
    
    // 현재 시간 표시
    updateTime();
    setInterval(updateTime, 1000);
    
    // 애니메이션 효과
    addScrollAnimations();
    
    // 상태 정보 업데이트
    updateStatus();
});

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 시간 정보가 표시될 요소가 있다면 업데이트
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function addScrollAnimations() {
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
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.step, .feature-card, .status-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function updateStatus() {
    // 배포 상태 시뮬레이션
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        const value = item.querySelector('.value');
        if (value && value.textContent.includes('상태')) {
            // 실제 환경에서는 API 호출로 실제 상태를 가져올 수 있습니다
            value.innerHTML = '<span class="status-healthy">✅ 정상</span>';
        }
    });
}

// 파이프라인 단계 클릭 이벤트
document.addEventListener('click', function(e) {
    if (e.target.closest('.step')) {
        const step = e.target.closest('.step');
        const stepName = step.querySelector('h3').textContent;
        
        // 단계별 상세 정보 표시 (실제로는 모달이나 상세 페이지로 이동)
        console.log(`${stepName} 단계가 클릭되었습니다.`);
        
        // 간단한 알림 표시
        showNotification(`${stepName} 단계에 대한 자세한 정보를 확인하세요.`);
    }
});

function showNotification(message) {
    // 간단한 알림 표시
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
