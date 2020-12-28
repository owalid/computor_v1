FROM node:12.19.0-alpine

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY . /usr/src/app/
RUN yarn

ENV PATH=/node_modules/.bin:$PATH
ENV NODE_PATH=/node_modules

COPY . /usr/src/app/

# expose 8080 on container
EXPOSE 8080

# start the app
CMD [ "yarn", "serve" ]

