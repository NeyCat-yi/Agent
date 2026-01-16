from app.config import load_env, env

load_env()

class AMapTool:
    def __init__(self) -> None:
        self.api_key = env("AMAP_API_KEY", "")
        self.base_url = env("AMAP_BASE_URL", "https://restapi.amap.com")

    def get_api_key(self) -> str:
        return self.api_key

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI

# 高德的 MCP 服务端 配置
gaode_mcp_server_config = {
    "url":"https://mcp.api-inference.modelscope.net/29a554731f6b49/mcp",
    "transport":"streamable_http",
}

# 创建客户端
mcp_client = MultiServerMCPClient(
    {
        "gaode_mcp_server_config": gaode_mcp_server_config,
    }
)

# 使用 ChatOpenAI 类，但是指向 DeepSeek 的服务器
llm = ChatOpenAI(
    model="qwen-plus",  
    api_key=env("qwen_plus_api_key", ""),  
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    temperature=0
)

async def get_llm_with_tools():
    """获取绑定了工具的 LLM 和工具列表"""
    # 获取工具
    try:
        tools = await mcp_client.get_tools()
        # 绑定工具到 LLM
        llm_with_tools = llm.bind_tools(tools)
        return llm_with_tools, tools
    except Exception as e:
        print(f"Error fetching tools: {e}")
        # 如果获取工具失败，返回原始 LLM 和空列表，避免崩溃
        return llm, []

# 调试工具
import asyncio

async def debug_tools():
    llm_with_tools, tools = await get_llm_with_tools()

    print("工具数量:", len(tools))
    for t in tools:
        print("工具:", t.name)

    # 打印 LLM 调用示例
    if tools:
        print("LLM 调用示例:")
        print(llm_with_tools.invoke("你好,我想知道岳阳的天气"))
    else:
        print("未获取到工具，跳过测试")

if __name__ == "__main__":
    asyncio.run(debug_tools())
