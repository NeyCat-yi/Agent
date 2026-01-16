from typing import TypedDict, Annotated, List, Optional
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    # 消息历史
    messages: Annotated[List[BaseMessage], add_messages]
    
    # 各个 Agent 的输出结果
    attraction_info: Optional[str]
    weather_info: Optional[str]
    hotel_info: Optional[str]
    
    # 最终行程
    final_itinerary: Optional[str]
    
    # 用户原始需求（可选，方便后续节点参考）
    user_requirement: Optional[str]
