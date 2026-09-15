"""
export_unet_onnx.py
Loads the trained UNet state-dict from vessel_unet_best.pth.zip
and exports it to vessel_unet.onnx with a fixed 256x256 input.
"""

import sys
import io
# Force UTF-8 stdout so torch.onnx internal log emojis don't crash on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import torch
import torch.nn as nn

# ── Model definition (must match training exactly) ──────────────
def double_conv(in_c, out_c):
    return nn.Sequential(
        nn.Conv2d(in_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(inplace=True),
        nn.Conv2d(out_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(inplace=True),
    )

class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.down1 = double_conv(3, 64)
        self.down2 = double_conv(64, 128)
        self.down3 = double_conv(128, 256)
        self.down4 = double_conv(256, 512)
        self.pool  = nn.MaxPool2d(2)
        self.bottleneck = double_conv(512, 1024)
        self.up4    = nn.ConvTranspose2d(1024, 512, 2, stride=2)
        self.upconv4 = double_conv(1024, 512)
        self.up3    = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.upconv3 = double_conv(512, 256)
        self.up2    = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.upconv2 = double_conv(256, 128)
        self.up1    = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.upconv1 = double_conv(128, 64)
        self.out    = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        c1 = self.down1(x)
        c2 = self.down2(self.pool(c1))
        c3 = self.down3(self.pool(c2))
        c4 = self.down4(self.pool(c3))
        bn = self.bottleneck(self.pool(c4))
        u4 = self.upconv4(torch.cat([self.up4(bn), c4], dim=1))
        u3 = self.upconv3(torch.cat([self.up3(u4), c3], dim=1))
        u2 = self.upconv2(torch.cat([self.up2(u3), c2], dim=1))
        u1 = self.upconv1(torch.cat([self.up1(u2), c1], dim=1))
        return self.out(u1)

# ── Load weights ────────────────────────────────────────────────
MODEL_PATH  = "vessel_unet_best.pth.zip"
OUTPUT_ONNX = "vessel_unet.onnx"
IMG_SIZE    = 256

print(f"Loading state-dict from: {MODEL_PATH}")
model = UNet()
state_dict = torch.load(MODEL_PATH, map_location="cpu")

# torch.save can store either the raw dict or a wrapped checkpoint
if isinstance(state_dict, dict) and "model_state_dict" in state_dict:
    state_dict = state_dict["model_state_dict"]

model.load_state_dict(state_dict)
model.eval()
print("Model loaded successfully.")

# ── Dummy forward pass to verify ────────────────────────────────
dummy = torch.randn(1, 3, IMG_SIZE, IMG_SIZE)
with torch.no_grad():
    out = model(dummy)
print(f"Forward pass OK  ->  input: {tuple(dummy.shape)}  output: {tuple(out.shape)}")

# ── Export to ONNX ──────────────────────────────────────────────
print(f"\nExporting to {OUTPUT_ONNX} ...")
torch.onnx.export(
    model,
    dummy,
    OUTPUT_ONNX,
    export_params=True,
    opset_version=14,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={
        "input":  {0: "batch_size"},
        "output": {0: "batch_size"},
    },
    dynamo=False,
)
print(f"ONNX export complete -> {OUTPUT_ONNX}")

# ── Quick ONNX Runtime sanity check ─────────────────────────────
try:
    import onnxruntime as ort
    import numpy as np

    sess = ort.InferenceSession(OUTPUT_ONNX, providers=["CPUExecutionProvider"])
    ort_input  = {sess.get_inputs()[0].name: dummy.numpy()}
    ort_output = sess.run(None, ort_input)[0]
    print(f"ONNX Runtime check OK  ->  output shape: {ort_output.shape}")

    # Compare PyTorch vs ONNX Runtime outputs
    with torch.no_grad():
        pt_output = model(dummy).numpy()
    max_diff = np.abs(pt_output - ort_output).max()
    print(f"Max absolute difference (PyTorch vs ONNX): {max_diff:.6f}  {'PASS' if max_diff < 1e-4 else 'CHECK'}")

except ImportError:
    print("onnxruntime not installed - skipping sanity check.")

print("\nDone. You can now use vessel_unet.onnx in main.py with ONNX Runtime.")
