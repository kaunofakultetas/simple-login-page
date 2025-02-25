# Simple Login Page
Sometimes there is a need to add a simple and weak authentication for resources that you dont really care about but still want to protect from internet and prying eyes. One of the examples would be a system which is prepared for students to work in laboratory environment for which password later will be disclosed for students anyway.

<img width="1250" alt="Screenshot 2025-02-25 at 08 58 43" src="https://github.com/user-attachments/assets/53955661-6a5d-4b28-86a0-fc7c77f9fb23" />



## How it works
This system is GUI only. This web app adds simply a cookie in the browser named "app-password" in plain text. It is intended to work with reverse proxy (for example Caddy) which then checks if the correct cookie exists and redirects requests to the system which is protected by this password. It is possible to make several passwords which would redirect traffic to different systems based on the password but all this redirection is configured in the reverse proxy which is not included in this project.

<img width="328" alt="Screenshot 2025-02-25 at 08 59 46" src="https://github.com/user-attachments/assets/7133c6cb-9827-404a-af8b-852df6c8b244" />

## How to test

First of all you will need docker installed in your system. \
Run these commands and you can try it out:
```bash
git clone https://github.com/kaunofakultetas/simple-login-page
cd simple-login-page
sudo docker build -t simple-login-page --build-arg VITE_SYSTEM_NAME="Failų dalijimosi<br/>sistema" -f Dockerfile.prod ./
sudo docker run -it --rm -p 8080:80 simple-login-page
```

And open the 8080 port in the browser.
