ARG BASE_IMAGE=nginx:alpine
FROM ${BASE_IMAGE}


COPY --chown=nginx:nginx dist/ /usr/share/nginx/html
COPY --chown=nginx:nginx docker/30-envsubst-content.sh /docker-entrypoint.d/30-envsubst-content.sh
COPY --chown=nginx:nginx docker/nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /docker-entrypoint.d/30-envsubst-content.sh
