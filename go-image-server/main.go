// Package main implements a lightweight HTTP server for managing image files.
// It supports listing available images, serving images (with optional resizing),
// and uploading new images to a static directory.
package main

import (
	"log"
	"net/http"
	"os"

	_ "go-image-server/docs" // Required for Swagger docs

	httpSwagger "github.com/swaggo/http-swagger"
)

const staticDir = "./static"

func main() {
	// Ensure static directory exists before server starts.
	if _, err := os.Stat(staticDir); os.IsNotExist(err) {
		if err := os.Mkdir(staticDir, 0755); err != nil {
			log.Fatalf("failed to create static directory: %v", err)
		}
	}

	mux := http.NewServeMux()
	// Route definitions
	mux.HandleFunc("/images", listImagesHandler)
	mux.HandleFunc("/images/", getImageHandler)
	mux.HandleFunc("/upload", uploadImagesHandler)
	mux.HandleFunc("/remove/", deleteImageHandler)

	mux.HandleFunc("/feh/start", startHandler)
	mux.HandleFunc("/feh/stop/", stopHandler)
	mux.HandleFunc("/feh/restart", restartHandler)

	startMotion()

	// Swagger endpoint
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	log.Println("Server started on http://localhost:8080")
	log.Println("Swagger docs available at http://localhost:8080/swagger/index.html")

	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
