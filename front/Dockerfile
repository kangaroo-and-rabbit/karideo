# base image
FROM node:latest as build

# add `/application/node_modules/.bin` to $PATH
ENV PATH /application/node_modules/.bin:$PATH

ADD package-lock.json /application/
ADD package.json /application/
#ADD browserslist /application/
ADD karma.conf.js /application/
ADD protractor.conf.js /application/
WORKDIR /application/

# install and cache app dependencies
RUN npm install

ADD e2e /application/e2e
ADD tsconfig.json /application/
ADD tslint.json /application/
ADD angular.json /application/
ADD src /application/src

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
