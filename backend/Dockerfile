# FROM node:12


# WORKDIR /home/node

# RUN npm install -g @nestjs/cli@6.11.1 && \
#   npm i -g typescript  && \
#   npm i -g rimraf


# COPY package*.json tsconfig*.json ./
# RUN npm install
# RUN chown -R node /home/node/*

# USER node

# COPY . .
# RUN npm run build

# EXPOSE 5000

# CMD npm run start:prod

FROM node:10 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]
