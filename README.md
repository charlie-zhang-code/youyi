# 友议助手

## 项目概述

Vue 3 + TypeScript + Vite + Electron + Flask + SQLite3 + Python 3 实现前后端分离的桌面端会议助手。

## 截图

![home.png](docs/home.png)
![create.png](docs/create.png)
![create_1.png](docs/create_1.png)
![record.png](docs/record.png)
![management.png](docs/management.png)
![summary.png](docs/summary.png)

## 安装指南

请按照以下步骤安装和运行本应用：

1. **安装Node.js**：确保你的开发环境中安装了Node.js(v20.16.0)。
2. **安装Python 3**：确保你的系统中安装了Python 3(3.12.4)。
3. **安装依赖**：

Node

``` bash
npm install
```

Python

``` bash
pip install -r requirements.txt
```

4. **运行应用**：

Node

```bash
npm run dev
```

Python

``` bash
python main.py
```

Docker

```bash
docker pull ollama/ollama
# docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker run -d -p 11434:11434 --name ollama ollama/ollama
ollama run qwen2.5
```

## 技术栈

- 前端：Vue 3, TypeScript, Vite, Electron
- 后端：Flask, Python 3, SQLite3
- 数据库：SQLite3


## 运行要准备sherpa的这几个文件

![alt text](docs/image01.png)

![alt text](docs/image02.png)

![alt text](docs/image03.png)

![alt text](docs/image04.png)

有个前端的package要自己再编译一次，具体是哪里给忘了
