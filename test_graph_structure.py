
import sys
import os
import asyncio

# Add current directory to path
sys.path.append(os.getcwd())

async def test_graph():
    try:
        from app.graphs.graph import graph
        print("Graph loaded successfully.")
        print(graph.get_graph().draw_ascii())
    except Exception as e:
        print(f"Error loading graph: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_graph())
