// handler-feh.go contains handlers to manages a local picture-frame display powered by `feh` and a motion-detection script.
// It exposes REST endpoints for controlling the slideshow and motion script from HTTP requests.
package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"sync"
)

// Global process and mutex definitions
var (
	motionCmd *exec.Cmd
	fehCmd    *exec.Cmd
	mu        sync.Mutex
)

// startMotion starts the timed_motion_display.py script if not already running
func startMotion() {
	mu.Lock()
	defer mu.Unlock()

	if motionCmd != nil && motionCmd.Process != nil {
		log.Println("motion process already running.")
		return
	}

	cmd := exec.Command("bash", "-c",
		"nohup python /home/bergo/Software/picture-frame-album/timed_motion_display.py > output.log 2>&1 & disown")

	err := cmd.Start()
	if err != nil {
		log.Printf("Error starting motion: %v", err)
		return
	}

	motionCmd = cmd
	log.Println("motion started.")
}

// startFeh launches the `feh` slideshow if not already running
func startFeh() {
	mu.Lock()
	defer mu.Unlock()

	if fehCmd != nil && fehCmd.Process != nil {
		log.Println("feh already running.")
		return
	}

	display := ":0.0"
	cmd := exec.Command("bash", "-c",
		fmt.Sprintf("DISPLAY=%s feh --slideshow-delay 5 --recursive --randomize --full-screen --quiet --preload -Y ~/nextjs-dnd-fileupload/packages/server/public/uploads/", display),
	)

	err := cmd.Start()
	if err != nil {
		log.Printf("Error starting feh: %v", err)
		return
	}

	fehCmd = cmd
	log.Println("feh started.")
}

// stopFeh stops the running feh process if active
func stopFeh() {
	mu.Lock()
	defer mu.Unlock()

	if fehCmd != nil && fehCmd.Process != nil {
		err := fehCmd.Process.Kill()
		if err != nil {
			log.Printf("Error stopping feh: %v", err)
		} else {
			log.Println("feh stopped.")
		}
		fehCmd = nil
	} else {
		log.Println("feh is not running.")
	}
}

// startHandler godoc
// @Summary      Start the feh slideshow
// @Description  Launches the feh slideshow viewer on the configured uploads directory.
// @Tags         feh
// @Produce      plain
// @Success      200 {string} string "feh started."
// @Router       /start [get]
func startHandler(w http.ResponseWriter, r *http.Request) {
	startFeh()
	fmt.Fprintln(w, "feh started.")
}

// stopHandler godoc
// @Summary      Stop the feh slideshow
// @Description  Stops the running feh process if active.
// @Tags         feh
// @Produce      plain
// @Success      200 {string} string "feh stopped."
// @Router       /stop [get]
func stopHandler(w http.ResponseWriter, r *http.Request) {
	stopFeh()
	fmt.Fprintln(w, "feh stopped.")
}

// restartHandler godoc
// @Summary      Restart the feh slideshow
// @Description  Stops and restarts the feh slideshow viewer.
// @Tags         feh
// @Produce      plain
// @Success      200 {string} string "feh restarted."
// @Router       /restart [get]
func restartHandler(w http.ResponseWriter, r *http.Request) {
	stopFeh()
	startFeh()
	fmt.Fprintln(w, "feh restarted.")
}
