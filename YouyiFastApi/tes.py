import ollama

host = "localhost"
port = "11434"

client = ollama.Client(host=f"http://{host}:{port}")

# stream = client.chat(
#     model="qwen2.5",
#     messages=[{
#         "role": "user",
#         "content": "使用Markdown格式帮我编写一个会议纪要"
#     }],
#     stream=True,
#     options={"temperature": 0})
#
# for chunk in stream:
#     print(chunk['message']['content'], end='', flush=True)


data = ollama.generate(model='qwen2.5', prompt='使用Markdown格式帮我编写一个会议纪要')
content = data['response']
print(content)
