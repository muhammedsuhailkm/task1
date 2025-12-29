BeyondChats Task 1

## Description

This project scrapes the 5 oldest blog articles from BeyondChats and provides CRUD APIs to manage them.
we can scrape any blog from beyond chat website by post method in which the api is "http://localhost:3000/blog/blogs" and in the body add the url of the blog required , then it will scrape the website and store the heading,content, date to the database.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Axios / Cheerio (for scraping)

## Setup Instructions

```bash
npm install
node server.js
```
