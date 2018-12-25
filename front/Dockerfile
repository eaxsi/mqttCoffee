FROM nginx
WORKDIR /usr/share/nginx/html/
ADD index.html ./
ADD style.css ./
ARG apiurl
RUN echo "apiurl: $apiurl"
RUN sed -i "s|%%API_URL%%|$apiurl|g" index.html
RUN cat index.html

