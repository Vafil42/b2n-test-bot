from "node:latest" as build

workdir /home/node/app
add package*.json .
run npm install
add . .
run npm run build
from "node:20-alpine"

workdir /home/node/app
add package*.json .
run npm install --omit=dev
copy --from=build /home/node/app/dist ./dist

cmd ["node", "./dist/index.js"]
