<template>
  <ArticleLayout
    ref="articleContent"
    title="Learn the night sky with free planetarium applications"
    sub-title="A list of free planetarium applications to explore the night sky on your computer or mobile device."
    creation-date="September 20, 2025"
    article-type="astronomy-post"
    :article-tags="tags"
    :cover-image="coverImage"
    :reading-time="readingTime"
    :slug="slug"
    :markdown-content="markdownContent"
    @show-toast="handleShowToastEvent"
  >
    <section>
      <h2 class="article-body-header" id="introduction">
        <a href="#introduction">Introduction</a>
      </h2>
      <p>
        <a href="https://en.wikipedia.org/wiki/Planetarium_software" target="_blank">Planetarium</a> applications helped
        me learn a lot about the universe. I read stories about constellations, stars, and planets. I memorized the
        names of the brightest stars. I learned how to read astronomical data like
        <a href="https://en.wikipedia.org/wiki/Right_ascension" target="_blank">right ascension</a>,
        <a href="https://en.wikipedia.org/wiki/Declination" target="_blank">declination</a>,
        <a href="https://en.wikipedia.org/wiki/Magnitude_(astronomy)" target="_blank">magnitude</a>,
        <a href="https://en.wikipedia.org/wiki/Stellar_classification" target="_blank">star type</a>, etc.
      </p>
      <p>
        I use planetarium applications on both my phone and my computer. Some are free, others are paid. Some are
        simple, others are complex. Overall, I believe everyone should have a planetarium app at hand. In this article,
        I will share with you the free applications that I have used over the past years.
      </p>
    </section>

    <section>
      <h2 class="article-body-header" id="computer-applications">
        <a href="#computer-applications">Computer applications</a>
      </h2>

      <div>
        <div>
          <h3 class="article-body-subheader" id="stellarium">
            <a href="#stellarium">Stellarium</a>
          </h3>
          <ImageWithCaption
            :image-src="stellariumMilkyWay"
            image-alt="Milky Way in Stellarium"
            image-caption="A view of the Milky Way as seen from Stellarium."
            @open-image-modal="handleOpenImageModal"
          />
          <p>
            <a href="https://stellarium.org/" target="_blank">Stellarium</a> was the first planetarium application I
            used. I installed it on my Ubuntu computer after discovering that it is free and open source. I don’t
            remember exactly how I found it, but I think it was through a YouTube video about astronomy.
          </p>
          <p>
            Stellarium has a simple, intuitive user interface and is packed with features. It is my favorite
            application, and I’d like to share some of the features I really enjoy.
          </p>
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-object-information">
            <a href="#stellarium-object-information">Object information</a>
          </h4>
          <p>
            Clicking on any object, whether it is a star, planet, galaxy, or something else, displays a lot of
            information about it. You can see details such as its magnitude, distance, position in the night sky, and
            many other useful facts.
          </p>
          <ImageWithCaption
            :image-src="stellariumClickObjectInformation"
            image-alt="Clicking on an object in Stellarium"
            image-caption="Clicking on an object in Stellarium reveals detailed information about it."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-whats-up-today">
            <a href="#stellarium-whats-up-today">What's up today</a>
          </h4>
          <p>
            The <InlineCode text="What's up today" /> feature shows you a list of interesting celestial events happening
            on the current day, such as planets, galaxies, and comets. It's a great way to discover new objects to
            observe in the night sky.
          </p>
          <p>
            To access this feature, click on the <InlineCode text="Astronomical calculations window" /> icon on the left
            toolbar or press <InlineCode text="F10" />, then go to the <InlineCode text="What's up today (WUT)" /> tab.
          </p>
          <p>
            Within the <InlineCode text="WUT" /> tab, you can filter events by category (for example, planets or comets)
            and by the time of day (such as any time during the night or just in the evening). You can also filter the
            results by magnitude, which is useful if you want to see only the brightest objects.
          </p>
          <p>
            The results appear in the <InlineCode text="Matching objects" /> table. You can double-click any row to
            center the view on that object.
          </p>
          <ImageWithCaption
            :image-src="whatsUpTodayStellarium"
            image-alt="What's up today in Stellarium"
            image-caption="The <b>What's up today</b> feature in Stellarium helps you discover interesting celestial events."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-phenomena">
            <a href="#stellarium-phenomena">Phenomena</a>
          </h4>
          <p>
            The <InlineCode text="Phenomena" /> feature allows you to calculate when certain celestial events will occur
            between two objects. By default, the tool calculates only
            <a href="https://en.wikipedia.org/wiki/Conjunction_(astronomy)" target="_blank">conjunctions</a>, but you
            can also select
            <a href="https://en.wikipedia.org/wiki/Opposition_(astronomy)" target="_blank">oppositions</a>,
            <a href="https://en.wikipedia.org/wiki/Elongation_(astronomy)" target="_blank">elongations</a>,
            <a href="https://en.wikipedia.org/wiki/Quadrature_(astronomy)" target="_blank">quadratures</a>,
            <a href="https://simple.wikipedia.org/wiki/Perihelion" target="_blank">perihelion</a>, and
            <a href="https://simple.wikipedia.org/wiki/Aphelion" target="_blank">aphelion</a>.
          </p>
          <p>
            Before starting the calculation, choose the start and end dates, the two objects, the type of phenomena you
            want to calculate, and the maximum allowed separation. Then click the
            <InlineCode text="Calculate" /> button.
          </p>
          <p>
            Double-clicking any row in the results table will take you to that event in time and center the objects in
            the view.
          </p>
          <ImageWithCaption
            :image-src="phenomenaStellarium"
            image-alt="Phenomena in Stellarium"
            image-caption="The <b>Phenomena</b> feature in Stellarium helps you find interesting celestial events between two objects."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-eclipses">
            <a href="#stellarium-eclipses">Eclipses</a>
          </h4>
          <p>
            The <InlineCode text="Eclipses" /> feature allows you to calculate all types of eclipses, including lunar,
            solar, and planetary transits. By default, the <InlineCode text="All solar eclipses" /> tab is selected, but
            you can choose any type of eclipse from the tabs at the bottom. Select the starting year and the number of
            years you want to search, then click the <InlineCode text="Calculate eclipses" /> button.
          </p>
          <p>
            As with the previous features, double-clicking any row in the results table will take you to that event in
            time and center the relevant objects in the view.
          </p>
          <ImageWithCaption
            :image-src="eclipsesStellarium"
            image-alt="Eclipses in Stellarium"
            image-caption="The <b>Eclipses</b> feature in Stellarium helps you find upcoming eclipses."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-image-sensor-frame">
            <a href="#stellarium-image-sensor-frame">Image sensor frame</a>
          </h4>
          <p>
            For astrophotographers, the <InlineCode text="Image sensor frame" /> feature is extremely useful. It allows
            you to simulate the field of view of your camera and telescope setup, so you can see exactly what portion of
            the sky will be captured in your images.
          </p>
          <p>
            You can select your sensor type, and the tool will display details such as the sensor's dimensions, binning,
            X and Y scale, and rotation angle. You can also choose your telescope and lens configuration, including
            <a href="https://en.wikipedia.org/wiki/Telecompressor" target="_blank">focal reducers</a> or
            <a href="https://en.wikipedia.org/wiki/Extension_tube" target="_blank">extenders</a>, and see the resulting
            field of view and multiplicity.
          </p>
          <p>
            This makes it easy to plan your astrophotography sessions and ensure your target fits perfectly within your
            camera's frame.
          </p>
          <ImageWithCaption
            :image-src="imageSensorFrameStellarium"
            image-alt="Image sensor frame settings in Stellarium"
            image-caption="The <b>Image sensor frame</b> feature in Stellarium helps you visualize your camera and telescope setup."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-sky-culture">
            <a href="#stellarium-sky-culture">Sky culture</a>
          </h4>
          <p>
            Stellarium supports a variety of sky cultures, allowing you to view the night sky as interpreted by
            different cultures around the world. You can choose from a wide range of cultural sky representations.
          </p>
          <p>
            To explore these options, click on the <InlineCode text="Sky and viewing options window" /> icon on the left
            toolbar or press <InlineCode text="F4" />, then go to the <InlineCode text="Sky culture" /> tab.
          </p>
          <ImageWithCaption
            :image-src="skyCultureStellarium"
            image-alt="Sky culture options in Stellarium"
            image-caption="On the left is the modern sky culture, and on the right is the Arabic sky culture."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-simulating-sky-conditions">
            <a href="#stellarium-simulating-sky-conditions">Simulating sky conditions</a>
          </h4>

          <p>
            In the past,
            <a
              href="https://harmoniouscosmos.com/ancient-astronomies-and-the-human-fascination-with-the-sky/"
              target="_blank"
              >people enjoyed the night sky</a
            >
            without the effects of
            <a href="https://en.wikipedia.org/wiki/Light_pollution" target="_blank">light pollution</a>. Today, in most
            cities, it is difficult to see more than a few stars due to artificial lights, which means we miss out on
            much of the sky’s beauty.
          </p>
          <p>
            Stellarium allows you to simulate different sky conditions, such as light pollution, and atmospheric
            effects. This is especially useful for planning observations based on your local environment.
          </p>
          <p>
            To adjust these settings, click on the <InlineCode text="Sky and viewing options window" /> on the left
            toolbar or press <InlineCode text="F4" />, then go to the <InlineCode text="Sky" /> tab.
          </p>
          <ImageWithCaption
            :image-src="skyAndViewingWindow"
            image-alt="Sky and viewing options window in Stellarium"
            image-caption="The <b>Sky and viewing options window</b> in Stellarium allows you to customize various sky settings."
            @open-image-modal="handleOpenImageModal"
          />
          <p>
            To control whether the atmosphere is rendered, check the
            <InlineCode text="Atmosphere visualization" /> checkbox. For more options, click the wrench icon next to it
            to adjust temperature, pressure, and other parameters.
          </p>
          <ImageWithCaption
            :image-src="skyWithAndWithoutAtmosphere"
            image-alt="Sky with and without atmosphere"
            image-caption="Comparison between a sky with atmosphere (left) and without atmosphere (right)."
            @open-image-modal="handleOpenImageModal"
          />
          <p>
            To simulate light pollution, use the slider in the <InlineCode text="light pollution" /> section. This
            slider lets you change the
            <a href="https://en.wikipedia.org/wiki/Bortle_scale" target="_blank">Bortle scale</a> from 1 (excellent dark
            sky) to 9 (inner city sky). Move the slider to see how the sky changes under different conditions.
          </p>
          <ImageWithCaption
            :image-src="bortle1VsBortle9Skies"
            image-alt="Bortle scale comparison"
            image-caption="Comparison between a Bortle 1 sky (left) and a Bortle 9 sky (right)."
            @open-image-modal="handleOpenImageModal"
          />
          <p>
            You can also adjust other settings, such as making stars twinkle, changing the
            <a href="https://en.wikipedia.org/wiki/General_Perspective_projection" target="_blank">sky projection</a>,
            and modifying the
            <a href="https://en.wikipedia.org/wiki/Field_of_view" target="_blank">field of view (FOV)</a>.
          </p>
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-plugins">
            <a href="#stellarium-plugins">Plugins</a>
          </h4>
          <p>
            Because Stellarium is open source, it offers a wide range of plugins that add extra features to the
            application. You can find plugins that add quasars, pulsars, simulate periodic meteor showers, and much
            more.
          </p>
          <p>
            To explore plugins, click on the <InlineCode text="Configuration window" /> icon on the left toolbar or
            press <InlineCode text="F2" />, then go to the <InlineCode text="Plugins" /> tab. Select a plugin and check
            the <InlineCode text="Load at startup" /> box to enable it. Some plugins have additional settings you can
            configure by clicking the <InlineCode text="Configure" /> button.
          </p>
          <ImageWithCaption
            :image-src="pluginsTabStellarium"
            image-alt="Plugins tab in Stellarium"
            image-caption="The <b>Plugins</b> tab in Stellarium allows you to manage and configure various plugins."
            @open-image-modal="handleOpenImageModal"
          />
          <p>
            For example, I enabled a plugin that measures angular distances between objects in the sky. After restarting
            Stellarium, I could use this plugin by clicking on the
            <InlineCode text="angular distance measurement tool" /> on the bottom toolbar.
          </p>
          <ImageWithCaption
            :image-src="angularDistanceMeasurementPlugin"
            image-alt="Angular distance measurement plugin in Stellarium"
            image-caption="The <b>angular distance measurement</b> plugin in Stellarium helps you measure distances between celestial objects."
            @open-image-modal="handleOpenImageModal"
          />
        </div>

        <div>
          <h4 class="article-body-sub-subheader" id="stellarium-full-guide">
            <a href="#stellarium-full-guide">Full guide</a>
          </h4>
          <p>
            I could write about Stellarium all day, but I will stop here. If you want to learn more about Stellarium and
            its features, I recommend checking out the
            <a href="https://stellarium.org/files/guide.pdf" target="_blank">official Stellarium guide</a>. It is a
            complete resource that covers all aspects of the application.
          </p>
        </div>
      </div>
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
import markdownContent from "./content.md";
import { calculateReadingTime } from "@/utils.js";

// Images
import coverImage from "./coverImage.svg";
import stellariumMilkyWay from "./stellarium_milky_way.jpeg";
import stellariumClickObjectInformation from "./stellarium_click_object_information.svg";
import whatsUpTodayStellarium from "./whats_up_today_stellarium.jpeg";
import phenomenaStellarium from "./phenomena_tab_stellarium.jpeg";
import eclipsesStellarium from "./eclipses_stellarium.jpeg";
import imageSensorFrameStellarium from "./image_sensor_frame_stellarium.jpeg";
import skyCultureStellarium from "./sky_culture_stellarium.svg";
import bortle1VsBortle9Skies from "./bortle_1_vs_bortle_9_skies.svg";
import skyWithAndWithoutAtmosphere from "./sky_with_and_without_atmosphere.svg";
import skyAndViewingWindow from "./sky_and_viewing_window.jpeg";
import angularDistanceMeasurementPlugin from "./angular_distance_measurement_plugin.svg";
import pluginsTabStellarium from "./plugins_tab_stellarium.jpeg";

// Components
import ArticleLayout from "@/components/ArticleLayout.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import InlineCode from "@/components/InlineCode.vue";

export default {
  name: "FreePlanetariumApps",
  emits: ["show-toast", "article-read"],
  components: {
    ArticleLayout,
    ImageWithCaption,
    ImageEnlarger,
    InlineCode,
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
  },
  data() {
    return {
      tags: ["Astronomy", "Planetarium", "Stellarium", "Sky Tonight", "SkySafari"],
      readingTime: 0,
      markdownContent,
      enlargedImageSrc: "",
      isImageModalVisible: false,

      coverImage,
      stellariumMilkyWay,
      stellariumClickObjectInformation,
      whatsUpTodayStellarium,
      phenomenaStellarium,
      eclipsesStellarium,
      imageSensorFrameStellarium,
      skyCultureStellarium,
      bortle1VsBortle9Skies,
      skyWithAndWithoutAtmosphere,
      skyAndViewingWindow,
      angularDistanceMeasurementPlugin,
      pluginsTabStellarium,
    };
  },
  mounted() {
    document.title = "Learn the night sky with free planetarium applications";
    this.readingTime = calculateReadingTime(this.$refs);
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
