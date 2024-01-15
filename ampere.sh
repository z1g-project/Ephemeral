#!/bin/bash
cd public
rm -rf ./ampere
git clone https://github.com/cohenerickson/ampere.git
cd ampere
npm install
read -p "Edit src/config.ts " -n 1 -r
echo   
if [[ $REPLY =~ ^[Yy]$ ]]
then
   npm run build
   cp -r ./dist/ ./
   rm -rf ./dist ./src ./vscode ./node_modules ./bin ./public ./tailwind.config.js
   find . ! -name "*.js" -type f -exec rm -rf {} +
fi
