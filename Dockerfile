FROM httpd:2.4
LABEL maintainer="Rob Zeeman <rob.zeeman@di.huc.knaw.nl>"
EXPOSE 80 443
COPY --chown=www-data:www-data  ./src/ /usr/local/apache2/htdocs/
