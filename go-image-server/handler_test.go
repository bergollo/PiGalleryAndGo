// handlers_test.go provides unit tests for the image server handlers.
// It uses Go's httptest package to simulate HTTP requests and responses.
package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestListImagesHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/images", nil)
	w := httptest.NewRecorder()

	listImagesHandler(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}

func TestUploadImageHandler(t *testing.T) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Create a temporary file
	filePath := filepath.Join(os.TempDir(), "picture1.jpg")
	os.WriteFile(filePath, []byte("fake image data"), 0644)
	defer os.Remove(filePath)

	part, _ := writer.CreateFormFile("file", "picture1.jpg")
	f, _ := os.Open(filePath)
	io.Copy(part, f)
	f.Close()
	writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/feh/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	w := httptest.NewRecorder()

	uploadImageHandler(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", res.StatusCode)
	}
}

func TestGetImageHandler(t *testing.T) {
	// Ensure a test image exists
	testFile := filepath.Join(staticDir, "picture1.jpg")
	os.WriteFile(testFile, []byte("fake image"), 0644)
	defer os.Remove(testFile)

	req := httptest.NewRequest(http.MethodGet, "/images/picture1.jpg", nil)
	w := httptest.NewRecorder()

	getImageHandler(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}
}
