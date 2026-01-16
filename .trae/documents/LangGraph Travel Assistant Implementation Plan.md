I will implement the travel assistant using LangGraph with the following steps:

1.  **Refactor `app/services/amap_tool.py`**:
    *   Convert it into a reusable service module that initializes the MCP client and ChatOpenAI.
    *   Expose a function to retrieve the configured LLM with Amap tools bound to it.

2.  **Define Graph State in `app/graphs/state.py`**:
    *   Create a `AgentState` class inheriting from `MessagesState`.
    *   Add specific fields to store structured outputs from each agent: `attraction_info`, `weather_info`, `hotel_info`, and `final_itinerary`.

3.  **Implement Agent Nodes in `app/graphs/node.py`**:
    *   **Attraction Node**: Uses the LLM with Amap tools to search for attractions based on user input. Updates `attraction_info`.
    *   **Weather Node**: Uses the LLM with Amap tools to query weather. Updates `weather_info`.
    *   **Hotel Node**: Uses the LLM with Amap tools to search for hotels. Updates `hotel_info`.
    *   **Planner Node (Integration)**: Takes the outputs from the three previous agents and generates a comprehensive travel plan. Updates `final_itinerary`.

4.  **Construct the Workflow in `app/graphs/graph.py`**:
    *   Initialize `StateGraph` with `AgentState`.
    *   Add the four nodes.
    *   Create parallel edges from `START` to `Attraction`, `Weather`, and `Hotel` nodes.
    *   Join these three nodes to the `Planner` node.
    *   Add a **Human-in-the-loop** checkpoint before the `END` (or allow routing back to `Planner` if rejected) using `MemorySaver`.

5.  **Review Prompts**:
    *   Ensure prompts in `app/graphs/prompt.py` are aligned with the new node logic.

This architecture ensures the three data-gathering agents run in parallel for efficiency, and the planner aggregates their real-time data into a coherent itinerary.