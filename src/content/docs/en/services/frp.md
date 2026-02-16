---
title: FRP Intranet Penetration
description: Use FRP to achieve intranet penetration and easily expose local services to the public internet.
---

`taten_frp` provides a shared intranet penetration service for internal team use. On February 14, 2026, team member CN059 purchased a three-year Hong Kong cloud server (8 vCPUs, 8 GB RAM, 30 Mbps bandwidth) and designated it as a shared team server. On the same day, CN059 granted sudo privileges to Xiao Lin and Xiao Xin, and deployed the `frps` service. Additionally, Xiao Xin also deployed a relatively complete Kubernetes service.

The FRP service was announced as available on February 14, 2026.

## 1. Connection Instructions

### 1. Install the frpc client

Clients must install `frpc` to utilize the team's FRP service. For installation instructions, please refer to the [official FRP documentation](https://gofrp.org/en/docs/setup/).
Download the latest binary release of `frpc` from [GitHub](https://github.com/fatedier/frp/releases), extract the downloaded file into any directory, and then edit the `frpc.toml` configuration file accordingly.

### 2. Configure the frpc.toml file

For comprehensive details on configuring `frpc.toml`, please consult the [official FRP documentation](https://gofrp.org/en/docs/features/common/configure/). To simplify setup, TATEN provides the following template:

```toml
# serverAddr: Enter the TATEN FRP server address
serverAddr = ""
serverPort = 7000

[auth]
# Replace with the actual token from TATEN's internal documentation
token = "token"

# Below is a complete tunnel proxy configuration example:
# name: Tunnel name
# type: Tunnel protocol type
# localIP: Local IP address to be exposed (if frpc runs on a router, specify the LAN IP of the target device)
# localPort: Local port to be exposed
# remotePort: Remote port on the FRP server
[[proxies]]
name = "Minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565
```

This basic template configures FRP to forward traffic from port 25565 on the FRP server to port 25565 of the local Minecraft server (`127.0.0.1:25565`). Consequently, other devices can connect to your local Minecraft server via the FRP server’s public IP on port 25565, enabling multiplayer gameplay.

### 3. Start the frpc service

Launch the `frpc` client by executing the following command:

```bash
frpc -c frpc.toml
```

If your configuration file contains no syntax errors, you will see green-colored `INFO` log messages indicating that `frpc` has started successfully.

## 2. Register as a System Service

### 1. Using systemd on Linux

#### (1) Create the service file

Create a file named `frpc.service` in `/etc/systemd/system/` with the following content:

```ini
[Unit]
Description = FRP client
After = network.target syslog.target
Wants = network.target

[Service]
Type = simple
ExecStart = /usr/local/bin/frpc -c /etc/frp/frpc.toml

[Install]
WantedBy = multi-user.target
```

#### (2) Install the frpc binary

Run `uname -m` to determine your system architecture. Download the corresponding `frpc` binary from GitHub, extract it, and place it in `/usr/local/bin/`. Then, set its permissions to `755`:

```bash
chmod 755 /usr/local/bin/frpc
```

#### (3) Place the frpc.toml configuration file

Put your `frpc.toml` configuration file into the `/etc/frp/` directory.

#### (4) Start the frpc service

Reload systemd to recognize the new service:

```bash
sudo systemctl daemon-reload
```

Start the `frpc` service:

```bash
sudo systemctl start frpc
```

Check the service status:

```bash
sudo systemctl status frpc
```

Enable automatic startup on boot:

```bash
sudo systemctl enable frpc
```

### 2. Registering as a Service on Windows

_Continuously being updated..._
