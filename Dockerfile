FROM alpine:3.6
RUN apk update && apk upgrade && apk add nodejs && apk add -u yarn && rm -rf /var/cache/apk/* && yarn add global nodemon
COPY . /src
WORKDIR /src
RUN yarn install

EXPOSE 3000
CMD ["yarn", "start:dev"]