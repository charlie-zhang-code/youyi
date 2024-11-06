from flask import Flask

from server.sys.blueprints.index import register_blueprints
from server.sys.config.index import flask_config

app = Flask(__name__)  # 创建Flask实例

flask_config(app)  # 加载配置
register_blueprints(app)  # 注册蓝图

if __name__ == '__main__':
    app.run(port=8069)
