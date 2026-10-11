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

### Verify the error handling

Now that the URL is blocked by the browser, trigger the search action again or reload the page.

Instead of reaching your backend server, the request is stopped right in the client. Because the promise rejected, the frontend `catch` block executed as designed, and displayed the error toast notification.

::: image ./error_toast_confirmation.png "The UI showing an error toast notification after the blocked request fails."
The frontend application safely catches the error and displays the notification toast.
:::

As you can see, you verified your error handling without modifying any backend logic or frontend code.

:::: info What status code does the browser report?
When a browser blocks a request via developer tools, it does not receive an HTTP 500 or 404 from the server. Instead, the browser terminates the request locally before it hits the network and reports a client-side network failure.

::: image ./no_status_code.png "The Network tab shows a blocked request with no status code."
The blocked request does not receive a status code because the browser terminates it before it reaches the server.
:::
::::

## Using wildcards for route patterns

The blocking panel is not limited to exact URLs. It also supports wildcard characters (`*`), which allows you to target an entire group of endpoints with a single pattern.

For example, if you want to test how your frontend behaves when every user-related endpoint fails at once, you can add this rule:

```text
http://localhost:8080/api/users/*
```

This pattern matches and blocks every sub-route under `/api/users/`. For example, it would also match paths like `/api/users/profile`, `/api/users/settings`, or `/api/users/avatar` depending on your app’s actual routes.

You can also keep multiple rules active at the same time. This is useful for simulating partial outages, such as blocking an external analytics script while leaving your primary API endpoints running normally.

## Disabling and removing blocked URLs

Once you finish testing, you do not want your endpoint to remain blocked. Firefox gives you two ways to restore your network traffic depending on whether you plan to test that endpoint again soon.

If you only want to pause the block temporarily, uncheck the box next to the URL in the **Request Blocking** sidebar. This restores normal network traffic immediately while keeping your configured URL saved in the list for later.

::: image ./disable_blocked_url_checkbox.png "Unchecking the checkbox next to a blocked URL in the Request Blocking sidebar."
Uncheck the box next to the blocked URL to restore traffic without deleting the configured rule.
:::

If you are completely finished with your test and want to clean up your list, hover over the entry in the sidebar and click the ::fa{fa-solid fa-close}:: button. You can also right-click the row directly inside the main Network table and select **Unblock URL**.

::: image ./delete_blocked_url.png "Hovering over a blocked URL in the sidebar to click the delete button."
Two ways to remove a blocked URL from the Request Blocking sidebar are demonstrated in this screenshot.
:::

## Conclusion

Testing edge cases and network errors is an essential part of building resilient web applications. Instead of inserting temporary exceptions or mock errors into your codebase, use your browser's built-in developer tools.

By blocking URLs directly in the Network tab, you get instant feedback on your frontend error states while keeping your local Git working tree completely untouched.
