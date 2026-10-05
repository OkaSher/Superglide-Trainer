package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
)

func main() {
	port := "8080"
	if len(os.Args) > 1 {
		port = os.Args[1]
	}

	fs := http.FileServer(http.Dir("./"))
	http.Handle("/", fs)

	url := fmt.Sprintf("http://localhost:%s", port)
	fmt.Println("==================================================")
	fmt.Println("⚡ Apex Legends Superglide Trainer (Go Dev Server)")
	fmt.Printf("🚀 Server running at: %s\n", url)
	fmt.Println("Press Ctrl+C to stop the server.")
	fmt.Println("==================================================")

	// Automatically open in default browser
	openBrowser(url)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	}
	if err != nil {
		fmt.Printf("Notice: Open %s in your browser manually.\n", url)
	}
}
