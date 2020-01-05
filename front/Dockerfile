# base image
FROM node:latest as build

ADD src /application/src
ADD e2e /application/e2e
ADD package-lock.json /application/
ADD package.json /application/
ADD angular.json /application/
ADD browserslist /application/
ADD karma.conf.js /application/
ADD protractor.conf.js /application/
ADD tsconfig.json /application/
ADD tslint.json /application/
WORKDIR /application/

# add `/application/node_modules/.bin` to $PATH
ENV PATH /application/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install

# generate build
RUN ng build --output-path=dist --configuration=production

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine

# copy artifact build from the 'build environment'
COPY --from=build /application/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]