import subprocess
import sys
import os
import time

def main():
    print("=" * 65)
    print("  🚀 SkillBridge / Proxly — Powered by Python 3 & FastAPI")
    print("=" * 65)
    print("  🐍 Backend:  FastAPI + Uvicorn (http://localhost:5000)")
    print("  ⚛️ Frontend: React 18 + Vite (http://localhost:5173)")
    print("  📘 Swagger:  http://localhost:5000/docs")
    print("=" * 65)
    print("Starting services... (Press Ctrl+C to stop all)\n")

    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    # 1. Start Python FastAPI Backend
    py_executable = sys.executable
    backend_cmd = [
        py_executable, "-m", "uvicorn",
        "backend_py.main:app",
        "--host", "0.0.0.0",
        "--port", "5000",
        "--reload"
    ]

    # 2. Start Frontend Vite Server
    frontend_cmd = "npm run dev"

    backend_proc = None
    frontend_proc = None

    try:
        backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)
        frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)

        # Keep running until user terminates
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend process ended.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend process ended.")
                break

    except KeyboardInterrupt:
        print("\n🛑 Shutting down SkillBridge services...")
    finally:
        if backend_proc and backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc and frontend_proc.poll() is None:
            frontend_proc.terminate()
        print("Done. Goodbye!")

if __name__ == "__main__":
    main()
