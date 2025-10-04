// handlers_test.go provides unit tests for the image server handlers.
// It uses Go's httptest package to simulate HTTP requests and responses.
package main

import (
	"bytes"
	"image/color"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/disintegration/imaging"
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
	filePath := filepath.Join(os.TempDir(), "test.png")
	os.WriteFile(filePath, []byte("fake image data"), 0644)
	defer os.Remove(filePath)

	part, _ := writer.CreateFormFile("files", "test.png")
	f, _ := os.Open(filePath)
	io.Copy(part, f)
	f.Close()
	writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/feh/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	w := httptest.NewRecorder()

	uploadImagesHandler(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", res.StatusCode)
	}
}

func TestGetImageHandler(t *testing.T) {
	// Create a dummy image
	img := imaging.New(100, 50, color.NRGBA{255, 0, 0, 255})
	testFilename := "test.png"
	testFilePath := filepath.Join(staticDir, testFilename)

	err := imaging.Save(img, testFilePath)
	if err != nil {
		t.Fatalf("failed to create test image: %v", err)
	}

	t.Run("returns image when exists", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/images/"+testFilename, nil)
		rec := httptest.NewRecorder()

		getImageHandler(rec, req)

		res := rec.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			t.Errorf("expected status 200, got %d", res.StatusCode)
		}
		if ct := res.Header.Get("Content-Type"); !strings.Contains(ct, "image/png") {
			t.Errorf("expected Content-Type image/png, got %s", ct)
		}
	})

	t.Run("returns 404 for missing image", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/images/missing.png", nil)
		rec := httptest.NewRecorder()

		getImageHandler(rec, req)

		res := rec.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusNotFound {
			t.Errorf("expected status 404, got %d", res.StatusCode)
		}
	})

	t.Run("returns 400 when no filename", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/images/", nil)
		rec := httptest.NewRecorder()

		getImageHandler(rec, req)

		res := rec.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", res.StatusCode)
		}
	})

	// Cleanup
	os.Remove(testFilePath)
}
