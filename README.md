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
│   ├── handlers.go
│   ├── handlers_test.go
│   ├── Dockerfile
│   └── static/              # Uploaded and served images
│
├── frontend/             # React frontend (Next.js)
│   ├── src/
│   │   └── App.jsx
│   ├── public/
│   │   └── index.html
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
git clone https://github.com/yourname/monorepo.git
cd monorepo
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
http://localhost:5173
```

Make sure the backend (`go-image-server`) is also running on port `8080`.

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

### Triggered On

* Every push or pull request to `dev`

---

## 🪪 License

This project is released under the **MIT License**.
Feel free to use, modify, and distribute.
