FROM nginx:latest

RUN mkdir -p /usr/share/nginx/html/streams

RUN chown -R nginx:nginx /usr/share/nginx/html/streams && \
    chmod -R 755 /usr/share/nginx/html/streams

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
