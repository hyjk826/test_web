// Modern JavaScript for enhanced interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Modern GitOps Platform loaded successfully!');
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Enhanced hover effects for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Click animation
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Pipeline step animations
    const pipelineSteps = document.querySelectorAll('.pipeline-step');
    pipelineSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = 'var(--border-color)';
        });
    });
    
    // Status card animations
    const statusCards = document.querySelectorAll('.status-card');
    statusCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Floating cards animation enhancement
    const floatingCards = document.querySelectorAll('.card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-30px) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Status update simulation with enhanced effects
    const statusHealthy = document.querySelectorAll('.status-healthy');
    statusHealthy.forEach(element => {
        setInterval(() => {
            element.style.opacity = '0.6';
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, 300);
        }, 5000);
    });
    
    // Scroll-triggered animations
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
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .pipeline-step, .status-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Performance monitoring
    const performanceInfo = {
        loadTime: performance.now(),
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    console.log('📊 Performance Info:', performanceInfo);
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Real-time status updates
    updateSystemStatus();
    setInterval(updateSystemStatus, 10000); // Update every 10 seconds
});

function updateSystemStatus() {
    // Simulate real-time status updates
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        if (metric.textContent.includes('%')) {
            // Simulate CPU usage changes
            const randomValue = Math.floor(Math.random() * 20) + 10; // 10-30%
            metric.textContent = randomValue + '%';
        } else if (metric.textContent.includes('MB')) {
            // Simulate memory usage changes
            const randomValue = Math.floor(Math.random() * 20) + 60; // 60-80MB
            metric.textContent = randomValue + 'MB';
        }
    });
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add click handlers for interactive elements
document.addEventListener('click', function(e) {
    // Pipeline step clicks
    if (e.target.closest('.pipeline-step')) {
        const step = e.target.closest('.pipeline-step');
        const stepName = step.querySelector('h3').textContent;
        showNotification(`${stepName} 단계에 대한 자세한 정보를 확인하세요.`, 'info');
    }
    
    // Feature card clicks
    if (e.target.closest('.feature-card')) {
        const card = e.target.closest('.feature-card');
        const featureName = card.querySelector('h3').textContent;
        showNotification(`${featureName} 기능에 대해 더 알아보세요!`, 'success');
    }
    
    // Button clicks
    if (e.target.closest('.btn')) {
        const button = e.target.closest('.btn');
        if (button.classList.contains('btn-primary')) {
            showNotification('시작하기 버튼이 클릭되었습니다!', 'success');
        } else if (button.classList.contains('btn-secondary')) {
            showNotification('더 알아보기 버튼이 클릭되었습니다!', 'info');
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .feature-card:hover .feature-icon {
        animation: pulse 2s infinite;
    }
    
    .pipeline-step:hover .step-icon {
        animation: pulse 1.5s infinite;
    }
`;
document.head.appendChild(style);