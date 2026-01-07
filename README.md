# Imad Saddik's website

[![ci_pipeline_status](https://github.com/ImadSaddik/ImadSaddikWebsite/actions/workflows/ci.yml/badge.svg)](https://github.com/ImadSaddik/ImadSaddikWebsite/actions/workflows/ci.yml)
[![Backend Coverage](https://img.shields.io/codecov/c/github/ImadSaddik/ImadSaddikWebsite?flag=backend&label=Backend%20Coverage&logo=codecov)](https://codecov.io/gh/ImadSaddik/ImadSaddikWebsite)
[![Frontend Coverage](https://img.shields.io/codecov/c/github/ImadSaddik/ImadSaddikWebsite?flag=frontend&label=Frontend%20Coverage&logo=codecov)](https://codecov.io/gh/ImadSaddik/ImadSaddikWebsite)
[![gitHub_license](https://img.shields.io/github/license/ImadSaddik/ImadSaddikWebsite)](https://github.com/ImadSaddik/ImadSaddikWebsite/blob/master/LICENSE)
[![website_status](https://img.shields.io/website?url=https%3A%2F%2Fimadsaddik.com%2F&up_message=online&down_message=offline&label=imadsaddik.com)](https://imadsaddik.com/)

The source code for my website, [imadsaddik.com](https://imadsaddik.com/), is stored in this repository. The frontend is built with [Vue.js](https://vuejs.org/), and the backend uses [FastAPI](https://fastapi.tiangolo.com/). The site is deployed on [DigitalOcean](https://www.digitalocean.com/), and the search feature is powered by [Meilisearch](https://www.meilisearch.com/).

I created this website to bring together everything I do online. You will find helpful blog posts about programming, courses I have worked on, and astronomy tutorials if you enjoy space 🌝

![readme_thumbnail](./images/readme_thumbnail.svg)

## Project showcase

Check out the video below for a quick tour of the website!

[![Watch the Project Tour](https://img.youtube.com/vi/OfBNIRxqGIU/maxresdefault.jpg)](https://www.youtube.com/watch?v=OfBNIRxqGIU)

## Project setup

To set up the project locally, follow these steps:

### Frontend

Install `pnpm` if you don't have it using `npm`:

```bash
npm install -g pnpm@latest-10
```

> [!NOTE]
> You can install `pnpm` using other methods. For more details, check the [official pnpm installation guide](https://pnpm.io/installation).

After installing `pnpm`, navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
pnpm install
```

Next, create a `.env` file by copying the example file:

```bash
cp .env.example .env
```

Finally, start the development server:

```bash
pnpm dev
```

Open your browser and go to `http://localhost:8080/` to view the frontend. Don't worry about the backend connection at this point.

### Backend

Navigate to the `backend` directory and create a virtual environment. I prefer to use [anaconda](https://www.anaconda.com/), but you can also use `venv`, `uv`, or any other tool of your choice.

```bash
# Using conda
conda create -n venv python=3.13 -y
conda activate venv

# Using venv
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Next, install the required dependencies. Don't forget to activate your virtual environment if you haven't done so already:

```bash
pip install -r requirements.txt
```

Now, create a `.env` file by copying the example file. You don't need to modify anything once you copy it:

```bash
cp .env.example .env
```

Finally, start the FastAPI development server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You are almost done! The next and final step is to start Meilisearch, and populate it with data. This will enable the search functionality, list blogs, courses, and more.

### Configuration

Both the frontend and backend use `.env` files to manage configuration.

In the backend, the `.env` file contains the following variables:

- `MEILISEARCH_URL`: The URL of your Meilisearch instance (default: `http://localhost:7700`).
- `MEILISEARCH_MASTER_KEY`: The master key to secure your search engine. **Must match** the key used when starting Meilisearch.
- `MEILISEARCH_INDEX_NAME`: The name of the index to store articles (default: `articles`).
- `ENVIRONMENT`: Set to `development` or `production`.

In the frontend, the `.env` file contains the following variables:

- `VITE_API_BASE_URL`: The URL of the backend API (default: `http://localhost:8000`).
- `BASE_URL`: The base URL used by Playwright for E2E testing (default: `http://localhost:8080`).

### Meilisearch

#### Installation

Before installing Meilisearch, decide where you want to store the Meilisearch data. Create a directory for Meilisearch data storage somewhere on your system, for example:

```bash
mkdir -p ~/meilisearch_data
```

Now, move to that directory and download the latest stable release of Meilisearch:

```bash
cd ~/meilisearch_data
curl -L https://install.meilisearch.com | sh
```

Start Meilisearch:

```bash
./meilisearch --master-key='aStrongMasterKey'
```

> [!NOTE]
> The master key used here is a dummy key for local development. In a production environment, make sure to use a strong and secure master key.
>
> `aStrongMasterKey` is the same key used in the `.env` file created earlier.

If that last command fails with a permission error like this:

```text
2026-01-03T21:01:04.724569Z ERROR meilisearch: error=Permission denied (os error 13)
Error: Permission denied (os error 13)
```

Retry starting Meilisearch with `sudo`:

```bash
sudo ./meilisearch --master-key='aStrongMasterKey'
```

The output should look like this:

```text
888b     d888          d8b 888 d8b                                            888
8888b   d8888          Y8P 888 Y8P                                            888
88888b.d88888              888                                                888
888Y88888P888  .d88b.  888 888 888 .d8888b   .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888 88K      d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888 "Y8888b. 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888      X88 Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  88888P'  "Y8888  "Y888888 888     "Y8888P 888  888

Config file path: "none"
Database path: "./data.ms"
Server listening on: "http://localhost:7700"
Environment: "development"
Commit SHA: "unknown"
Commit date: "unknown"
Package version: "1.18.0"

Thank you for using Meilisearch!

...
```

#### Populate Meilisearch with data

To load the initial settings and documents into Meilisearch, run the following script from the project root:

```bash
python backend/scripts/seed_meilisearch.py
```

For more details about the seed data, refer to the [seed README](./backend/seed/README.md).

## Run all services using tmux

If you don't want to start each server in a separate window manually, you can use [run_all_services_tmux.sh](./bash_scripts/run_all_services_tmux.sh) to start everything in a `tmux` session.

> [!WARNING]
> Open the bash script and make sure that the paths, and commands are correct before running it.

Now, install `tmux` if you don't have it already. On Debian or Ubuntu, you can install it using:

```bash
sudo apt install tmux
```

For other operating systems, refer to the [official tmux installation guide](https://github.com/tmux/tmux/wiki/Installing).

After installing `tmux`, navigate to the `bash_scripts` directory and run the script:

```bash
cd bash_scripts
./run_all_services_tmux.sh
```

This will create a new `tmux` session named `imad_saddik_personal_website` with three panes: one for Meilisearch, one for the frontend, and one for the backend.

The backend pane is located at the bottom and spans the full width of the window, while the top half is split into two panes for Meilisearch (left) and the frontend (right).

## Useful tools & scripts

This repository contains several helper tools to assist with maintenance and analysis:

- **[Dashboard analysis](./dashboard_analysis/README.md)**: A collection of tools to analyze Nginx logs using [GoAccess](https://goaccess.io/) data. Useful for tracking traffic and identifying bad actors.
- **[Bash scripts](./bash_scripts/README.md)**: A set of utility scripts for tasks such as:

  - Optimizing images (`optimize_jpeg_images.sh`, `optimize_png_images.sh`)
  - Finding large media files (`find_media.sh`)
  - Managing backups (`clean_backups.sh`)

  Check the respective README files in those directories for more usage details.

## Production infrastructure

The `infrastructure/` directory contains configuration files and scripts used to deploy the website in a production environment:

- **nginx/**: Configuration files for the Nginx web server, including Cloudflare-specific settings.
- **supervisor/**: Configuration for [Supervisor](http://supervisord.org/) to manage the backend process.
- **systemd/**: Systemd service files (e.g., for Meilisearch).
- **scripts/**: Deployment and maintenance scripts, such as Gunicorn startup and monthly cleanup tasks.

For more details, refer to the [infrastructure README](./infrastructure/README.md).

## Contributing

Contributions are welcome! To keep the code clean and consistent, please follow these simple steps:

### Pre-commit hooks

I use **pre-commit hooks** to check the code automatically before every commit. This helps catch small mistakes early.

First, install `pre-commit` in your virtual environment:

```bash
pip install pre-commit
```

Then, set up the hooks:

```bash
pre-commit install
```

> [!NOTE]
> The pre-commit hooks will also automatically regenerate the `sitemap.xml` file if you make changes to the frontend.

### Code style (Linting and Formatting)

Please make sure your code follows the project style. You can run these commands to fix most style issues:

- **Frontend**: Run `pnpm lint` and `pnpm format` in the `frontend` folder.
- **Backend**: Run `ruff check . --fix` in the `backend` folder.

### Testing

Before submitting your changes, run the tests to make sure everything still works:

Inside the `frontend` folder run these tests:

- **Unit tests**: `pnpm run test:run`
- **E2E tests**: `pnpm run test:e2e` (requires the frontend, meilisearch, and backend to be running)

Inside the `backend` folder run these tests:

- **Unit tests**: `pytest tests/unit`
- **Integration tests**: `pytest tests/integration` (requires Meilisearch to be running)
- **Load tests**:

  ```bash
  locust -f tests/load/locustfile.py
  ```

  Then open [http://localhost:8089](http://localhost:8089) to start the swarm.

If you find a typo or have a suggestion, feel free to open an issue or a pull request!

## Licence

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact

You can reach me through:

- **Email** – [simad3647@gmail.com](mailto:simad3647@gmail.com).
- **LinkedIn** – [Connect with me](https://www.linkedin.com/in/imadsaddik/).
