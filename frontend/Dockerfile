# This is the image that we want to build from
FROM node:12.13-alpine

# Directory to hold the app code inside the image.
# This is the working directory for your application
WORKDIR /usr/src/app/frontend

# Copy both package.json and package-lock.json to the working directory
# Order is important
COPY package*.json tsconfig.json ./
# Install dependencies
RUN npm install
# If you are building for production we would use
# RUN npm ci --only-production

# Bundle the apps source code inside the Docker image
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# RUN npm run build

# FROM node:12.13-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]
