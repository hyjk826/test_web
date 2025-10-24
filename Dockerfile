# Multi-stage build for better security and smaller image size
FROM nginx:1.25-alpine AS base

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy static files
COPY --chown=nginx:nginx ./web/ /usr/share/nginx/html/

# Create nginx config directory and set proper permissions
RUN mkdir -p /etc/nginx/conf.d && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chmod -R 755 /etc/nginx/conf.d

# Keep root user for nginx to work properly
# USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
