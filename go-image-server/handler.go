// handlers.go contains HTTP handlers for the Go image server.
//
// Handlers provided:
//   - listImagesHandler: Lists available image filenames in the static directory.
//   - getImageHandler: Serves a specific image (with optional resizing parameters).
//   - upload
package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/disintegration/imaging"
)

// listImagesHandler godoc
// @Summary List all images
// @Description Get all image filenames from the static directory.
// @Tags images
// @Produce json
// @Success 200 {array} string
// @Failure 500 {string} string "Unable to read directory"
// @Router /images [get]
func listImagesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir(staticDir)
	if err != nil {
		http.Error(w, "Unable to read directory", http.StatusInternalServerError)
		return
	}

	var images []string
	for _, f := range files {
		if !f.IsDir() {
			ext := strings.ToLower(filepath.Ext(f.Name()))
			if ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" {
				images = append(images, f.Name())
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

// getImageHandler godoc
// @Summary Get image file
// @Description Serve image by filename, with optional resizing (w, h, fit, auto=format)
// @Tags images
// @Param filename path string true "Image file name"
// @Param w query int false "Width"
// @Param h query int false "Height"
// @Param fit query string false "Fit mode (crop)"
// @Param auto query string false "Auto format (format)"
// @Produce png
// @Success 200 {file} binary
// @Failure 400 {string} string "File name required"
// @Failure 404 {string} string "Image not found"
// @Router /images/{filename} [get]
func getImageHandler(w http.ResponseWriter, r *http.Request) {
	filename := strings.TrimPrefix(r.URL.Path, "/images/")
	if filename == "" {
		http.Error(w, "File name required", http.StatusBadRequest)
		return
	}

	filePath := filepath.Join(staticDir, filename)
	img, err := imaging.Open(filePath)
	if err != nil {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}

	// Parse query params
	width, _ := strconv.Atoi(r.URL.Query().Get("w"))
	height, _ := strconv.Atoi(r.URL.Query().Get("h"))
	fit := r.URL.Query().Get("fit")   // e.g. "crop"
	auto := r.URL.Query().Get("auto") // e.g. "format"

	// Apply resizing if requested
	if width > 0 || height > 0 {
		if fit == "crop" {
			// Crop to requested size
			if width > 0 && height > 0 {
				img = imaging.Fill(img, width, height, imaging.Center, imaging.Lanczos)
			}
		} else {
			// Resize with aspect ratio
			if width == 0 {
				width = img.Bounds().Dx() * height / img.Bounds().Dy()
			}
			if height == 0 {
				height = img.Bounds().Dy() * width / img.Bounds().Dx()
			}
			img = imaging.Resize(img, width, height, imaging.Lanczos)
		}
	}

	// Auto=format → always serve as JPEG (common in CDN usage)
	if auto == "format" {
		w.Header().Set("Content-Type", "image/jpeg")
		imaging.Encode(w, img, imaging.JPEG)
		return
	}

	// Default: serve as PNG
	w.Header().Set("Content-Type", "image/png")
	imaging.Encode(w, img, imaging.PNG)
}

// uploadImageHandler godoc
// @Summary Upload image
// @Description Upload an image file via multipart form data.
// @Tags upload
// @Accept multipart/form-data
// @Param file formData file true "Image file"
// @Success 201 {string} string "File uploaded successfully"
// @Failure 400 {string} string "Missing file"
// @Failure 405 {string} string "Invalid request method"
// @Router /upload [post]
func uploadImageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Missing file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	dst, err := os.Create(filepath.Join(staticDir, header.Filename))
	if err != nil {
		http.Error(w, "Unable to save file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("File uploaded successfully"))
}

// deleteImageHandler godoc
// @Summary Delete an image
// @Description Deletes an image file from the static directory by its filename.
// @Tags images
// @Param filename path string true "Image file name"
// @Success 204 {string} string "No Content"
// @Failure 400 {string} string "File name required"
// @Failure 404 {string} string "Image not found"
// @Failure 500 {string} string "Failed to delete file"
// @Router /images/{filename} [delete]
func deleteImageHandler(w http.ResponseWriter, r *http.Request) {
	filename := strings.TrimPrefix(r.URL.Path, "/images/")
	if filename == "" {
		http.Error(w, "File name required", http.StatusBadRequest)
		return
	}

	filePath := filepath.Join(staticDir, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}

	// Attempt to delete
	if err := os.Remove(filePath); err != nil {
		http.Error(w, "Failed to delete file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
