# Go + React Monorepo

A modern **full-stack monorepo** combining a Go backend (image API) and a React frontend UI.
Fully containerized with Docker, orchestrated via Compose, and CI/CD-ready using GitHub Actions.

---

## Overview

| Component    | Description                             | Tech Stack                      |
| ------------ | --------------------------------------- | ------------------------------- |
| **Backend**  | Image upload, resize, and serve API     | Go + Imaging + Swagger          |
| **Frontend** | Simple React UI to view images from API | React + Next.js            |
| **DevOps**   | Local orchestration and CI/CD           | Docker Compose + GitHub Actions |

---

## Project Structure

```
PiGalleryAndGo/
├── go-image-server/         # Go backend API
│   ├── main.go
│   ├── handler.go
│   ├── handler-feh.go       # Optional display control endpoints
│   ├── docs/                # Swagger specs
│   ├── static/              # Uploaded and served images
│   └── Dockerfile
│
├── frontend/                # Next.js frontend
│   ├── app/                 # App Router entrypoints (page.tsx, layout.tsx)
│   ├── components/          # Shared UI building blocks
│   ├── tests/               # Vitest + Playwright suites
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml       # Local multi-container setup
└── .github/
    └── workflows/
        └── github-actions.yml           # CI/CD pipeline
```

---

## Requirements

* **Go 1.23+**
* **Node 20+**
* **Docker + Docker Compose**
* **GitHub account** (for CI/CD)

---

## Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/bergollo/PiGalleryAndGo.git
cd PiGalleryAndGo
```
---

### 2. Docker Compose

#### Build and Run

```bash
docker compose up --build
```

This will:

* Build and run the Go backend on **port 8080**
* Build and run the React frontend on **port 3000**
* Expose Swagger UI at `/swagger/index.html`

#### Stop

```bash
docker compose down
```

#### Persist Uploaded Files

Uploaded images are stored in `go-image-server/static/` — mapped as a volume in Compose for persistence.

> **Heads-up:** The service Dockerfiles are currently named `dockerfile` (lowercase). On case-sensitive filesystems rename them to `Dockerfile` or reference the lowercase name explicitly via `dockerfile: dockerfile` in `docker-compose.yml`.

---

## URLs

| Service    | URL                                                                                  | Description |
| ---------- | ------------------------------------------------------------------------------------ | ----------- |
| Frontend   | [http://localhost:3000](http://localhost:3000)                                       | React App   |
| API        | [http://localhost:8080](http://localhost:8080)                                       | Go Server   |
| Swagger UI | [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html) | API Docs    |

---

## Running Tests (Backend)

Inside backend directory:

```bash
cd go-image-server
go test -v ./...
```

---

## Frontend Development Mode

You can run the frontend independently:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```
http://localhost:3000
```

Make sure the backend (`go-image-server`) is also running on port `8080`.

> Want a different port? Pass `--port` to Next.js: `npm run dev -- --port 5173`

---

## Frontend & End-to-End Tests

The frontend ships with Vitest and Playwright:

```bash
npm run test          # Unit tests (Vitest)
npm run test:coverage # Coverage report
npm run test:ui       # Launch the Vitest UI
npx playwright test   # E2E tests (Playwright)
```

---

## GitHub Actions CI/CD

Your CI pipeline lives at:

```
.github/workflows/github-actions.yml
```

It performs:

1. Go backend build and test
2. React frontend build and test
<!-- 3. Docker image build and push -->

---

## Additional Backend Endpoints

The Go service also exposes image-display helpers for devices running `feh`:

- `POST /feh/start` – launch the slideshow
- `POST /feh/stop/{pid}` – stop a running slideshow by PID
- `POST /feh/restart` – restart the slideshow process

See `go-image-server/handler-feh.go` for implementation details and required environment.

### Triggered On

* Every push or pull request to `dev`

---

## License

This project is released under the **MIT License**.
Feel free to use, modify, and distribute.
