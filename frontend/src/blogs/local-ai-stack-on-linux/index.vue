<template>
  <ArticleLayout
    :title="title"
    sub-title="A complete guide to running LLMs, embedding models, and multimodal models locally with full control and automation."
    creation-date="December 27, 2025"
    :article-type="ARTICLE_TYPES.BLOG"
    :article-tags="tags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 id="introduction" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#introduction">Introduction</a>
      </h2>

      <p>
        I wrote this article to document every step I took to replace
        <a href="https://github.com/ollama/ollama" target="_blank">ollama</a> with
        <a href="https://github.com/ggml-org/llama.cpp" target="_blank">llama.cpp</a>, and
        <a href="https://github.com/mostlygeek/llama-swap" target="_blank">llama-swap</a>. Along the way, I discovered
        other interesting projects like
        <a href="https://github.com/ggml-org/whisper.cpp" target="_blank">whisper.cpp</a>,
        <a href="https://github.com/SYSTRAN/faster-whisper" target="_blank">faster-whisper</a>, and
        <a href="https://github.com/danny-avila/LibreChat" target="_blank">LibreChat</a>.
      </p>

      <p>
        This article is long because I show everything in detail. You will learn a lot from this article. You will build
        <InlineCode text="llama.cpp" /> to run
        <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank">LLM</a>s, and
        <a href="https://www.ibm.com/think/topics/multimodal-ai" target="_blank">multimodal models</a>. You will use
        <InlineCode text="whisper.cpp" /> and <InlineCode text="faster-whisper" /> to run
        <a href="https://github.com/openai/whisper" target="_blank">the whisper model</a> from OpenAI.
      </p>

      <p>
        <InlineCode text="llama-swap" /> is a handy tool that you will use as a middleman between the backend and
        frontend. The backend is a server that will host the model, and the frontend in our case is
        <InlineCode text="LibreChat" />.
      </p>

      <p>
        In the end, I will show you how to automate everything by using
        <a href="https://wiki.archlinux.org/title/Systemd" target="_blank">services</a>,
        <a href="https://en.wikipedia.org/wiki/Cron" target="_blank">cron jobs</a>, creating desktop shortcuts, and
        using watchers to detect file changes to run commands automatically.
      </p>

      <ImageWithCaption
        :image-src="architectureDiagram"
        image-alt="The architecture of the local AI stack that you will build."
        image-caption="The architecture of the local AI stack that you will build."
        @open-image-modal="handleOpenImageModal"
      />

      <AdmonitionBlock title="Important" type="warning">
        <p>
          Throughout this guide, I use my own username (<InlineCode text="imad-saddik" />) and specific directory paths
          (e.g., <InlineCode text="/home/imad-saddik/..." />) in the code snippets.
        </p>
        <br />
        <p>
          You <b>must</b> update these paths to match your own username and system file structure. Additionally, check
          that flags like <InlineCode text="-DCMAKE_CUDA_ARCHITECTURES" /> match your specific GPU model.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="hardware-and-os" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#hardware-and-os">Hardware and operating system</a>
      </h2>

      <p>
        The experiments that I conducted in this article were performed on an
        <b>Asus ROG Strix G16 gaming laptop</b> running <b>Ubuntu 24.04.2 LTS</b> with the following configuration:
      </p>

      <BulletPoint><b>System RAM</b>: 32GB</BulletPoint>
      <BulletPoint><b>CPU</b>: 13th Gen Intel® Core™ i7–13650HX × 20</BulletPoint>
      <BulletPoint><b>GPU</b>: NVIDIA GeForce RTX™ 4070 Laptop GPU (8GB of VRAM)</BulletPoint>
    </section>

    <section>
      <h2 id="installing-llama-cpp" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#installing-llama-cpp">Installing llama.cpp</a>
      </h2>

      <p>
        The main reason that made me want to try <InlineCode text="llama.cpp" /> is running the new
        <a href="https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507" target="_blank"
          >Qwen3-30B-A3B-Instruct-2507</a
        >
        model released by the <a href="https://qwen.ai/home" target="_blank">Qwen team</a>.
      </p>

      <ImageWithCaption
        :image-src="qwenBenchmarkGraph"
        image-alt="Comparing Qwen3-30B-A3B-Instruct-2507 to other models on selected benchmarks"
        image-caption="Comparing Qwen3-30B-A3B-Instruct-2507 to other models on selected benchmarks. Graph shared by the Qwen team."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Ollama is great, but it decides for you how it should run a model. That worked well for models that didn’t
        exceed the <b>12B parameters</b> range. However, when trying to run big models, ollama complains that I don’t
        have enough resources to use those models.
      </p>

      <p>
        For months I was stuck in that situation, I was limited to running only <b>8–12B parameter</b> models with
        ollama. But this weekend, I decided to try <InlineCode text="llama.cpp" /> after hearing people talk about it on
        Reddit, YouTube videos, and articles.
      </p>

      <p>
        You have plenty of options to install <InlineCode text="llama.cpp" />,
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/README.md" target="_blank"
          >refer to the README file on GitHub</a
        >. I decided to build <InlineCode text="llama.cpp" /> from source for my hardware. You can
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md" target="_blank"
          >follow the build guide</a
        >
        that the team behind <InlineCode text="llama.cpp" /> has created.
      </p>

      <p>
        I have an NVIDIA GPU, I will follow the
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md#cuda" target="_blank">CUDA section</a>
        in the build guide. If you have something else, make sure to follow the section that discusses how to build
        <InlineCode text="llama.cpp" /> for your hardware.
      </p>

      <h3 id="installing-build-tools" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#installing-build-tools">Installing build tools</a>
      </h3>

      <p>On Ubuntu, run these commands to install the build tools.</p>
      <CodeBlock :code="installBuildTools" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="nvidia-cuda-toolkit" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#nvidia-cuda-toolkit">NVIDIA CUDA Toolkit</a>
      </h3>

      <p>
        You need to install the <b>NVIDIA CUDA Toolkit</b> if you don’t have it. This is very important if you want to
        use your GPU for inference. You can
        <a href="https://developer.nvidia.com/cuda-downloads" target="_blank"
          >install the toolkit from NVIDIA’s website</a
        >.
      </p>

      <ImageWithCaption
        :image-src="cudaToolkitDownload"
        image-alt="Selecting the target platform before downloading the CUDA toolkit"
        image-caption="Selecting the target platform before downloading the CUDA toolkit."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        When visiting the website, you will be prompted to select your operating system, architecture, distribution, and
        other stuff. The options that are selected in the image are valid for my system. Please make sure to select what
        is valid for you.
      </p>

      <p>
        For the installation type, you can choose <b>deb (network)</b> because it automatically handles downloading and
        installing all the necessary dependencies.
      </p>

      <ImageWithCaption
        :image-src="cudaToolkitCommands"
        image-alt="The commands to install the CUDA toolkit"
        image-caption="The commands to install the CUDA toolkit will be shown after completing the first step."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        After completing the first step, you will see a list of commands that you need to run in order to install the
        toolkit. To verify that the installation went well, run this command.
      </p>
      <CodeBlock :code="checkNvccVersion" language="bash" @show-toast="handleShowToastEvent" />

      <p>You should see something like this.</p>
      <CodeOutput :code-output="nvccVersionOutput" />

      <h3 id="build-llama-cpp-with-cuda" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#build-llama-cpp-with-cuda">Build llama.cpp with CUDA support</a>
      </h3>

      <p>Start by cloning the <InlineCode text="llama.cpp" /> project from GitHub with the following command.</p>
      <CodeBlock :code="cloneLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, go inside the <InlineCode text="llama.cpp" /> folder.</p>
      <CodeBlock :code="cdLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>The first command that we need to run is the following.</p>
      <CodeBlock :code="cmakeCommand" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        We run the <InlineCode text="cmake" /> command with the <InlineCode text="GGML_CUDA=ON" /> flag to enable
        support for NVIDIA CUDA so that we can use the GPU for inference.
      </p>

      <p>
        The <InlineCode text="CMAKE_CUDA_ARCHITECTURES" /> flag tells the compiler exactly which NVIDIA GPU architecture
        to build the code for. I have an RTX 4070 and the compute capability of this GPU is 8.9.
        <a href="https://developer.nvidia.com/cuda-gpus" target="_blank">Visit this page</a> to check the compute
        capability of your GPU.
      </p>

      <p>After running that command, you should see something like this.</p>
      <CodeOutput :code-output="cmakeOutput" />

      <p>The build files were created. Now, we can build <InlineCode text="llama.cpp" />. Run this command.</p>
      <CodeBlock :code="buildLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        The command takes the configuration files from the <InlineCode text="build" /> directory and starts the
        compilation and linking process to create the final program. To speed up the compilation I added
        <InlineCode text="$(nproc)" /> to use all available CPU cores.
      </p>

      <p>You should see something like this in the end.</p>
      <CodeOutput :code-output="buildOutput" />

      <p>
        The compiled programs are now located in the <InlineCode text="build/bin/" /> directory. Let’s copy them to
        <InlineCode text="/usr/local/bin" />.
      </p>
      <CodeBlock :code="installLlamaCppBinaries" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, you can run <InlineCode text="llama-cli" />, <InlineCode text="llama-embedding" /> and
        <InlineCode text="llama-server" /> directly from any location.
      </p>

      <AdmonitionBlock title="Info" type="info">
        <p>If you recompile the project, make sure to copy the programs again.</p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="running-an-llm" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#running-an-llm">Running an LLM</a>
      </h2>

      <p>
        Companies and research teams upload their models to
        <a href="https://huggingface.co/" target="_blank">Hugging Face</a> in the
        <InlineCode text="safetensors" /> format.
      </p>

      <p>
        Search for the
        <a href="https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507" target="_blank"
          >Qwen3-30B-A3B-Instruct-2507</a
        >
        model in the hub. Click on the
        <a href="https://huggingface.co/Qwen/Qwen3-30B-A3B-Instruct-2507/tree/main" target="_blank"
          >Files and versions</a
        >
        tab, notice how many <InlineCode text="safetensors" /> files are there. These files contain the weights in their
        original high-precision format (16 or 32-bits).
      </p>

      <ImageWithCaption
        :image-src="huggingFaceModelPage"
        image-alt="The Qwen3-30B-A3B-Instruct-2507 model uploaded to Hugging Face"
        image-caption="The Qwen3-30B-A3B-Instruct-2507 model uploaded to Hugging Face by the Qwen team."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        <InlineCode text="llama.cpp" /> does not work with the <InlineCode text="safetensors" /> format, it works with
        the <a href="https://github.com/ggml-org/ggml/blob/master/docs/gguf.md" target="_blank">GGUF format</a>. This
        format is optimized for quick loading and saving of models, and running models efficiently on consumer hardware.
      </p>

      <p>
        The good news is that we can convert models to the GGUF format. There is a
        <a href="https://huggingface.co/spaces/ggml-org/gguf-my-repo" target="_blank">Hugging Face space</a> that you
        can use for that purpose, or this
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/convert_hf_to_gguf.py" target="_blank"
          >python script</a
        >.
      </p>

      <p>
        If you don’t want to convert the model by yourself, you can search for GGUF versions of the model that you want
        to download. There are a lot of people that do this for the community. You have
        <a href="https://huggingface.co/unsloth/models" target="_blank">Unsloth</a>,
        <a href="https://huggingface.co/bartowski" target="_blank">bartowski</a>,
        <a href="https://huggingface.co/TheBloke" target="_blank">TheBloke</a>, and others. Sometimes, the teams behind
        the models release GGUF versions too.
      </p>

      <ImageWithCaption
        :image-src="huggingFaceModelInGGUF"
        image-alt="A GGUF version of the Qwen3-30B-A3B-Instruct-2507 model from Unsloth"
        image-caption="A GGUF version of the Qwen3-30B-A3B-Instruct-2507 model from Unsloth."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Hugging Face displays useful information for GGUF models. On the right side, you will find how much memory is
        needed to run the model at different
        <a href="https://huggingface.co/docs/hub/gguf#quantization-types" target="_blank">quantization levels</a>.
      </p>

      <ImageWithCaption
        :image-src="hardwareCompatibilityPanel"
        image-alt="The hardware compatibility panel"
        image-caption="The hardware compatibility panel."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Hugging Face is displaying the available quantization levels for the model that you selected. You will see a
        green checkmark next to the quantization levels that you can run without any issue on your system.
      </p>

      <p>
        If you don’t see those icons that means that you did not specify the hardware that you have. Click on your
        profile picture, then settings.
      </p>

      <p>
        In the settings page, click on <InlineCode text="Local Apps and Hardware" />. After that, select one of the
        three options under the <InlineCode text="Add new Hardware" /> section, select the model that you have and click
        on the <InlineCode text="Add item" /> button.
      </p>

      <ImageWithCaption
        :image-src="addingHardwareToHF"
        image-alt="Adding Hardware to your Hugging Face profile"
        image-caption="Adding Hardware to your Hugging Face profile."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        But, Imad! I see a lot of quantization options, which one should I choose? That is a great question, before I
        answer it I would like you to
        <a href="https://huggingface.co/docs/hub/gguf#quantization-types" target="_blank">read this page</a> from
        Hugging Face. There is a table that explains all those quantization types in detail.
      </p>

      <ImageWithCaption
        :image-src="quantizationTypesTable"
        image-alt="The quantization types explained in the Hugging Face docs"
        image-caption="The quantization types explained in the Hugging Face docs."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Avoid downloading models in <InlineCode text="FP32" /> or <InlineCode text="FP16" /> precision, as these
        unquantized formats require a lot of memory, especially for very large models.
      </p>

      <p>
        Instead, download <b>quantized</b> versions of the model in the <b>GGUF format</b>, because they use less
        memory. A great starting point is the <InlineCode text="Q8_K" /> quantization level.
      </p>

      <p>
        If you encounter an
        <a href="https://en.wikipedia.org/wiki/Out_of_memory" target="_blank"><b>Out Of Memory </b></a>
        <b>(OOM)</b> error or the model runs too slowly, try a more aggressive quantization like
        <InlineCode text="Q6_K" />. Repeat this process with progressively smaller versions until you find one that runs
        at a <b>decent</b> speed on your machine.
      </p>

      <p>
        To stay organized, create a dedicated folder for your downloaded models. I will store mine in
        <InlineCode text="~/.cache/llama.cpp/" />, but you can use any directory you prefer.
      </p>

      <p>
        To run a model, use the <InlineCode text="llama-cli" /> command. The following example shows how to run the
        <InlineCode text="Qwen3-30B-A3B-Thinking-2507-IQ4_XS" /> model with custom settings that I modified.
      </p>
      <CodeBlock :code="runModelCommand" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        This command uses several arguments to control the model’s behavior. Here’s an explanation of the arguments that
        I used:
      </p>
      <BulletPoint
        ><InlineCode text="--ctx-size" />: Sets the model's context window size in tokens. Larger values can handle
        longer conversations but require more memory.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="--n-gpu-layers" />: Offloads a specified number of the model's layers to the GPU for
        acceleration. Adjust this based on your GPU's VRAM.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="--color" />: Adds color to the output to distinguish your input from the model's
        generation.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="--interactive-first" />: Starts in interactive mode, waiting for user input immediately
        instead of processing an initial prompt.</BulletPoint
      >

      <p>For a complete list of all available arguments and their descriptions, run the help command.</p>
      <CodeBlock :code="runModelHelp" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        After running the <InlineCode text="llama-cli" /> command, the program will load the model and display startup
        information before presenting an interactive prompt. You can then begin chatting with the model directly in your
        terminal.
      </p>
      <CodeOutput :code-output="interactiveModeOutput" />

      <p>
        Before the interactive prompt appears, <InlineCode text="llama-cli" /> outputs detailed logs about the model
        loading process. If you scroll up through this output, you can verify that the <b>GPU was detected</b> and that
        the 20 layers of the model were successfully offloaded.
      </p>

      <p>First, look for a message confirming <InlineCode text="llama.cpp" /> found your CUDA device.</p>
      <CodeOutput :code-output="gpuDetectionLog" />

      <p>
        Next, you can see exactly how many of the model’s layers were offloaded to the GPU. In this case, 20 out of 49
        layers were moved.
      </p>
      <CodeOutput :code-output="layerOffloadLog" />

      <p>
        Finally, the logs provide a breakdown of memory allocation. This is useful for understanding how much
        <b>VRAM</b> and <b>RAM</b> the model is using.
      </p>
      <CodeOutput :code-output="memoryAllocationLog" />

      <p>Based on this output:</p>
      <BulletPoint>The 20 offloaded layers are occupying <b>~6.3 GB of GPU VRAM</b>.</BulletPoint>
      <BulletPoint>The rest of the model is running on the CPU and consuming <b>~9.3 GB of system RAM</b>.</BulletPoint>

      <p>
        When you exit the interactive session by pressing <InlineCode text="Ctrl+C" />, <InlineCode text="llama-cli" />
        automatically displays a detailed performance report. The output will look like this.
      </p>
      <CodeOutput :code-output="performanceReportLog" />

      <p>Here is how to interpret the most important metrics from this report:</p>
      <BulletPoint
        ><InlineCode text="load time" />: This is the time it took to load the large model file from your disk into RAM
        and VRAM. In my case, it took 12 seconds.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="prompt eval time" />: This measures the speed of processing your initial prompt. Here, the
        speed was <InlineCode text="53.96 tokens per second" />.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="eval time" />: This is the generation speed, which shows how quickly the model produces new
        tokens after processing your prompt. In my case, the model generated text at a speed of
        <InlineCode text="25.53 tokens per second" />.</BulletPoint
      >
    </section>

    <section>
      <h2 id="serving-the-llm-as-an-api" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#serving-the-llm-as-an-api">Serving the LLM as an API</a>
      </h2>

      <p>
        Serving a model means running it as a local server, exposing it as an <b>API</b> that other applications can
        connect to and use.
      </p>

      <p>
        For example, you could write a Python program that uses the model for a specific task or connect a web interface
        like LibreChat for a more user-friendly chat experience.
      </p>

      <p>
        To serve the model as an API, we use the <InlineCode text="llama-server" /> program. The command is very similar
        to <InlineCode text="llama-cli" />, but with additional arguments for networking.
      </p>

      <p>Here is how you can serve the <InlineCode text="Qwen3-30B-A3B-Thinking-2507-IQ4_XS" /> model.</p>
      <CodeBlock :code="serveModelCommand" language="bash" @show-toast="handleShowToastEvent" />

      <p>In this command we use two networking arguments:</p>
      <BulletPoint><InlineCode text="--host" />: Specifies the IP address the server will listen on.</BulletPoint>
      <BulletPoint><InlineCode text="--port" />: Specifies the network port the server will use.</BulletPoint>

      <p>Why use <InlineCode text="--host 0.0.0.0" />?</p>

      <p>
        Setting the host to <InlineCode text="0.0.0.0" /> makes the server listen on all available network interfaces.
        This is very important for allowing other services, especially applications running inside
        <b>Docker containers</b> (like LibreChat), to see and connect to your
        <InlineCode text="llama-server" /> instance.
      </p>

      <p>
        If you were to use the default <InlineCode text="127.0.0.1" /> (localhost), the server would only be accessible
        from your main computer, and the Docker container would not be able to reach it.
      </p>

      <p>
        After running the command, the log output will confirm that the server is running and ready to accept requests.
      </p>
      <CodeOutput :code-output="serverListeningLog" />

      <h3 id="connect-to-server-with-python" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#connect-to-server-with-python">Connect to the server with Python</a>
      </h3>

      <p>
        Since <InlineCode text="llama-server" /> provides an
        <a href="https://github.com/openai/openai-openapi" target="_blank">OpenAI-compatible API</a>, you can interact
        with it using the same tools you would use for OpenAI's models. The endpoint for chat is
        <InlineCode text="/v1/chat/completions" />.
      </p>

      <p>
        Let’s write two Python scripts to connect to our server: one for a simple request-response, and a second example
        for streaming the response in real-time.
      </p>

      <h4 id="connect-to-server-with-python-example1" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#connect-to-server-with-python-example1">
          Example 1: A simple request
        </a>
      </h4>
      <p>
        In this example, we send a prompt to the server and wait for the full response to be generated before printing
        it.
      </p>
      <BulletPoint
        >We use <a href="https://github.com/psf/requests" target="_blank">requests</a> to send the HTTP request and
        <InlineCode text="json" /> to format our data.</BulletPoint
      >
      <BulletPoint
        >We create a <InlineCode text="messages" /> list containing <InlineCode text="system" /> and
        <InlineCode text="user" /> roles. This is sent inside a <InlineCode text="data" /> dictionary, along with other
        parameters like <InlineCode text="temperature" />.</BulletPoint
      >
      <BulletPoint>We send a POST request to the server.</BulletPoint>
      <BulletPoint>We parse the returned JSON to extract and print the model’s message.</BulletPoint>

      <CodeBlock :code="pythonSimpleRequest" language="python" @show-toast="handleShowToastEvent" />

      <h4 id="connect-to-server-with-python-example2" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#connect-to-server-with-python-example2">
          Example 2: Streaming the response
        </a>
      </h4>
      <p>
        For a real-time experience, you can stream the response token by token. The server uses a standard format called
        <a href="https://html5doctor.com/server-sent-events/" target="_blank">Server-Sent Events (SSE)</a>. Here’s how
        it works:
      </p>
      <BulletPoint
        >We add <InlineCode text='"stream": True' /> to our JSON payload and <InlineCode text="stream=True" /> to the
        <InlineCode text="requests.post()" /> call.</BulletPoint
      >
      <BulletPoint
        >We use <InlineCode text="response.iter_lines()" /> to process the response as it arrives.</BulletPoint
      >
      <BulletPoint
        >Each piece of data from the stream is a line of bytes prefixed with <InlineCode text="data:" />. The code
        decodes the line, strips the prefix, and parses the remaining string.</BulletPoint
      >
      <BulletPoint
        >The stream ends when the server sends a final message of <InlineCode text="data: [DONE]" />. We break out of
        the loop when we receive that message.</BulletPoint
      >
      <BulletPoint
        >The generated token is stored inside the <b>delta</b> object. We extract this token and print it immediately
        using <InlineCode text='end=""' /> and <InlineCode text="flush=True" /> to display it on the same
        line.</BulletPoint
      >

      <CodeBlock :code="pythonStreamingRequest" language="python" @show-toast="handleShowToastEvent" />

      <h3 id="connect-to-server-with-librechat" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#connect-to-server-with-librechat"
          >Connect to the server with LibreChat</a
        >
      </h3>

      <p>
        LLMs format their responses in
        <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank"><b>Markdown</b></a
        >. This makes it hard to read the output in the terminal. This is why using web interfaces like
        <b>LibreChat</b> is necessary because they format the output in a way that makes it easier to read.
      </p>

      <p>
        I love LibreChat because it is highly customizable and can connect to any AI provider, not just our local
        <InlineCode text="llama.cpp" /> server. It can display the <b>thinking</b> process for reasoning models. It
        supports RAG, storing memories about you, and much more.
      </p>

      <p>
        Now, let’s configure LibreChat to work with our running <InlineCode text="llama-server" />. First, clone the
        LibreChat project and navigate into the new directory.
      </p>
      <CodeBlock :code="cloneLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Before continuing, make sure that you have
        <a href="https://www.docker.com/" target="_blank">Docker</a> installed. Next, create your custom configuration
        file by copying the example file.
      </p>
      <CodeBlock :code="cpLibreChatConfig" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, open the new <InlineCode text="librechat.yaml" /> file. Under the
        <InlineCode text="endpoints.custom" /> section, add the following entry. This tells LibreChat how to connect to
        our local <InlineCode text="llama.cpp" />
        server.
      </p>
      <CodeBlock :code="libreChatYamlConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>
        The most important setting here is <InlineCode text="baseURL" />. The address
        <InlineCode text="http://host.docker.internal:8080/v1" /> allows the LibreChat container to communicate with the
        <InlineCode text="llama-server" /> running on your main computer. The <InlineCode text="apiKey" /> can be set to
        anything you like.
      </p>

      <p>
        Next, create a
        <a href="https://www.librechat.ai/docs/configuration/docker_override" target="_blank"
          >Docker compose override file</a
        >. This will tell Docker to use your custom configuration.
      </p>
      <CodeBlock :code="cpDockerComposeOverride" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Open the new <InlineCode text="docker-compose.override.yml" /> and uncomment the
        <InlineCode text="services" /> section. This configuration mounts your <InlineCode text="librechat.yaml" /> file
        into the container and sets the image for the <InlineCode text="api" /> service to
        <InlineCode text="ghcr.io/danny-avila/librechat:latest" />, which pulls the latest stable LibreChat image.
      </p>
      <CodeBlock :code="dockerComposeOverrideContent" language="yaml" @show-toast="handleShowToastEvent" />

      <p>You can now build and run the LibreChat application using Docker compose. Run the following command.</p>
      <CodeBlock :code="runLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <ImageWithCaption
        :image-src="libreChatStartup"
        image-alt="Starting the LibreChat application"
        image-caption="Starting the LibreChat application."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Open your web browser and navigate to <a href="http://localhost:3080" target="_blank">http://localhost:3080</a>.
        After that, create an account, and login. To select a model that you are serving with
        <InlineCode text="llama-server" />
        follow these steps:
      </p>
      <BulletPoint>Click the model selector button in the top-left corner.</BulletPoint>
      <BulletPoint>In the dropdown menu, hover over <InlineCode text="llama.cpp" />.</BulletPoint>
      <BulletPoint>Select the model name that appears.</BulletPoint>

      <ImageWithCaption
        :image-src="libreChatModelSelection"
        image-alt="Selecting a model from Llama.cpp"
        image-caption="Selecting a model from Llama.cpp."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You’ll notice the model is named <InlineCode text="canis-majoris" />. This is just a display name that I chose,
        it has nothing to do with the model that you are serving with <InlineCode text="llama-server" />.
      </p>

      <p>
        You can now start chatting with your locally hosted model! Don’t forget to run the server first, here is the
        command.
      </p>
      <CodeBlock :code="serveModelCommandRef" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="managing-multiple-models" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#managing-multiple-models">Managing multiple models</a>
      </h3>

      <p>
        Hopefully, you were able to chat with the model. Here is the problem that we will try to solve in this section.
      </p>

      <p>
        Assume that you have downloaded a GGUF file for another model. If you want to use this new model, you have to
        stop the old running server and start it again to host the new model.
      </p>

      <p>
        Doing this manually every time you want to change models is repetitive and not fun at all. We don’t have this
        issue with ollama, we can download as many models as we like.
      </p>

      <p>
        Then, we add them to the list of models in <InlineCode text="librechat.yaml" /> and restart the application. We
        can start a conversation with one model, switch to another and behind the scenes ollama will handle running the
        models for you.
      </p>

      <p>
        Luckily, we have <a href="https://github.com/mostlygeek/llama-swap" target="_blank">llama-swap</a>. This tool
        acts as a smart proxy that sits between LibreChat and <InlineCode text="llama.cpp" />. When you select a model
        in the LibreChat UI, <InlineCode text="llama-swap" /> intercepts the request and automatically starts the
        correct <InlineCode text="llama-server" /> for the model you chose after stopping any other that might be
        running.
      </p>

      <p>
        Let’s set up the <InlineCode text="llama-swap" /> tool. Go to the
        <a href="https://github.com/mostlygeek/llama-swap/releases" target="_blank">llama-swap releases page</a> and
        download the archive that matches your operating system and CPU architecture. For example, I chose
        <InlineCode text="llama-swap_162_linux_amd64.tar.gz" /> because I am on Ubuntu with a 64-bit Intel CPU.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapReleases"
        image-alt="The releases page of the llama-swap project"
        image-caption="The releases page of the llama-swap project."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Open your terminal, navigate to your Downloads folder, and extract the
        <InlineCode text="llama-swap" /> executable using the <InlineCode text="tar" /> command.
      </p>
      <CodeBlock :code="downloadLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        For better organization, create a dedicated folder for <InlineCode text="llama-swap" /> and move the executable
        into it.
      </p>
      <CodeBlock :code="moveLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        <InlineCode text="llama-swap" /> uses a single <InlineCode text="config.yaml" /> file to know which models you
        have and how to run them.
      </p>

      <BulletPoint
        >Inside your <InlineCode text="~/llama-swap" /> directory, create a new file named
        <InlineCode text="config.yaml" />.</BulletPoint
      >
      <BulletPoint
        >Add your models to the file. For each one, provide a name and the exact
        <InlineCode text="llama-server" /> command needed to run it.</BulletPoint
      >

      <BulletPoint
        ><InlineCode text="llama-swap" /> requires you to use <InlineCode text="${PORT}" /> in your command. It will
        automatically assign a free port when it starts a server.</BulletPoint
      >
      <BulletPoint
        >The <InlineCode text="ttl" /> value tells <InlineCode text="llama-swap" /> to shut down an inactive model
        server to free up memory.</BulletPoint
      >

      <p>Here is an example configuration. Modify it to match the models you have downloaded.</p>
      <CodeBlock :code="llamaSwapConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>
        Let’s run the <InlineCode text="llama-swap" /> server. This server will now act as the manager for all your
        models.
      </p>
      <CodeBlock :code="runLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Go back to your <InlineCode text="LibreChat" /> project directory and open <InlineCode text="librechat.yaml" />.
        Update the <InlineCode text="models.default" /> list to include the exact names of the models you just defined
        in <InlineCode text="llama-swap" />'s <InlineCode text="config.yaml" />.
      </p>
      <CodeBlock :code="libreChatYamlUpdate" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Apply the new configuration by restarting the LibreChat containers.</p>
      <CodeBlock :code="restartLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Navigate back to LibreChat at <a href="http://localhost:3080" target="_blank">http://localhost:3080</a>. When
        you click the model selector, you should now see a dropdown list with all the models you configured.
      </p>

      <ImageWithCaption
        :image-src="libreChatNewModels"
        image-alt="The new models appear in LibreChat"
        image-caption="The new models appear in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        In LibreChat, select one of your models, send a message, and wait for the reply. Open a new browser tab and
        navigate to the address of your <InlineCode text="llama-swap" /> server:
        <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>.
      </p>

      <p>
        This is a web application that ships with <InlineCode text="llama-swap" />. it shows you logs, available models,
        the state of each server, and more.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapWebUI"
        image-alt="The llama-swap web interface"
        image-caption="The llama-swap web interface."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Click on the <a href="http://localhost:8080/ui/models" target="_blank">models tab</a> and make sure that the
        model that you are chatting with in LibreChat is in the ready state.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapReadyState"
        image-alt="The model you are chatting with in LibreChat is in the ready state"
        image-caption="The model you are chatting with in LibreChat is in the ready state."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Then, select your second model and send another message. Switch back to the <InlineCode text="llama-swap" /> web
        interface and notice how the state has changed. The previous model is in the stopped state, while the new one is
        in the ready state.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapStoppedState"
        image-alt="The previous model is in the stopped state after switching to the other model"
        image-caption="The previous model is in the stopped state after switching to the other model."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        When you switch models in LibreChat, you will see <InlineCode text="llama-swap" /> automatically stop the old
        server and start the new one. The logs will show a cleanup message like this.
      </p>
      <CodeOutput :code-output="llamaSwapCleanupLog" />

      <p>
        If you stop interacting with a model, its status will remain <InlineCode text="ready" /> for the duration you
        set in the <InlineCode text="ttl" /> field. After that, <InlineCode text="llama-swap" /> will automatically
        unload it to free up VRAM, and its status will change to <InlineCode text="stopped" />.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapUnloadState"
        image-alt="The model’s state changed to stopped because it was not used"
        image-caption="The model’s state changed to <b>stopped</b> because it was not used."
        @open-image-modal="handleOpenImageModal"
      />

      <p>The corresponding log message will look like this.</p>
      <CodeOutput :code-output="llamaSwapUnloadLog" />

      <p>
        To avoid starting <InlineCode text="llama-swap" /> manually every time you reboot, you can set it up as a
        <InlineCode text="systemd" /> service that runs automatically in the background. Since
        <InlineCode text="llama-swap" /> is lightweight and only loads models when needed, it’s fine to keep it running
        this way.
      </p>

      <p>Create a new service file:</p>
      <CodeBlock :code="createLlamaSwapServiceFile" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Paste the following text into the editor. You <b>must</b> replace the placeholder values for
        <InlineCode text="User" />, <InlineCode text="Group" />, and the file paths.
      </p>

      <BulletPoint>To find your <InlineCode text="User" />, run <InlineCode text="whoami" />.</BulletPoint>
      <BulletPoint
        >To find your <InlineCode text="Group" />, run <InlineCode text="id" />. Look for
        <InlineCode text="gid=1000(group_name)" />, <InlineCode text="group_name" /> is your group.</BulletPoint
      >

      <CodeBlock :code="llamaSwapServiceFile" language="ini" @show-toast="handleShowToastEvent" />

      <p>Save the file, exit the editor, and run these commands to activate and start your new service:</p>
      <CodeBlock :code="enableLlamaSwapService" language="bash" @show-toast="handleShowToastEvent" />

      <p>To view the logs for the running service, you can use the <InlineCode text="journalctl" /> command.</p>
      <CodeBlock :code="journalctlLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        With this setup, you don’t need to manually stop services to manage memory. <InlineCode text="llama-swap" />
        handles it all for you.
      </p>

      <p>Isn’t this awesome? I love llama-swap 🤍</p>
    </section>

    <section>
      <h2 id="working-with-embedding-models" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#working-with-embedding-models">Working with embedding models</a>
      </h2>

      <p>
        So far, we’ve focused on chat models. Now, let’s explore how to use an <b>embedding model</b>, which is designed
        to convert text into
        <a href="https://www.pinecone.io/learn/series/nlp/dense-vector-embeddings-nlp/" target="_blank"
          >dense vectors</a
        >
        for tasks like
        <a href="https://en.wikipedia.org/wiki/Retrieval-augmented_generation" target="_blank"
          >Retrieval-Augmented Generation</a
        >
        (RAG) and <a href="https://en.wikipedia.org/wiki/Semantic_search" target="_blank">semantic search</a>.
      </p>

      <p>
        We’ll use the
        <a href="https://huggingface.co/Qwen/Qwen3-Embedding-8B-GGUF" target="_blank">Qwen3-Embedding-8B-Q5_K_M</a>
        model, which is currently the top-performing embedding model on the
        <a href="https://huggingface.co/spaces/mteb/leaderboard" target="_blank">MTEB leaderboard</a>.
      </p>

      <ImageWithCaption
        :image-src="mtebLeaderboard"
        image-alt="The MTEB leaderboard"
        image-caption="The MTEB leaderboard."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You can generate an embedding directly from the terminal using the
        <InlineCode text="llama-embedding" /> program.
      </p>

      <p>
        First, download a GGUF version of the model. I chose the <InlineCode text="Q5_K_M" /> quant because it offers a
        great balance of quality and performance, allowing me to offload the entire model to my GPU.
      </p>

      <p>Here is the command to generate an embedding for a piece of text:</p>
      <CodeBlock :code="generateEmbeddingCommand" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        You’ll notice I set <InlineCode text="--n-gpu-layers" /> to <InlineCode text="999" />. This is a useful trick to
        tell <InlineCode text="llama.cpp" /> to offload as many layers as possible to the GPU.
      </p>

      <p>
        If this command gives you an <b>Out Of Memory (OOM)</b> error, look at the startup logs for lines that tell you
        the total number of layers in the model.
      </p>
      <CodeOutput :code-output="embeddingOomLog" />

      <p>
        This model has 37 layers. If you get an error, reduce the <InlineCode text="--n-gpu-layers" /> value from the
        total, start with <InlineCode text="36" /> and keep decreasing it until the error disappears. Also, be aware
        that increasing <InlineCode text="--ctx-size" /> will consume more VRAM.
      </p>

      <p>
        While the <InlineCode text="Qwen3-Embedding-8B" /> model supports a massive context window of up to
        <b>32,768 tokens</b>, it's more practical to work with smaller text chunks. For a good balance of context and
        performance, I recommend keeping your chunks between <b>1024</b> and <b>2048</b> tokens.
      </p>

      <h3 id="serving-embedding-model" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#serving-embedding-model">Serving the embedding model as an API</a>
      </h3>

      <p>
        To use the embedding model as a service, run <InlineCode text="llama-server" /> with the
        <InlineCode text="--embedding" /> flag:
      </p>
      <CodeBlock :code="serveEmbeddingCommand" language="bash" @show-toast="handleShowToastEvent" />

      <p>This starts a server that exposes the OpenAI-compatible <InlineCode text="/v1/embeddings" /> endpoint.</p>

      <h3 id="connect-to-embedding-server-python" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#connect-to-embedding-server-python"
          >Connect to the server with Python</a
        >
      </h3>

      <p>
        You can get embeddings from the server by sending a POST request. The payload is a JSON object containing the
        <InlineCode text="input" /> text. The server will respond with the dense vector.
      </p>

      <p>On my system, this request takes only <b>~30ms</b> which is really fast!</p>
      <CodeBlock :code="pythonEmbeddingRequest" language="python" @show-toast="handleShowToastEvent" />
    </section>

    <section>
      <h2 id="going-multimodal" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#going-multimodal">Going multimodal</a>
      </h2>

      <h3 id="working-with-vision-models" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#working-with-vision-models">Working with vision models</a>
      </h3>

      <p>
        So far, we have only worked with text. Now, let’s explore <b>multimodal models</b> like
        <a href="https://huggingface.co/unsloth/gemma-3-4b-it-GGUF" target="_blank">gemma-3-4b-it-GGUF</a> or
        <a href="https://huggingface.co/unsloth/Qwen2.5-VL-3B-Instruct-GGUF" target="_blank"
          >Qwen2.5-VL-3B-Instruct-GGUF</a
        >
        that can process and understand both text and images as input.
      </p>

      <p>
        Running a multimodal model in <InlineCode text="llama.cpp" /> involves two separate files that work together to
        answer your questions:
      </p>

      <BulletPoint
        >The language model <b>(</b><InlineCode text=".gguf" /><b>)</b>: This is the standard model file we've been
        using. It understands language, performs reasoning, and generates the final text response.</BulletPoint
      >
      <BulletPoint
        >The multimodal projector <b>(</b><InlineCode text="mmproj.gguf" /><b>)</b>: This is a specialized model. Its
        job is to look at an image, process it, and translate what it sees into embeddings that the language model can
        understand.</BulletPoint
      >

      <ImageWithCaption
        :image-src="multimodalArchitecture"
        image-alt="The mmproj and language models work together to handle multimodal input"
        image-caption="The mmproj and language models work together to handle multimodal input."
        @open-image-modal="handleOpenImageModal"
      />

      <AdmonitionBlock title="Info" type="info">
        <p>
          The diagram above is a conceptual illustration I made to help explain the process. It does not reflect the
          exact internal architecture of any specific model.
        </p>
      </AdmonitionBlock>

      <p>
        When downloading multimodal models from Hugging Face, you must make sure you get <b>both</b> the main
        <InlineCode text=".gguf" /> file and the corresponding <InlineCode text="mmproj.gguf" /> file.
      </p>

      <ImageWithCaption
        :image-src="downloadMultimodalFiles"
        image-alt="Arrows point to the different files that you should be looking for when trying to download multimodal models"
        image-caption="Arrows point to the different files that you should be looking for when trying to download multimodal models."
        @open-image-modal="handleOpenImageModal"
      />

      <h4 id="run-the-vision-model-in-the-terminal" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#run-the-vision-model-in-the-terminal">
          Running the model in the terminal
        </a>
      </h4>

      <p>
        <InlineCode text="llama.cpp" /> provides a dedicated command-line tool, <InlineCode text="llama-mtmd-cli" />,
        for multimodal chat.
      </p>

      <p>First, let’s make the tool easily accessible from anywhere by copying it to a system path.</p>
      <CodeBlock :code="cpLlamaMtmdCli" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, let’s run the <InlineCode text="gemma-3-4b-it-GGUF" /> model. We can use the <InlineCode text="-hf" /> flag
        to automatically download the correct model and projector files from Hugging Face.
      </p>
      <CodeBlock :code="runVisionModelCli" language="bash" @show-toast="handleShowToastEvent" />

      <p>Once the model loads, you'll enter an interactive chat mode.</p>
      <CodeOutput :code-output="visionChatInstructions" />

      <p>
        First, send a text message to make sure it’s working. Then, use the <InlineCode text="/image" /> command to load
        your image, followed by a question about it. I will give the model the first thumbnail that I designed for this
        article.
      </p>
      <CodeOutput :code-output="visionChatImageLoaded" />

      <p>The image is loaded, now let’s ask the model about it.</p>
      <CodeOutput :code-output="visionChatSession" />

      <p>Not bad! The background is solid white rather than a gradient, but hey it worked.</p>

      <h4 id="run-the-model-in-librechat" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#run-the-model-in-librechat"> Running the model in LibreChat </a>
      </h4>

      <p>
        You can also add your vision model to your <InlineCode text="llama-swap" /> setup to use it within LibreChat's
        graphical interface.
      </p>

      <p>
        Add a new entry for the multimodal model in <InlineCode text="config.yaml" />. The important distinction is that
        you must include the <InlineCode text="--mmproj" /> flag in the command, pointing to the projector file.
      </p>
      <CodeBlock :code="llamaSwapVisionConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Apply the changes by restarting the service.</p>
      <CodeBlock :code="restartLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>Add the new model name to your LibreChat configuration so it appears in the UI.</p>
      <CodeBlock :code="libreChatYamlVisionUpdate" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Restart LibreChat so that it can load the new configuration.</p>
      <CodeBlock :code="restartLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        In LibreChat, load the <InlineCode text="gemma-3-4b-it" /> model and send a text message to verify that the
        changes have taken effect.
      </p>

      <p>You got a response back? Perfect. Now click on the attach files icon and upload an image.</p>

      <ImageWithCaption
        :image-src="uploadingImageLibreChat"
        image-alt="Uploading an image in LibreChat"
        image-caption="Uploading an image in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Send the image together with a text message. You should get a response confirming that the model understood the
        image.
      </p>

      <ImageWithCaption
        :image-src="imageInputLibreChat"
        image-alt="Successfully used an image as input in LibreChat"
        image-caption="Successfully used an image as input in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <h4 id="using-the-vision-model-in-python" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#using-the-vision-model-in-python"> Using the model in Python </a>
      </h4>

      <p>
        This time instead of running the <InlineCode text="llama-server" /> command to create a server that the Python
        script will connect to, we will use the <InlineCode text="llama-swap" /> server since it is already configured
        to run automatically.
      </p>

      <p>
        The OpenAI API expects multimodal input in a specific JSON format. The image is not sent as a file but as a
        <a href="https://en.wikipedia.org/wiki/Data_URI_scheme" target="_blank">Base64-encoded data URI</a> inside the
        <InlineCode text="messages" /> payload.
      </p>

      <BulletPoint
        >The <InlineCode text="encode_image_to_data_uri" /> function handles reading the image file and encoding it into
        this required format.</BulletPoint
      >
      <BulletPoint
        >The <InlineCode text="get_vision_completion" /> function constructs the special
        <InlineCode text="messages" /> list containing separate objects for the <InlineCode text="text" /> and the
        <InlineCode text="image_url" />. It then sends this payload to <InlineCode text="llama-swap" />, which routes
        the request to the correct model.</BulletPoint
      >

      <CodeBlock :code="pythonVisionRequest" language="python" @show-toast="handleShowToastEvent" />

      <h3 id="working-with-audio-models" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#working-with-audio-models">Working with audio models</a>
      </h3>

      <p>Next, we’ll explore models that can understand audio. Audio models come in two main types:</p>
      <BulletPoint
        >Models built for specific tasks like
        <a
          href="https://developer.nvidia.com/blog/essential-guide-to-automatic-speech-recognition-technology/"
          target="_blank"
          >Automatic Speech Recognition</a
        >
        (ASR) or
        <a href="https://www.ibm.com/think/topics/text-to-speech" target="_blank">Text-to-Speech</a> (TTS).</BulletPoint
      >
      <BulletPoint
        >General models that combine audio understanding with language to reason about and discuss the content of an
        audio file.</BulletPoint
      >

      <p>
        <InlineCode text="llama.cpp" /> handles the second category of models like
        <a href="https://huggingface.co/ggml-org/Voxtral-Mini-3B-2507-GGUF" target="_blank"
          >Voxtral-Mini-3B-2507-GGUF</a
        >
        with the same two-file approach we saw with vision models: a main language model and a specialized audio
        projector.
      </p>

      <h4 id="run-the-audio-model-in-the-terminal" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#run-the-audio-model-in-the-terminal">
          Running the model in the terminal
        </a>
      </h4>

      <p>
        Let’s use <InlineCode text="llama-mtmd-cli" /> to download and run
        <a href="https://huggingface.co/ggml-org/Voxtral-Mini-3B-2507-GGUF" target="_blank"
          >Voxtral-Mini-3B-2507-GGUF</a
        >
        for a quick test.
      </p>
      <CodeBlock :code="runAudioModelCli" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        After it loads, you can use the <InlineCode text="/audio" /> command to provide an audio file and then ask the
        model to transcribe it. I gave it an audio clip from one of my YouTube videos.
      </p>

      <CodeOutput :code-output="audioChatSession" />

      <p>The output is excellent, I am really impressed with this small model.</p>

      <h4 id="python-and-librechat-integration-roadblock" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#python-and-librechat-integration-roadblock">
          Python and LibreChat integration roadblock
        </a>
      </h4>

      <p>
        Unfortunately, while <InlineCode text="Voxtral" /> is amazing in the CLI, its advanced audio capabilities are
        <b>not yet exposed</b> through the <InlineCode text="llama-server" /> API.
      </p>

      <p>
        My attempts to use it with LibreChat or standard OpenAI audio endpoints (like
        <InlineCode text="/v1/audio/transcriptions" />) in Python failed with a
        <InlineCode text="404 Not Found" /> error.
      </p>
      <CodeOutput :code-output="audioErrorLog" />

      <p>
        I'm sure this will be implemented in the future, but for now, we need to try something else like
        <a href="https://github.com/ggml-org/whisper.cpp" target="_blank">whisper.cpp</a> or
        <a href="https://github.com/SYSTRAN/faster-whisper" target="_blank">faster-whisper</a>.
      </p>

      <h4 id="speech-to-text-with-whisper" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#speech-to-text-with-whisper"> Speech-to-Text with Whisper </a>
      </h4>

      <p>
        Since our goal is to get audio input working in LibreChat, let’s focus on a dedicated Speech-to-Text (STT)
        model,
        <a href="https://openai.com/index/whisper/" target="_blank">Whisper</a>.
      </p>

      <p>
        There are different ways to run Whisper. We can use <InlineCode text="whisper.cpp" />,
        <InlineCode text="faster-whisper" /> or other projects.
      </p>

      <p>Clone the <InlineCode text="whisper.cpp" /> project.</p>
      <CodeBlock :code="cloneWhisperCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        <a href="https://huggingface.co/ggerganov/whisper.cpp" target="_blank">Download the model from Hugging Face</a>.
        I picked the large version since it fits comfortably on my GPU.
      </p>
      <CodeBlock :code="downloadWhisperModel" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        I will build the project with CUDA support. Check the project’s
        <a href="https://github.com/ggml-org/whisper.cpp/blob/master/README.md" target="_blank">README.md</a> for other
        options.
      </p>
      <CodeBlock :code="buildWhisperCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>You should see something like this in the end.</p>
      <CodeOutput :code-output="buildWhisperOutput" />

      <p>Copy the programs to <InlineCode text="/usr/local/bin" />.</p>
      <CodeBlock :code="installWhisperBinaries" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, let’s add our new <InlineCode text="whisper-server" /> to <InlineCode text="llama-swap" />'s configuration.
        Add the following entry.
      </p>
      <CodeBlock :code="llamaSwapWhisperConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>
        The <InlineCode text="--request-path" /> tells <InlineCode text="whisper-server" /> which API endpoint to use.
        Now, restart the service.
      </p>
      <CodeBlock :code="restartLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Before trying LibreChat, let’s confirm the API is working with a Python script. This script sends a local audio
        file to our server.
      </p>
      <CodeBlock :code="pythonWhisperRequest" language="python" @show-toast="handleShowToastEvent" />

      <p>
        Running this script should successfully return the full transcribed text, proving our
        <InlineCode text="whisper.cpp" /> server and <InlineCode text="llama-swap" /> integration is working correctly.
        Here is the output:
      </p>
      <CodeOutput :code-output="pythonWhisperOutput" />

      <p>
        To get the timestamps, use this code instead. It tells the <InlineCode text="whisper-server" /> to give us
        detailed data from the model. This is achieved by adding <InlineCode text="response_format" /> and
        <InlineCode text="timestamp_granularities" /> to the payload.
      </p>
      <CodeBlock :code="pythonWhisperTimestamps" language="python" @show-toast="handleShowToastEvent" />

      <p>Here is the output of the script.</p>
      <CodeOutput :code-output="pythonWhisperTimestampsOutput" />

      <p>
        Now, let’s use whisper in LibreChat. Open <InlineCode text="librechat.yaml" /> and update the
        <InlineCode text="speech" /> section.
      </p>
      <CodeBlock :code="libreChatYamlWhisperUpdate" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Restart the LibreChat containers.</p>
      <CodeBlock :code="restartLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <p>Click on the <b>Settings</b> button.</p>

      <ImageWithCaption
        :image-src="libreChatSettingsButton"
        image-alt="Steps to find the Settings button in LibreChat"
        image-caption="Steps to find the Settings button in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Click on the <b>Speech</b> option, and make sure that the engine is set to <InlineCode text="External" /> in the
        Speech to Text section.
      </p>

      <ImageWithCaption
        :image-src="libreChatSpeechSettings"
        image-alt="The speech settings page"
        image-caption="The speech settings page."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Go back and click on the microphone and start talking, when you are done click the button again to stop the
        recording. LibreChat will call the transcriptions endpoint and will send the data to whisper.
      </p>

      <p>Go to the <InlineCode text="llama-swap" /> dashboard, you should see that whisper is starting to load.</p>

      <ImageWithCaption
        :image-src="llamaSwapWhisperLoading"
        image-alt="llama-swap received the request and is starting to load whisper"
        image-caption="llama-swap received the request and is starting to load whisper."
        @open-image-modal="handleOpenImageModal"
      />

      <p>After waiting for a few seconds, I got this error.</p>

      <ImageWithCaption
        :image-src="libreChatWhisperError"
        image-alt="Error in LibreChat"
        image-caption="Error in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Looking at the <InlineCode text="llama-swap" /> logs reveals the problem.</p>
      <CodeOutput :code-output="whisperErrorLog" />

      <p>
        The issue is an <b>audio format incompatibility</b>. LibreChat’s browser interface sends audio in
        <InlineCode text="webm" /> format, but the default <InlineCode text="whisper-server" /> expects
        <InlineCode text="16-bit WAV" />.
      </p>

      <p>
        There is a section in the
        <a href="https://github.com/ggml-org/whisper.cpp?tab=readme-ov-file#ffmpeg-support-linux-only" target="_blank"
          >README.md</a
        >
        file that shows how to compile <InlineCode text="whisper.cpp" /> with
        <a href="https://github.com/FFmpeg/FFmpeg" target="_blank">ffmpeg</a> so that the program can handle different
        audio formats.
      </p>

      <p>
        I followed those instructions but couldn’t solve the problem. Instead, I ran into new issues. The
        <InlineCode text="whisper-cli" /> works fine with different audio files, but the
        <InlineCode text="whisper-server" />
        isn’t functioning properly. I get errors like these.
      </p>
      <CodeOutput :code-output="whisperFfmpegErrorLog" />

      <p>
        Hopefully, this issue will be fixed soon. I didn’t want to wait, so I found another project called
        <a href="https://github.com/SYSTRAN/faster-whisper" target="_blank">faster-whisper</a>. It’s similar to
        <InlineCode text="whisper.cpp" /> but faster, and it can be installed as a Python package.
      </p>

      <p>Let’s create a dedicated Python environment to keep our dependencies clean.</p>
      <CodeBlock :code="createFasterWhisperEnv" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Install <InlineCode text="faster-whisper" /> and other libraries that we will use to create a server in Python.
      </p>
      <CodeBlock :code="installFasterWhisper" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        To run the model on a GPU, follow the
        <a href="https://github.com/SYSTRAN/faster-whisper?tab=readme-ov-file#gpu" target="_blank"
          >instructions in the</a
        >
        README. You’ll need to install <InlineCode text="cuBLAS" /> and <InlineCode text="cuDNN" />, either system-wide
        or inside a virtual environment.
      </p>

      <p>
        I chose to install them in a virtual environment, which makes it easier to remove them later if needed. You can
        install <InlineCode text="cuBLAS" /> and <InlineCode text="cuDNN" /> with the following command.
      </p>
      <CodeBlock :code="installCudaLibs" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        You must tell your system where to find the NVIDIA libraries you just installed by setting the
        <InlineCode text="LD_LIBRARY_PATH" /> environment variable. If you don’t do that, you will get this error.
      </p>
      <CodeOutput :code-output="cudaLibsError" />

      <p>Run these commands in the terminal to fix the error.</p>
      <CodeBlock :code="fixCudaLibsError" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        I will use the <InlineCode text="large-v3" /> model. If you can’t run it, change the model name to a smaller
        version.
      </p>

      <p>
        In the <InlineCode text="WhisperModel" /> class, I’m using <InlineCode text="cuda" /> as the device and
        <InlineCode text="int8_float16" /> as the compute type. If you don’t have a GPU, set the device to CPU like
        this.
      </p>
      <CodeBlock
        code='model = WhisperModel(model_size, device="cpu", compute_type="int8")'
        language="python"
        @show-toast="handleShowToastEvent"
      />

      <p>
        After that, pass the audio to the <InlineCode text="transcribe" /> method. It returns a generator, which allows
        you to loop through the segments as they are produced.
      </p>
      <CodeBlock :code="fasterWhisperUsage" language="python" @show-toast="handleShowToastEvent" />

      <p>
        If you were able to run this code without any issue, you can create the <InlineCode text="FastAPI" /> server.
        Start by creating an instance of the <InlineCode text="FastAPI" /> class and adding a
        <InlineCode text="/health" /> endpoint. This endpoint is important because <InlineCode text="llama-swap" /> will
        use it to check whether the server is alive.
      </p>
      <CodeBlock :code="fasterWhisperScript1" language="python" @show-toast="handleShowToastEvent" />

      <p>Next, set up logging and load the model at startup so it can be reused for every request.</p>
      <CodeBlock :code="fasterWhisperScript2" language="python" @show-toast="handleShowToastEvent" />

      <p>
        Finally, add the <InlineCode text="/v1/audio/transcriptions" /> endpoint. In the
        <InlineCode text="transcribe_audio" /> method, a temporary file is created with the audio data received from
        LibreChat. The file is then passed to the <InlineCode text="transcribe" /> method, the segments are combined,
        and the final text is returned to the frontend.
      </p>
      <CodeBlock :code="fasterWhisperScript3" language="python" @show-toast="handleShowToastEvent" />

      <p>Now we’ll tell <InlineCode text="llama-swap" /> how to manage our new FastAPI server. Create a bash script.</p>
      <CodeBlock :code="createStartScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        This script sets the required environment variable and then starts the
        <a href="https://github.com/Kludex/uvicorn" target="_blank">uvicorn</a> server, passing along the port assigned
        by <InlineCode text="llama-swap" />.
      </p>
      <CodeBlock :code="startScriptContent" language="bash" @show-toast="handleShowToastEvent" />

      <p>Make the script executable.</p>
      <CodeBlock :code="chmodStartScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Next, we need to update the <InlineCode text="config.yaml" /> file. We will configure
        <InlineCode text="llama-swap" /> to:
      </p>

      <BulletPoint>Run our bash script (<InlineCode text="start.sh" />).</BulletPoint>
      <BulletPoint
        >Check the <InlineCode text="/health" /> endpoint to verify that the FastAPI server is running.</BulletPoint
      >
      <BulletPoint>After 300 seconds, use <InlineCode text="pkill" /> to stop the FastAPI server.</BulletPoint>

      <CodeBlock :code="llamaSwapFasterWhisperConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Restart the <InlineCode text="llama-swap" /> service.</p>
      <CodeBlock :code="restartLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        In LibreChat, click the microphone icon to start recording, speak, and click it again to stop. The icon will
        show a loading state while the FastAPI server starts.
      </p>

      <p>Open the <InlineCode text="llama-swap" /> interface.</p>

      <ImageWithCaption
        :image-src="llamaSwapFasterWhisperLogs"
        image-alt="The model state and logs in the llama-swap interface"
        image-caption="The model state and logs in the llama-swap interface."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You should see that the model is in a <b>ready state</b>, and if you inspect the logs, you will see entries like
        the following.
      </p>
      <CodeOutput :code-output="fasterWhisperLogs" />

      <p>I have to admit, I spent a lot of time on this feature, so I’m really happy that it worked in the end.</p>
    </section>

    <section>
      <h2 id="optimizing-performance" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#optimizing-performance">Optimizing performance with llama-bench</a>
      </h2>

      <p>
        Manually tweaking arguments like <InlineCode text="--n-gpu-layers" /> and <InlineCode text="--ctx-size" /> to
        find the best performance for your hardware is not fun. <InlineCode text="llama.cpp" /> includes a tool called
        <InlineCode text="llama-bench" /> that automates this process by running a series of benchmarks and presenting
        the results in a clear table.
      </p>

      <p>Make the tool easily accessible from your terminal.</p>
      <CodeBlock :code="cpLlamaBench" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        You can run <InlineCode text="llama-bench -h" /> to see all available options. Read the
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/tools/llama-bench/README.md" target="_blank"
          >README.md</a
        >
        to find examples of how to use the tool.
      </p>

      <h3 id="find-optimal-gpu-layers" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#find-optimal-gpu-layers">Find the optimal number of GPU layers</a>
      </h3>

      <p>
        Our first goal is to find the number of GPU layers that gives the highest generation speed (tokens/second)
        without using all available VRAM.
      </p>

      <p>Let's benchmark the <InlineCode text="Qwen3-30B-A3B-Thinking" /> model across a range of GPU layer counts.</p>
      <CodeBlock :code="llamaBenchStep1" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        The argument <InlineCode text="--n-gpu-layers 18-24+1" /> tells <InlineCode text="llama-bench" /> to start with
        18 layers and increase the count by 1 up to 24. In each run, the model will generate 128 tokens.
      </p>

      <DataTable :headers="llamaBench1Headers" :rows="llamaBench1Rows" :text-align="'left'" />

      <p>
        The table shows that offloading <b>19 layers</b> provides the highest generation speed. We can also see the
        final run for 24 layers failed due to insufficient VRAM.
      </p>
      <CodeOutput :code-output="llamaBenchStep1Output" />

      <h3 id="determine-max-context-size" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#determine-max-context-size"
          >Determine maximum context size and speed trade-offs</a
        >
      </h3>

      <p>
        Now that we know our optimal speed is at 19 GPU layers, let’s see how performance changes as the context window
        fills up. We can use the <InlineCode text="--n-depth" /> argument to benchmark the model at different context
        depths.
      </p>

      <p>
        This simulates how it would perform with a pre-existing conversation history of <InlineCode text="0" />,
        <InlineCode text="4096" />, <InlineCode text="8192" />, and <InlineCode text="16384" /> tokens.
      </p>
      <CodeBlock :code="llamaBenchStep2" language="bash" @show-toast="handleShowToastEvent" />

      <DataTable :headers="llamaBench2Headers" :rows="llamaBench2Rows" :text-align="'left'" />

      <p>
        The results show a clear trade-off. With 19 layers on the GPU, we don’t have enough leftover VRAM to handle a
        16,384 token context. To support a larger context, we must sacrifice some speed by offloading fewer layers.
        Let’s test that hypothesis by reducing the layers to 16.
      </p>
      <CodeBlock :code="llamaBenchStep3" language="bash" @show-toast="handleShowToastEvent" />

      <DataTable :headers="llamaBench3Headers" :rows="llamaBench3Rows" :text-align="'left'" />

      <p>
        By offloading only 16 layers, we can now handle the 16K context window. Notice how the generation speed
        decreases when the context window increases. This is normal because the model needs to do a lot of work.
      </p>

      <p>
        For most tasks, you won’t need a large context window. But if you plan to upload long documents, the window can
        fill up quickly. To avoid manually changing arguments each time, create two entries in
        <InlineCode text="config.yaml" />: one for small tasks, and another for tasks requiring a large context window.
      </p>
      <CodeBlock :code="llamaSwapConfigOptimized" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Restart the <InlineCode text="llama-swap" /> service.</p>
      <CodeBlock :code="restartLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>Update the <InlineCode text="librechat.yaml" /> file to include the new models.</p>
      <CodeBlock :code="libreChatYamlOptimized" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Finally, restart LibreChat.</p>
      <CodeBlock :code="restartLibreChat" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        This is how you can use <InlineCode text="llama-bench" /> to systematically find the best settings for your
        hardware. For more examples, please read the
        <a href="https://github.com/ggml-org/llama.cpp/blob/master/tools/llama-bench/README.md" target="_blank"
          >README.md</a
        >
        file.
      </p>
    </section>

    <section>
      <h2 id="automating-workflow" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#automating-workflow">Automating the entire workflow</a>
      </h2>

      <h3 id="creating-desktop-shortcuts" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#creating-desktop-shortcuts"
          >Creating desktop shortcuts for easy access</a
        >
      </h3>

      <p>To make launching everything easier, we’ll be accessing two web interfaces:</p>
      <BulletPoint
        ><b>llama-swap interface</b>:
        <a href="http://localhost:8080/" target="_blank">http://localhost:8080/</a></BulletPoint
      >
      <BulletPoint
        ><b>LibreChat</b>: <a href="http://localhost:3080/" target="_blank">http://localhost:3080/</a></BulletPoint
      >

      <p>Instead of remembering these links, we can create desktop shortcuts to open these links.</p>

      <h4 id="llama-swap-desktop-shortcut" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#llama-swap-desktop-shortcut"> llama-swap </a>
      </h4>

      <p>Create a new launcher file in your local applications directory.</p>
      <CodeBlock :code="createLlamaSwapDesktop" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Paste the following into the editor. This defines the launcher’s name, action, and icon.
        <b>Remember to change the</b> <InlineCode text="Icon" /> <b>path</b> to where you saved the icon. You can
        <a href="https://github.com/mostlygeek/llama-swap/blob/main/ui/public/favicon.svg" target="_blank"
          >download the icon from here</a
        >.
      </p>
      <CodeBlock :code="llamaSwapDesktopContent" language="ini" @show-toast="handleShowToastEvent" />

      <p>Make the file executable.</p>
      <CodeBlock :code="chmodLlamaSwapDesktop" language="bash" @show-toast="handleShowToastEvent" />

      <p>Run the following command to make your new shortcut discoverable by your system’s application menu.</p>
      <CodeBlock :code="updateDesktopDb" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Search for <b>Llama Swap UI</b>. You should see it appear in the search result. Click it and verify that it
        opens the browser with the correct link.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapDesktopShortcut"
        image-alt="The Llama Swap UI desktop shortcut"
        image-caption="The Llama Swap UI desktop shortcut."
        @open-image-modal="handleOpenImageModal"
      />

      <h4 id="librechat-desktop-shortcut" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#librechat-desktop-shortcut"> LibreChat </a>
      </h4>

      <p>Create another launcher file in your local applications directory.</p>
      <CodeBlock :code="createLibreChatDesktop" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Paste the following into the editor. <b>Remember to change the</b> <InlineCode text="Exec" /> <b>and</b>
        <InlineCode text="Icon" /> <b>paths</b>. You can
        <a href="https://github.com/danny-avila/LibreChat/blob/main/client/public/assets/logo.svg" target="_blank"
          >download the icon from here</a
        >.
      </p>
      <CodeBlock :code="libreChatDesktopContent" language="ini" @show-toast="handleShowToastEvent" />

      <p>Make the file executable.</p>
      <CodeBlock :code="chmodLibreChatDesktop" language="bash" @show-toast="handleShowToastEvent" />

      <p>Navigate to your <InlineCode text="LibreChat" /> project directory and create a new script file.</p>
      <CodeBlock :code="createLibreChatStartScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        This script will automatically navigate to the correct directory, run
        <InlineCode text="docker compose up -d" />, and launch Firefox. <b>Remember to change the</b>
        <InlineCode text="DOCKER_COMPOSE_DIR" /> <b>path</b>.
      </p>
      <CodeBlock :code="libreChatStartScriptContent" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Search for <b>LibreChat</b> in your application menu and click it. It should start the Docker containers (if
        they aren’t already running) and open the UI in your browser.
      </p>

      <ImageWithCaption
        :image-src="libreChatDesktopShortcut"
        image-alt="The LibreChat desktop shortcut"
        image-caption="The LibreChat desktop shortcut."
        @open-image-modal="handleOpenImageModal"
      />

      <h3 id="automatically-restarting-services" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#automatically-restarting-services"
          >Automatically restarting services on configuration changes</a
        >
      </h3>

      <p>
        So far, we have to manually restart <InlineCode text="llama-swap" /> or <InlineCode text="LibreChat" /> every
        time we edit their <InlineCode text=".yaml" /> configuration files. This is repetitive and easy to forget. We
        can do better by creating a fully automated workflow that watches for changes and triggers restarts for us.
      </p>

      <p>
        We will rely on <a href="https://github.com/inotify-tools/inotify-tools" target="_blank">inotify-tools</a> for
        this automation. This is a powerful Linux utility that can monitor files for events like modifications.
      </p>

      <p>On Ubuntu, you can install <InlineCode text="inotify-tools" /> like so.</p>
      <CodeBlock :code="installInotify" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        First, we’ll create a bash script that will contain the logic for watching the files and triggering the
        restarts.
      </p>
      <CodeBlock :code="createConfigWatcher" language="bash" @show-toast="handleShowToastEvent" />

      <p>Paste the following code into the file.</p>
      <CodeBlock :code="configWatcherContent" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        I begin the script by creating variables to improve code readability. Make sure to update the paths to the
        <InlineCode text="config.yaml" /> file, the <InlineCode text="librechat.yaml" /> file, and the LibreChat folder
        containing the source code.
      </p>

      <p>
        Next, I use an infinite loop to continuously monitor these files. The following line of code pauses execution
        and waits for any signal indicating that a file has changed.
      </p>
      <CodeBlock
        code='MODIFIED_FILE=$(inotifywait -q -e modify --format &apos;%w%f&apos; "$LLAMA_SWAP_CONFIG" "$LIBRECHAT_CONFIG")'
        language="bash"
        @show-toast="handleShowToastEvent"
      />

      <p>
        We use the <InlineCode text="inotifywait" /> command to monitor the two files:
        <InlineCode text="config.yaml" /> and <InlineCode text="librechat.yaml" />. The file paths are provided at the
        end of the command as <InlineCode text="$LLAMA_SWAP_CONFIG" /> and <InlineCode text="$LIBRECHAT_CONFIG" />.
      </p>

      <p>
        I included the <InlineCode text="-q" /> option so that <InlineCode text="inotifywait" /> runs quietly without
        printing any output, and the <InlineCode text="-e modify" /> option to listen specifically for modifications.
        This event is triggered whenever a file is saved.
      </p>

      <p>
        The <InlineCode text="--format '%w%f'" /> option tells <InlineCode text="inotifywait" /> to output the full path
        of the file that was changed. This path is then stored in the <InlineCode text="MODIFIED_FILE" /> variable.
      </p>

      <p>
        Once we have the path of the modified file, we check whether it is <InlineCode text="config.yaml" /> or
        <InlineCode text="librechat.yaml" />. Inside the corresponding <InlineCode text="if-else" /> blocks, we execute
        the commands that we previously ran manually.
      </p>
      <CodeBlock
        code="sudo systemctl restart llama-swap
docker compose restart"
        language="bash"
        @show-toast="handleShowToastEvent"
      />

      <p>Now, the script handles them automatically for us.</p>

      <p>
        Notice something: to restart the <InlineCode text="llama-swap" /> service, we need to use
        <InlineCode text="sudo" />. This is a problem because the script will pause and wait for a password.
      </p>

      <p>
        Fortunately, we can create a rule that allows this script to run without requiring a password. To do this, open
        the <InlineCode text="sudoers" /> file for editing using <InlineCode text="visudo" />. It’s important to use
        <InlineCode text="visudo" /> because it checks for syntax errors before saving.
      </p>
      <CodeBlock :code="sudoVisudo" language="bash" @show-toast="handleShowToastEvent" />

      <p>Scroll to the bottom of the file and add the following line.</p>
      <CodeOutput :code-output="sudoersContent" />

      <p>Here’s what each part means:</p>
      <BulletPoint
        ><InlineCode text="imad-saddik" /> is the user who gets the permission. The rule applies to this user
        only.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="ALL=(ALL)" /> has two parts: the first <InlineCode text="ALL=" /> means the rule applies to
        the current machine, and <InlineCode text="(ALL)" /> means the command can be run as any user, granting root
        privileges.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="NOPASSWD" /> tells the system that when <InlineCode text="imad-saddik" /> runs the
        <InlineCode text="/usr/bin/systemctl restart llama-swap" /> command, no password is required. Without this, the
        script would stop every time it tried to run <InlineCode text="sudo" />, waiting for a password.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="/usr/bin/systemctl restart llama-swap" /> is the exact command that
        <InlineCode text="imad-saddik" /> is allowed to run without a password. No other commands are
        affected.</BulletPoint
      >

      <p>Save the file and exit. Next, make the script executable.</p>
      <CodeBlock :code="chmodConfigWatcher" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, create a systemd service to run the script automatically.</p>
      <CodeBlock :code="createConfigWatcherService" language="bash" @show-toast="handleShowToastEvent" />

      <p>Copy and paste the following configuration. This tells systemd to run the script under your user account.</p>
      <CodeBlock :code="configWatcherServiceContent" language="ini" @show-toast="handleShowToastEvent" />

      <p>Enable and start the service.</p>
      <CodeBlock :code="enableConfigWatcherService" language="bash" @show-toast="handleShowToastEvent" />

      <p>Check the status to make sure it is running correctly.</p>
      <CodeBlock :code="statusConfigWatcherService" language="bash" @show-toast="handleShowToastEvent" />

      <p>You should see output similar to this.</p>
      <CodeOutput :code-output="statusConfigWatcherOutput" />

      <p>
        This confirms that your script is now running as a background service and will automatically watch for changes
        to the configuration files.
      </p>

      <p>
        Now, make a change in <InlineCode text="config.yaml" /> and save it. For example, remove a model from the list.
        In my case, I removed <InlineCode text="Qwen3-30B-A3B-Thinking - 16K" />:
      </p>
      <CodeBlock :code="llamaSwapConfigRemoved" language="yaml" @show-toast="handleShowToastEvent" />

      <p>To watch the logs in real time, run.</p>
      <CodeBlock :code="journalctlConfigWatcher" language="bash" @show-toast="handleShowToastEvent" />

      <p>You should see that the change is detected, for example.</p>
      <CodeOutput :code-output="journalctlConfigWatcherOutput" />

      <p>
        To verify that it worked, open the <InlineCode text="llama-swap" /> interface and confirm that the removed model
        no longer appears. In this example, <InlineCode text="Qwen3-30B-A3B-Thinking - 16K" /> is gone.
      </p>

      <ImageWithCaption
        :image-src="llamaSwapModelRemoved"
        image-alt="Qwen3-30B-A3B-Thinking — 16K is no longer visible"
        image-caption="Qwen3-30B-A3B-Thinking — 16K is no longer visible."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Next, do the same with <InlineCode text="librechat.yaml" /> by updating the list of models.</p>
      <CodeBlock :code="libreChatYamlRemoved" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Save the file and watch the logs again. You should see something like.</p>
      <CodeOutput :code-output="journalctlConfigWatcherOutput2" />

      <p>
        Open LibreChat and check the model list, <InlineCode text="Qwen3-30B-A3B-Thinking - 16K" /> is no longer
        available.
      </p>

      <ImageWithCaption
        :image-src="libreChatModelRemoved"
        image-alt="The Qwen3-30B-A3B-Thinking — 16K can no longer be selected in LibreChat"
        image-caption="The Qwen3-30B-A3B-Thinking — 16K can no longer be selected in LibreChat."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Now you can enjoy watching the script automatically restart the services whenever you make changes. This feature
        saves time and makes sure you never forget to restart anything. I really like it, and I hope you do too!
      </p>
    </section>

    <section>
      <h2 id="keep-things-up-to-date" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#keep-things-up-to-date">Keep things up-to-date</a>
      </h2>

      <p>
        The projects we are using are actively developed. It is a good idea to update them from time to time to get the
        latest features, bug fixes, and performance improvements.
      </p>

      <h3 id="update-llama-cpp" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#update-llama-cpp">Llama.cpp</a>
      </h3>

      <p>The <InlineCode text="llama.cpp" /> project moves very quickly. Here is how you can update it manually.</p>

      <p>First, navigate to your <InlineCode text="llama.cpp" /> project directory.</p>
      <CodeBlock :code="cdLlamaCppUpdate" language="bash" @show-toast="handleShowToastEvent" />

      <p>Pull the latest changes from the GitHub repository.</p>
      <CodeBlock :code="gitPullLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>Next, remove the old <InlineCode text="build" /> directory to make sure you perform a clean compilation.</p>
      <CodeBlock :code="rmBuildLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, recompile the project using the same commands you used during the initial installation. Remember to use the
        correct flags for your hardware (e.g., <InlineCode text="GGML_CUDA=ON" /> for NVIDIA GPUs).
      </p>
      <CodeBlock :code="rebuildLlamaCpp" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Finally, copy the newly compiled programs to <InlineCode text="/usr/local/bin" />, replacing the old versions.
      </p>
      <CodeBlock :code="cpLlamaCppBinaries" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        That was the manual approach. Now, let’s look at how to automate these steps so they run periodically. You can
        automate this process using a <a href="https://en.wikipedia.org/wiki/Cron" target="_blank">cron job</a>.
      </p>

      <p>First, create a shell script that contains all the update commands.</p>
      <CodeBlock :code="createUpdateScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Paste the following code into the script. <b>Make sure to change the</b> <InlineCode text="LLAMA_CPP_DIR" />
        <b> path</b> to the correct location on your system.
      </p>
      <CodeBlock :code="updateScriptContent" language="bash" @show-toast="handleShowToastEvent" />

      <p>Make the script executable.</p>
      <CodeBlock :code="chmodUpdateScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>Open your crontab file for editing.</p>
      <CodeBlock :code="crontabEdit" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Add the following line to the end of the file. This will run your update script <b>every day at 6:00 AM</b>.
      </p>
      <CodeOutput :code-output="crontabEntry" />

      <p>Let me explain this line:</p>
      <BulletPoint
        ><InlineCode text="0 6 * * *" />: This is the schedule. It means "at minute 0 of hour 6, every day, every month,
        every day of the week."</BulletPoint
      >
      <BulletPoint
        ><InlineCode text="/home/your_user/update_llama_cpp.sh" />: This is the command to run.
        <b>Make sure to use the full path to your script</b>.</BulletPoint
      >
      <BulletPoint
        ><InlineCode text=">> /home/your_user/llama_cpp_update.log 2>&1" />: This part redirects the output of the
        script to a log file.</BulletPoint
      >

      <p>
        Save and close the file. Now your <InlineCode text="llama.cpp" /> installation will be updated automatically
        every day.
      </p>

      <p>Open the <InlineCode text="sudoers" /> file.</p>
      <CodeBlock :code="sudoVisudo2" language="bash" @show-toast="handleShowToastEvent" />

      <p>Scroll to the bottom and add the following line to allow the script to run without requiring a password.</p>
      <CodeOutput :code-output="sudoersContent2" />

      <p>
        I ran into a few issues with <b>crontab</b>. Sometimes it executed my job, and other times it didn’t, even
        though my laptop was powered on at the scheduled time. To avoid dealing with inconsistent behavior, I switched
        to <b>anacron</b>.
      </p>

      <p>
        Anacron works differently from crontab. Instead of running a job at a specific hour, it only guarantees when the
        job should run: daily, weekly, monthly, and so on. If the system was off at the scheduled time, anacron will
        simply run the job the next time the machine is on. This is exactly what I needed.
      </p>

      <p>
        Since I want to update <b>llama.cpp</b> every day, I placed the update script directly inside the
        <InlineCode text="/etc/cron.daily/" /> directory. Files inside this directory are executed once per day by
        anacron. Create the script as follows (without a file extension).
      </p>
      <CodeBlock :code="createCronDaily" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, paste this entire content into the editor.</p>
      <CodeBlock :code="cronDailyContent" language="bash" @show-toast="handleShowToastEvent" />

      <p>Save the file and make it executable.</p>
      <CodeBlock :code="chmodCronDaily" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        At this point, the old crontab entry is no longer needed. Open your crontab and delete the line you previously
        added.
      </p>
      <CodeBlock :code="crontabEdit" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Anacron will automatically detect and run your new script during its next daily check. If you want to test it
        immediately, run it manually.
      </p>
      <CodeBlock :code="runCronDaily" language="bash" @show-toast="handleShowToastEvent" />

      <p>Then inspect the log file to confirm everything worked.</p>
      <CodeBlock :code="inspectCronLog" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Finally, the old script located at <InlineCode text="/usr/local/bin/update_llama_cpp.sh" /> is no longer used by
        anything, so you can safely remove it.
      </p>
      <CodeBlock :code="rmOldScript" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        This guarantees that llama.cpp stays up-to-date every day without relying on crontab’s unpredictable behavior.
      </p>

      <h3 id="update-llama-swap" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#update-llama-swap">llama-swap</a>
      </h3>

      <p>
        To update <InlineCode text="llama-swap" />, visit the
        <a href="https://github.com/mostlygeek/llama-swap/releases" target="_blank">releases page</a> on GitHub.
        Download the latest archive for your system, e.g. <InlineCode text="llama-swap_XXX_linux_amd64.tar.gz" />.
      </p>

      <p>Extract the archive and replace your old <InlineCode text="llama-swap" /> executable with the new one.</p>
      <CodeBlock :code="updateLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="update-librechat" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#update-librechat">LibreChat</a>
      </h3>

      <p>Updating LibreChat involves pulling the latest changes from GitHub and rebuilding the Docker containers.</p>

      <p>First, navigate to your LibreChat directory.</p>
      <CodeBlock :code="updateLibreChatStep1" language="bash" @show-toast="handleShowToastEvent" />

      <p>Pull the latest code changes from GitHub.</p>
      <CodeBlock :code="updateLibreChatStep2" language="bash" @show-toast="handleShowToastEvent" />

      <p>Stop and remove the current Docker containers.</p>
      <CodeBlock :code="updateLibreChatStep3" language="bash" @show-toast="handleShowToastEvent" />

      <p>Remove the old Docker images to free up space.</p>
      <CodeBlock :code="updateLibreChatStep4" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, pull the new application images that the updated configuration files refer to.</p>
      <CodeBlock :code="updateLibreChatStep5" language="bash" @show-toast="handleShowToastEvent" />

      <p>Finally, start the application again in detached mode.</p>
      <CodeBlock :code="updateLibreChatStep6" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="update-whisper-cpp" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#update-whisper-cpp">whisper.cpp</a>
      </h3>

      <p>
        The update process for <InlineCode text="whisper.cpp" /> is the same as for <InlineCode text="llama.cpp" />.
      </p>
      <p>Navigate to the <InlineCode text="whisper.cpp" /> directory.</p>
      <CodeBlock :code="updateWhisperCppStep1" language="bash" @show-toast="handleShowToastEvent" />

      <p>Pull the latest changes and recompile the project.</p>
      <CodeBlock :code="updateWhisperCppStep2" language="bash" @show-toast="handleShowToastEvent" />

      <p>Copy the updated programs to your system path.</p>
      <CodeBlock :code="updateWhisperCppStep3" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="update-faster-whisper" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#update-faster-whisper">faster-whisper</a>
      </h3>

      <p>Since <InlineCode text="faster-whisper" /> was installed as a Python package, updating it is simple.</p>

      <p>First, activate the Python environment you used for the installation.</p>
      <CodeBlock :code="updateFasterWhisperStep1" language="bash" @show-toast="handleShowToastEvent" />

      <p>Then, use <InlineCode text="pip" /> to upgrade the package to the latest version.</p>
      <CodeBlock :code="updateFasterWhisperStep2" language="bash" @show-toast="handleShowToastEvent" />
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>

      <ImageWithCaption
        :image-src="conclusionImage"
        image-alt="Photo by Vlad Bagacian on Unsplash"
        image-caption="Photo by <a href='https://unsplash.com/@vladbagacian?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash' target='_blank'>Vlad Bagacian</a> on <a href='https://unsplash.com/photos/woman-sitting-on-grey-cliff-d1eaoAabeXs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash' target='_blank'>Unsplash</a>."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        This article documented my complete journey of replacing ollama with a more powerful, flexible, and
        fully-controlled local AI stack. We started with the goal of running large models that ollama couldn’t handle
        and ended up building a complete system centered around <InlineCode text="llama.cpp" /> and
        <InlineCode text="llama-swap" />.
      </p>

      <p>
        We covered every step in detail, from building <InlineCode text="llama.cpp" /> from source with
        <b>CUDA</b> support to serving large language models, embedding models, and multimodal models that can
        understand both images and audio. We integrated everything with <b>LibreChat</b>, providing a flexible interface
        that makes it easy to interact with our models.
      </p>

      <p>
        An essential component of this process was <InlineCode text="llama-swap" />, which acted as an intelligent
        manager for our models. It automatically handles loading and unloading them on demand, which frees up VRAM and
        makes switching between different models seamless. When we faced challenges with audio input in LibreChat, we
        built a custom <InlineCode text="faster-whisper" /> server to solve the audio format incompatibility.
      </p>

      <p>
        Beyond just running models, we focused on optimization and automation. We used
        <InlineCode text="llama-bench" /> to fine-tune performance for our specific hardware and created specialized
        configurations for different context window sizes. We automated the entire workflow by creating
        <InlineCode text="systemd" /> services to run everything in the background, desktop shortcuts for easy access,
        and a file watcher that automatically restarts services whenever we change a configuration file.
      </p>

      <p>
        What I ended up with is a setup that gives me full control over the entire stack. It’s a powerful, efficient,
        and customized system that has transformed how I interact with local models. I am extremely satisfied with this
        new environment and hope this guide helps you to build your own.
      </p>
    </section>

    <section>
      <h2 id="updates" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#updates">Updates</a>
      </h2>

      <h3 id="solving-whisper-issue" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#solving-whisper-issue">Solving the whisper audio format issue</a>
      </h3>

      <p>
        After publishing this article, I received a comment from a reader named
        <a href="https://medium.com/u/66a72706c889" target="_blank">Gtinjr</a> on Medium. They pointed out that I gave
        up on <InlineCode text="whisper.cpp" /> too early!
      </p>

      <p>
        In the <b>Speech-to-Text with Whisper</b> section, I mentioned that I couldn’t get the native
        <InlineCode text="whisper-server" /> to work with LibreChat because of audio format incompatibilities (WebM vs
        WAV). I resorted to building a custom Python server using <InlineCode text="faster-whisper" /> to bridge that
        gap.
      </p>

      <p>
        It turns out I was missing two things: enabling FFmpeg during the build process AND using the
        <InlineCode text="--convert" /> flag when running the server.
      </p>

      <AdmonitionBlock title="Info" type="info">
        <p>This FFmpeg integration is currently supported on <b>Linux only</b>.</p>
      </AdmonitionBlock>

      <p>
        If you prefer to use the native <InlineCode text="whisper.cpp" /> server instead of the Python workaround, here
        is how to do it.
      </p>

      <p>You need these libraries so <InlineCode text="whisper.cpp" /> can link against them during compilation.</p>
      <CodeBlock :code="installWhisperDependencies" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Navigate to your <InlineCode text="whisper.cpp" /> directory. You need to add
        <InlineCode text="-DWHISPER_FFMPEG=yes" /> to your cmake command.
      </p>

      <AdmonitionBlock title="Important" type="warning">
        <p>
          In the command below, I am using <InlineCode text="-DCMAKE_CUDA_ARCHITECTURES=89" /> which targets my specific
          GPU (RTX 4070). You must change this number to match your GPU's
          <a href="https://developer.nvidia.com/cuda/gpus" target="_blank">compute capability</a> (e.g.,
          <InlineCode text="86" /> for RTX 3000 series, <InlineCode text="75" /> for RTX 2000 series), or use
          <InlineCode text="native" /> to let CMake detect it automatically.
        </p>
      </AdmonitionBlock>
      <CodeBlock :code="buildWhisperWithFfmpeg" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now you don’t need the Python script or the virtual environment anymore. You can run the native server directly.
      </p>

      <p>
        Open your <InlineCode text="llama-swap/config.yaml" /> and update the whisper entry. The key change here is
        adding the <InlineCode text="--convert" /> flag, which tells the server to automatically convert incoming audio
        (like WebM from LibreChat) into the WAV format it needs.
      </p>
      <CodeBlock :code="llamaSwapWhisperFfmpegConfig" language="yaml" @show-toast="handleShowToastEvent" />

      <p>Restart llama-swap.</p>
      <CodeBlock :code="restartLlamaSwap" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, when you speak into LibreChat, <InlineCode text="whisper-server" /> will accept the audio, convert it
        internally using FFmpeg, and return the transcription.
      </p>

      <p>
        This solution is much cleaner because it removes the need for the external Python environment and the
        <InlineCode text="faster-whisper" /> dependency. A huge thank you to
        <a href="https://medium.com/u/66a72706c889" target="_blank">Gtinjr</a> for sharing this solution!
      </p>

      <h4 id="cleanup-old-faster-whisper-files" class="article-body-sub-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#cleanup-old-faster-whisper-files">
          Optional: Cleanup old faster-whisper files
        </a>
      </h4>

      <p>
        If you previously followed the <InlineCode text="faster-whisper" /> instructions, you can now safely remove the
        old files to free up space.
      </p>

      <p>Start by removing the Python project.</p>
      <CodeBlock :code="rmFasterWhisper" language="bash" @show-toast="handleShowToastEvent" />

      <p>Next, remove the Python environment.</p>
      <CodeBlock :code="rmFasterWhisperEnv" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Most importantly, don’t forget to delete the cached model weights, as
        <InlineCode text="faster-whisper" /> stores them separately from <InlineCode text="llama.cpp" /> models.
      </p>
      <CodeBlock :code="rmFasterWhisperCache" language="bash" @show-toast="handleShowToastEvent" />

      <h3 id="llama-cpp-webui" class="article-body-subheader" data-table-of-contents>
        <a class="clickable-header-link" href="#llama-cpp-webui">llama.cpp: New built-in WebUI</a>
      </h3>

      <p>
        Recently, <InlineCode text="llama.cpp" />
        <a href="https://github.com/ggml-org/llama.cpp/discussions/16938" target="_blank"> released a major update</a>
        that includes a new, modern WebUI built with <a href="https://svelte.dev/" target="_blank">SvelteKit</a>. It is
        a fully featured interface that runs directly from the <InlineCode text="llama-server" /> binary without any
        extra installation.
      </p>

      <p>Some of the nice features include:</p>
      <BulletPoint><b>Multimodal support:</b> You can upload images for vision models.</BulletPoint>
      <BulletPoint
        ><b>Document processing:</b> You can upload text files and even PDFs directly into the chat
        context.</BulletPoint
      >
      <BulletPoint><b>Parallel conversations:</b> You can run multiple chat streams at the same time.</BulletPoint>
      <BulletPoint><b>Math rendering:</b> It supports LaTeX for rendering mathematical expressions.</BulletPoint>

      <p>
        For a full list of features and videos on how to use them, check out the
        <a href="https://github.com/ggml-org/llama.cpp/discussions/16938" target="_blank"
          >official discussion on GitHub</a
        >.
      </p>

      <p>
        To use it, you need to run <InlineCode text="llama-server" /> directly. I recommend adding the
        <InlineCode text="--jinja" /> flag, which enables the Jinja2 template engine to handle chat templates more
        accurately.
      </p>
      <CodeBlock :code="runLlamaServerJinja" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, navigate to <a href="http://localhost:8033" target="_blank">http://localhost:8033</a> in your browser.</p>

      <VideoWithCaption :video-src="llamaCppWebUI" video-caption="The new llama.cpp WebUI." />
    </section>
  </ArticleLayout>

  <ImageEnlarger
    :is-visible="isImageModalVisible"
    :enlarged-image-src="enlargedImageSrc"
    @close-image-modal="handleCloseImageModal"
  />
</template>

<script>
// Text & Utils
import * as codeSnippets from "./codeSnippets.js";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";
import architectureDiagram from "./1_architecture_diagram.svg";
import qwenBenchmarkGraph from "./2_qwen_benchmark_graph.jpg";
import cudaToolkitDownload from "./3_cuda_toolkit_download.png";
import cudaToolkitCommands from "./4_cuda_toolkit_commands.png";
import huggingFaceModelPage from "./5_hugging_face_model_page.png";
import huggingFaceModelInGGUF from "./6_hugging_face_gguf_page.jpg";
import hardwareCompatibilityPanel from "./7_hardware_compatibility_panel.jpg";
import addingHardwareToHF from "./8_adding_hardware_to_hf.svg";
import quantizationTypesTable from "./9_quantization_types_table.jpg";
import libreChatStartup from "./10_libre_chat_startup.jpg";
import libreChatModelSelection from "./11_libre_chat_model_selection.svg";
import llamaSwapReleases from "./12_llama_swap_releases.jpg";
import libreChatNewModels from "./13_libre_chat_new_models.jpg";
import llamaSwapWebUI from "./14_llama_swap_web_ui.jpg";
import llamaSwapReadyState from "./15_llama_swap_ready_state.jpg";
import llamaSwapStoppedState from "./16_llama_swap_stopped_state.jpg";
import llamaSwapUnloadState from "./17_llama_swap_unload_state.jpg";
import mtebLeaderboard from "./18_mteb_leaderboard.jpg";
import multimodalArchitecture from "./19_multimodal_architecture.svg";
import downloadMultimodalFiles from "./20_download_multimodal_files.svg";
import uploadingImageLibreChat from "./21_uploading_image_libre_chat.svg";
import imageInputLibreChat from "./22_image_input_libre_chat.jpg";
import libreChatSettingsButton from "./23_libre_chat_settings_button.svg";
import libreChatSpeechSettings from "./24_libre_chat_speech_settings.svg";
import llamaSwapWhisperLoading from "./25_llama_swap_whisper_loading.jpg";
import libreChatWhisperError from "./26_libre_chat_whisper_error.jpg";
import llamaSwapFasterWhisperLogs from "./27_llama_swap_faster_whisper_logs.svg";
import llamaSwapDesktopShortcut from "./28_llama_swap_desktop_shortcut.jpg";
import libreChatDesktopShortcut from "./29_libre_chat_desktop_shortcut.jpg";
import llamaSwapModelRemoved from "./30_llama_swap_model_removed.jpg";
import libreChatModelRemoved from "./31_libre_chat_model_removed.jpg";
import conclusionImage from "./32_conclusion_image.jpg";
import llamaCppWebUI from "./33_llama_cpp_web_ui.mp4";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import CodeBlock from "@/components/CodeBlock.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";
import VideoWithCaption from "@/components/VideoWithCaption.vue";
import DataTable from "@/components/DataTable.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "LocalAIStackOnLinux",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    BulletPoint,
    CodeOutput,
    CodeBlock,
    AdmonitionBlock,
    VideoWithCaption,
    DataTable,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to build your own local AI stack on Linux with llama.cpp, llama-swap, LibreChat and more";

    const { enlargedImageSrc, isImageModalVisible, handleOpenImageModal, handleCloseImageModal } = useImageModal();
    const { slug, readingTime } = useArticleContent({ title, emit, content: markdownContent });
    return {
      // Variables
      title,
      slug,
      readingTime,
      enlargedImageSrc,
      isImageModalVisible,

      // Methods
      handleOpenImageModal,
      handleCloseImageModal,
    };
  },
  data() {
    return {
      // Code
      ...codeSnippets,

      // Variables
      tags: ["Linux", "AI", "LLM", "llama.cpp", "LibreChat", "Local AI", "llama-swap"],
      markdownContent,

      // Images
      coverImage,
      architectureDiagram,
      qwenBenchmarkGraph,
      cudaToolkitDownload,
      cudaToolkitCommands,
      huggingFaceModelPage,
      huggingFaceModelInGGUF,
      hardwareCompatibilityPanel,
      addingHardwareToHF,
      quantizationTypesTable,
      libreChatStartup,
      libreChatModelSelection,
      llamaSwapReleases,
      libreChatNewModels,
      llamaSwapWebUI,
      llamaSwapReadyState,
      llamaSwapStoppedState,
      llamaSwapUnloadState,
      mtebLeaderboard,
      multimodalArchitecture,
      downloadMultimodalFiles,
      uploadingImageLibreChat,
      imageInputLibreChat,
      libreChatSettingsButton,
      libreChatSpeechSettings,
      llamaSwapWhisperLoading,
      libreChatWhisperError,
      llamaSwapFasterWhisperLogs,
      llamaSwapDesktopShortcut,
      libreChatDesktopShortcut,
      llamaSwapModelRemoved,
      libreChatModelRemoved,
      conclusionImage,
      llamaCppWebUI,

      // Table data
      llamaBench1Headers: ["model", "size (GiB)", "params (B)", "backend", "ngl", "test", "t/s"],
      llamaBench1Rows: [
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "18", "tg128", "25.22 ± 0.57"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "19", "tg128", "25.46 ± 0.49"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "20", "tg128", "25.22 ± 0.93"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "21", "tg128", "23.92 ± 1.15"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "22", "tg128", "23.70 ± 1.37"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "23", "tg128", "24.85 ± 0.94"],
      ],
      llamaBench2Headers: ["model", "size (GiB)", "params (B)", "backend", "ngl", "test", "t/s"],
      llamaBench2Rows: [
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "19", "tg128", "22.12 ± 2.12"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "19", "tg128 @ d4096", "15.60 ± 0.26"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "19", "tg128 @ d8192", "11.33 ± 0.35"],
      ],
      llamaBench3Headers: ["model", "size (GiB)", "params (B)", "backend", "ngl", "test", "t/s"],
      llamaBench3Rows: [
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "16", "tg128", "23.14 ± 1.04"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "16", "tg128 @ d4096", "14.62 ± 0.17"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "16", "tg128 @ d8192", "10.63 ± 0.12"],
        ["qwen3moe 30B.A3B IQ4_XS - 4.25 bpw", "15.25", "30.53", "CUDA", "16", "tg128 @ d16384", "6.79 ± 0.10"],
      ],

      // Constants
      ARTICLE_TYPES,
    };
  },
  methods: {
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
