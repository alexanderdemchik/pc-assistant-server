FROM node:16

COPY package.json .
RUN npm install
RUN npm install typescript -g
COPY . .
RUN npm run build
CMD npm run prod