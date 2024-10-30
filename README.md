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

## 贡献指南

如果你希望为这个项目贡献代码，请遵循以下步骤：

1. Fork这个仓库。
2. 创建一个新的分支。
3. 提交你的更改。
4. 创建一个Pull Request。

## 开源许可证

本项目采用[MIT许可证](LICENSE)。

## 联系我们

如果你有任何问题或建议，请通过以下方式联系我们：

- 邮箱：[z_shey@163.com](mailto:z_shey@163.com)

## 鸣谢

感谢所有为本项目做出贡献的开发者和用户。
