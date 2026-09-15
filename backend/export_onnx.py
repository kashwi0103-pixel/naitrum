import torch
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python export_onnx.py <model.pth>")
        return
        
    model_path = sys.argv[1]
    output_onnx_path = model_path.replace(".pth.zip", "").replace(".pth", "") + "_fixed.onnx"
    
    print(f"Attempting to load {model_path}...")
    
    try:
        # Try loading as TorchScript first
        model = torch.jit.load(model_path, map_location='cpu')
        model.eval()
        
        print("Loaded as TorchScript. Exporting to ONNX...")
        dummy_input = torch.randn(1, 3, 512, 512)
        
        torch.onnx.export(
            model,
            dummy_input,
            output_onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=['input'],
            output_names=['output'],
            dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
        )
        print(f"Successfully exported to {output_onnx_path}")
        return
        
    except Exception as e:
        print(f"Failed to load as TorchScript: {e}")
        
    try:
        # Try loading as whole model
        model = torch.load(model_path, map_location='cpu')
        
        if isinstance(model, dict):
            print("ERROR: This is a state_dict, not a complete model. We cannot export it to ONNX without the original Python class definition.")
            return
            
        model.eval()
        print("Loaded as whole PyTorch model. Exporting to ONNX...")
        dummy_input = torch.randn(1, 3, 512, 512)
        
        torch.onnx.export(
            model,
            dummy_input,
            output_onnx_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=['input'],
            output_names=['output'],
            dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
        )
        print(f"Successfully exported to {output_onnx_path}")
        
    except Exception as e:
        print(f"Failed to load as whole model: {e}")

if __name__ == "__main__":
    main()
