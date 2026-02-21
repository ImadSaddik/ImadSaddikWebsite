# Markdown transformers

[This directory](./transformers/) contains the custom logic that converts standard Markdown into `Vue.js` components for my articles.

I decided against using a static site generator because I wanted my website to feel unique and stay free from the constraints of existing tools. Instead, I built a custom pipeline that lets me write in Markdown and render it through my own Vue components.

## How it works

The transformation is powered by [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown). When Vite processes a `.md` file, it passes it through [markdown-it](https://github.com/markdown-it/markdown-it), which is configured using the transformers found in [index.js](./index.js).

Each transformer targets a specific Markdown element (like headers, links, or custom containers) and replaces it with a Vue component or enhanced HTML.

## Custom syntax & components

Here are the custom extensions I've added to standard Markdown to support my website's unique features.

### YouTube player

To embed a YouTube video with a responsive player, use the `::: youtube` container. Here is the syntax:

```markdown
::: youtube [URL]
:::
```

> [!NOTE]
> You can wrap the URL in Markdown link syntax to satisfy linters, or just use a bare URL. The transformer handles both.

And here is an example of how to use it:

```markdown
::: youtube [https://www.youtube.com/embed/7G9q_5q82hY](https://www.youtube.com/embed/7G9q_5q82hY)
:::
```

### Videos with captions

For local video files (like `.mp4`), use the `::: video` container. Here is the syntax to embed a video with a caption:

```markdown
::: video [path] "[caption]"
:::
```

And here is an example of how to use it:

```markdown
::: video ./timelapse.mp4 "A beautiful time-lapse of the night sky."
:::
```

> [!NOTE]
> The file path should be **relative to the current Markdown file**. For example, `./video.mp4` refers to a file in the same directory. The transformer will automatically handle the import for you.

### Images with captions

Standard Markdown image syntax doesn't support captions, use the following syntax to add a caption to your images:

```markdown
![alt text](path "caption")
```

And here is an example of how to use it:

```markdown
![alt text](./image.png "This is the caption that appears below the image.")
```

### Admonitions (Alerts)

I use custom containers to highlight important information like tips, warnings, or info blocks.

Follow this syntax to create an admonition:

```markdown
::: [type]
Content goes here.
:::
```

> [!NOTE]
> The full list of supported types is defined in this constant: [ADMONITION_TYPES](../../src/constants/content.js#L4). You can add new types by updating that list and creating a corresponding CSS class.

And here is an example of how to use it:

```markdown
::: tip
This is a helpful tip!
:::

::: warning
Be careful with this command.
:::
```

### Superscript

To write superscript text, surround the text with carets (`^`). Here is the syntax:

```markdown
^text^
```

Here is an example of how to use it:

```markdown
The formula is 1 \* 0.99^407^ = 0.016.
```

### Inline icons

You can embed icons directly in your text using the `::icon{file-path}::` syntax. This is useful for adding visual cues without breaking the flow of your writing.

```markdown
Look for the star icon ::icon{/src/assets/icons/star.svg}:: in the guide.
```

### Font awesome icons

If you want to use Font Awesome icons, you can use the `::fa{icon-name}::` syntax. This allows you to easily include any Font Awesome icon in your content.

```markdown
To indicate a warning, use the ::fa{exclamation-triangle}:: icon.
```

### Links

The links transformer adds `target="_blank"` and `rel="noopener noreferrer"` to all external links to ensure they open in a new tab and are secure.

```markdown
[Google](https://imadsaddik.com)
```

This will be transformed into:

```html
<a href="https://imadsaddik.com" target="_blank" rel="noopener noreferrer">Google</a>
```

### Ordered and unordered lists

The syntax is the same as standard Markdown, but the transformer uses `UnorderedList`, `OrderedList`, `UnorderedItem`, and `OrderedItem` Vue components to render the lists with custom styles.

Ordered list example:

```markdown
1. First item
2. Second item
3. Third item
```

Unordered list example:

```markdown
- First item
- Second item
- Third item
```
