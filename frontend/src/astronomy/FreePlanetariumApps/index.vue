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
        <a class="clickable-header-link" href="#introduction">Introduction</a>
      </h2>
      <p>
        <a href="https://en.wikipedia.org/wiki/Planetarium_software" target="_blank">Planetarium</a> applications helped
        me learn a lot about the universe. I read stories about
        <a href="https://en.wikipedia.org/wiki/Constellation" target="_blank">constellations</a>, stars, and planets. I
        memorized the names of the brightest stars. I learned how to read astronomical data like
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
        <a class="clickable-header-link" href="#computer-applications">Computer applications</a>
      </h2>

      <div>
        <div>
          <h3 class="article-body-subheader" id="stellarium">
            <a class="clickable-header-link" href="#stellarium">Stellarium</a>
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
            <a class="clickable-header-link" href="#stellarium-object-information">Object information</a>
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
            <a class="clickable-header-link" href="#stellarium-whats-up-today">What's up today</a>
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
            <a class="clickable-header-link" href="#stellarium-phenomena">Phenomena</a>
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
            <a class="clickable-header-link" href="#stellarium-eclipses">Eclipses</a>
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
            <a class="clickable-header-link" href="#stellarium-image-sensor-frame">Image sensor frame</a>
          </h4>
          <p>
            For astrophotographers, the <InlineCode text="Image sensor frame" /> feature is extremely useful. It allows
            you to simulate the field of view of your camera and telescope setup, so you can see exactly what portion of
            the sky will be captured in your images.
          </p>
          <p>
            You can select your sensor type, and the tool will display details such as the sensor's dimensions,
            <a href="https://en.wikipedia.org/wiki/Pixel_binning" target="_blank">binning</a>, X and Y scale, and
            rotation angle. You can also choose your telescope and lens configuration, including
            <a href="https://en.wikipedia.org/wiki/Telecompressor" target="_blank">focal reducers</a> or
            <a href="https://en.wikipedia.org/wiki/Extension_tube" target="_blank">extenders</a>, and see the resulting
            field of view and multiplicity.
          </p>
          <p>
            This makes it easy to plan your
            <a href="https://en.wikipedia.org/wiki/Astrophotography" target="_blank">astrophotography</a> sessions and
            ensure your target fits perfectly within your camera's frame.
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
            <a class="clickable-header-link" href="#stellarium-sky-culture">Sky culture</a>
          </h4>
          <p>
            Stellarium supports a variety of
            <a href="https://en.wikipedia.org/wiki/Cultural_astronomy" target="_blank">sky cultures</a>, allowing you to
            view the night sky as interpreted by different cultures around the world. You can choose from a wide range
            of cultural sky representations.
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
            <a class="clickable-header-link" href="#stellarium-simulating-sky-conditions">Simulating sky conditions</a>
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
            <InlineCode text="Atmosphere visualization" /> checkbox. For more options, click the
            <i class="fa-solid fa-wrench"></i> icon next to it to adjust temperature, pressure, and other parameters.
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
            <a class="clickable-header-link" href="#stellarium-plugins">Plugins</a>
          </h4>
          <p>
            Because Stellarium is open source, it offers a wide range of plugins that add extra features to the
            application. You can find plugins that add
            <a href="https://en.wikipedia.org/wiki/Quasar" target="_blank">quasars</a>,
            <a href="https://en.wikipedia.org/wiki/Pulsar" target="_blank">pulsars</a>, simulate periodic
            <a href="https://en.wikipedia.org/wiki/Meteor_shower" target="_blank">meteor showers</a>, and much more.
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
            For example, I enabled a plugin that measures
            <a class="clickable-header-link" href="https://en.wikipedia.org/wiki/Angular_distance" target="_blank"
              >angular distances</a
            >
            between objects in the sky. After restarting Stellarium, I could use this plugin by clicking on the
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
            <a class="clickable-header-link" href="#stellarium-full-guide">Full guide</a>
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

    <section>
      <h2 class="article-body-header" id="mobile-applications">
        <a class="clickable-header-link" href="#mobile-applications">Mobile applications</a>
      </h2>
      <p>
        I have used many planetarium applications on my phone over the years. Currently, I only use
        <InlineCode text="Sky Tonight" /> and <InlineCode text="SkySafari Legacy" />. Unfortunately, I can't discuss
        SkySafari Legacy because it is no longer available for download. The other SkySafari versions are paid, and in
        this article, I only cover free applications that I use.
      </p>

      <div>
        <h3 class="article-body-subheader" id="sky-tonight">
          <a class="clickable-header-link" href="#sky-tonight">Sky Tonight</a>
        </h3>
        <ImageWithCaption
          :image-src="scorpiusSkyTonight"
          image-alt="Scorpius in Sky Tonight"
          image-caption="A view of the Scorpius constellation as seen from Sky Tonight."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          <InlineCode text="Sky Tonight" /> is a free planetarium application developed by
          <a href="https://vitotechnology.com/" target="_blank">Vito Technology</a> and is available on both
          <a
            href="https://play.google.com/store/apps/details?id=com.vitotechnology.sky.tonight.map.star.walk&referrer=utm_source%3Dvitosite%26utm_medium%3Dsky-tonight%26utm_campaign%3Dproduct"
            target="_blank"
            >Android</a
          >
          and <a href="https://apps.apple.com/us/app/sky-tonight-stargazing-guide/id1570594940" target="_blank">iOS</a>.
          Vito Technology has also developed other applications, such as
          <a href="https://starwalk.space/en" target="_blank">Star Walk 2</a>, which I used previously. However, since
          the launch of Sky Tonight, I have switched to it.
        </p>
        <p>
          I love the graphics and user interface of Sky Tonight. The application has many features that I will discuss
          below.
        </p>
      </div>

      <div>
        <h4 class="article-body-sub-subheader" id="sky-tonight-calendar">
          <a class="clickable-header-link" href="#sky-tonight-calendar">Calendar</a>
        </h4>
        <p>To use the calendar feature, tap the <InlineCode text="calendar" /> icon on the main screen.</p>
        <ImageWithCaption
          :image-src="calendarButtonSkyTonight"
          image-alt="Calendar button in Sky Tonight"
          image-caption="The <b>calendar</b> button in Sky Tonight opens the calendar view."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          The calendar displays a list of interesting celestial events happening today, and you can also select any
          future date to see upcoming events for that day. Unlike Stellarium, you can't filter events by category or
          magnitude, but you can view all events by selecting a date.
        </p>
        <ImageWithCaption
          :image-src="skyTonightCalendar"
          image-alt="Calendar in Sky Tonight"
          image-caption="The calendar in Sky Tonight shows celestial events for the selected date."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          The calendar also shows <a href="https://en.wikipedia.org/wiki/Lunar_phase" target="_blank">moon phases</a>.
          When you tap on a date, you'll see detailed information about the moon phase for that day, including age,
          illumination, angular size, magnitude, rise and set times, and more.
        </p>
        <ImageWithCaption
          :image-src="skyTonightMoonPhases"
          image-alt="Moon phases in Sky Tonight"
          image-caption="Detailed information about the moon phase in Sky Tonight."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          There is a tab for meteor showers you can observe, and another tab that provides information about the sky,
          such as the length of the day, total darkness start and end times, and more.
        </p>
        <ImageWithCaption
          :image-src="skyTonightMeteorShowersAndSkyDetails"
          image-alt="Meteor showers and sky details in Sky Tonight"
          image-caption="The <b>meteor showers</b> and <b>sky details</b> tabs in Sky Tonight."
          @open-image-modal="handleOpenImageModal"
        />
        <p>You can also use the <InlineCode text="share" /> button to send calendar information to your friends.</p>
        <ImageWithCaption
          :image-src="skyTonightShareEvents"
          image-alt="Share events in Sky Tonight"
          image-caption="The <b>share</b> button in Sky Tonight allows you to share celestial event information."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h4 class="article-body-sub-subheader" id="sky-tonight-stargazing-index">
          <a class="clickable-header-link" href="#sky-tonight-stargazing-index">Stargazing index</a>
        </h4>
        <p>To use this feature, click on the telescope icon at the bottom of the screen in the main view.</p>
        <ImageWithCaption
          :image-src="visibleTonightIcon"
          image-alt="Visible Tonight icon in Sky Tonight"
          image-caption="The <b>Visible Tonight</b> icon in Sky Tonight."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          The <InlineCode text="Stargazing index" /> feature gathers information about the start and end of the night,
          the moon phase, light pollution, and the percentage of cloudiness. All of this data is combined to give you a
          final score from 0 to 100%. A higher score means better conditions for stargazing.
        </p>
        <ImageWithCaption
          :image-src="stargazingIndexInformation"
          image-alt="Stargazing index information in Sky Tonight"
          image-caption="The <b>Stargazing index</b> in Sky Tonight provides a score based on various factors affecting stargazing conditions."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          You can adjust the forecast horizon to see how the stargazing index changes over time. This is helpful for
          planning your stargazing sessions. You can choose between <InlineCode text="1 day" />,
          <InlineCode text="3 days" />, or <InlineCode text="7 days" />. When you select 3 days or 7 days, additional
          tabs appear, one for each day.
        </p>
        <ImageWithCaption
          :image-src="changeForecastHorizonStargazingIndex"
          image-alt="Change forecast horizon in Sky Tonight"
          image-caption="You can change the forecast horizon in the <b>Stargazing index</b> feature of Sky Tonight."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h4 class="article-body-sub-subheader" id="sky-tonight-stargazing-news">
          <a class="clickable-header-link" href="#sky-tonight-stargazing-news">Stargazing news</a>
        </h4>
        <p>
          The team behind Sky Tonight regularly publishes articles and quizzes about astronomy. You can find these by
          clicking the hamburger menu icon, then selecting the <InlineCode text="Stargazing news" /> option.
        </p>
        <p>They also create beautiful infographics. I really enjoy reading these articles and taking the quizzes.</p>
        <ImageWithCaption
          :image-src="stargazingNewsSteps"
          image-alt="Stargazing news in Sky Tonight"
          image-caption="The <b>Stargazing news</b> section in Sky Tonight provides articles and quizzes about astronomy."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3 class="article-body-subheader" id="other-applications">
          <a class="clickable-header-link" href="#other-applications">Other applications</a>
        </h3>
        <p>
          I have also used other planetarium applications like <InlineCode text="Star Walk 2" />,
          <InlineCode text="SkyView" />, and several others. While I no longer use them, they are still solid options.
          You can try them out and see which one you like best.
        </p>
      </div>
    </section>

    <section>
      <h2 class="article-body-header" id="conclusion">
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        Exploring the night sky is incredibly easy with free planetarium applications. Over time, I’ve tried many of
        these applications on both my computer and my phone, and each one has taught me something new about the
        universe.
      </p>
      <p>
        If you have not already, I encourage you to try some of these tools. You might be surprised by how much you can
        learn, and how much fun you will have just by looking up.
      </p>
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
import skyCultureStellarium from "./sky_culture_stellarium.jpeg";
import bortle1VsBortle9Skies from "./bortle_1_vs_bortle_9_skies.jpeg";
import skyWithAndWithoutAtmosphere from "./sky_with_and_without_atmosphere.jpeg";
import skyAndViewingWindow from "./sky_and_viewing_window.jpeg";
import angularDistanceMeasurementPlugin from "./angular_distance_measurement_plugin.svg";
import pluginsTabStellarium from "./plugins_tab_stellarium.jpeg";
import scorpiusSkyTonight from "./scorpius_sky_tonight.jpeg";
import calendarButtonSkyTonight from "./calendar_button_sky_tonight.svg";
import skyTonightCalendar from "./sky_tonight_calendar.jpeg";
import skyTonightMoonPhases from "./sky_tonight_moon_phases.jpeg";
import skyTonightMeteorShowersAndSkyDetails from "./sky_tonight_meteor_showers_and_sky_details.jpeg";
import skyTonightShareEvents from "./sky_tonight_share_events.jpeg";
import visibleTonightIcon from "./visible_tonight_icon.svg";
import stargazingIndexInformation from "./stargazing_index_information.svg";
import changeForecastHorizonStargazingIndex from "./change_forecast_horizon_stargazing_index.svg";
import stargazingNewsSteps from "./sky_tonight_stargazing_news_steps.svg";

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
      scorpiusSkyTonight,
      calendarButtonSkyTonight,
      skyTonightCalendar,
      skyTonightMoonPhases,
      skyTonightMeteorShowersAndSkyDetails,
      skyTonightShareEvents,
      visibleTonightIcon,
      stargazingIndexInformation,
      changeForecastHorizonStargazingIndex,
      stargazingNewsSteps,
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
