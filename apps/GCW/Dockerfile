FROM node:7.10
WORKDIR /www/GCW/
COPY package.json /www/GCW/
RUN npm install
RUN useradd -ms /bin/bash admin
USER admin
COPY . /www/GCW/
EXPOSE 3142
CMD ["npm", "start"]
