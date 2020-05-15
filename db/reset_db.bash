$(> db/students.sqlite)
cat db/migrate.sql | sqlite3 db/students.sqlite
