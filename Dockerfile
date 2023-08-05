FROM node

COPY ./package*.json /home/node/DjFlossy/
WORKDIR /home/node/DjFlossy/
RUN npm install
COPY . .
CMD ["npm", "run", "start"]