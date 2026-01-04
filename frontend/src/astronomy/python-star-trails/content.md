# How to make star trails and time-lapses with Python

A guide to creating star trail images and time-lapse videos on any platform using Python.

**Date:** October 24, 2025
**Tags:** Python, Astrophotography, Image processing, Timelapse, Star trails

---

## Introduction

I created `PyStarTrails` because I needed a simple tool to make star trail images and time-lapse videos on Linux. In this article, I'll show you how to create your own using Python, which works on any platform.

You will learn the basics of how to **blend photos** together to create a beautiful star trail image. I will also show you how to add cool effects like **comet trails** and **fades**. Finally, we'll use the same code to turn all those images into a time-lapse video, like the one below.

_Time-lapse generated from 408 images at 60 FPS._

The source code for this project is available on [GitHub](https://github.com/ImadSaddik/PyStarTrails).

---

## Creating your first star trail image

### How it works

You've captured hundreds of photos, and now it's time to blend them together to create your first star trail image. Each photo can be thought of as having two parts: the stars and the background.

The background remains still, while the stars appear to move from frame to frame due to Earth's rotation. Our goal is to keep the background consistent while revealing the stars' motion across the sky.

To do this, we gradually blend the images together to trace the path of each star. The pixels representing the background are mostly dark, while the ones representing the stars are bright.

We use the [lighten blending mode](https://en.wikipedia.org/wiki/Blend_modes#Lighten_Only) for this process, it takes the brighter value between a pixel in one image and the corresponding pixel in the next. This simple rule creates the illusion of continuous trails.

If you can't quite visualize it yet, don't worry, I've included some illustrations to show exactly how this blending algorithm works.

To demonstrate how the `lighten blending mode` works, I created five small `8x8` images. Each cell is colored either black (background) or white (stars).

In the white cells, I've placed the number `1`, which represents full brightness. In practice, each pixel in an [8-bit image](https://en.wikipedia.org/wiki/8-bit_color) stores a value between `0` and `255`, where `255` corresponds to the maximum brightness. So, in this simplified example, `1` stands for `255`.

The black cells correspond to a brightness value of `0`. For clarity, they are left empty in the diagram because they are greater in number than the white cells.

_A sequence of five 8x8 grids arranged in chronological order._

In the first image, there are three stars. From one frame to the next, each star moves one pixel to the right and one pixel down. By the final frame, only one star remains visible, as the other two have moved outside the `8x8` grid.

Now, let's apply the `lighten blending mode` to the first two images. In the illustration, you'll see them represented as inputs to the `max()` function. This function compares the pixel values from both images and keeps the brighter one for each position. The resulting image is a blend of the two, showing all the stars that were visible in either frame.

_Blending the first two images with the max function._

The blended image becomes the new input for the next iteration of the `max()` function. The third image is then used as the second argument. Blend these two together, and repeat the process with the remaining images until you reach the fifth one.

The final blended result is your complete star trail image, showing the continuous paths traced by the stars over time.

_Iteratively applying the max function to combine the brightest pixels from each frame._

### Putting it into practice

Before running the script, make sure you have the necessary libraries installed:

```bash
pip install numpy Pillow tqdm
```

The following Python script implements the `lighten blending mode` algorithm. Make sure your input images are stored in the `/images/stacking_input` directory and are in either `JPG` or `PNG` format.

```python
import glob
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
print(f"The stacked image has been saved to {output_path}")
```

The code begins by reading all images from the `stacking_input` directory inside the `images` folder.

It then loops through the images one by one:

- In the first iteration, the first image is simply stored in `stacked_array`, since there's nothing to blend with yet.
- In the second iteration, the next image is blended with the previous one stored in `stacked_array`. The blending is done using `np.maximum`, which performs the lighten operation **element by element**. In other words, it works **pixel by pixel**.
- After blending, the result replaces `stacked_array`, and the process continues until all images have been processed.

Finally, the script saves the resulting star trail image to the `output` directory.

_The star trail image that the Python script produced._

---

## Stylizing your star trails

### Creating a comet effect

Comets are fascinating objects, they shine with a bright core followed by a long, glowing tail that gradually fades out. We can apply a similar look to our star trails by slightly modifying the way we blend the images.

With this technique, each star will leave behind a fading trail instead of a continuous, fully bright line.

_Comet at moonrise by [Gabriel Zaparolli](https://www.instagram.com/gabriel_zaparolli/)._

To create this effect, we introduce a `decay factor` that gradually reduces the brightness of the stars over time. The decay factor controls how long the comet-like tail appears: values close to `1.0` produce longer trails, while values below `0.95` make the trails fade much more quickly.

The total number of frames also has a strong impact on trail length. Below is a comparison of two results created using the same sequence of images, but with different decay factors:

_**Left:** decay factor = 0.99. **Right:** decay factor = 0.95._

As you can see, the difference is significant. With a decay factor of `0.99`, the star trails remain visible for much longer than with `0.95`.

This example uses a stack of `408` images. If we take a pixel with initial brightness `1` and apply the decay factor repeatedly, we can see just how quickly the light fades:

- 1 \* 0.99^407 = 0.01673108868
- 1 \* 0.95^407 = 0.00000000086

With a decay factor of `0.95`, the pixel brightness becomes very small, and would be even dimmer if we collected more images. This is why choosing the right decay factor is important for control of your star trails.

To apply the comet effect, we introduce the `decay factor` into the `max()` blending operation. In each iteration, we slightly dim the previously blended image before comparing it with the next frame.

_Applying the decay factor during the first blending step._

On the next iteration, the updated blended image is multiplied by the `decay factor` again, then compared with the next input image. This process repeats for every frame in the sequence.

_Each new frame adds a bright star position, while older ones gradually fade._

Here is the modified code that applies the comet effect. We introduce a new variable, `decay_factor`, and apply it to the previously blended image before combining it with the next frame using `np.maximum`:

```python
import glob
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
print(f"The stacked image has been saved to {output_path}")
```

Here is the resulting comet-style star trail image:

_Star trails with comet effect applied (decay_factor = 0.99)._

### Adding a fade in and fade out

The fade-in and fade-out effect creates star trails that gradually brighten toward the middle of the sequence, then fade again toward the end. This keeps the central portion of each trail bright while softening both the beginning and the end.

To apply this effect, count the total number of images and determine the midpoint.

- Frames **before** the midpoint are gradually brightened, this is the fade-in phase.
- Frames **after** the midpoint are gradually dimmed, the fade-out phase.

_Image sequence showing the fade-in, midpoint, and fade-out phases._

Here is the updated code that applies the fade-in and fade-out effect. We introduce two new variables:

- `mid_point` determines the center frame in the sequence.
- `brightness` controls how bright each frame appears based on its position.

_Multiplying each frame by the brightness value for its position._

Unlike the comet effect, we do not apply the `brightness` factor to the blended image. Instead, we multiply it directly with each current image, because the brightness must depend on that frame's position in the sequence (how far it is from the midpoint).

```python
import glob
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
print(f"The stacked image has been saved to {output_path}")
```

Here is the resulting star trail image with the fade-in and fade-out effect:

_Star trails with a fade-in / fade-out brightness effect._

---

## Creating a star trail time-lapse

Instead of generating just a single star trail image, you can use the same stacking process to create a time-lapse video. The idea is simple: while stacking the images, we save each intermediate blended frame. These saved frames can later be combined into a video.

In fact, the final star trail image you produced earlier is the last frame in this progression. By capturing every step along the way, you can watch the star trails grow and stretch across the sky over time.

Here's the Python script that does exactly that. It progressively blends each image with the previous result and saves every blended frame to the `output` directory. You can also apply different blending styles (like the comet or fade-in/fade-out effects) by modifying the logic inside the loop.

```python
import glob
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

print("Created all timelapse frames.")
```

Before running the script, make sure to install `imageio`:

```bash
pip install imageio==2.37.0
```

Once you've generated the intermediate blended frames, the next step is to turn them into a time-lapse video. The script below will read each frame you created and combine them into a video using `imageio`. You can control the duration of the video by adjusting the `fps` variable (frames per second).

```python
import os
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

print(f"Video saved successfully to {output_path}")
```

---

## Conclusion

In this article, you learned how to create your own star trail images and time-lapses with Python.

We covered the theory of how blending works using the `lighten mode`. We turned that theory into a practical Python script using `numpy.maximum`. You also saw how easy it is to adjust that script to create stylized images with comet or fade effects.

By saving each blended frame, we were able to build a smooth time-lapse that shows the stars moving across the sky. I hope this helps you create your own amazing images.

All the code we used is available in [this GitHub repository](https://github.com/ImadSaddik/PyStarTrails).
