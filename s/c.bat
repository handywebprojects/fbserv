call s\ver

git add .

git reset -- static/js/app.js
git reset -- schemaconfig.json

git commit -m "%*"

git add -- static/js/app.js
git add -- schemaconfig.json

git commit -m "%* bin"