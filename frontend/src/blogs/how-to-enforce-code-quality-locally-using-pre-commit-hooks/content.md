---
title: "How to enforce code quality locally using pre-commit hooks"
subtitle: "Catch syntax errors and formatting issues before they ever reach your Git history."
date: "April 30, 2026"
tags: ["Git", "Automation", "Python", "JavaScript", "CI/CD"]
---

## Introduction

When you push code to a repository, CI/CD pipelines run automated checks to find bugs or formatting issues. However, waiting for a cloud server to catch a missing comma or an unused import is a slow process that wastes compute time.

It is much more efficient to catch these errors locally on your laptop before a commit is even created.

In this article, you will learn how to enforce code quality at the source using the [pre-commit](https://pre-commit.com/) framework. This tool automatically runs a series of checks on your codebase, preventing messy formatting, broken files, or sensitive secrets from making it into your permanent Git history.

::: tip Prerequisites
To follow this tutorial, you will need:

- A basic understanding of **Git**.
- **Python** and **Node.js** installed locally.
- A package manager (e.g., **npm/pnpm** for JavaScript and **pip/uv/conda** for Python).

You will configure hooks for a typical web project, though these concepts apply to any stack.
:::

## How pre-commit works

Git has a built-in feature called [hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks). These are hidden scripts that run automatically when you perform actions like committing or pushing code. However, writing and managing custom shell scripts for every security and quality check in your stack is difficult to maintain.

This is where the pre-commit framework comes in. Instead of writing complex bash scripts, you create a simple YAML configuration file. The framework reads this file, downloads the necessary tools in isolated environments, and runs them against your code right before a commit is created.

::: image ./01_pre_commit_workflow.png "A diagram of the pre-commit workflow showing how a git commit triggers automated checks that either pass to the Git history or fail and block the commit for an auto-fix."
A diagram of the pre-commit workflow showing how a git commit triggers automated checks that either pass to the Git history or fail and block the commit.
:::

If your code has syntax errors, unresolved merge conflicts, or a 50MB file added by mistake, the hook blocks the commit entirely. This forces you to fix issues locally before pushing, keeping your Git history clean and professional.

## Configuring the hooks

Create a file named `.pre-commit-config.yaml` in the root directory of your project. For this tutorial, you will build a configuration that targets standard repository maintenance, a Python backend, and a Vue.js frontend.

### Standard repository checks

Before worrying about specific programming languages, you should configure the baseline hooks provided by the pre-commit team. These protect your repository from common Git mistakes.

Add this block to your configuration file:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: "v4.6.0"
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files
        args: ["--maxkb=5000"]
      - id: check-merge-conflict
      - id: detect-private-key
```

Here is what these baseline hooks do:

- `trailing-whitespace` and `end-of-file-fixer` guarantee consistent formatting by removing unnecessary spaces and adding a standard newline at the end of files.
- `check-added-large-files` blocks you from accidentally committing huge files like database dumps or videos (capped at 5MB in this example).
- `check-merge-conflict` prevents you from committing code that still contains `<<<<<<< HEAD` markers.
- `detect-private-key` scans your code to prevent you from accidentally pushing private keys.

::: tip
The pre-commit team maintains several other useful hooks. You can find the full list of available options in the [official repository](https://github.com/pre-commit/pre-commit-hooks#hooks-available).
:::

### Python

Now, let's configure the backend hooks. We will use a tool called [Ruff](https://docs.astral.sh/ruff/). It is a modern and very fast Python linter and formatter that replaces older tools like Flake8, Black, and isort.

Add this block to your configuration file:

```yaml
- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: "v0.15.12"
  hooks:
    - id: ruff
      name: ruff (lint)
      args: [--fix]
      files: ^backend/
    - id: ruff-format
      name: ruff (format)
      files: ^backend/
```

Here is what this does:

- The `ruff` hook acts as a linter. By passing the `--fix` argument, you tell Ruff to actively fix the errors it knows how to solve, like removing unused imports.
- The `ruff-format` hook enforces a strict visual style, making sure your spacing and line lengths are perfectly consistent.
- The `files: ^backend/` line restricts these tools so they only run on files inside your backend folder.

::: tip
The `rev` value in the configuration specifies the exact version of the tool you are installing. It is always a good practice to check the respective GitHub repositories and use the latest stable releases instead of strictly copying the version numbers shown here.
:::

### JavaScript

Next, you need to handle the frontend. You will use **ESLint** to catch logic bugs in your JavaScript and Vue files, and **Prettier** to handle the visual formatting.

Append this configuration to the same YAML file:

```yaml
- repo: https://github.com/pre-commit/mirrors-eslint
  rev: "v9.39.1"
  hooks:
    - id: eslint
      name: eslint (frontend)
      files: ^frontend/.*\.(js|vue)$
      types: [file]
      args: [--fix, --config, frontend/eslint.config.js]
      additional_dependencies:
        - eslint@9.39.1
        - eslint-plugin-vue@10.6.2
        - eslint-config-prettier@10.1.8
        - globals@16.5.0
        - vue-eslint-parser@10.2.0

- repo: local
  hooks:
    - id: prettier-frontend
      name: prettier (frontend)
      entry: npx prettier --write
      language: node
      language_version: system
      files: ^frontend/.*\.(js|vue|css|scss|html|json)$
      types_or: [javascript, vue, css, scss, html, json]
```

This section uses a few specific strategies:

- **Targeted arguments**: The ESLint hook uses the `--config` argument to point directly to your frontend's specific ESLint configuration file.
- **Additional dependencies**: Because ESLint needs to understand Vue's custom `.vue` file structure, you must explicitly provide plugins like `eslint-plugin-vue` so the hook runs correctly in its isolated environment.
- **The local repository**: Running Prettier as a `local` hook uses your existing Node.js setup, which is faster than downloading a separate copy. It executes `npx prettier --write` on your frontend files.

### Full configuration

Here is how your complete `.pre-commit-config.yaml` should look:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: "v4.6.0"
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files
        args: ["--maxkb=5000"]
      - id: check-merge-conflict
      - id: detect-private-key

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: "v0.15.12"
    hooks:
      - id: ruff
        name: ruff (lint)
        args: [--fix]
        files: ^backend/
      - id: ruff-format
        name: ruff (format)
        files: ^backend/

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: "v9.39.1"
    hooks:
      - id: eslint
        name: eslint (frontend)
        files: ^frontend/.*\.(js|vue)$
        types: [file]
        args: [--fix, --config, frontend/eslint.config.js]
        additional_dependencies:
          - eslint@9.39.1
          - eslint-plugin-vue@10.6.2
          - eslint-config-prettier@10.1.8
          - globals@16.5.0
          - vue-eslint-parser@10.2.0

  - repo: local
    hooks:
      - id: prettier-frontend
        name: prettier (frontend)
        entry: npx prettier --write
        language: node
        language_version: system
        files: ^frontend/.*\.(js|vue|css|scss|html|json)$
        types_or: [javascript, vue, css, scss, html, json]
```

## Activation and testing

Your configuration file is complete. Now you need to install the pre-commit framework so it can link those hooks to your Git repository.

### Installing the framework

Because pre-commit runs as a Git hook, it is a bad idea to install it inside your project's virtual environment. If you ever delete or recreate that environment, Git will lose track of the tool and block your commits.

Instead, you should install it using a tool called [pipx](https://github.com/pypa/pipx). This installs Python applications in their own isolated environments but makes the command available globally across your entire system.

First, install `pipx` using your system package manager. On Ubuntu, you can do this:

```bash
sudo apt install pipx
pipx ensurepath
```

::: info
If `pipx ensurepath` shows a warning saying "All pipx binary directories have been appended to PATH", it means the path was already configured. As long as it ends with "pipx is ready to go!", you can safely ignore the warning.
:::

Next, install the pre-commit package.

```bash
pipx install pre-commit
```

### Initializing the hooks

Now, tell the framework to read your YAML file and install the hidden hook scripts into your `.git` directory. Open your terminal in your project's root directory and run:

```bash
pre-commit install
```

Your repository is now safely decoupled from your project's local Python environment. You can verify this by checking the generated hook file:

```bash
cat .git/hooks/pre-commit
```

Look for the `INSTALL_PYTHON` variable. It should point to your `pipx` installation (e.g., `~/.local/share/pipx/...`), ensuring your hooks work regardless of which project-specific virtual environment is active.

### Migrating from a virtual environment

If you previously installed `pre-commit` inside a virtual environment, you don't need to manually uninstall your old hooks. Install `pre-commit` via `pipx` as shown above, and then run:

```bash
pre-commit install
```

This will refresh your Git hooks to point to the new, stable global installation, safely decoupling your repository from any project-specific environment.

::: tip
If you already have a custom bash script written inside `.git/hooks/pre-commit`, do not worry about losing it. The pre-commit framework detects custom scripts and safely renames them to `pre-commit.legacy`.

When you make a commit, the framework runs its own hooks first and then automatically executes your legacy script.
:::

### Testing your configuration

From now on, whenever you type `git commit`, this script will intercept the process and run your configured hooks first.

To verify that everything is working properly, you should manually trigger the hooks across your entire project right now.

```bash
pre-commit run --all-files
```

The first time you run this, it will take a minute or two because the framework has to download Ruff, ESLint, and the Node.js dependencies. Once it finishes, it will output a checklist in your terminal.

```output
ruff (lint)........................................Passed
ruff (format)......................................Passed
eslint (frontend)..................................Passed
prettier (frontend)................................Passed
```

If a check fails, the framework blocks the commit. It will often fix the formatting automatically for you, but you still need to stage the new changes (`git add .`) and run the commit command again.

## Keeping hooks updated

The tools in your configuration, like Ruff and ESLint, release new versions constantly. Manually checking their GitHub pages to update the `rev` versions in your YAML file is tedious.

The framework has a built-in command to handle this for you. Run this in your terminal:

```bash
pre-commit autoupdate
```

This command scans your configuration file, checks the remote repositories for the latest stable tags, and automatically updates the `rev` strings to the newest versions.

## The emergency bypass

Pre-commit hooks are strict, which keeps your codebase clean. But there might be a rare emergency where you absolutely must commit your code immediately, even if a linter is failing.

You can bypass the hooks entirely by adding the `--no-verify` flag to your commit command.

```bash
git commit -m "WIP: saving a broken state" --no-verify
```

::: warning
Use this flag sparingly. Bypassing your local checks means those errors will be caught later by your cloud CI/CD pipeline, forcing you to fix them anyway.
:::

## Conclusion

By using local pre-commit hooks, you keep your codebase consistent and professional. You have built an automated gatekeeper that prevents typos and formatting issues from reaching production or cluttering your Git history.
