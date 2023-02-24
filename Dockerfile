FROM node:12.22

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app

ENV TZ='Asia/Ho_Chi_Minh'
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN echo haha
RUN echo "Asia/Ho_Chi_Minh" > /etc/timezone

ENV PORT 5001
EXPOSE 5001
CMD [ "npm", "start" ]
