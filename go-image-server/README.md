# Go Image Server

A lightweight, production-ready **Go HTTP server** for managing image files.
Supports:

* Listing available images
* Serving images with **dynamic resizing and format conversion**
* Uploading new images
* Full unit test coverage
* Dockerized for easy deployment

---

## Features

| Feature | Description|
| - | - |
| `GET /images` | Returns a JSON list of available image filenames |
| `GET /images/{filename}`<br><br>Resize Parameters | Serves an image with optional resizing and format parameters <br><br> `w` (width), `h` (height), `fit` (e.g. `crop`), `auto=format` (forces JPEG output) |
| `POST /upload` | Uploads a new image file via multipart form |
| `DELETE /images/{filename}` | Deletes stored image |
---

## Project Structure

```
go-image-server/
├── main.go              # Entry point for the application
├── handlers.go          # HTTP route logic (list, serve, upload)
├── handlers_test.go     # Unit tests for handlers
├── go.mod               # Go module definition
├── go.sum               # Module checksum file
├── Dockerfile           # Multi-stage build for Docker
└── static/              # Directory where images are stored
```

---

## Requirements

* **Go 1.23+**
* (Optional) Docker 24+

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bergollo/go-image-server.git
cd go-image-server
```

### 2. Initialize & Download Dependencies

```bash
go mod tidy
```

> This will install `github.com/disintegration/imaging` for image manipulation.

### 3. Run the Server

```bash
go run .
```

Server starts at:

```
http://localhost:8080
```

---

## API Endpoints

### List Images

**Request**

```bash
curl http://localhost:8080/images
```

**Response**

```json
["photo1.jpg", "photo2.png", "sample.gif"]
```

---

### Get Image (with Resize Options)

**Example Request**

```bash
curl "http://localhost:8080/images/sample.png?w=164&h=164&fit=crop&auto=format" -o output.jpg
```

**Query Parameters**

| Param  | Description                                | Example                     |
| ------ | ------------------------------------------ | --------------------------- |
| `w`    | Width in pixels                            | `w=300`                     |
| `h`    | Height in pixels                           | `h=300`                     |
| `fit`  | Cropping method (`crop` or default resize) | `fit=crop`                  |
| `auto` | Output format control                      | `auto=format` (forces JPEG) |

---

### Upload Image

**Example Request**

```bash
curl -X POST -F "file=@/path/to/image.png" http://localhost:8080/upload
```

**Response**

```
File uploaded successfully
```

---

## Running Tests

Run all unit tests:

```bash
go test -v ./...
```

---

## Docker Usage

### Build Docker Image

```bash
docker build -t go-image-server .
```

### Run Container

```bash
docker run -p 8080:8080 go-image-server
```

Access the app at:

```
http://localhost:8080
```

---

### Persist Uploaded Images (Recommended)

Mount the static directory from host to container:

```bash
docker run -p 8080:8080 -v $(pwd)/static:/app/static go-image-server
```

Now uploads are stored persistently on your host machine.

### Docker (Production)

```bash
docker build -t go-image-server .
docker run -d -p 8080:8080 go-image-server
```

---

## 🧩 Future Enhancements (Optional Ideas)

* 🔒 Authentication for uploads
* 🧹 Image cleanup / deletion endpoint
* ☁️ S3 or GCS storage backend
* 🖼️ Caching layer for resized images
* 🧾 Swagger/OpenAPI documentation

---

## 🪪 License

MIT License — feel free to use and modify for personal or commercial projects.
