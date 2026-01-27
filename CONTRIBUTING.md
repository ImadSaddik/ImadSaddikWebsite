# Contributing to Imad Saddik's website

First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to this project. These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of contents

- [Contributing to Imad Saddik's website](#contributing-to-imad-saddiks-website)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Backend development](#backend-development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running tests](#running-tests)
    - [Linting and formatting](#linting-and-formatting)
  - [Frontend development](#frontend-development)
    - [Prerequisites](#prerequisites-1)
    - [Setup](#setup-1)
    - [Running tests](#running-tests-1)
    - [Linting and formatting](#linting-and-formatting-1)
  - [Pull request process](#pull-request-process)

## Getting started

Click the `Fork` button at the top right of this page. This will create a copy of the repository under your GitHub account.

Now, clone your fork:

```bash
git clone https://github.com/your_username/ImadSaddikWebsite.git
cd ImadSaddikWebsite/
```

> [!NOTE]
> Make sure to replace `your_username` with your actual GitHub username in the clone URL.

Follow the backend and frontend setup guides below to get your local environment running.

## Project structure

The repository is organized as follows:

- `backend/` - FastAPI application code.
- `frontend/` - Vue.js frontend application.
- `bash_scripts/` - Utility scripts for development and maintenance.
- `infrastructure/` - Configuration for deployment (Nginx, etc.).
- `dashboard_analysis/` - Data analysis notebooks and scripts.

## Backend development

The backend is built with [FastAPI](https://fastapi.tiangolo.com/) and uses [Meilisearch](https://www.meilisearch.com/) for search functionality.

### Prerequisites

- [Python](https://www.python.org/) 3.13+
- [Meilisearch](https://docs.meilisearch.com/learn/getting_started/installation.html) installed and running.

### Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# With anaconda
conda create -n venv python=3.13 -y
conda activate venv

# Or with venv
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy the example environment file and update `.env` with your Meilisearch configuration if different from defaults.

```bash
cp .env.example .env
```

Start Meilisearch (in a separate terminal):

```bash
# Make sure that you are using the master key defined in your .env
meilisearch --master-key='aStrongMasterKey'
```

Run the application:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. API docs are at `http://localhost:8000/docs`.

### Running tests

We use `pytest` for testing.

```bash
# Run all tests
pytest -vv

# Run tests with coverage
pytest --cov -vv
```

### Linting and formatting

We use `ruff` for linting and formatting.

```bash
# Check for linting errors
ruff check .

# Format code
ruff format .
```

## Frontend development

The frontend is built with [Vue.js](https://vuejs.org/) and [Vite](https://vitejs.dev/).

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (v10+)

### Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`.

### Running tests

Unit Tests with [Vitest](https://vitest.dev/):

```bash
pnpm test
```

End-to-End Tests with [Playwright](https://playwright.dev/):

```bash
# Install browsers first if you haven't
pnpm exec playwright install

# Run tests
pnpm test:e2e
```

### Linting and formatting

- **Lint**: `pnpm lint`
- **Format**: `pnpm format`

## Pull request process

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/my-new-feature
```

Make your changes and ensure they follow the project's coding standards. Run tests locally to ensure nothing is broken.

Commit your changes with descriptive commit messages. Push your branch to your fork:

```bash
git push origin feature/my-new-feature
```

Open a Pull Request against the `master` branch of the original repository.
