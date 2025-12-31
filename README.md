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

flowchart TD
A[User provides Blog URL] --> B[Scrape Blog Content]
B --> C[Store in blogs Collection]
C --> D[5 Blogs Scraped Successfully]

    D --> E[User calls updateScrap API]
    E --> F[Send Blog Heading]
    F --> G[Fetch Old Blog from DB]
    G --> H[Search Heading via Google Serper API]
    H --> I[Get Top 2 Similar Blogs]
    I --> J[Scrape New Blogs]
    J --> K[Combine Old + New Blogs]
    K --> L[Send to Gemini Flash LLM API]
    L --> M[Generate Updated Article]
    M --> N[Save to updatedBlog Collection]
