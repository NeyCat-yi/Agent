import json
import asyncio
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from app.services.amap_tool import get_llm_with_tools, llm as raw_llm
from app.graphs.prompt import (
    ATTRACTION_AGENT_PROMPT,
    WEATHER_AGENT_PROMPT,
    HOTEL_AGENT_PROMPT,
    PLANNER_AGENT_PROMPT
)
from app.graphs.state import AgentState

async def execute_tool_calls(tool_calls, tools_map):
    """执行工具调用并返回结果"""
    results = []
    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_call_id = tool_call["id"]
        
        if tool_name in tools_map:
            try:
                tool_result = await tools_map[tool_name].ainvoke(tool_args)
                results.append(
                    ToolMessage(
                        tool_call_id=tool_call_id,
                        name=tool_name,
                        content=str(tool_result)
                    )
                )
            except Exception as e:
                 results.append(
                    ToolMessage(
                        tool_call_id=tool_call_id,
                        name=tool_name,
                        content=f"Error executing tool {tool_name}: {str(e)}"
                    )
                )
        else:
            results.append(
                ToolMessage(
                    tool_call_id=tool_call_id,
                    name=tool_name,
                    content=f"Tool {tool_name} not found."
                )
            )
    return results

async def generic_search_node(state: AgentState, system_prompt: str, output_key: str):
    """通用的搜索节点逻辑"""
    llm_with_tools, tools = await get_llm_with_tools()
    tools_map = {t.name: t for t in tools}
    
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    
    # 第一次调用 LLM
    response = await llm_with_tools.ainvoke(messages)
    
    final_content = response.content
    
    # 如果有工具调用
    if response.tool_calls:
        tool_results = await execute_tool_calls(response.tool_calls, tools_map)
        # 将工具结果添加到结果中
        # 这里我们可以选择再次调用 LLM 来总结，或者直接返回工具结果
        # 为了简化，我们将工具结果转换为字符串返回
        final_content = "\n".join([res.content for res in tool_results])
        
    return {output_key: final_content}

# 景点搜索 Node
async def attraction_search_node(state: AgentState):
    return await generic_search_node(state, ATTRACTION_AGENT_PROMPT, "attraction_info")

# 天气查询 Node
async def weather_query_node(state: AgentState):
    return await generic_search_node(state, WEATHER_AGENT_PROMPT, "weather_info")

# 酒店推荐 Node
async def hotel_recommendation_node(state: AgentState):
    return await generic_search_node(state, HOTEL_AGENT_PROMPT, "hotel_info")

# 并行搜索 Node
async def parallel_search_node(state: AgentState):
    """并行执行三个搜索任务"""
    results = await asyncio.gather(
        attraction_search_node(state),
        weather_query_node(state),
        hotel_recommendation_node(state)
    )
    
    # 合并结果
    merged_result = {}
    for res in results:
        merged_result.update(res)
    
    return merged_result

# 行程规划 Node
async def itinerary_planning_node(state: AgentState):
    # 规划节点不需要工具，使用原始 LLM
    
    # 构建上下文
    context = f"""
    【景点信息】
    {state.get('attraction_info', '无')}
    
    【天气信息】
    {state.get('weather_info', '无')}
    
    【酒店信息】
    {state.get('hotel_info', '无')}
    """
    
    messages = [
        SystemMessage(content=PLANNER_AGENT_PROMPT),
        HumanMessage(content=f"用户需求: {state['messages'][-1].content}\n\n收集到的信息:\n{context}")
    ]
    
    response = await raw_llm.ainvoke(messages)
    
    return {"final_itinerary": response.content}

# 占位符函数，如果 graph.py 还在引用它们
def restaurant_recommendation_node(state): pass
def history_retrieval_node(state): pass
def photo_spot_recommendation_node(state): pass
def summary_suggestion_node(state): pass
