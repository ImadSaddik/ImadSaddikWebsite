# Markdown transformers

[This directory](./transformers/) contains the custom logic that converts standard Markdown into `Vue.js` components for my articles.

I built a custom pipeline to render Markdown through my own Vue components. This allows my website to feel unique and avoids the limitations of standard static site generators.

## How it works

The transformation is powered by [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown). When Vite processes a `.md` file, it passes it through [markdown-it](https://github.com/markdown-it/markdown-it), which is configured using the transformers found in [index.js](./index.js).

Each transformer targets a specific Markdown element (like headers, links, or custom containers) and replaces it with a Vue component or enhanced HTML.

## Custom syntax & components

Here are the custom extensions I've added to standard Markdown to support my website's unique features.

### YouTube player

To embed a YouTube video with a responsive player, use the `::: youtube` container.

Syntax and example:

```markdown
::: youtube [URL]
:::

::: youtube [https://www.youtube.com/embed/7G9q_5q82hY](https://www.youtube.com/embed/7G9q_5q82hY)
:::
```

> [!NOTE]
> You can wrap the URL in Markdown link syntax to satisfy linters, or just use a bare URL. The transformer handles both.

### Videos with captions

For local video files (like `.mp4`), use the `::: video` container to embed the file alongside a caption.

Syntax and example:

```markdown
::: video [path] "[caption]"
:::

::: video ./timelapse.mp4 "A beautiful time-lapse of the night sky."
:::
```

> [!NOTE]
> The file path must be **relative to the current Markdown file** (e.g., `./video.mp4` for a file in the same directory). The transformer automatically handles the import.

### Images with captions

Because standard Markdown does not support image captions, use this format instead:

Syntax and example:

```markdown
![alt text](path "caption")

![alt text](./image.png "This is the caption that appears below the image.")
```

### Admonitions (Alerts)

Use custom containers to highlight important information like tips, warnings, or info blocks.

Syntax and example:

```markdown
::: [type]
Content goes here.
:::

::: tip
This is a helpful tip!
:::
```

> [!NOTE]
> The full list of supported types is defined in [ADMONITION_TYPES](../../src/constants/content.js#L4). You can add new types by updating that list and creating a corresponding CSS class.

### Superscript

To write superscript text, surround the text with carets (`^`).

Syntax and example:

```markdown
^text^

The formula is 1 \* 0.99^407^ = 0.016.
```

### Inline icons

You can embed icons directly in your text using the `::icon{file-path}::` syntax. This adds visual cues without breaking the flow of your writing.

Example:

```markdown
Look for the star icon ::icon{/src/assets/icons/star.svg}:: in the guide.
```

### Font awesome icons

To easily include any [Font Awesome](https://fontawesome.com/) icon in your content, use the `::fa{icon-name}::` syntax.

Example:

```markdown
To indicate a warning, use the ::fa{exclamation-triangle}:: icon.
```

### Links

The links transformer automatically adds `target="_blank"` and `rel="noopener noreferrer"` to all external links so they open securely in a new tab.

Example:

```markdown
[imadsaddik.com](https://imadsaddik.com)
```

Transforms into:

```html
<a href="https://imadsaddik.com" target="_blank" rel="noopener noreferrer">imadsaddik.com</a>
```

### Ordered and unordered lists

The syntax is the same as standard Markdown, but the transformer uses custom Vue components (`UnorderedList`, `OrderedList`, `UnorderedItem`, and `OrderedItem`) to render them with custom styles.

Examples:

```markdown
1. First ordered item
2. Second ordered item

- First unordered item
- Second unordered item
```
