#!/bin/bash
cd public
rm -rf ./ampere
git clone https://github.com/cohenerickson/ampere.git
cd ampere
npm install
# chatgpt code lmao
awk '{gsub("/~/", "/~/light/")}1' src/config.ts > tmpfile && mv tmpfile src/config.ts
awk '{gsub("http://localhost:8080/", "http://localhost:8080/bare/")}1' src/config.ts > tmpfile && mv tmpfile src/config.ts
npm run build
cp -r ./dist/ ./
rm -rf ./dist ./src ./.vscode ./node_modules ./bin ./public ./tailwind.config.js .prettier* .git* *p* *ts* *.md
echo "Ampere has been built"