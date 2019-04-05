call s\bundle production

call s\ver

git add .

git reset -- static/clientjs/*
git reset -- static/js/app.js
git reset -- schemaconfig.json

git commit -m "%*"

git add -- static/clientjs/*
git add -- static/js/app.js
git add -- schemaconfig.json

git commit -m "%* bin"
