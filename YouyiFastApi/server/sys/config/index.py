from flask_cors import CORS


def flask_config(app):
    """
    flask配置
    :param app: flask 实例
    :return: 无
    """
    app.config['JSON_AS_ASCII'] = False  # 设置编码格式
    app.config['JSONIFY_MIMETYPE'] = "application/json;charset=utf-8"  # 设置返回的数据格式
    CORS(app)  # 跨域设置
