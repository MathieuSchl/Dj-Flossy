FROM node:18.13.0

COPY ./package*.json /home/node/DjFlossy/
WORKDIR /home/node/DjFlossy/
RUN npm install
COPY . .
CMD ["npm", "run", "start"]