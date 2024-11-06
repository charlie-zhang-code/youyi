from server.business.controller.generate import summary

def register_blueprints(app):
    """
    注册蓝图
    :param app: flask 实例
    :return: 无
    """
    app.register_blueprint(summary)  # 总结会议


