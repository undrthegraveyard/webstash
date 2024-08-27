## Table of contents

- [Overview](#overview)
  - [The problem we're solving](#the-problem-I'm-solving)
  - [Links](#links)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

Hey, **WebStash** is your go-to tool for keeping track of all those random but important links you encounter every day. This is more than just another bookmarking tool—WebStash lets you add descriptions, and even tag them with up to 3 relevant tags, making your life just a little more organized. And hey, I've even thrown in a quick-export-to-Excel feature, because why not?

### The problem I'm solving

I built this extension to solve a pretty common problem: **link clutter**. Ever been in a situation where you’ve got tons of tabs open, each containing a critical article, a podcast episode, or a cat video you swear you're going to watch later? Yeah, me too. With this, you can save any open tab with a short description and a couple of tags. Boom—everything’s categorized and ready to revisit whenever you need it. Plus, if you ever need to export all your saved links to Excel, WebStash has your back!

### Links

- GitHub Repo: [Click Here](https://github.com/undrthegraveyard/webstash.git)
- Live Site URL: [Chrome Web Store](https://chrome.google.com/webstore/detail/webstash/your-extension-id)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- JavaScript (ES6+)
- Chrome API (Tabs API, Storage API)
- Excel export (via CSV/ExcelJS)

### What I learned

This project was a great opportunity to dive into the world of Chrome extensions, and here are a couple of fun things I learned while building **WebStash**:

1. **Chrome APIs are powerful**: Chrome's `tabs` and `storage` APIs make it incredibly easy to fetch and store data. Managing browser tabs directly within an extension is super satisfying!
   
2. **Data export**: Implementing the CSV/Excel export feature was an interesting challenge. Whether you're using the `xlsx` library or native CSV export, building something that works across platforms (including MacBooks) was a crucial consideration.

Here's a snippet of how we implemented the CSV export:
```js
exportBtn.addEventListener("click", function() {
    const csvHeaders = ["Title", "URL", "Tags", "Description"];
    const csvData = [
        csvHeaders,
        ...myLeads.map(lead => [lead.title, lead.url, lead.tags, lead.description])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'webstash.csv';
    link.click();
});
```