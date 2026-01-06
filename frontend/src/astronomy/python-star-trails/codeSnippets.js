export const bashCodeSnippet1 = `pip install numpy Pillow tqdm`;

export const pythonCodeSnippet1 = `import glob
import os
import numpy as np

from tqdm import tqdm
from PIL import Image

def convert_image_to_array(image_path: str) -> np.ndarray:
    image = Image.open(image_path)
    return np.array(image)


def get_all_input_images(image_directory: str) -> list[str]:
    jpg_files = glob.glob(os.path.join(image_directory, "*.jpg"))
    png_files = glob.glob(os.path.join(image_directory, "*.png"))
    image_files = sorted(jpg_files + png_files)
    return image_files


def save_array_as_image(image_array: np.ndarray, output_path: str) -> None:
    final_image = Image.fromarray(image_array.astype(np.uint8))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_image.save(output_path)


image_directory = "./images/stacking_input"
image_files = get_all_input_images(image_directory)
print(f"Found {len(image_files)} image files.")

if not image_files:
    raise ValueError("No image files found!")

stacked_array = None
for image_file in tqdm(
    iterable=image_files,
    total=len(image_files),
    desc="Stacking images to form star trails",
):
    current_array = convert_image_to_array(image_file)
    if stacked_array is None:
        stacked_array = current_array
    else:
        stacked_array = np.maximum(stacked_array, current_array)

output_path = "./output/stacked/stacked_star_trails.jpg"
save_array_as_image(image_array=stacked_array, output_path=output_path)  # type: ignore
print(f"The stacked image has been saved to {output_path}")`;

export const pythonCodeSnippet2 = `import glob
import os
import numpy as np

from tqdm import tqdm
from PIL import Image

def convert_image_to_array(image_path: str) -> np.ndarray:
    image = Image.open(image_path)
    return np.array(image)

def get_all_input_images(image_directory: str) -> list[str]:
    jpg_files = glob.glob(os.path.join(image_directory, "*.jpg"))
    png_files = glob.glob(os.path.join(image_directory, "*.png"))
    image_files = sorted(jpg_files + png_files)
    return image_files

def save_array_as_image(image_array: np.ndarray, output_path: str) -> None:
    final_image = Image.fromarray(image_array.astype(np.uint8))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_image.save(output_path)


image_directory = "./images/stacking_input"
image_files = get_all_input_images(image_directory)
print(f"Found {len(image_files)} image files.")

if not image_files:
    raise ValueError("No image files found!")

stacked_array = None
decay_factor = 0.99

for image_file in tqdm(
    iterable=image_files,
    total=len(image_files),
    desc="Stacking images to form comet trails",
):
    current_array = convert_image_to_array(image_file).astype(np.float32)
    if stacked_array is None:
        stacked_array = current_array
    else:
        stacked_array *= decay_factor
        stacked_array = np.maximum(stacked_array, current_array)

output_path = "./output/stacked/stacked_star_trails_comet_style.jpg"
save_array_as_image(image_array=stacked_array, output_path=output_path)  # type: ignore
print(f"The stacked image has been saved to {output_path}")`;

export const pythonCodeSnippet3 = `import glob
import os
import numpy as np

from tqdm import tqdm
from PIL import Image

def convert_image_to_array(image_path: str) -> np.ndarray:
    image = Image.open(image_path)
    return np.array(image)

def get_all_input_images(image_directory: str) -> list[str]:
    jpg_files = glob.glob(os.path.join(image_directory, "*.jpg"))
    png_files = glob.glob(os.path.join(image_directory, "*.png"))
    image_files = sorted(jpg_files + png_files)
    return image_files

def save_array_as_image(image_array: np.ndarray, output_path: str) -> None:
    final_image = Image.fromarray(image_array.astype(np.uint8))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_image.save(output_path)


image_directory = "./images/stacking_input"  // Make sure this is set correctly
image_files = get_all_input_images(image_directory)
print(f"Found {len(image_files)} image files.")

if not image_files:
    raise ValueError("No image files found!")

stacked_array = None
number_of_images = len(image_files)
mid_point = (number_of_images - 1) / 2.0

for i, image_file in tqdm(
    iterable=enumerate(image_files),
    total=number_of_images,
    desc="Stacking images (fade in/out)",
):
    brightness = 1.0 - abs(i - mid_point) / mid_point if mid_point > 0 else 1.0
    current_array = convert_image_to_array(image_file).astype(np.float32)
    modified_array = current_array * brightness
    if stacked_array is None:
        stacked_array = modified_array
    else:
        stacked_array = np.maximum(stacked_array, modified_array)

output_path = "./output/stacked/stacked_star_trails_fade_in_out.jpg"
save_array_as_image(image_array=stacked_array, output_path=output_path)  # type: ignore
print(f"The stacked image has been saved to {output_path}")`;

export const pythonCodeSnippet4 = `import glob
import os
import numpy as np

from tqdm import tqdm
from PIL import Image

def convert_image_to_array(image_path: str) -> np.ndarray:
    image = Image.open(image_path)
    return np.array(image)

def get_all_input_images(image_directory: str) -> list[str]:
    jpg_files = glob.glob(os.path.join(image_directory, "*.jpg"))
    png_files = glob.glob(os.path.join(image_directory, "*.png"))
    image_files = sorted(jpg_files + png_files)
    return image_files

def save_array_as_image(image_array: np.ndarray, output_path: str) -> None:
    final_image = Image.fromarray(image_array.astype(np.uint8))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_image.save(output_path)


image_directory = "./images/stacking_input"
image_files = get_all_input_images(image_directory)
print(f"Found {len(image_files)} image files.")

if not image_files:
    raise ValueError("No image files found!")

stacked_array = None
output_directory = "./output/timelapse/"

for i, image_file in tqdm(
    iterable=enumerate(image_files),
    total=len(image_files),
    desc="Creating timelapse frames",
):
    current_array = convert_image_to_array(image_file)
    if stacked_array is None:
        stacked_array = current_array
    else:
        stacked_array = np.maximum(stacked_array, current_array)
    output_path = os.path.join(output_directory, f"{i:06d}.jpg")
    save_array_as_image(stacked_array, output_path)

print("Created all timelapse frames.")`;

export const bashCodeSnippet2 = `pip install imageio==2.37.0`;

export const pythonCodeSnippet5 = `import os
import glob

import imageio.v3 as iio
from tqdm import tqdm

def get_all_input_images(image_directory: str) -> list[str]:
    jpg_files = glob.glob(os.path.join(image_directory, "*.jpg"))
    png_files = glob.glob(os.path.join(image_directory, "*.png"))
    image_files = sorted(jpg_files + png_files)
    return image_files


image_directory = "./output/timelapse/"
image_files = get_all_input_images(image_directory)
print(f"Found {len(image_files)} image files.")

if not image_files:
    raise ValueError("No image frames found in the specified directory!")

print("Creating video from timelapse frames...")

fps = 60
output_directory = "./output/video/"
os.makedirs(os.path.dirname(output_directory), exist_ok=True)
output_filename = f"star_trails_timelapse_{fps}fps.mp4"
output_path = os.path.join(output_directory, output_filename)
with iio.imopen(uri=output_path, io_mode="w", plugin="pyav") as writer:
    writer.init_video_stream(codec="libx264", fps=fps, pixel_format="yuv420p")

    for filename in tqdm(image_files, desc="Adding frames to video"):
        frame = iio.imread(filename)
        writer.write_frame(frame)

print(f"Video saved successfully to {output_path}")`;
