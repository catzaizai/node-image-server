FROM node:10.15
LABEL maintainer=catzaizai@live.com

RUN apt-get update && apt-get install libpango1.0-dev gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget fonts-wqy-microhei ttf-wqy-zenhei -y

ENV PROJECT_DIR=/app
WORKDIR /app

COPY package.json $PROJECT_DIR
RUN npm install
COPY . $PROJECT_DIR

ENV MEDIA_DIR=/media \  
    NODE_ENV=production \
    APP_PORT=8081

VOLUME $MEDIA_DIR  
EXPOSE $APP_PORT
HEALTHCHECK CMD curl --fail http://localhost:$APP_PORT || exit 1

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
CMD [ "start" ]

