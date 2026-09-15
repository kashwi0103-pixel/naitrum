import torch
import sys

try:
    model_path = sys.argv[1]
    # Try loading as a TorchScript model first
    try:
        model = torch.jit.load(model_path, map_location='cpu')
        print("Model is a TorchScript model.")
        sys.exit(0)
    except Exception as e:
        print(f"Not a TorchScript model: {e}")
        
    # Try loading normally
    obj = torch.load(model_path, map_location='cpu')
    if isinstance(obj, dict):
        print("Model is a state_dict.")
        print(list(obj.keys())[:5])
    else:
        print("Model is a whole model (Pickle).")
        print(type(obj))
        
except Exception as e:
    print(f"Error loading model: {e}")
