---
name: blog-converter
description: Converts a Markdown blog post into a Vue.js component structure consistent with the project's `frontend/src/blogs` architecture. Use this when the user provides a markdown file (and optionally assets) and asks to "convert it to a blog" or "add this blog post".
---

# Blog converter skill

This skill converts a standard Markdown file into a specific Vue.js component structure used in this project's frontend.

## Input analysis

You will typically receive:

- **Markdown content**: Containing frontmatter (Title, Date, Tags, Subtitle) and body.
- **Assets**: Images or other media referenced in the markdown.

## Type analysis

Determine the type of article being created. If the user doesn't specify, default to `blog`.

| User Request     | Target Directory          | `ARTICLE_TYPES` Constant  | Template Placeholder `{{ARTICLE_TYPE}}` |
| :--------------- | :------------------------ | :------------------------ | :-------------------------------------- |
| "blog" (default) | `frontend/src/blogs/`     | `ARTICLE_TYPES.BLOG`      | `BLOG`                                  |
| "astronomy"      | `frontend/src/astronomy/` | `ARTICLE_TYPES.ASTRONOMY` | `ASTRONOMY`                             |
| "course"         | `frontend/src/courses/`   | `ARTICLE_TYPES.COURSE`    | `COURSE`                                |

## Directory creation

1. **Slugify the title**: Convert the blog title to kebab-case (e.g., "How to Clean Up" -> `how-to-clean-up`).
2. **Create directory**: Create a new directory at `<Target Directory>/<slug>/`.
3. **Move assets**: Move any provided images into this new directory. If they are already in the correct location, no action is needed.
4. **Create content.md**: Save a _modified_ version of the markdown content into `<Target Directory>/<slug>/content.md`.
   - **Remove images**: Replace all image references (`![Alt](src "Caption")`) with just their caption text wrapped in underscores (e.g., `_Caption_`). This ensures the "Copy Markdown" feature doesn't include broken image links.

## Component generation (`index.vue`)

You will create `<Target Directory>/<slug>/index.vue` by transforming the Markdown body into Vue template syntax.

### Template transformation rules

Read the `assets/blog-template.vue` file to see the target structure. You need to replace the placeholders.

**HTML Structure**:

- **Sections**: Wrap content groups in `<section>` tags. Usually, a new Header 2 (`##`) starts a new section.
- **Headers (H2)**:

  ```html
  <h2 id="header-slug" class="article-body-header" data-table-of-contents>
    <a class="clickable-header-link" href="#header-slug">Header Text</a>
  </h2>
  ```

- **Headers (H3)**:

  ```html
  <h3 id="header-slug" class="article-body-subheader" data-table-of-contents>
    <a class="clickable-header-link" href="#header-slug">Header Text</a>
  </h3>
  ```

- **Paragraphs**: `<p>...</p>`
- **Inline code**: `<InlineCode text="code content" />`
- **Links**: Standard `<a href="..." target="_blank">...</a>` (add `target="_blank"` for external links).

**Image Components**:
Replace Markdown images `![Alt Text](path/to/image.png "Caption")` with:

```html
<ImageWithCaption
  :image-src="imageVariableName"
  image-alt="Alt Text"
  image-caption="Caption (or Alt Text if missing)"
  @open-image-modal="handleOpenImageModal"
/>
```

**Others**:
Check the `frontend/src/components` directory to understand how to use other specialized components like `CodeBlock`, `VideoWithCaption`, or `BulletPoint`. You should inspect their props and implementation to ensure you use them correctly when the markdown content warrants it (e.g., using `CodeBlock` for triple-backtick blocks).

### JavaScript logic (script tag)

1. **Imports**:
   - Import all images referenced in the markdown.
   - Naming convention: camelCase based on filename (e.g., `my-image.png` -> `myImage`).
   - `import myImage from "./my-image.png";`
2. **Component name**: PascalCase of the slug (e.g., `HowToCleanUp`).
3. **Setup()**:
   - `const title = "Exact Title From Markdown";`
   - `const tags = ["Tag1", "Tag2"];`
4. **Data()**:
   - Return all imported image variables so they can be used in the template.

### Placeholders to replace in template

- `{{COMPONENT_NAME}}`: The PascalCase component name.
- `{{TITLE}}`: The blog post title.
- `{{SUBTITLE}}`: The subtitle from frontmatter or first paragraph.
- `{{CREATION_DATE}}`: The date string (e.g., "December 21, 2025").
- `{{TAGS}}`: Quoted, comma-separated tags (e.g., `"Inkscape", "SVG"`).
- `{{ARTICLE_TYPE}}`: The constant suffix determined in Step 2 (e.g., `BLOG`, `ASTRONOMY`, `COURSE`).
- `{{CONTENT_BODY}}`: The transformed HTML content.
- `// IMPORT_IMAGES_HERE`: Image import statements.
- `// REGISTER_IMAGES_HERE`: Image variables in the `data()` return object.

## Execution steps

1. Read the input markdown.
2. Determine the **Type**, **Target directory**, and **Article type constant**.
3. Determine the slug.
4. Create the directory.
5. Write `content.md` (images removed).
6. Generate the `index.vue` content by applying the transformation rules to the markdown body and filling in the `blog-template.vue` structure.
7. Write `index.vue`.
8. If images are provided, ensure they are written to the directory.

> [!NOTE]
> If you are unsure about any part of the transformation, refer to existing articles in any of the target directories for reference implementations.
