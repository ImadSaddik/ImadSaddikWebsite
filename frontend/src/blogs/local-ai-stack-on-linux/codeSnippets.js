export const installBuildTools = `sudo apt update
sudo apt install build-essential cmake git`;

export const checkNvccVersion = `nvcc --version`;

export const nvccVersionOutput = `nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2023 NVIDIA Corporation
Built on Fri_Jan__6_16:45:21_PST_2023
Cuda compilation tools, release 12.0, V12.0.140
Build cuda_12.0.r12.0/compiler.32267302_0`;

export const cloneLlamaCpp = `git clone https://github.com/ggml-org/llama.cpp.git`;

export const cdLlamaCpp = `cd llama.cpp`;

export const cmakeCommand = `cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89`;

export const cmakeOutput = `$ cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89

-- The C compiler identification is GNU 13.3.0
-- The CXX compiler identification is GNU 13.3.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
CMAKE_BUILD_TYPE=Release
-- Found Git: /usr/bin/git (found version "2.43.0")
-- The ASM compiler identification is GNU
-- Found assembler: /usr/bin/cc
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD
-- Performing Test CMAKE_HAVE_LIBC_PTHREAD - Success
-- Found Threads: TRUE
-- Warning: ccache not found - consider installing it for faster compilation or disable this warning with GGML_CCACHE=OFF
-- CMAKE_SYSTEM_PROCESSOR: x86_64
-- GGML_SYSTEM_ARCH: x86
-- Including CPU backend
-- Found OpenMP_C: -fopenmp (found version "4.5")
-- Found OpenMP_CXX: -fopenmp (found version "4.5")
-- Found OpenMP: TRUE (found version "4.5")
-- x86 detected
-- Adding CPU backend variant ggml-cpu: -march=native
-- Found CUDAToolkit: /usr/include (found version "12.0.140")
-- CUDA Toolkit found
-- Using CUDA architectures: 89
-- The CUDA compiler identification is NVIDIA 12.0.140
-- Detecting CUDA compiler ABI info
-- Detecting CUDA compiler ABI info - done
-- Check for working CUDA compiler: /usr/bin/nvcc - skipped
-- Detecting CUDA compile features
-- Detecting CUDA compile features - done
-- CUDA host compiler is GNU 12.3.0
-- Including CUDA backend
-- ggml version: 0.9.0-dev
-- ggml commit:  3f81b4e9
-- Found CURL: /usr/lib/x86_64-linux-gnu/libcurl.so (found version "8.5.0")
-- Configuring done (2.6s)
-- Generating done (0.1s)
-- Build files have been written to: /home/imad-saddik/Projects/llama.cpp/build`;

export const buildLlamaCpp = `cmake --build build --config Release -j $(nproc)`;

export const buildOutput = `$ cmake --build build --config Release -j $(nproc)

...

[ 98%] Built target llama-tts
[ 99%] Linking CXX executable ../bin/test-backend-ops
[ 99%] Built target test-backend-ops
[100%] Linking CXX executable ../../bin/llama-server
[100%] Built target llama-server`;

export const installLlamaCppBinaries = `sudo cp build/bin/llama-cli /usr/local/bin/
sudo cp build/bin/llama-server /usr/local/bin/
sudo cp build/bin/llama-embedding /usr/local/bin/`;

export const runModelCommand = `llama-cli \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gpu-layers 20 \\
  --ctx-size 4096 \\
  --color \\
  --interactive-first`;

export const runModelHelp = `llama-cli --help`;

export const interactiveModeOutput = `$ llama-cli \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gpu-layers 20 \\
  --ctx-size 4096 \\
  --color \\
  --interactive-first

...

== Running in interactive mode. ==

- Press Ctrl+C to interject at any time.
- Press Return to return control to the AI.
- To return control without starting a new line, end your input with '/'.
- If you want to submit another line, end your input with '\\'.
- Not using system message. To change it, set a different value via -sys PROMPT

> Hi
> Hello! 😊 How can I assist you today?

>`;

export const gpuDetectionLog = `ggml_cuda_init: found 1 CUDA devices:
  Device 0: NVIDIA GeForce RTX 4070 Laptop GPU, compute capability 8.9, VMM: yes`;

export const layerOffloadLog = `load_tensors: offloading 20 repeating layers to GPU
load_tensors: offloaded 20/49 layers to GPU`;

export const memoryAllocationLog = `print_info: file size = 15.25 GiB (4.29 BPW)

load_tensors:      CUDA0 model buffer size = 6334.71 MiB
load_tensors: CPU_Mapped model buffer size = 9278.95 MiB`;

export const performanceReportLog = `llama_perf_sampler_print:    sampling time =      25.55 ms /   390 runs   (    0.07 ms per token, 15264.79 tokens per second)
llama_perf_context_print:        load time =   12043.37 ms
llama_perf_context_print: prompt eval time =     444.75 ms /    24 tokens (   18.53 ms per token,    53.96 tokens per second)
llama_perf_context_print:        eval time =   23582.66 ms /   602 runs   (   39.17 ms per token,    25.53 tokens per second)
llama_perf_context_print:       total time =  737557.31 ms /   626 tokens`;

export const serveModelCommand = `llama-server \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gpu-layers 20 \\
  --host 0.0.0.0 \\
  --port 8080 \\
  --ctx-size 4096`;

export const serverListeningLog = `main: server is listening on http://0.0.0.0:8080 - starting the main loop
srv update_slots: all slots are idle`;

export const pythonSimpleRequest = `import json

import requests

try:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Hello! What is the capital of Morocco?",
        },
    ]

    data = {"messages": messages, "temperature": 0.7}
    response = requests.post(
        url="http://localhost:8080/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
        },
        data=json.dumps(data),
    )
    response.raise_for_status()

    response_json = response.json()
    assistant_message = response_json["choices"][0]["message"]["content"]
    print(assistant_message.strip())

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")`;

export const pythonStreamingRequest = `import json

import requests

try:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Hello! What is the capital of Morocco.",
        },
    ]

    data = {
        "messages": messages,
        "temperature": 0.7,
        "stream": True,
    }
    response = requests.post(
        url="http://localhost:8080/v1/chat/completions",
        headers={"Content-Type": "application/json"},
        data=json.dumps(data),
        stream=True,
    )
    response.raise_for_status()

    for line in response.iter_lines():
        if not line:
            continue

        decoded_line = line.decode("utf-8")

        # Each line is prefixed with "data: ", so we strip that
        if decoded_line.startswith("data: "):
            json_string = decoded_line[len("data: ") :]
            if json_string.strip() == "[DONE]":
                break

            try:
                chunk = json.loads(json_string)

                delta_object = chunk["choices"][0]["delta"]
                if "content" in delta_object:
                    token = delta_object["content"]
                    if token:
                        print(token, end="", flush=True)
            except json.JSONDecodeError:
                pass

    print()

except requests.exceptions.RequestException as e:
    print(f"\nAn error occurred: {e}")`;

export const cloneLibreChat = `git clone https://github.com/danny-avila/LibreChat.git
cd LibreChat`;

export const cpLibreChatConfig = `cp librechat.example.yaml librechat.yaml`;

export const libreChatYamlConfig = `endpoints:
  custom:
    - name: 'llama.cpp'
      apiKey: 'llama-cpp-is-awesome' # Put anything here. Because we are running the models locally, there is no API key that we need to provide.
      baseURL: 'http://host.docker.internal:8080/v1'
      models:
        default:
          [
            'canis-majoris' # Put any model name here for now. We will change this later.
          ]
        fetch: false
      titleConvo: true
      titleModel: "current_model"
      modelDisplayLabel: "Llama.cpp"`;

export const cpDockerComposeOverride = `cp docker-compose.override.yml.example docker-compose.override.yml`;

export const dockerComposeOverrideContent = `# Please consult our docs for more info: https://www.librechat.ai/docs/configuration/docker_override

# TO USE THIS FILE, FIRST UNCOMMENT THE LINE ('services:')

# THEN UNCOMMENT ONLY THE SECTION OR SECTIONS CONTAINING THE CHANGES YOU WANT TO APPLY
# SAVE THIS FILE AS 'docker-compose.override.yaml'
# AND USE THE 'docker compose build' & 'docker compose up -d' COMMANDS AS YOU WOULD NORMALLY DO

# WARNING: YOU CAN ONLY SPECIFY EVERY SERVICE NAME ONCE (api, mongodb, meilisearch, ...)
# IF YOU WANT TO OVERRIDE MULTIPLE SETTINGS IN ONE SERVICE YOU WILL HAVE TO EDIT ACCORDINGLY

# EXAMPLE: if you want to use the config file and the latest numbered release docker image the result will be:


services:
  api:
    volumes:
    - type: bind
      source: ./librechat.yaml
      target: /app/librechat.yaml
    image: ghcr.io/danny-avila/librechat:latest`;

export const runLibreChat = `docker compose up -d`;

export const serveModelCommandRef = `llama-server \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gpu-layers 20 \\
  --host 0.0.0.0 \\
  --port 8080 \\
  --ctx-size 4096`;

export const downloadLlamaSwap = `# Make sure to use the exact filename you downloaded
tar -xvzf llama-swap_162_linux_amd64.tar.gz`;

export const moveLlamaSwap = `mkdir ~/llama-swap
mv ~/Downloads/llama-swap ~/llama-swap/`;

export const llamaSwapConfig = `models:
  "gemma-3-1b-it":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-1b-it-GGUF_gemma-3-1b-it-Q4_K_M.gguf
      --n-gpu-layers 999
      --ctx-size 8192
      --port \${PORT}
    ttl: 300 # 5 minutes

  "Qwen3-30B-A3B-Thinking":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf
      --n-gpu-layers 20
      --ctx-size 4096
      --port \${PORT}
    ttl: 300 # 5 minutes`;

export const runLlamaSwap = `./llama-swap --listen 0.0.0.0:8080`;

export const libreChatYamlUpdate = `endpoints:
  custom:
    - name: 'llama.cpp'
      apiKey: 'llama-cpp-is-awesome'
      baseURL: 'http://host.docker.internal:8080/v1'
      models:
        default:
          [
            # These names MUST EXACTLY match the names in the llama-swap config.yaml
            "gemma-3-1b-it",
            "Qwen3-30B-A3B-Thinking"
          ]
        fetch: false
      titleConvo: true
      titleModel: "current_model"
      modelDisplayLabel: "Llama.cpp"`;

export const restartLibreChat = `docker compose restart`;

export const llamaSwapCleanupLog = `srv    operator(): operator(): cleaning up before exit...`;

export const llamaSwapUnloadLog = `[INFO] <gemma-3-1b-it> Unloading model, TTL of 300s reached
srv    operator(): operator(): cleaning up before exit...`;

export const createLlamaSwapServiceFile = `sudo nano /etc/systemd/system/llama-swap.service`;

export const llamaSwapServiceFile = `[Unit]
Description=Llama Swap Proxy Server
After=network.target

[Service]
User=your_user # IMPORTANT: Change this
Group=your_group # IMPORTANT: Change this
WorkingDirectory=/home/your_user/llama-swap # IMPORTANT: Change this
ExecStart=/home/your_user/llama-swap/llama-swap --listen 0.0.0.0:8080 # IMPORTANT: Change this
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target`;

export const enableLlamaSwapService = `sudo systemctl daemon-reload
sudo systemctl enable llama-swap
sudo systemctl start llama-swap`;

export const journalctlLlamaSwap = `sudo journalctl -f -u llama-swap.service`;

export const generateEmbeddingCommand = `llama-embedding \\
  --model ~/.cache/llama.cpp/Qwen3-Embedding-8B-Q5_K_M.gguf \\
  --n-gpu-layers 999 \\
  --pooling last \\
  --ubatch-size 1024 \\
  --prompt "You like embeddings?"`;

export const embeddingOomLog = `load_tensors: offloading 36 repeating layers to GPU
load_tensors: offloading output layer to GPU
load_tensors: offloaded 37/37 layers to GPU`;

export const serveEmbeddingCommand = `llama-server \\
  --model ~/.cache/llama.cpp/Qwen3-Embedding-8B-Q5_K_M.gguf \\
  --n-gpu-layers 999 \\
  --ubatch-size 1024 \\
  --host 0.0.0.0 \\
  --port 8080 \\
  --embedding \\
  --pooling last`;

export const pythonEmbeddingRequest = `import json

import requests

try:
    data = {
        "input": "What is the capital of Morocco?",
    }
    response = requests.post(
        url="http://localhost:8080/v1/embeddings",
        headers={
            "Content-Type": "application/json",
        },
        data=json.dumps(data),
    )
    response.raise_for_status()

    response_json = response.json()
    embedding_vector = response_json["data"][0]["embedding"]
    print(f"Size of embedding vector: {len(embedding_vector)}")

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")`;

export const cpLlamaMtmdCli = `sudo cp build/bin/llama-mtmd-cli /usr/local/bin/`;

export const runVisionModelCli = `llama-mtmd-cli -hf ggml-org/gemma-3-4b-it-GGUF`;

export const visionChatInstructions = `Running in chat mode, available commands:
/image <path>    load an image
/clear           clear the chat history
/quit or /exit   exit the program`;

export const visionChatImageLoaded = `> /image /home/imad-saddik/Downloads/thumbnail.png
> /home/imad-saddik/Downloads/thumbnail.png image loaded`;

export const visionChatSession = `> What do you see in this image?
encoding image slice...
image slice encoded in 709 ms
decoding image batch 1/1, n_tokens_batch = 256
image decoded (batch 1/1) in 11 ms

Here's a breakdown of what I see in the image:

*   **Text:** The main text reads "First experience w/ Llama.cpp". "w/" is a shortened form of "with".
*   **C++ Logo:** There's a bright orange logo of a llama with a plus sign (+), representing the C++ programming language.
*   **Background:** The background is a gradient, transitioning from white on the left to black on the right.

**Overall Impression:** The image appears to be a graphic related to a beginner's introduction to C++ programming, specifically using the Llama.cpp project (likely a popular tool for running large language models).

>`;

export const llamaSwapVisionConfig = `models:

  # ... your other models

  "gemma-3-4b-it":
    cmd: |
      llama-server \\
      --model /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-4b-it-GGUF_gemma-3-4b-it-Q4_K_M.gguf \\
      --mmproj /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-4b-it-GGUF_mmproj-model-f16.gguf \\
      --n-gpu-layers 999 \\
      --ctx-size 8192 \\
      --port \${PORT}
    ttl: 300`;

export const restartLlamaSwap = `sudo systemctl restart llama-swap`;

export const libreChatYamlVisionUpdate = `endpoints:
  custom:
    - name: 'llama.cpp'
      apiKey: 'llama-cpp-is-awesome'
      baseURL: 'http://host.docker.internal:8080/v1'
      models:
        default:
          [
            # These names MUST EXACTLY match the names in the llama-swap config.yaml
            "gemma-3-1b-it",
            "gemma-3-4b-it", # Add the new model name
            "Qwen3-30B-A3B-Thinking"
          ]
        fetch: false
      titleConvo: true
      titleModel: "current_model"
      modelDisplayLabel: "Canis majoris"`;

export const pythonVisionRequest = `import base64
import json
import mimetypes

import requests

LLAMA_SWAP_URL = "http://localhost:8080"


def encode_image_to_data_uri(image_path: str) -> str:
    mime_type, _ = mimetypes.guess_type(image_path)
    if mime_type is None:
        mime_type = "application/octet-stream"

    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded_string}"


def get_vision_completion(model_name: str, prompt: str, image_path: str) -> None:
    try:
        image_data_uri = encode_image_to_data_uri(image_path)
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_data_uri}},
                ],
            }
        ]

        data = {
            "messages": messages,
            "model": model_name,
            "max_tokens": 1024,
        }
        response = requests.post(
            url=f"{LLAMA_SWAP_URL}/v1/chat/completions",
            headers={"Content-Type": "application/json"},
            data=json.dumps(data),
        )
        response.raise_for_status()
        response_json = response.json()

        assistant_message = response_json["choices"][0]["message"]["content"]
        print(assistant_message.strip())

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


model_to_use = "gemma-3-4b-it"  # This tells llama-swap to load the gemma-3-4b-it model
path_to_image = "./thumbnail.png"  # Change the path
text_prompt = "What do you see in the image?"

get_vision_completion(model_to_use, text_prompt, path_to_image)`;

export const runAudioModelCli = `llama-mtmd-cli -hf ggml-org/Voxtral-Mini-3B-2507-GGUF`;

export const audioChatSession = `Running in chat mode, available commands:
/audio <path>    load an audio
/clear           clear the chat history
/quit or /exit   exit the program

> /audio /home/imad-saddik/Downloads/audio.mp3
/home/imad-saddik/Downloads/audio.mp3 audio loaded

> Please transcribe the following audio:
encoding audio slice...
audio slice encoded in 248 ms
decoding audio batch 1/1, n_tokens_batch = 187
audio decoded (batch 1/1) in 7 ms
encoding audio slice...
audio slice encoded in 219 ms
decoding audio batch 1/1, n_tokens_batch = 187
audio decoded (batch 1/1) in 3 ms
encoding audio slice...
audio slice encoded in 217 ms
decoding audio batch 1/1, n_tokens_batch = 187
audio decoded (batch 1/1) in 3 ms

Hello everyone, welcome to this course about routing and pathfinding problems. We will focus on using the OSRM project, which stands for Open Source Routing Machine. I will show you how to install the routing engine on your computer and use it as a server to make HTTP requests. You will learn how to use OSRM's services, such as finding the shortest path between two or more points, customizing the profile used by OSRM, it could be cars, bikes, or even pedestrians, solving the traveling salesman problem, and much more. I will also show you how to download a specific map area to limit the search space. In this course, I will use Python in the backend to interact with the OSRM engine server. However, you can use any programming language that makes HTTP requests. We will also visualize the data we get from the engine on a map to make the process more fun and easy to understand. This will help us confirm that the data from OSRM is accurate. I hope you are excited about this course. I will do my best to provide high-quality content. Before we start, the source will be available on GitHub. Let's get started.

>`;

export const audioErrorLog = `An error occurred: 404 Client Error: Not Found for url: http://localhost:8080/v1/audio/transcriptions`;

export const cloneWhisperCpp = `git clone https://github.com/ggml-org/whisper.cpp.git
cd whisper.cpp`;

export const downloadWhisperModel = `wget -O ~/.cache/llama.cpp/whisper-large-v3-turbo-q8_0.gguf "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q8_0.bin"`;

export const buildWhisperCpp = `cmake -B build -DGGML_CUDA=1
cmake --build build -j --config Release`;

export const buildWhisperOutput = `[ 99%] Linking CXX executable ../../bin/whisper-cli
[ 99%] Built target whisper-cli
[100%] Linking CXX executable ../../bin/whisper-server
[100%] Built target whisper-server`;

export const installWhisperBinaries = `sudo cp build/bin/whisper-server /usr/local/bin/
sudo cp build/bin/whisper-cli /usr/local/bin/`;

export const llamaSwapWhisperConfig = `models:
  ...
  "whisper-large-v3-turbo":
    cmd: |
      whisper-server
      --model /home/imad-saddik/.cache/llama.cpp/whisper-large-v3-turbo-q8_0.gguf
      --port \${PORT}
      --host 0.0.0.0
      --request-path /v1/audio/transcriptions
      --inference-path ""
    checkEndpoint: /v1/audio/transcriptions/
    ttl: 300`;

export const pythonWhisperRequest = `import requests

try:
    audio_file_path = "./audio.mp3"
    with open(audio_file_path, "rb") as audio_file:
        files = {"file": (audio_file_path.split("/")[-1], audio_file, "audio/mp3")}

        response = requests.post(
            url="http://localhost:8080/v1/audio/transcriptions",
            data={"model": "whisper-large-v3-turbo"},
            files=files,
        )
        response.raise_for_status()

    response_json = response.json()
    transcribed_text = response_json["text"]
    print(transcribed_text.strip())

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
except FileNotFoundError:
    print("Error: The file was not found")`;

export const pythonWhisperOutput = `Hello everyone, welcome to this course about routing and pathfinding problems. We will focus on using the OSRM project, which stands for Open Source Routing Machine. I will show you how to install the routing engine on your computer and use it as a server to make HTTP requests. You will learn how to use the OSRM's services, such as finding the shortest path between two or more points, customizing the profile used by OSRM. It could be cars, bikes, or even pedestrians, solving the traveling salesman problem, and much more. I will also show you how to download a specific map area to limit the search space. In this course, I will use Python in the backend to interact with the OSRM engine server. However, you can use any programming language that can make HTTP requests. We will also visualize the data we get from the engine on a map to make the process more fun and easy to understand. This will help us confirm that the data from OSRM is accurate. I hope you are excited about this course. I will do my best to provide high quality content. Before I forget, the source code will be available on GitHub. Let's get started.`;

export const pythonWhisperTimestamps = `import datetime

import requests

try:
    audio_file_path = "./audio.mp3"
    with open(audio_file_path, "rb") as audio_file:
        files = {"file": (audio_file_path.split("/")[-1], audio_file, "audio/mp3")}

        response = requests.post(
            url="http://localhost:8080/v1/audio/transcriptions",
            data={
                "model": "whisper-large-v3-turbo",
                "response_format": "verbose_json",
                "timestamp_granularities": ["segment"],
            },
            files=files,
        )
        response.raise_for_status()

    response_json = response.json()
    for segment in response_json["segments"]:
        start_time_seconds = segment["start"]
        end_time_seconds = segment["end"]
        text = segment["text"]

        start_timestamp = str(datetime.timedelta(seconds=start_time_seconds))
        end_timestamp = str(datetime.timedelta(seconds=end_time_seconds))

        print(f"[{start_timestamp} --> {end_timestamp}] {text.strip()}")

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
except FileNotFoundError:
    print("Error: The file was not found.")`;

export const pythonWhisperTimestampsOutput = `[0:00:00 --> 0:00:04.240000] Hello, everyone. Welcome to this course about routing and
[0:00:04.240000 --> 0:00:09.560000] pathfinding problems. We will focus on using the OSRM
[0:00:09.560000 --> 0:00:14.170000] project, which stands for Open Source Routing Machine. I
[0:00:14.170000 --> 0:00:17.520000] will show you how to install the routing engine on
[0:00:17.520000 --> 0:00:22.640000] your computer and use it as a server to make HTTP requests.
[0:00:22.640000 --> 0:00:26.080000] You will learn how to use the OSRM's services,
[0:00:26.080000 --> 0:00:29.740000] such as finding the shortest path between two or more
[0:00:29.740000 --> 0:00:33.600000] points, customizing the profile used by OSRM.
[0:00:33.600000 --> 0:00:38.340000] It could be cars, bikes, or even pedestrians, solving the
[0:00:38.340000 --> 0:00:42.720000] traveling salesman problem, and much more. I will also
[0:00:42.720000 --> 0:00:47.450000] show you how to download a specific map area to limit the
[0:00:47.450000 --> 0:00:51.760000] search space. In this course, I will use Python
[0:00:51.760000 --> 0:00:56.010000] in the backend to interact with the OSRM engine server.
[0:00:56.010000 --> 0:00:59.600000] However, you can use any programming language
[0:00:59.600000 --> 0:01:03.940000] that can make HTTP requests. We will also visualize the
[0:01:03.940000 --> 0:01:07.360000] data we get from the engine on a map to make the
[0:01:07.360000 --> 0:01:11.970000] process more fun and easy to understand. This will help us
[0:01:11.970000 --> 0:01:15.280000] confirm that the data from OSRM is accurate.
[0:01:15.280000 --> 0:01:18.790000] I hope you are excited about this course. I will do my best
[0:01:18.790000 --> 0:01:21.440000] to provide high quality content. Before I
[0:01:21.440000 --> 0:01:24.940000] forget, the source code will be available on GitHub. Let's
[0:01:24.940000 --> 0:01:25.680000] get started.`;

export const libreChatYamlWhisperUpdate = `speech:
  speechTab:
    speechToText:
      engineSTT: "external"
  stt:
    openai:
      url: 'http://host.docker.internal:8080/v1/audio/transcriptions'
      apiKey: 'whisper-cpp-is-awesome'
      model: 'whisper-large-v3-turbo' # The same name in config.yaml`;

export const whisperErrorLog = `error: failed to read audio data as wav (Unknown error)
error: failed to read audio data`;

export const whisperFfmpegErrorLog = `Couldn't open input file Eߣ
error: failed to ffmpeg decode 'Eߣ'
error: failed to read audio data

Couldn't open input file ID3
error: failed to ffmpeg decode 'ID3'
error: failed to read audio data`;

export const createFasterWhisperEnv = `# Using Conda
conda create -n faster_whisper python=3.12 -y
conda activate faster_whisper

# Or using Python's venv
python -m venv .faster_whisper
source .faster_whisper/bin/activate`;

export const installFasterWhisper = `pip install faster-whisper
pip install fastapi "uvicorn[standard]" python-multipart`;

export const installCudaLibs = `pip install nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*"`;

export const cudaLibsError = `Unable to load any of {libcudnn_ops.so.9.1.0, libcudnn_ops.so.9.1, libcudnn_ops.so.9, libcudnn_ops.so}
Invalid handle. Cannot load symbol cudnnCreateTensorDescriptor
Aborted (core dumped)`;

export const fixCudaLibsError = `CONDA_ENV_PATH="/home/imad-saddik/anaconda3/envs/faster_whisper" # IMPORTANT: Change this
SITE_PACKAGES_PATH="$CONDA_ENV_PATH/lib/python3.12/site-packages" # IMPORTANT: Change this

export LD_LIBRARY_PATH="$SITE_PACKAGES_PATH/nvidia/cudnn/lib:$SITE_PACKAGES_PATH/nvidia/cublas/lib""`;

export const fasterWhisperUsage = `from faster_whisper import WhisperModel

try:
    model_size = "large-v3"
    model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")

    segments, info = model.transcribe("./audio.mp3", beam_size=5)
    print(
        "Detected language '%s' with probability %f"
        % (info.language, info.language_probability)
    )

    for segment in segments:
        print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))

except Exception as e:
    print("Error during transcription:", str(e))`;

export const fasterWhisperScript1 = `from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}`;

export const fasterWhisperScript2 = `import logging

from fastapi import FastAPI
from faster_whisper import WhisperModel

logging.basicConfig()
logger = logging.getLogger(__name__)
logging.getLogger("faster_whisper").setLevel(logging.INFO)

logger.info("Loading the Whisper model")
whisper_model = WhisperModel(
    model_size_or_path="large-v3",
    device="cuda",
    compute_type="float16"
)
logger.info("Whisper model loaded successfully.")

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}`;

export const fasterWhisperScript3 = `import logging
import os
import tempfile

from fastapi import FastAPI, File, Form, UploadFile
from faster_whisper import WhisperModel

logging.basicConfig()
logger = logging.getLogger(__name__)
logging.getLogger("faster_whisper").setLevel(logging.INFO)

logger.info("Loading the Whisper model")
whisper_model = WhisperModel(
    model_size_or_path="large-v3", device="cuda", compute_type="float16"
)
logger.info("Whisper model loaded successfully.")

app = FastAPI()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/v1/audio/transcriptions")
async def transcribe_audio(
    file: UploadFile = File(...),
    model: str = Form(...),
):
    logger.info(f"Received request for model: {model}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as tmp_file:
        tmp_file.write(await file.read())
        tmp_file_path = tmp_file.name

    logger.info(f"Transcribing audio file: {file.filename}")
    segments, info = whisper_model.transcribe(tmp_file_path, beam_size=5)
    full_text = "".join(segment.text for segment in segments)
    os.unlink(tmp_file_path)
    logger.info(f"Transcription successful. Detected language: {info.language}")

    return {"text": full_text.strip()}`;

export const createStartScript = `nano start.sh`;

export const startScriptContent = `#!/bin/bash

PROJECT_DIR="/home/imad-saddik/Programs/faster-whisper"
CONDA_ENV_PATH="/home/imad-saddik/anaconda3/envs/faster_whisper"
SITE_PACKAGES_PATH="$CONDA_ENV_PATH/lib/python3.12/site-packages"

export LD_LIBRARY_PATH="$SITE_PACKAGES_PATH/nvidia/cudnn/lib:$SITE_PACKAGES_PATH/nvidia/cublas/lib"

cd "$PROJECT_DIR"
"$CONDA_ENV_PATH/bin/uvicorn" server:app --host 0.0.0.0 "$@"`;

export const chmodStartScript = `chmod +x start.sh`;

export const llamaSwapFasterWhisperConfig = `models:
  ...
  "whisper-large-v3-turbo":
    cmd: /home/imad-saddik/Programs/faster-whisper/start.sh --port \${PORT}
    cmdStop: pkill -f "uvicorn server:app"
    proxy: http://127.0.0.1:\${PORT}
    checkEndpoint: "/health"
    ttl: 300`;

export const fasterWhisperLogs = `INFO: Started server process [133188]
INFO: Waiting for application startup.
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:10004 (Press CTRL+C to quit)
INFO: 127.0.0.1:49778 - "GET /health HTTP/1.1" 200 OK
INFO:faster_whisper:Processing audio with duration 00:06.414
INFO:faster_whisper:Detected language 'ar' with probability 0.33
INFO: 127.0.0.1:49784 - "POST /v1/audio/transcriptions HTTP/1.1" 200 OK`;

export const cpLlamaBench = `sudo cp build/bin/llama-bench /usr/local/bin/`;

export const llamaBenchStep1 = `llama-bench \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gen 128 \\
  --n-prompt 0 \\
  --n-gpu-layers 18-24+1`;

export const llamaBenchStep1Output = `main: error: failed to create context with model '/home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf'`;

export const llamaBenchStep2 = `llama-bench \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gen 128 \\
  --n-prompt 0 \\
  --n-gpu-layers 19 \\
  --n-depth 0,4096,8192,16384`;

export const llamaBenchStep3 = `llama-bench \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --n-gen 128 \\
  --n-prompt 0 \\
  --n-gpu-layers 16 \\
  --n-depth 0,4096,8192,16384`;

export const llamaSwapConfigOptimized = `models:
  "Qwen3-30B-A3B-Thinking - 4K":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf
      --n-gpu-layers 19
      --ctx-size 4096
      --port \${PORT}
    ttl: 300

  "Qwen3-30B-A3B-Thinking - 16K":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf
      --n-gpu-layers 16
      --ctx-size 16384
      --port \${PORT}
    ttl: 300`;

export const libreChatYamlOptimized = `endpoints:
  custom:
    - name: 'llama.cpp'
      apiKey: 'llama-cpp-is-awesome'
      baseURL: 'http://host.docker.internal:8080/v1'
      models:
        default:
          [
            # These names MUST EXACTLY match the names in the llama-swap config.yaml
            "gemma-3-1b-it",
            "gemma-3-4b-it",
            "Qwen3-30B-A3B-Thinking - 4K",
            "Qwen3-30B-A3B-Thinking - 16K",
          ]
        fetch: false
      titleConvo: true
      titleModel: "current_model"
      modelDisplayLabel: "Canis majoris"`;

export const createLlamaSwapDesktop = `nano ~/.local/share/applications/llama-swap.desktop`;

export const llamaSwapDesktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=Llama Swap UI
Comment=Monitor local llama.cpp models
Exec=xdg-open http://localhost:8080/
Icon=/path/to/icon.svg # IMPORTANT: Change this path
Terminal=false
Categories=Network;`;

export const chmodLlamaSwapDesktop = `chmod +x ~/.local/share/applications/llama-swap.desktop`;

export const updateDesktopDb = `update-desktop-database ~/.local/share/applications`;

export const createLibreChatDesktop = `nano ~/.local/share/applications/librechat.desktop`;

export const libreChatDesktopContent = `[Desktop Entry]
Version=1.0
Name=LibreChat
Comment=Run LibreChat with Docker
Exec=/path/to/LibreChat/start.sh # IMPORTANT: Change this path
Icon=/path/to/logo.svg # IMPORTANT: Change this path
Terminal=false
Type=Application
Categories=Utility;Development;`;

export const chmodLibreChatDesktop = `chmod +x ~/.local/share/applications/librechat.desktop`;

export const createLibreChatStartScript = `nano start.sh`;

export const libreChatStartScriptContent = `#!/bin/bash

DOCKER_COMPOSE_DIR="/path/to/LibreChat/" # IMPORTANT: Change this path
cd "$DOCKER_COMPOSE_DIR"
docker compose up -d
firefox http://localhost:3080`;

export const installInotify = `sudo apt update
sudo apt install inotify-tools`;

export const createConfigWatcher = `sudo nano /usr/local/bin/config_watcher.sh`;

export const configWatcherContent = `#!/bin/bash

# IMPORTANT: UPDATE THESE PATHS
LLAMA_SWAP_CONFIG="/home/imad-saddik/Programs/llama-swap/config.yaml"
LIBRECHAT_CONFIG="/home/imad-saddik/snap/LibreChat/librechat.yaml"
LIBRECHAT_DIR="/home/imad-saddik/snap/LibreChat/"

while true; do
  # Wait for a modification event on either file.
  # The --format '%w%f' prints the full path of the modified file.
  MODIFIED_FILE=$(inotifywait -q -e modify --format '%w%f' "$LLAMA_SWAP_CONFIG" "$LIBRECHAT_CONFIG")

  if [ "$MODIFIED_FILE" == "$LLAMA_SWAP_CONFIG" ]; then
    echo "$(date): Change detected in $LLAMA_SWAP_CONFIG. Restarting all services..."
    sudo systemctl restart llama-swap
    (cd "$LIBRECHAT_DIR" && docker compose restart)
    echo "$(date): All services restarted successfully."

  elif [ "$MODIFIED_FILE" == "$LIBRECHAT_CONFIG" ]; then
    echo "$(date): Change detected in $LIBRECHAT_CONFIG. Restarting LibreChat containers..."
    (cd "$LIBRECHAT_DIR" && docker compose restart)
    echo "$(date): LibreChat containers restarted successfully."
  fi
done`;

export const sudoVisudo = `sudo visudo`;

export const sudoersContent = `imad-saddik ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart llama-swap`;

export const chmodConfigWatcher = `sudo chmod +x /usr/local/bin/config_watcher.sh`;

export const createConfigWatcherService = `sudo nano /etc/systemd/system/config-watcher.service`;

export const configWatcherServiceContent = `[Unit]
Description=Watcher for llama-swap and librechat config files
After=network.target

[Service]
User=imad-saddik
Group=imad-saddik
ExecStart=/usr/local/bin/config_watcher.sh
Restart=always

[Install]
WantedBy=multi-user.target`;

export const enableConfigWatcherService = `sudo systemctl daemon-reload
sudo systemctl enable config-watcher.service
sudo systemctl start config-watcher.service`;

export const statusConfigWatcherService = `sudo systemctl status config-watcher.service`;

export const statusConfigWatcherOutput = `● config-watcher.service - Watcher for llama-swap and librechat config files
     Loaded: loaded (/etc/systemd/system/config-watcher.service; enabled; preset: enabled)
     Active: active (running) since Wed 2025-10-01 21:19:38 +01; 2h 26min ago
   Main PID: 23025 (config_watcher.)
      Tasks: 2 (limit: 37817)
     Memory: 1.7M (peak: 24.3M)
        CPU: 140ms
     CGroup: /system.slice/config-watcher.service
             ├─23025 /bin/bash /usr/local/bin/config_watcher.sh
             └─28014 inotifywait -q -e modify --format %w%f /home/imad-saddik/Programs/llama-swap/config.yaml /home/i>`;

export const llamaSwapConfigRemoved = `models:
  "gemma-3-1b-it":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-1b-it-GGUF_gemma-3-1b-it-Q4_K_M.gguf
      --n-gpu-layers 999
      --ctx-size 8192
      --port \${PORT}
    ttl: 300

  "Qwen3-30B-A3B-Thinking - 4K":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf
      --n-gpu-layers 19
      --ctx-size 4096
      --port \${PORT}
    ttl: 300

  # "Qwen3-30B-A3B-Thinking - 16K":
  #   cmd: |
  #     llama-server
  #     --model /home/imad-saddik/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf
  #     --n-gpu-layers 16
  #     --ctx-size 16384
  #     --port \${PORT}
  #   ttl: 300

  "gemma-3-4b-it":
    cmd: |
      llama-server
      --model /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-4b-it-GGUF_gemma-3-4b-it-Q4_K_M.gguf
      --mmproj /home/imad-saddik/.cache/llama.cpp/ggml-org_gemma-3-4b-it-GGUF_mmproj-model-f16.gguf
      --n-gpu-layers 999
      --ctx-size 8192
      --port \${PORT}
    ttl: 300

  "whisper-large-v3-turbo":
    cmd: /home/imad-saddik/Programs/faster-whisper/start.sh --port \${PORT}
    cmdStop: pkill -f "uvicorn server:app"
    proxy: http://127.0.0.1:\${PORT}
    checkEndpoint: "/health"
    ttl: 300`;

export const journalctlConfigWatcher = `journalctl -u config-watcher.service -f`;

export const journalctlConfigWatcherOutput = `$ journalctl -u config-watcher.service -f
Oct 01 21:19:38 saddik systemd[1]: Started config-watcher.service - Watcher for llama-swap and librechat config files.
Oct 01 21:20:47 saddik config_watcher.sh[23025]: Wed Oct 1 09:20:47 PM +01 2025: **Change detected** in /home/imad-saddik/Programs/llama-swap/config.yaml. Restarting all services...
Oct 01 21:20:47 saddik sudo[23945]: imad-saddik : PWD=/ ; USER=root ; COMMAND=/usr/bin/systemctl restart llama-swap`;

export const libreChatYamlRemoved = `endpoints:
  custom:
    - name: 'llama.cpp'
      apiKey: 'llama-cpp-is-awesome'
      baseURL: 'http://host.docker.internal:3647/v1'
      models:
        default:
          [
            # These names MUST EXACTLY match the names in the llama-swap config.yaml
            "gemma-3-1b-it",
            "gemma-3-4b-it",
            "Qwen3-30B-A3B-Thinking - 4K",
            # "Qwen3-30B-A3B-Thinking - 16K",
          ]`;

export const journalctlConfigWatcherOutput2 = `Oct 01 21:21:39 saddik config_watcher.sh[23025]: Wed Oct 1 09:21:39 PM +01 2025: **Change detected** in /home/imad-saddik/snap/LibreChat/librechat.yaml. Restarting LibreChat containers...`;

export const cdLlamaCppUpdate = `cd /path/to/llama.cpp`;

export const gitPullLlamaCpp = `git pull --rebase`;

export const rmBuildLlamaCpp = `rm -rf build/`;

export const rebuildLlamaCpp = `cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89
cmake --build build --config Release -j $(nproc)`;

export const cpLlamaCppBinaries = `sudo cp build/bin/llama-cli /usr/local/bin/
sudo cp build/bin/llama-server /usr/local/bin/
sudo cp build/bin/llama-embedding /usr/local/bin/
sudo cp build/bin/llama-mtmd-cli /usr/local/bin/
sudo cp build/bin/llama-bench /usr/local/bin/`;

export const createUpdateScript = `sudo nano /usr/local/bin/update_llama_cpp.sh`;

export const updateScriptContent = `#!/bin/bash

LLAMA_CPP_DIR="/path/to/your/llama.cpp" # IMPORTANT: Change this path
cd "$LLAMA_CPP_DIR" || exit

git pull --rebase

rm -rf build/

cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89
cmake --build build --config Release -j $(nproc)

cp build/bin/llama-cli /usr/local/bin/
cp build/bin/llama-server /usr/local/bin/
cp build/bin/llama-embedding /usr/local/bin/
cp build/bin/llama-mtmd-cli /usr/local/bin/
cp build/bin/llama-bench /usr/local/bin/

echo "llama.cpp updated successfully on $(date)"`;

export const chmodUpdateScript = `sudo chmod +x /usr/local/bin/update_llama_cpp.sh`;

export const crontabEdit = `crontab -e`;

export const crontabEntry = `0 6 * * * sudo /home/your_user/update_llama_cpp.sh >> /home/your_user/llama_cpp_update.log 2>&1`;

export const sudoVisudo2 = `sudo visudo`;

export const sudoersContent2 = `imad-saddik ALL=(ALL) NOPASSWD: /usr/local/bin/update_llama_cpp.sh`;

export const createCronDaily = `sudo nano /etc/cron.daily/update-llama-cpp`;

export const cronDailyContent = `#!/bin/bash

LOG_DIR="/home/your_user/Programs/logs/llama.cpp"
LOG_FILE="$LOG_DIR/llama_cpp_update_$(date +%Y-%m-%d).log"
mkdir -p "$LOG_DIR"

# This line redirects all output for the rest of the script
exec >> "$LOG_FILE" 2>&1

echo "--- Starting llama.cpp daily update at $(date) ---"
LLAMA_CPP_DIR="/home/your_user/Programs/llama.cpp"
if [ ! -d "$LLAMA_CPP_DIR" ]; then
    echo "Error: Directory $LLAMA_CPP_DIR does not exist."
    exit 1
fi

cd "$LLAMA_CPP_DIR" || exit

echo "Running git pull..."
git pull --rebase

echo "Cleaning build directory..."
rm -rf build/

echo "Running cmake setup..."
cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89

echo "Building project (using $(nproc) cores)..."
cmake --build build --config Release -j $(nproc)

echo "Copying new binaries to /usr/local/bin/..."
cp build/bin/llama-cli /usr/local/bin/
cp build/bin/llama-server /usr/local/bin/
cp build/bin/llama-embedding /usr/local/bin/
cp build/bin/llama-mtmd-cli /usr/local/bin/
cp build/bin/llama-bench /usr/local/bin/

echo "--- llama.cpp updated successfully on $(date) ---"
exit 0`;

export const chmodCronDaily = `sudo chmod +x /etc/cron.daily/update-llama-cpp`;

export const runCronDaily = `sudo /etc/cron.daily/update-llama-cpp`;

export const inspectCronLog = `cat /home/imad-saddik/Programs/logs/llama.cpp/llama_cpp_update_$(date +%Y-%m-%d).log`;

export const rmOldScript = `sudo rm /usr/local/bin/update_llama_cpp.sh`;

export const updateLlamaSwap = `tar -xvzf llama-swap_XXX_linux_amd64.tar.gz
sudo mv llama-swap /path/to/your/old/llama-swap`;

export const updateLibreChatStep1 = `cd /path/to/LibreChat`;

export const updateLibreChatStep2 = `git pull --rebase`;

export const updateLibreChatStep3 = `docker compose down`;

export const updateLibreChatStep4 = `# For Linux/Mac
docker images -a | grep "librechat" | awk '{print $3}' | xargs docker rmi`;

export const updateLibreChatStep5 = `docker compose pull`;

export const updateLibreChatStep6 = `docker compose up -d`;

export const updateWhisperCppStep1 = `cd /path/to/whisper.cpp`;

export const updateWhisperCppStep2 = `git pull --rebase
rm -rf build/
cmake -B build -DGGML_CUDA=1
cmake --build build -j --config Release`;

export const updateWhisperCppStep3 = `sudo cp build/bin/whisper-server /usr/local/bin/
sudo cp build/bin/whisper-cli /usr/local/bin/`;

export const updateFasterWhisperStep1 = `# For Conda
conda activate faster_whisper

# For venv
source .faster_whisper/bin/activate`;

export const updateFasterWhisperStep2 = `pip install --upgrade faster-whisper`;

export const installWhisperDependencies = `sudo apt install libavcodec-dev libavformat-dev libavutil-dev`;

export const buildWhisperWithFfmpeg = `cd ~/Programs/whisper.cpp
rm -rf build/

# Build with CUDA and FFmpeg support
cmake -B build -DGGML_CUDA=1 -DWHISPER_FFMPEG=yes -DCMAKE_CUDA_ARCHITECTURES=89
cmake --build build -j --config Release`;

export const llamaSwapWhisperFfmpegConfig = `"whisper-large-v3-turbo":
    cmd: |
      whisper-server
      --model /home/imad-saddik/.cache/llama.cpp/whisper-large-v3-turbo-q8_0.gguf
      --port \${PORT}
      --host 0.0.0.0
      --convert # <--- The flag that fixes the issue!
    checkEndpoint: /health
    ttl: 300`;

export const rmFasterWhisper = `rm -rf ~/Programs/faster-whisper`;

export const rmFasterWhisperEnv = `# If you used Anaconda
conda env remove -n faster_whisper

# If you used venv
rm -rf ~/.faster_whisper`;

export const rmFasterWhisperCache = `rm -rf ~/.cache/huggingface/hub/models--Systran--faster-whisper-large-v3`;

export const runLlamaServerJinja = `llama-server \\
  --model ~/.cache/llama.cpp/Qwen3-30B-A3B-Thinking-2507-IQ4_XS.gguf \\
  --port 8033 \\
  --n-gpu-layers 19 \\
  --ctx-size 4096 \\
  --host 0.0.0.0 \\
  --jinja`;
