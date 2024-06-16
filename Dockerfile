# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer
WORKDIR /app
COPY package.*json ./
RUN npm i


FROM node:20-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/package.json package.json
COPY --from=installer /app/node_modules node_modules
COPY .gitignore .gitignore
COPY . .
RUN npm run build


FROM node:20-alpine as runner
WORKDIR /app
EXPOSE 3000
COPY --from=sourcer /app/ .
CMD [ "npm", "run", "start" ]