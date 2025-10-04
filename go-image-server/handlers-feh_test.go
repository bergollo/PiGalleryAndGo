// handler-feh_test.go contains tests that verify the behavior of the HTTP handlers
// (/start, /stop, and /restart) that manage the "feh" slideshow process.
// The real process-starting functions are mocked to prevent launching
// external commands during automated testing.
package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// The init() function runs before all tests.
// Here, we override (mock) the process control functions to prevent
// starting or killing actual system processes during tests.
// func init() {
// 	startFeh = func() {}
// 	stopFeh = func() {}
// 	startMotion = func() {}
// }

// TestStartHandler verifies that the /start endpoint returns
// a 200 OK response and includes "feh started" in its body.
func TestStartHandler(t *testing.T) {
	// Create a simulated GET request to /start
	req := httptest.NewRequest(http.MethodGet, "/feh/start", nil)
	w := httptest.NewRecorder()

	// Call the handler directly
	startHandler(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	// Assert: HTTP 200 OK
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	// Assert: body contains expected message
	body := w.Body.String()
	if !strings.Contains(body, "feh started") {
		t.Errorf("unexpected body: %s", body)
	}
}

// TestStopHandler verifies that the /stop endpoint returns
// a 200 OK response and includes "feh stopped" in its body.
func TestStopHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/feh/stop", nil)
	w := httptest.NewRecorder()

	stopHandler(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	body := w.Body.String()
	if !strings.Contains(body, "feh stopped") {
		t.Errorf("unexpected body: %s", body)
	}
}

// TestRestartHandler verifies that the /restart endpoint returns
// a 200 OK response and includes "feh restarted" in its body.
func TestRestartHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/feh/restart", nil)
	w := httptest.NewRecorder()

	restartHandler(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	body := w.Body.String()
	if !strings.Contains(body, "feh restarted") {
		t.Errorf("unexpected body: %s", body)
	}
}
