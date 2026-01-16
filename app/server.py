
import uvicorn
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
from app.graphs.graph import graph
from app.models.schemas import TripRequest, TripPlanResponse, TripPlan

app = FastAPI(title="Travel Agent API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def clean_json_string(s: str) -> str:
    """Remove markdown code blocks from JSON string."""
    # Remove ```json and ``` or just ```
    s = re.sub(r'```json\s*', '', s)
    s = re.sub(r'```\s*', '', s)
    return s.strip()

@app.post("/api/plan", response_model=TripPlanResponse)
async def generate_plan(request: TripRequest):
    try:
        # Construct the user query from the structured request
        query_parts = [
            f"我想去{request.city}玩{request.travel_days}天。",
            f"时间是{request.start_date}到{request.end_date}。",
            f"交通方式偏好：{request.transportation}。",
            f"住宿偏好：{request.accommodation}。"
        ]
        
        if request.preferences:
            query_parts.append(f"我的偏好是：{', '.join(request.preferences)}。")
            
        if request.free_text_input:
            query_parts.append(f"其他要求：{request.free_text_input}")
            
        user_query = "\n".join(query_parts)
        
        input_message = HumanMessage(content=user_query)
        config = {"configurable": {"thread_id": "1"}} # In a real app, manage thread_ids
        
        final_state = await graph.ainvoke({"messages": [input_message]}, config)
        
        if "final_itinerary" in final_state:
            json_str = clean_json_string(final_state["final_itinerary"])
            try:
                plan_data = json.loads(json_str)
                # Validate against TripPlan model
                trip_plan = TripPlan(**plan_data)
                return TripPlanResponse(success=True, data=trip_plan)
            except json.JSONDecodeError as e:
                return TripPlanResponse(
                    success=False, 
                    message=f"Failed to parse plan JSON: {str(e)}\nRaw: {json_str[:100]}..."
                )
            except Exception as e:
                return TripPlanResponse(
                    success=False, 
                    message=f"Validation error: {str(e)}"
                )
        else:
            return TripPlanResponse(success=False, message="Agent failed to generate a plan.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        return TripPlanResponse(success=False, message=str(e))

if __name__ == "__main__":
    uvicorn.run("app.server:app", host="0.0.0.0", port=8000, reload=True)
