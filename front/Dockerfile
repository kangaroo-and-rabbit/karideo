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
RUN ng build --output-path=dist --configuration=production --base-href=/karideo/ --deploy-url=/karideo/ 

############
### prod ###
############

# base image
FROM httpd:latest

# copy artifact build from the 'build environment'
COPY --from=build /application/dist /usr/local/apache2/htdocs/
COPY httpd/httpd.conf /usr/local/apache2/conf/httpd.conf
