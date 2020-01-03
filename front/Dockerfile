# base image
FROM node:latest

ADD src /application/src
ADD package.json /application/
WORKDIR /application/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install

# start app
CMD ["ng", "serve", "--host", "0.0.0.0"]

