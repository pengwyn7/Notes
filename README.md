# Notes App

A simple Notes App.

## Features

* Add notes
* View notes
* Edit notes
* Delete notes

## Technologies Used

* HTML
* CSS
* JavaScript
* Supabase

## Database

```sql
CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Setup

1. Create a Supabase project.
2. Create the `notes` table.
3. Copy your Supabase URL and Anon Key.
4. Add them to `script.js`.
5. Open `index.html` in your browser.

