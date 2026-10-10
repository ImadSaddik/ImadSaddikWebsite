---
title: "How to block URLs in browser developer tools to test error handling"
subtitle: "Simulate failed network requests and verify frontend error states without editing a single line of code."
date: "October 10, 2026"
tags: ["Debugging", "DevTools", "Frontend", "Firefox", "Web development", "JavaScript"]
---

## Introduction

In any full-stack web application, your frontend constantly communicates with your backend API. When everything runs smoothly, your user interface displays the returned data. But when a server goes down or a network request fails, your frontend needs clean error handling to guide the user.

Testing those error states has always felt clunky. Most of us temporarily raise an exception on the backend or throw a manual error right before the API call on the frontend. While this works, altering source code just to test a UI state is tedious and risky. You risk accidentally committing temporary debug code or breaking other features while testing.

Modern browser developer tools make this simpler by allowing you to block requests directly. By intercepting and blocking specific requests in your browser, you can test how your application handles network failures on demand.

In this guide, you will learn how to block network requests using Firefox Developer Tools. The same workflow also applies to Chromium-based browsers like Chrome and Edge.

## How developers usually test failed requests

To understand why URL blocking is convenient, consider a typical search feature. On the backend, an endpoint receives a query, asks the search service for records, and returns the result:

```python
@router.post("/search", response_model=SearchResponse)
async def search_articles(request: Request, body: SearchRequest):
    try:
        results = await meilisearch_service.search(body)
        return results
    except Exception:
        logger.exception(f"Error searching articles with query '{body.query}'")
        raise HTTPException(status_code=500, detail="Internal server error")
```

On the frontend, an HTTP client like Axios triggers the request inside a `try...catch` block:

```javascript
try {
  const response = await axios.post("/api/search", data);
} catch (error) {
  showErrorNotification("Failed to load search results.");
}
```

If you want to verify that your error toast notification appears when the request fails, you traditionally have two options.

First, you can force an exception in your backend route:

```python
@router.post("/search", response_model=SearchResponse)
async def search_articles(request: Request, body: SearchRequest):
    raise RuntimeError("Simulated error")
```

Second, if you do not want to touch backend code, you can throw an error right before making the frontend request:

```javascript
try {
  throw new Error("Simulated error");
  const response = await axios.post("/api/search", data);
} catch (error) {
  showErrorNotification("Failed to load search results.");
}
```

Both methods get the job done, but modifying your source code for manual testing creates friction. You must remember to remove the test code before committing, and hot reloading might trigger unintended side effects.

Browser developer tools let you simulate this failure at the network boundary without modifying a single file.

## Blocking requests in developer tools

Firefox includes a native request-blocking tool inside its Network monitor. You can use it to block individual endpoints, third-party scripts, or entire route trees.

### Open the network monitor

Open your browser's developer tools by pressing `F12` (or right-click anywhere on the page and select **Inspect**). Then, switch to the **Network** tab.

::: image ./network_tab_open.png "The Network tab inside Firefox Developer Tools."
The Network tab inside the browser developer tools.
:::

Refresh your web page or trigger an action in your app. The network table will populate with all incoming and outgoing assets, scripts, and API calls.

::: image ./all_network_requests.png "A list of network requests recorded in the Network tab."
All network requests recorded after refreshing the page.
:::

### Block the target endpoint

Use the search filter at the top left corner of the Network panel to isolate the request you want to test. For this example, typing `search` and selecting the **Fetch/XHR** tab filters out static assets, leaving only the `POST` request to `/api/search`.

::: image ./filtered_search_request.png "Filtering network requests to locate the search endpoint."
Filtering network requests to locate the target search endpoint.
:::

Right-click the request row and select **Block URL**.

::: image ./block_url_option.png "Context menu showing the Block URL action and the Request Blocking panel."
Selecting Block URL from the context menu opens the Request Blocking sidebar.
:::

Once clicked, Firefox opens a dedicated **Request Blocking** sidebar on the left side of the panel. You will see your endpoint listed (for example, `http://localhost:8080/api/search`) with an active checkbox indicating that the rule is live.
