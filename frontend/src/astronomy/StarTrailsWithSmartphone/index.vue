<template>
  <ArticleLayout
    ref="articleContent"
    title="How to shoot star trails with your smartphone"
    sub-title="This complete guide covers everything you need to know to capture beautiful star trail photos using just your smartphone."
    creation-date="October 17, 2025"
    article-type="astronomy-post"
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

      <div>
        <p>
          In this guide, I'll show you how to photograph
          <a href="https://en.wikipedia.org/wiki/Circumpolar_star" target="_blank">circumpolar star trails</a> with your
          smartphone. The image I used as the thumbnail for this article was taken with my phone under a
          <a href="https://en.wikipedia.org/wiki/Bortle_scale" target="_blank">Bortle level</a> 3 sky, just before
          sunrise.
        </p>
        <p>
          The Bortle scale is a nine-level scale used by astronomers to describe the brightness of the night sky caused
          by
          <a href="https://en.wikipedia.org/wiki/Light_pollution" target="_blank">light pollution</a>.
        </p>
        <BulletPoint><b>A Bortle 1</b> sky is extremely dark.</BulletPoint>
        <BulletPoint><b>A Bortle 9</b> sky is bright and blocks most starlight.</BulletPoint>
      </div>

      <div>
        <p>
          The image below shows how much <InlineCode text="light pollution" /> affects what you can see in the night
          sky, from a dark <InlineCode text="Bortle 1" /> location (left) to a bright
          <InlineCode text="Bortle 9" /> city sky (right).
        </p>
        <ImageWithCaption
          :image-src="bortle1VsBortle9Skies"
          image-alt="A comparison between a dark Bortle 1 sky and a light-polluted Bortle 9 sky."
          image-caption="A comparison between a dark Bortle 1 sky (left) and a light-polluted Bortle 9 sky (right)."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>By following this guide, you'll learn how to:</p>
        <BulletPoint
          >Locate the <a href="https://en.wikipedia.org/wiki/Polaris" target="_blank"> north star (Polaris)</a> or the
          <a href="https://en.wikipedia.org/wiki/Sigma_Octantis" target="_blank"> south star (Sigma Octantis)</a> to
          find the center of rotation in the night sky.</BulletPoint
        >
        <BulletPoint>Use your phone's <InlineCode text="pro mode" /> to take long-exposure photos.</BulletPoint>
        <BulletPoint>Automatically capture hundreds of photos throughout the night.</BulletPoint>
        <BulletPoint>Combine those images into a single image to create star trails.</BulletPoint>
        <BulletPoint
          >Create a <a href="https://en.wikipedia.org/wiki/Time-lapse_photography" target="_blank">time-lapse</a> video
          from the same photos (Bonus).</BulletPoint
        >
        <p>
          Everything in this article is explained step-by-step, so even if you've never tried astrophotography before,
          you'll be able to follow along easily.
        </p>
      </div>
    </section>

    <section>
      <div>
        <h2 id="star-trails" class="article-body-header" data-table-of-contents>
          <a class="clickable-header-link" href="#star-trails">Star trails</a>
        </h2>

        <p>
          Star trails are photographs that show the motion of stars across the night sky, which is caused by the Earth's
          rotation. Capturing a star trail is one of the best ways to get started with
          <a href="https://en.wikipedia.org/wiki/Astrophotography" target="_blank">astrophotography</a>.
        </p>
        <p>
          The look of your final image depends entirely on where you point your camera. Each direction creates a
          different effect:
        </p>
        <BulletPoint
          ><b>Pointing north or south:</b> This creates a circular pattern around the celestial poles (Polaris in the
          north, Sigma Octantis in the south).</BulletPoint
        >
        <BulletPoint><b>Pointing east:</b> You will capture stars as long arcs rising from the horizon.</BulletPoint>
        <BulletPoint><b>Pointing west:</b> You will capture stars as long arcs setting toward the horizon.</BulletPoint>
      </div>

      <div>
        <div>
          <h3 id="northern-hemisphere" class="article-body-subheader" data-table-of-contents>
            <a class="clickable-header-link" href="#northern-hemisphere">Northern hemisphere</a>
          </h3>

          <p>
            If you live in the
            <a href="https://en.wikipedia.org/wiki/Northern_Hemisphere" target="_blank">northern hemisphere</a>, you can
            see the star <b>Polaris</b>. The Earth's
            <a href="https://en.wikipedia.org/wiki/Celestial_pole#Finding_the_north_celestial_pole" target="_blank"
              >north celestial pole</a
            >
            is almost perfectly aligned with it, which means <b>Polaris remains visible all year round</b> and never
            sets below the horizon.
          </p>
          <p>
            Stars that never set below the horizon are called
            <a href="https://en.wikipedia.org/wiki/Circumpolar_star" target="_blank">circumpolar stars</a>. When you
            take a photo with Polaris in the center, you capture these circumpolar stars creating perfect circles around
            it, while other stars form arcs across the sky.
          </p>

          <ImageWithCaption
            :image-src="earthPointingAtPolaris"
            image-alt="An illustration showing the north celestial pole aligned with the star Polaris."
            image-caption="The north celestial pole is aligned with the star Polaris."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h3 id="southern-hemisphere" class="article-body-subheader" data-table-of-contents>
            <a class="clickable-header-link" href="#southern-hemisphere">Southern hemisphere</a>
          </h3>

          <p>
            If you live in the
            <a href="https://en.wikipedia.org/wiki/Celestial_pole#Finding_the_south_celestial_pole" target="_blank"
              >southern hemisphere</a
            >, try to locate the star <b>Sigma Octantis</b>. If you've never heard of it before, don't worry, I'll show
            you how to use a planetarium app to help you find any object in the sky.
          </p>

          <ImageWithCaption
            :image-src="earthPointingAtSigmaOctantis"
            image-alt="An illustration showing the south celestial pole aligned with the star Sigma Octantis."
            image-caption="The south celestial pole is aligned with the star Sigma Octantis."
            @open-image-modal="handleOpenImageModal"
          />
        </div>
      </div>
    </section>

    <section>
      <h2 id="required-equipment" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#required-equipment">Required equipment</a>
      </h2>

      <p>
        To capture a star trail, <b>you take hundreds of short-exposure images over several hours</b>. Later, you will
        combine those images using photo-editing software to create the final star trail effect.
      </p>
      <p>Here is what you will need:</p>
      <BulletPoint>A tripod.</BulletPoint>
      <BulletPoint>Your smartphone.</BulletPoint>
      <BulletPoint>An app that can automatically tap the shutter button.</BulletPoint>
      <BulletPoint>A planetarium app to help find Polaris or Sigma Octantis.</BulletPoint>

      <div>
        <h3 id="smartphone" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#smartphone">Smartphone</a>
        </h3>

        <p>
          Both Android and iPhone users can follow this guide. What matters most is that your camera app allows you to
          shoot in <b>pro mode</b>.
        </p>
        <p>
          Pro mode lets you change the camera settings manually. This is important because every photo needs to have the
          same settings throughout the night.
        </p>
        <p>
          If you don't use pro mode, your phone will keep changing the camera settings on its own while shooting, which
          will ruin the final image.
        </p>
        <p>
          In the steps below, I will show you how to find pro mode on your phone. I am using an Android device, but
          iPhone users should be able to find similar options in their camera app.
        </p>

        <p>Launch your camera app and tap the pro mode option.</p>
        <ImageWithCaption
          :image-src="cameraAppStep1"
          image-alt="This image shows how to access the pro mode in a smartphone camera app."
          image-caption="Tap the pro mode button."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Inside pro mode, you will need to adjust three main settings:</p>
        <BulletPoint><b>ISO:</b> Controls how sensitive your camera sensor is to light.</BulletPoint>
        <BulletPoint><b>Shutter speed:</b> How long the camera's shutter stays open.</BulletPoint>
        <BulletPoint
          ><b>Focus:</b> Adjusts the lens to make a specific area in your frame appear sharp and clear.</BulletPoint
        >
        <ImageWithCaption
          :image-src="cameraAppStep2"
          image-alt="This image shows how to find the ISO, shutter speed, and focus settings in a smartphone camera app."
          image-caption="Find these settings in your camera app."
          @open-image-modal="handleOpenImageModal"
        />
        <p>Found them? Great! I'll explain how to set them later in this guide.</p>
      </div>

      <div>
        <h3 id="planetarium-app" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#planetarium-app">Planetarium app</a>
        </h3>

        <p>
          A planetarium app lets you see the sky directly on your phone. The app uses your location and your phone's
          compass to accurately show celestial objects.
        </p>
        <p>
          This guide is written for people in the <InlineCode text="northern hemisphere" />, where Polaris is visible
          and easy to find.
        </p>
        <p>
          If you're in the <InlineCode text="southern hemisphere" />, Polaris won't be visible. Instead, look for
          <InlineCode text="Sigma Octantis" />, the South Star, which is much fainter and harder to spot.
        </p>
        <p>
          There are many free apps that work on both Android and iPhone. I use
          <a href="https://vitotechnology.com/apps/sky-tonight" target="_blank">Sky Tonight</a> every day, it's simple
          and works well. Give it a try.
        </p>
        <p>
          Open the app and go through the setup. Once done, click on the <InlineCode text="compass icon" /> in the
          lower-right corner, or just move your phone around. This helps the app match your view to the real sky.
        </p>
        <p>
          Keep moving your phone until you see the <InlineCode text="south" /> direction (in the southern hemisphere) or
          <InlineCode text="north" /> (in the northern hemisphere).
        </p>
        <ImageWithCaption
          :image-src="skyTonightStep1"
          image-alt="In this image, we use the compass feature of the Sky Tonight app to find the north direction."
          image-caption="Tap the compass icon to use your phone's compass for navigation."
          @open-image-modal="handleOpenImageModal"
        />

        <p>When you're pointing north, Polaris should be highlighted by the app.</p>
        <ImageWithCaption
          :image-src="skyTonightStep2"
          image-alt="This image shows the north direction in the Sky Tonight app where Polaris should be highlighted."
          image-caption="Find the North in the app."
          @open-image-modal="handleOpenImageModal"
        />

        <p>If it's not, tap the <b>search button</b>.</p>
        <ImageWithCaption
          :image-src="skyTonightStep3"
          image-alt="This image shows the location of the search button in the Sky Tonight app."
          image-caption="The search button location."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Type <InlineCode text="Polaris" />, then press the locate icon.</p>
        <ImageWithCaption
          :image-src="skyTonightStep4"
          image-alt="This image shows how to search for Polaris in the Sky Tonight app."
          image-caption="Searching and locating Polaris."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Now you should see Polaris highlighted. Move your phone slowly until the star is in the center of the screen.
        </p>
        <ImageWithCaption
          :image-src="skyTonightStep5"
          image-alt="This image shows Polaris highlighted in the Sky Tonight app."
          image-caption="Polaris is now highlighted."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3 id="automatic-app-clicker" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#automatic-app-clicker">Automatic clicker app</a>
        </h3>

        <p>
          Since you'll be taking hundreds of photos, you need an app that can take them automatically for you. The
          built-in camera apps on most phones don't have this feature.
        </p>
        <p>
          On Android, I use
          <a
            href="https://play.google.com/store/apps/details?id=com.truedevelopersstudio.automatictap.autoclicker&hl=en-US"
            target="_blank"
            >Auto Clicker-Automatic tap</a
          >. It is free, easy to use, and works well. Unfortunately, it's not available for iPhone, but you can find
          similar apps in the App Store.
        </p>

        <p>
          Open the app and enable <InlineCode text="single target mode" />, since we only need to tap one thing, the
          shutter button.
        </p>
        <ImageWithCaption
          :image-src="autoClickerStep1"
          image-alt="This image shows how to enable single target mode in the Auto Clicker app."
          image-caption="Enable <b>single target mode</b>."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Make sure the control panel is showing on screen.</p>
        <ImageWithCaption
          :image-src="autoClickerStep2"
          image-alt="This image shows the Auto Clicker app's control panel on screen."
          image-caption="The control panel is now visible on the screen after enabling the single target mode."
          @open-image-modal="handleOpenImageModal"
        />

        <p>You can disable this mode now, I will show you how to use it properly later.</p>
      </div>

      <div>
        <h3 id="tripod" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#tripod">Tripod</a>
        </h3>

        <p>
          To get a clean star trail, your phone must stay completely still during the entire shoot. That's why a tripod
          is important.
        </p>
        <p>Any tripod that can hold your phone will do. No need to spend a lot, even a cheap one works fine.</p>
        <ImageWithCaption
          :image-src="tripods"
          image-alt="This image shows different types of tripods that can be used to hold a smartphone."
          image-caption="Different types of tripods that can hold a smartphone."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          If you don't have a tripod, you can lean your phone against a wall or somewhere solid that won't move. I have
          done this many times when I couldn't afford a tripod :)
        </p>
      </div>
    </section>

    <section>
      <h2 id="collecting-data" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#collecting-data">Collecting data</a>
      </h2>

      <p>
        Place your smartphone on the tripod. Then, open the planetarium app you downloaded. Search for the star Polaris
        and follow it until you find it. Try to center it in the screen, or put it in a corner if you prefer.
      </p>
      <p>
        Make sure the phone stays still all night. If it is windy, cover the phone gently, but don't block the camera
        lens.
      </p>
      <p>Now, open the auto clicker app and turn on <InlineCode text="single target mode" />.</p>
      <p>
        Exit the auto clicker, then open the camera app. Switch to <InlineCode text="pro mode" />, and place the auto
        clicker's floating blue circle over the shutter button.
      </p>
      <ImageWithCaption
        :image-src="collectDataStep1"
        image-alt="This image shows how to position the auto clicker's floating button over the camera app's shutter button."
        image-caption="Place the auto clicker's floating button over the shutter button."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Now, it is time to adjust the settings. First, tap on <InlineCode text="AF" /> and set it to <b>infinity</b>.
        This locks the camera focus on distant stars. If you skip this, the camera will try to focus on something
        nearby, and your photos will be blurry.
      </p>
      <ImageWithCaption
        :image-src="collectDataStep2"
        image-alt="This image shows how to set the camera focus to infinity in pro mode."
        image-caption="Set the focus to infinity."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Now, tap <InlineCode text="S" /> (it might say something different depending on your app) to change the shutter
        speed. Set it to 10 seconds. That means the camera stays open for 10 seconds each time, gathering as much light
        as possible.
      </p>
      <p>
        Don't go over 20 seconds, especially if you're using a tripod. If you set it too high, stars will show up as
        streaks, not circles. Try taking a test shot at 30 seconds just to see what happens. You'll see that the stars
        are all stretched.
      </p>
      <p>So stick to 10–20 seconds. For now, use 10.</p>
      <ImageWithCaption
        :image-src="collectDataStep3"
        image-alt="This image warns against using a shutter speed longer than 20 seconds when using a tripod."
        image-caption="Never choose a value larger than 20 seconds if you are using a tripod."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Next, tap the <InlineCode text="ISO" /> button and set it between 800 and 1600. If you're in a city with light
        pollution, keep it at 800 or less. Again, don't push the ISO too high, like 25600, unless you want to hurt your
        eyes later when looking at the photo 😅
      </p>
      <ImageWithCaption
        :image-src="collectDataStep4"
        image-alt="This image warns against using a high ISO value when capturing star trails."
        image-caption="Set the ISO between 800 and 1600."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Now, set the timer to 3 or 5 seconds. This helps reduce blur caused by shaking the phone when pressing the
        shutter. The timer lets the phone settle before taking the shot.
      </p>
      <ImageWithCaption
        :image-src="collectDataStep5"
        image-alt="This image shows how to set the timer in a smartphone camera app."
        image-caption="Set the timer to 3 or 5 seconds."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        I said it's rare to find an intervalometer built into the camera app. But in my case, it's there. Not sure if
        all Android phones have it.
      </p>
      <p>
        If your app has the <InlineCode text="Interval" /> option, set it to 1 or 2 seconds. That means: after a
        10-second exposure, the camera waits 1 or 2 seconds before taking the next one.
      </p>
      <p>
        If your camera app doesn't have this, no problem, we'll use the auto clicker instead. But first, let's take a
        test shot. Make sure your camera settings are as follows:
      </p>
      <BulletPoint><b>ISO:</b> 1200.</BulletPoint>
      <BulletPoint><b>Timer:</b> 3 or 5 seconds.</BulletPoint>
      <BulletPoint><b>Shutter speed:</b> 10 seconds.</BulletPoint>
      <BulletPoint><b>Focus:</b> Infinity (max number).</BulletPoint>

      <p>Take a photo. Open it and check if the stars show up. Here's what I got:</p>
      <ImageWithCaption
        :image-src="testShot"
        image-alt="This image shows a test shot of the night sky taken with a smartphone."
        image-caption="A test shot of the night sky taken with my smartphone."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Zoom in on a star. Is it a clean circle? If not, check your focus or increase the timer. If the image is too
        dark, increase the ISO a little. Take another photo, look at it, adjust, repeat. Keep doing this until you're
        happy with the result.
      </p>
      <p>
        Once you have found the settings you like, delete the earlier test shots. Now you're ready to let the phone run
        on its own and collect data.
      </p>
      <p>
        Make sure the phone is fully charged before starting. Then, disable Wi-Fi, turn on airplane mode, and set the
        phone to silent. This helps prevent interruption, like incoming calls, that could stop the photo sequence.
      </p>
      <p>Put the auto clicker's floating circle on the shutter speed again, and open the settings.</p>
      <ImageWithCaption
        :image-src="collectDataStep6"
        image-alt="This image shows how to open the auto clicker's settings menu."
        image-caption="Open the auto clicker's settings menu."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Set the <b>Stop after</b> to <InlineCode text="Run indefinitely" />. Then calculate the interval like this:</p>
      <CodeOutput :code-output="intervalCodeOutput" />
      <p>
        The extra second gives your phone time to save the photo and prepare for the next one. If you want to gain a few
        seconds, decrease the timer as much as you can. Once done, click Save.
      </p>
      <ImageWithCaption
        :image-src="collectDataStep7"
        image-alt="This image shows how to set the auto clicker's interval and stop options."
        image-caption="Set the interval and stop options."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Now tap the blue icon to start the auto clicker. Don't touch the phone. Leave it alone for 3 to 5 hours.</p>
      <ImageWithCaption
        :image-src="collectDataStep8"
        image-alt="This image shows how to start the auto clicker."
        image-caption="Tap the blue icon to start the auto clicker."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You're done waiting? Good. Tap the same icon again, it is now a square, to stop the auto clicker. If you think
        the last photo was affected by you touching the phone, go ahead and delete it.
      </p>
    </section>

    <section>
      <h2 id="processing-the-data" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#processing-the-data">Processing the data</a>
      </h2>

      <div>
        <h3 id="windows-macos" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#windows-macos">Windows & macOS</a>
        </h3>

        <p>
          You are now ready to process the data you collected. For Windows & macOS users, download the
          <a href="https://markus-enzweiler.de/software/starstax/" target="_blank">StarStax program</a>. Then connect
          your phone to your computer with a USB cable and transfer your photos.
        </p>

        <p>
          Create a folder named <InlineCode text="StarTrails" /> to stay organized. Inside it, create another folder
          called <InlineCode text="images" />, and move only your <InlineCode text="jpg" /> files there.
        </p>

        <ImageWithCaption
          :image-src="jpgFolderStarTrails"
          image-alt="File folder structure showing StarTrails folder with images subfolder containing JPG files."
          image-caption="The images are located at <b>Pictures/StarTrails/JPG</b>."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Now, open <InlineCode text="StarStax" />. Drag and drop all your images where it says "Drop Images Here."</p>

        <ImageWithCaption
          :image-src="starTrailProcessingWindowsMacosStep1"
          image-alt="StarStax application showing the drag and drop area for images."
          image-caption="Drop the images in the left panel."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Once the images are loaded, click on a file name to preview it. Every checked image will be used when
          stacking. If you notice any with artifacts, simply uncheck them before continuing.
        </p>

        <ImageWithCaption
          :image-src="starTrailProcessingWindowsMacosStep2"
          image-alt="StarStax showing loaded images with preview and checkbox options."
          image-caption="Images loaded in StarStax."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Next, click the <InlineCode text="Preferences" /> button in the top-right corner to open the blending
          settings.
        </p>

        <ImageWithCaption
          :image-src="starTrailProcessingWindowsMacosStep3"
          image-alt="StarStax interface highlighting the Preferences button location."
          image-caption="The location of the preferences button."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          By default, <InlineCode text="Lighten" /> mode is selected, this is what we want. You can also select
          <InlineCode text="Gap filling" /> to smooth out any breaks in the star trails. Keep
          <InlineCode text="Lighten" /> active, then press <InlineCode text="Ctrl+P" /> or click
          <InlineCode text="Start processing" /> in the top-left corner to begin stacking.
        </p>

        <ImageWithCaption
          :image-src="starTrailProcessingWindowsMacosStep4"
          image-alt="StarStax preferences showing Lighten mode selected and stacking options."
          image-caption="The stacked image will appear in the preview once processing is finished."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          To save your final image, click <InlineCode text="Save as" /> next to the
          <InlineCode text="Start processing" /> button or press <InlineCode text="Ctrl+S" />.
        </p>

        <p>
          Inside your <InlineCode text="StarTrails" /> folder, create another folder called
          <InlineCode text="StackedImage" /> and save the result there.
        </p>

        <p>
          Before saving, make sure to add the correct file extension. If you just want the final image, use
          <InlineCode text=".png" /> or <InlineCode text=".jpg" />. If you plan to edit it further, for example, to
          remove satellites or add effects, save it as <InlineCode text=".tiff" />.
        </p>

        <ImageWithCaption
          :image-src="starStaxSaveStackedImage"
          image-alt="StarStax save dialog showing file name input with extension options."
          image-caption="Add the file extension to the file name before saving."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3 id="linux" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#linux">Linux</a>
        </h3>

        <p>
          There's an excellent open-source project on GitHub called
          <a href="https://github.com/gkyle/startrails" target="_blank">startrails</a>. It lets you stack images, remove
          artifacts, and fill gaps in your star trails. It's completely free and open source.
        </p>

        <p>On GitHub, click on the <InlineCode text="Code" /> button and download the project as a ZIP file.</p>

        <ImageWithCaption
          :image-src="githubStarTrailProjectStep1"
          image-alt="GitHub repository page showing the Code button and download option."
          image-caption="The startrails project on GitHub."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Unzip the file and navigate to the project folder using these commands:</p>

        <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />

        <p>To start the program, run this script:</p>

        <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />

        <p>
          Now wait, the script will create a virtual environment using the
          <a href="https://docs.astral.sh/uv/" target="_blank">uv package manager</a>. If you have an <b>NVIDIA GPU</b>,
          the script will automatically detect it and install the required dependencies to use your GPU for faster
          processing.
        </p>

        <p>At the end of the installation, you should see this window:</p>

        <ImageWithCaption
          :image-src="starTrailsProgramHomePage"
          image-alt="Startrails application window running on Ubuntu 25.10."
          image-caption="The startrails program running on Ubuntu 25.10."
          @open-image-modal="handleOpenImageModal"
        />

        <p>Click on the <InlineCode text="Add star frames" /> button and import your images.</p>

        <ImageWithCaption
          :image-src="githubStarTrailProjectStep2"
          image-alt="Startrails application showing the Add star frames button."
          image-caption="Import the images by clicking the Add star frames button."
          @open-image-modal="handleOpenImageModal"
        />

        <p>After loading the images, you will be able to preview the images in the app.</p>

        <ImageWithCaption
          :image-src="starTrailsGithubLoadedImages"
          image-alt="Startrails showing a preview of loaded star trail images."
          image-caption="Previewing the loaded images."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Next, click <InlineCode text="Stack images" /> to start the stacking process. In the options, set
          <InlineCode text="Fade Frames" /> to None. If you have a GPU, enable it and adjust the
          <InlineCode text="Batch Size" /> based on your GPU's available VRAM.
        </p>

        <p>
          Higher batch sizes will speed up processing but also use more memory. Click <InlineCode text="OK" /> to start
          the stacking process.
        </p>

        <p>The final image will be saved in the <InlineCode text="projects" /> folder:</p>
        <CodeBlock :code="bashCodeSnippet3" language="bash" @show-toast="handleShowToastEvent" />

        <p>Output:</p>
        <CodeOutput :code-output="treeCommandOutput" />

        <p>
          To fill gaps in the star trails, click the <InlineCode text="Fill gaps" /> button. The result will be saved in
          the same folder.
        </p>

        <p>
          You can also remove satellite streaks from the images by clicking on the
          <InlineCode text="Detect streaks" /> button. This uses a deep learning model to find and remove streaks
          automatically.
        </p>

        <p>
          Click <InlineCode text="Stack images" /> again. Choose <InlineCode text="Remove" /> in the streaks section and
          set <InlineCode text="Fade frames" /> to None and click <InlineCode text="OK" />. Your new image will now be
          free of satellite trails.
        </p>

        <ImageWithCaption
          :image-src="githubStarTrailProjectStep3"
          image-alt="Startrails showing the final stacked image with satellite streaks removed."
          image-caption="The satellite streak was removed after applying the detect streaks tool."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2 id="bonus-time-lapse" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#bonus-time-lapse">Bonus: Time-lapse</a>
      </h2>

      <p>Here is a bonus for you, with the same data, you can create a time-lapse like this one.</p>
      <VideoWithCaption :video-src="timelapse60Fps" video-caption="Time-lapse of the night sky." />

      <p>
        To do this, you'll need video editing software to combine your images into a video. I use
        <a href="https://www.shotcut.org/" target="_blank">Shotcut</a>, but feel free to use any other program you like.
      </p>

      <div>
        <h3 id="starstax-timelapse" class="article-body-subheader" data-table-of-contents>
          <a class="clickable-header-link" href="#starstax-timelapse">StarStax</a>
        </h3>

        <p>
          In StarStax, enable the <InlineCode text="Save after each step" /> option. Enter a name in the
          <InlineCode text="image name" /> field, this will be used as a prefix for each frame. Then click
          <InlineCode text="Browse" /> to select where the images should be saved.
        </p>

        <p>
          Create a new folder inside <InlineCode text="StarTrails" /> and call it <InlineCode text="Timelapse" />.
          Inside it, create another folder named <InlineCode text="Images" />.
        </p>

        <p>Select the <InlineCode text="Images" /> folder when clicking on <InlineCode text="Browse" />.</p>

        <ImageWithCaption
          :image-src="starTrailProcessingWindowsMacosTimelapse"
          image-alt="StarStax interface showing Save after each step option and image name field."
          image-caption="Steps to save images after each step in StarStax."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          If you downloaded <a href="https://www.shotcut.org/" target="_blank">Shotcut</a>, follow these steps.
          Otherwise, try to reproduce them in your own editing software.
        </p>

        <p>
          Open Shotcut and go to <InlineCode text="Settings" /> → <InlineCode text="Video mode" /> →
          <InlineCode text="Custom" /> → <InlineCode text="Add" /> to create a new video mode.
        </p>

        <ImageWithCaption
          :image-src="starTrailTimelapseStep1"
          image-alt="Shotcut Settings menu showing the path to create a new video mode."
          image-caption="Adding a new video mode in Shotcut."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Set the resolution and aspect ratio based on your phone camera's resolution. Set the frame rate to
          <b>30 or 60 FPS</b>, then click <b>OK</b>.
        </p>

        <ImageWithCaption
          :image-src="addCustomVideoMode"
          image-alt="Shotcut video mode settings showing resolution, aspect ratio, and frame rate options."
          image-caption="The add custom video mode dialog."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Drag your first image (for example, <InlineCode text="image_name_00000000" />) into Shotcut. Then open the
          <InlineCode text="Properties" /> panel and check <InlineCode text="Image sequence" />, this tells Shotcut to
          combine all the images into a single video.
        </p>

        <p>
          Press the <InlineCode text="+" /> button or the <InlineCode text="A" /> key to add the video to the track.
        </p>

        <ImageWithCaption
          :image-src="starTrailTimelapseStep2"
          image-alt="Shotcut showing image sequence import and Properties panel."
          image-caption="Importing the image sequence to Shotcut."
          @open-image-modal="handleOpenImageModal"
        />

        <p>
          Click <InlineCode text="Export" /> → <InlineCode text="Advanced" />, and make sure the format is
          <InlineCode text="MP4" />. Check that the resolution and FPS match your project settings. Finally, click
          <InlineCode text="Export file" /> to create your time-lapse.
        </p>

        <ImageWithCaption
          :image-src="starTrailTimelapseStep3"
          image-alt="Shotcut Export dialog showing MP4 format and export options."
          image-caption="Exporting the time-lapse as an MP4 video."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>In this guide, you learned how to use <b>pro mode</b> on your camera app to control every setting manually.</p>
      <p>
        You used an <b>auto clicker</b> to capture images automatically throughout the night, and learned how to use
        computer programs to <b>stack</b> those images into a single star trail, and even how to turn them into a
        <b>time-lapse</b> video.
      </p>
      <p>Everything you've learned here also applies to digital cameras.</p>
      <p>Happy stargazing!</p>
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
import { calculateReadingTime } from "@/utils";

// Images
import coverImage from "./coverImage.svg";
import bortle1VsBortle9Skies from "./bortle_1_vs_bortle_9_skies.jpeg";
import earthPointingAtPolaris from "./earth_pointing_at_polaris.svg";
import earthPointingAtSigmaOctantis from "./earth_pointing_at_sigma_octantis.svg";
import cameraAppStep1 from "./camera_app_step_1.svg";
import cameraAppStep2 from "./camera_app_step_2.svg";
import skyTonightStep1 from "./sky_tonight_step_1.svg";
import skyTonightStep2 from "./sky_tonight_step_2.svg";
import skyTonightStep3 from "./sky_tonight_step_3.svg";
import skyTonightStep4 from "./sky_tonight_step_4.svg";
import skyTonightStep5 from "./sky_tonight_step_5.svg";
import autoClickerStep1 from "./auto_clicker_step_1.svg";
import autoClickerStep2 from "./auto_clicker_step_2.svg";
import tripods from "./tripods.svg";
import collectDataStep1 from "./collect_data_step_1.svg";
import collectDataStep2 from "./collect_data_step_2.svg";
import collectDataStep3 from "./collect_data_step_3.svg";
import collectDataStep4 from "./collect_data_step_4.svg";
import collectDataStep5 from "./collect_data_step_5.svg";
import collectDataStep6 from "./collect_data_step_6.svg";
import collectDataStep7 from "./collect_data_step_7.svg";
import collectDataStep8 from "./collect_data_step_8.svg";
import testShot from "./test_shot.jpg";
import jpgFolderStarTrails from "./jpg_folder_star_trails.jpg";
import starTrailProcessingWindowsMacosStep1 from "./star_trail_processing_windows_macos_step_1.svg";
import starTrailProcessingWindowsMacosStep2 from "./star_trail_processing_windows_macos_step_2.jpg";
import starTrailProcessingWindowsMacosStep3 from "./star_trail_processing_windows_macos_step_3.svg";
import starTrailProcessingWindowsMacosStep4 from "./star_trail_processing_windows_macos_step_4.svg";
import starTrailProcessingWindowsMacosTimelapse from "./star_trail_processing_windows_macos_step_timelapse.svg";
import starStaxSaveStackedImage from "./star_stax_save_stacked_image.jpg";
import starTrailsProgramHomePage from "./star_trails_program_home_page.jpg";
import starTrailsGithubLoadedImages from "./star_trails_github_loaded_images.jpg";
import githubStarTrailProjectStep1 from "./github_star_trail_project_step_1.svg";
import githubStarTrailProjectStep2 from "./github_star_trail_project_step_2.svg";
import githubStarTrailProjectStep3 from "./github_star_trail_project_step_3.svg";
import timelapse60Fps from "./timelapse_60_fps.mp4";
import starTrailTimelapseStep1 from "./star_trail_timelapse_step_1.svg";
import starTrailTimelapseStep2 from "./star_trail_timelapse_step_2.svg";
import starTrailTimelapseStep3 from "./star_trail_timelapse_step_3.svg";
import addCustomVideoMode from "./add_custom_video_mode.jpg";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import CodeBlock from "@/components/CodeBlock.vue";
import VideoWithCaption from "@/components/VideoWithCaption.vue";

export default {
  name: "StarTrailsWithSmartphone",
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
    BulletPoint,
    CodeOutput,
    CodeBlock,
    VideoWithCaption,
  },
  emits: ["show-toast", "article-read"],
  data() {
    return {
      ...codeSnippets,

      tags: ["Astronomy", "Star trails", "Timelapse", "Sky Tonight", "Astrophotography"],
      readingTime: 0,
      markdownContent,
      enlargedImageSrc: "",
      isImageModalVisible: false,

      coverImage,
      bortle1VsBortle9Skies,
      earthPointingAtPolaris,
      earthPointingAtSigmaOctantis,
      cameraAppStep1,
      cameraAppStep2,
      skyTonightStep1,
      skyTonightStep2,
      skyTonightStep3,
      skyTonightStep4,
      skyTonightStep5,
      autoClickerStep1,
      autoClickerStep2,
      tripods,
      collectDataStep1,
      collectDataStep2,
      collectDataStep3,
      collectDataStep4,
      collectDataStep5,
      collectDataStep6,
      collectDataStep7,
      collectDataStep8,
      testShot,
      jpgFolderStarTrails,
      starTrailProcessingWindowsMacosStep1,
      starTrailProcessingWindowsMacosStep2,
      starTrailProcessingWindowsMacosStep3,
      starTrailProcessingWindowsMacosStep4,
      starTrailProcessingWindowsMacosTimelapse,
      starStaxSaveStackedImage,
      starTrailsProgramHomePage,
      starTrailsGithubLoadedImages,
      githubStarTrailProjectStep1,
      githubStarTrailProjectStep2,
      githubStarTrailProjectStep3,
      timelapse60Fps,
      starTrailTimelapseStep1,
      starTrailTimelapseStep2,
      starTrailTimelapseStep3,
      addCustomVideoMode,
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  mounted() {
    document.title = "How to shoot star trails with your smartphone";
    const articleContent = this.$refs.articleContent.$el.innerText;
    this.readingTime = calculateReadingTime(articleContent);
    const readTimeThresholdInMilliseconds = this.readingTime * 0.25 * 60 * 1000;
    setTimeout(() => {
      this.$emit("article-read");
    }, readTimeThresholdInMilliseconds);
  },
  methods: {
    handleOpenImageModal(event) {
      this.enlargedImageSrc = event.target.src;
      this.isImageModalVisible = true;
      window.addEventListener("keydown", this.handleEscape);
    },
    handleCloseImageModal() {
      this.isImageModalVisible = false;
      this.enlargedImageSrc = "";
      window.removeEventListener("keydown", this.handleEscape);
    },
    handleEscape(event) {
      if (event.key === "Escape") {
        this.handleCloseImageModal();
      }
    },
    handleShowToastEvent(data) {
      this.$emit("show-toast", data);
    },
  },
};
</script>

<style scoped></style>
