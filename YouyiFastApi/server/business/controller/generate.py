import io
import json
import os
import re
import ollama
import asyncio
from ollama import AsyncClient

from flask import Blueprint, request, jsonify, Response

summary = Blueprint('summary', __name__)

jiyao = """
{
    "title": "在这里填写会议的主题",
    "time": "在这里填写会议的具体时间",
    "place": "在这里填写会议的具体地点",
    "participant": [
        "列出所有参会人员"
    ],
    "agenda": [
        {
            "num": "会议议程序号",
            "content": "会议议程序号对应会议议程内容"
        }
    ],
    "resolution": [
        {
            "num": "会议决议序号",
            "content": "会议决议序号对应会议决议内容"
        }
    ],
    "summary": "在这里填写会议的总结"
}
"""

@summary.route('/summary', methods=['POST'])
def summary_meeting():
    data = request.get_json()

    content = data['content']
    payload_str = ''.join([elem['payload'] for elem in content if 'payload' in elem])

    print(payload_str)

    client = ollama.Client(host=f"http://localhost:11434")

    cc = f"""
    总结会议纪要，返回纯json：
    模板：{jiyao}
    内容：{payload_str}

    不要输出你的建议！只要回复json文本，不要使用markdown代码块！
    """

    json_str = client.generate(model='qwen2.5', prompt=cc)

    # 移除不需要的字段
    json_str.pop('model', None)
    json_str.pop('context', None)
    json_str.pop('done_reason', None)
    json_str.pop('done', None)
    json_str.pop('eval_count', None)
    json_str.pop('eval_duration', None)
    json_str.pop('load_duration', None)
    json_str.pop('prompt_eval_count', None)
    json_str.pop('prompt_eval_duration', None)

    print(json_str)

    # return "OK"
    return jsonify(json_str)

