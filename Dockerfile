# Nginx를 사용한 정적 웹페이지 서빙
FROM nginx:alpine

# 웹 파일들을 nginx 디렉토리로 복사
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# nginx 설정 파일 복사 (선택사항)
COPY nginx.conf /etc/nginx/nginx.conf

# 포트 80 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
