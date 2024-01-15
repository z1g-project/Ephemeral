<<info
Comment: This script is used to update Ampere. When you are told to edit src/config.ts, you should change the prefix to "/~/light/" and the server to http://localhost:8080/bare/
info
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
