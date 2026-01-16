# 构建图结构

from IPython.display import Image, display
from langgraph.graph import START, END, StateGraph
from langgraph.checkpoint.memory import MemorySaver
from app.graphs.state import AgentState
from app.graphs.node import (
    parallel_search_node,
    itinerary_planning_node
)

# 初始化图构建器
builder = StateGraph(AgentState)

# 添加节点
builder.add_node("parallel_search", parallel_search_node)
builder.add_node("planner", itinerary_planning_node)

# 添加边
# 开始 -> 并行搜索
builder.add_edge(START, "parallel_search")

# 并行搜索 -> 规划师
builder.add_edge("parallel_search", "planner")

# 规划师 -> 结束
# 这里我们不设置自动循环，用户如果不满意，可以通过发送新消息来触发新的运行
builder.add_edge("planner", END)

# 设置记忆检查点，支持 Human-in-the-loop
memory = MemorySaver()

# 编译图
# interrupt_after=["planner"] 可以让程序在规划完成后暂停，等待用户确认或干预
# graph = builder.compile(checkpointer=memory, interrupt_after=["planner"])
graph = builder.compile(checkpointer=memory)

# 可视化（如果在 Jupyter 环境中）
try:
    display(Image(graph.get_graph(xray=1).draw_mermaid_png()))
except:
    pass

import asyncio

async def main():
    # 测试
    from langchain_core.messages import HumanMessage
    input_message = HumanMessage(content="我想在湖南找一个天气好的景点和酒店")
    config = {"configurable": {"thread_id": "1"}}

    print("=== 开始执行工作流 ===")
    async for event in graph.astream({"messages": [input_message]}, config, stream_mode="values"):
        # 检查是否有搜索结果更新
        if "attraction_info" in event and event["attraction_info"]:
            print("\n[系统] 搜索任务完成，已收集景点、天气、酒店信息。")
            # print(f"景点信息摘要: {event['attraction_info'][:50]}...") 

        # 检查是否有最终行程
        if "final_itinerary" in event and event["final_itinerary"]:
            print("\n[系统] 行程规划完成：")
            print("=" * 40)
            print(event["final_itinerary"])
            print("=" * 40)
            
    print("\n=== 工作流结束 ===")

if __name__ == "__main__":
    asyncio.run(main())