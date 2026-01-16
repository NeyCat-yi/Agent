
from app.models.schemas import TripPlan, Attraction, Meal, Hotel
import json

def test_parsing():
    # 测试 Attraction 解析
    attraction_data = {
        "name": "Test Attraction",
        "address": "Test Address",
        "visit_duration": "2小时",  # 测试字符串时间
        "description": "Test Desc",
        "ticket_price": "免费",     # 测试免费
        # location 缺失
    }
    attr = Attraction(**attraction_data)
    print(f"Attraction parsed: duration={attr.visit_duration}, price={attr.ticket_price}, location={attr.location}")
    assert attr.visit_duration == 120  # 2小时 * 60
    assert attr.ticket_price == 0
    assert attr.location is None

    attraction_data_2 = {
        "name": "Test Attraction 2",
        "address": "Test Address 2",
        "visit_duration": "30",
        "description": "Test Desc",
        "ticket_price": "58元（含船票）"
    }
    attr2 = Attraction(**attraction_data_2)
    print(f"Attraction 2 parsed: duration={attr2.visit_duration}, price={attr2.ticket_price}")
    assert attr2.visit_duration == 30
    assert attr2.ticket_price == 58

    # 测试 Meal 解析
    meal_data = {
        "type": "lunch",
        "name": "Test Lunch",
        "estimated_cost": "约50元"
    }
    meal = Meal(**meal_data)
    print(f"Meal parsed: cost={meal.estimated_cost}")
    assert meal.estimated_cost == 50

    print("All tests passed!")

if __name__ == "__main__":
    try:
        test_parsing()
    except Exception as e:
        print(f"Test failed: {e}")
