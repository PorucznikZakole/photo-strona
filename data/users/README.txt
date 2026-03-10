Folder with registered user accounts snapshot.

File used by backend:
- accounts.json

Notes:
- source of truth for login is API backend + SQLite (data/site.db)
- accounts.json is synchronized by server.py and keeps persisted user data,
  including password hashes (never plain passwords)
