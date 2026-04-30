---
title: "How to enforce code quality locally using pre-commit hooks"
subtitle: "Catch syntax errors and formatting issues before they ever reach your Git history."
date: "April 30, 2026"
tags: ["Git", "Automation", "Python", "JavaScript", "CI/CD"]
---

## Introduction

When you push code to a repository, CI/CD pipelines run automated checks to find bugs or formatting issues. However, waiting for a cloud server to catch a missing comma or an unused import is a slow process that wastes compute time.

It is much more efficient to catch these errors locally on your laptop before a commit is even created.

In this article, you will learn how to enforce code quality at the source using the [pre-commit](https://pre-commit.com/) framework. This tool automatically runs a series of checks on your codebase, ensuring that messy formatting, broken files, or sensitive secrets never make it into your permanent Git history.

## The pre-commit framework

Git has a built-in feature called [hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks). These are hidden scripts that run automatically when you perform actions like committing or pushing code. However, writing and managing custom shell scripts for every security and quality check in your stack is difficult to maintain.

This is where the pre-commit framework comes in. Instead of writing complex bash scripts, you create a simple YAML configuration file. The framework reads this file, downloads the necessary tools in isolated environments, and runs them against your code right before a commit is created.

If your code has syntax errors, contains unresolved merge conflicts, or attempts to upload a 50MB file by mistake, the hook blocks the commit entirely. This forces you to fix the issues locally.
