
from app.models.schemas import Attraction
from pydantic.fields import FieldInfo

print("Checking Attraction fields:")
for name, field in Attraction.model_fields.items():
    print(f"{name}: {field.annotation} (required={field.is_required()})")

import inspect
try:
    print("\nValidators:")
    # print(Attraction.__pydantic_decorators__.field_validators)
    for name, val in Attraction.__pydantic_decorators__.field_validators.items():
        print(f"{name}: {val}")
except Exception as e:
    print(f"Could not print validators: {e}")
