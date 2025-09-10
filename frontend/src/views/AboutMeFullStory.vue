<template>
  <div class="about-me-full-story-container">
    <section>
      <h1>Read my story</h1>

      <div>
        <p>
          I was born in <b>Meknes, Morocco, in 2001</b>. My early childhood was simple. Back then, computers and phones
          were not common, so I spent most of my time outside, playing football and other traditional Moroccan street
          games with my friends in the streets.
        </p>
        <p>
          I was a playful kid, but I learned early on to manage my time. My mom would not let me play until my homework
          was done, so I always finished my homework quickly to go play with my friends. This taught me to balance my
          responsibilities with my fun. This balance has stayed with me throughout my life.
        </p>
        <ImageWithCaption
          :image-src="meLookingAtSunset"
          image-alt="Me looking at the sunset"
          image-caption="A photo of me looking at the sunset. Edited with <a href='https://blog.google/intl/en-mena/product-updates/explore-get-answers/nano-banana-image-editing-in-gemini-just-got-a-major-upgrade/' target='_blank'>Nano banana</a> to remove other people from the scene."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2>My academic journey</h2>

      <div>
        <h3>Lycee Moulay Ismail</h3>
        <p>
          My academic journey started in <b>2016</b> when I joined <b>Lycee Moulay Ismail</b> (which means high school
          in French). At this school, science classes were taught in French, not Arabic like before. It was hard at
          first, but I got used to it quickly. I spent 3 years there, studying <b>Electrical Engineering</b>.
        </p>
        <ImageWithCaption
          :image-src="moulayIsmailUpClose"
          image-alt="Lycee Moulay Ismail Up Close"
          image-caption="A photo of Lycee Moulay Ismail, the high school I attended in Meknes, Morocco."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          I really enjoyed learning about how electricity is made, how it travels to our homes and factories, and how it
          powers everything we use. We also learned how computers work, including digital logic, microcontrollers, and
          how to write programs in <b>assembly language</b>. We did not spend too much time on programming because the
          focus was more on hardware and electrical systems.
        </p>
        <p>
          In <b>2019</b>, I graduated from high school and wanted to study <b>Computer Science</b>, but since my
          background was in Electrical Engineering, no school accepted me for that major. So, I chose to go to
          <b>ESTM</b>
          (Ecole Superieure de Technologie de Meknes), where I continued learning Electrical Engineering.
        </p>
      </div>

      <div>
        <h3>ESTM - Ecole Superieure de Technologie de Meknes</h3>
        <p>
          EST schools in Morocco focus on hands-on training to prepare students for specific jobs. The programs are
          shorter (2 years) and more practical than regular universities. At
          <a href="https://www.est.umi.ac.ma/" target="_blank">ESTM</a>, I learned about things like
          <a href="https://en.wikipedia.org/wiki/Digital-to-analog_converter" target="_blank">DAC</a>/<a
            href="https://en.wikipedia.org/wiki/Analog-to-digital_converter"
            target="_blank"
            >ADC</a
          >, signal processing, induction motors,
          <a href="https://en.wikipedia.org/wiki/Control_engineering" target="_blank">control engineering</a>, and much
          more.
        </p>
        <ImageWithCaption
          :image-src="estmUpClose"
          image-alt="ESTM Up Close"
          image-caption="A photo of ESTM , the school I attended for my higher education."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          During my time at ESTM, I also learned the <b>C</b> programming language. We didn't build anything big with
          it, we just used it to solve programming challenges and practice problem-solving skills. Two years have passed
          and I graduated in <b>2021</b> with a DUT (Diplome Universitaire de Technologie) in Electrical Engineering.
        </p>
        <p>
          After that, I joined <a href="http://www.ensam-umi.ac.ma/" target="_blank">ENSAM</a> (Ecole Nationale
          Superieure d'Arts et Metiers) in Meknes to pursue a 3-year engineering degree in Industrial Engineering, AI &
          Data Science.
        </p>
      </div>

      <div>
        <h3>ENSAM - Ecole Nationale Superieure d'Arts et Metiers</h3>
        <p>
          After studying Electrical Engineering for 5 years, I wanted to learn something new and exciting. That's why I
          chose to specialize in Industrial Engineering, AI & Data Science. It was a tough decision because I had to
          deal with subjects like thermodynamics, materials science, and welding - stuff I didn't find interesting. But
          I pushed through because I wanted to achieve my goal of becoming an engineer.
        </p>
        <ImageWithCaption
          :image-src="ensamUpClose"
          image-alt="ENSAM Up Close"
          image-caption="A photo of ENSAM, the engineering school I attended."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          I learned two more programming languages at ENSAM: <b>Python</b> and <b>Java</b>. We started with Java in the
          first year. I fell in love with it because I could use it to build Android apps, this was the first time I
          used a programming language to build something useful. In the last two years, we learned Python for data
          science and machine learning. I loved Python because it's easy to use and has lots of libraries that make
          complex things simple.
        </p>
        <p>
          In my final year before graduation, I did my internship in Strasbourg, France. This was the first time I left
          my city after living there for 22 years. I worked at a research lab called
          <a href="https://lineact.cesi.fr/en/" target="_blank">CESI Lineact</a>. The project was interesting because it
          combined machine learning with electrical engineering.
        </p>
        <p>
          I built a model that predicts how much energy a solar panel will produce. The model used historical data from
          buildings in Strasbourg. It had to handle many variables like the solar panel type, size, placement, and
          weather conditions. This work received the first best paper award at the
          <a href="https://www.icrera.org/archieve2024/" target="_blank">ICRERA 2024 conference</a>.
          <a href="https://ieeexplore.ieee.org/document/10815288" target="_blank">Read the paper</a> if you are
          interested.
        </p>
        <ImageWithCaption
          :image-src="bestPaperAward"
          image-alt="Best Paper Award"
          image-caption="The first best paper award that I received at the ICRERA 2024 conference."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2>How I became a programmer</h2>

      <div>
        <p>
          After my simple childhood, I began studying Electrical Engineering. It was there that I had my first contact
          with programming. We learned to program microcontrollers using <b>assembly language</b>. It was tough, but I
          was hooked. I loved the idea of writing a set of instructions that could control a machine. It felt like I was
          learning how to think in a completely new way.
        </p>
        <p>
          Here is a sample program written in <b>Motorola 68HC11 Assembly Language</b>. Back in the lab, we used to work
          on code like this all the time. Looking at it now, I honestly can’t make sense of it anymore! I had to ask an
          LLM to figure out that this program counts the number of positive, negative, and zero values in a block of
          memory.
        </p>
        <CodeBlock :code="assemblyCodeSnippet" language="asm" @show-toast="handleShowToastEvent" />
      </div>

      <p>
        Later, I moved on to programming in <b>C</b>, where I focused on solving problems. But it was not until I
        discovered <b>Java</b> that I truly fell in love with programming. With Java, I was finally able to build useful
        things, like my first Android apps. Here are some of the apps I built.
      </p>

      <div>
        <h3>Random ayah generator</h3>
        <p>
          I use this app every day before I go to pray. For each prayer, you need to read a pair of verses (ayahs) from
          the Quran, and this app helps me quickly find two random ayahs. Discovering new ayahs keeps things fresh and
          encourages me to explore different parts of the Quran more.
          <a href="https://github.com/ImadSaddik/RandomAyahGenerator" target="_blank">Download it from GitHub</a> if you
          are interested.
        </p>
        <ImageWithCaption
          :image-src="randomAyahGeneratorScreenshots"
          image-alt="Random Ayah Generator Screenshots"
          image-caption="Screenshots of the Random Ayah Generator app I built."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <h3>DoCamp - RAG on mobile</h3>
        <p>
          I created this app to participate in the
          <a href="https://ai.google.dev/competition" target="_blank">Gemini API developer competition</a>. The name
          <b>DoCamp</b> is a combination of the words <b>Doc</b> and <b>Camp</b>. I used it to chat with my personal
          documents on my phone. I was motivated to build this app because I did not see anyone bring RAG
          (Retrieval-Augmented Generation) to mobile, and I wanted to be the first to do it. The app is no longer
          maintained because the Gemini API changed multiple times and I did not have the time to keep up with it.
        </p>
        <p>
          The app uses Gemini as the LLM and an embedding from Google, both of them are accessed through the API. Now,
          we have open source models like
          <a href="https://ai.google.dev/gemma/docs/gemma-3n" target="_blank">Gemma3</a> and
          <a href="https://developers.googleblog.com/en/introducing-embeddinggemma/" target="_blank">EmbeddingGemma</a>
          that can be run locally on the phone, which is amazing. I will probably update the app to use these models in
          the future. In any case, you can find the app in this
          <a href="https://github.com/ImadSaddik/DoCamp" target="_blank">GitHub repository</a>.
        </p>
      </div>
    </section>

    <section>
      <h2>Linux changed my life</h2>
      <p>
        During the last year at the <a href="https://www.est.umi.ac.ma/" target="_blank">High School of Technology</a>,
        I had a very slow PC that was running Windows 10. It was bad and hard to work with because it was slow and
        overheated a lot. It was in that year that I discovered <b>Linux</b>. A YouTube video introduced me to Ubuntu,
        and I immediately noticed how fast and light it was.
      </p>

      <div>
        <p>
          <b>Linux</b> changed my life for good. I was amazed by this ecosystem where everything is free and open, and
          that feeling alone made me want to share my own work with the world. I even found two free and open-source
          alternatives to <a href="https://www.mathworks.com/products/matlab.html" target="_blank">Matlab</a> called
          <a href="https://www.scilab.org/" target="_blank">Scilab</a> and
          <a href="https://octave.org/" target="_blank">Octave</a>, which I used to work on my school assignments.
        </p>
        <ImageWithCaption
          :image-src="approximatingSquareWaveFunction"
          image-alt="Approximating Square Wave Function with Fourier Transform"
          image-caption="A project I completed in Octave. I used Fourier Transform to approximate a square wave function."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2>Sharing knowledge with others</h2>

      <div>
        <p>
          My love for the open-source world, which started with Linux, made me believe that learning should be free. I
          was very happy that I got to attend high school for free in Morocco. This feeling inspired me to start my own
          journey of sharing knowledge. I created the <b>3CodeCamp</b> YouTube channel, where I began to share tutorials
          on programming and <b>Linux</b>.
        </p>
        <ImageWithCaption
          :image-src="myYouTubeChannel"
          image-alt="My YouTube Channel (3CodeCamp)"
          image-caption="A screenshot of my YouTube channel, 3CodeCamp."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>
          I also found a lot of inspiration from <b>freeCodeCamp</b>, a channel I used to learn a ton of new concepts
          myself. I decided to collaborate with them and have created courses on topics like <b>Elasticsearch</b>, how
          to train <b>LLMs from scratch</b>, and the evolution of the <b>Transformer architecture</b>.
        </p>
        <ImageWithCaption
          :image-src="freeCodeCampContributions"
          image-alt="freeCodeCamp Contributions"
          image-caption="Few courses I created for freeCodeCamp."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <p>
        During my studies, I also discovered <b>Python</b>, and it's a language that I use for everything now. I've used
        it to build many projects, and I love giving back to the community by contributing to open-source projects on
        <b>GitHub</b>.
      </p>
    </section>

    <section>
      <h2>My passion for the cosmos</h2>

      <div>
        <p>
          My life is not just about programming and engineering. The last thing I love doing is astronomy. I remember
          one day, while waiting at a grocery store, I looked up and saw a bright dot in the sky. I was confused because
          the sun's light was still there. When I got home, I searched for what it was and discovered it was not a star,
          but Venus, the evening star. From that moment, I was hooked.
        </p>
        <ImageWithCaption
          :image-src="venusDuringSunset"
          image-alt="Venus During Sunset"
          image-caption="Venus shining during sunset <i>(dot added manually)</i>."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>
          Because of the pandemic, I spent a lot of time at home and used that time to learn about constellations, star
          names, and even astrophysics on my own. It was a new world for me.
        </p>
      </div>

      <div>
        <p>
          I was so passionate that during my internship in France, I bought my first telescope. It was a breathtaking
          experience to finally see Jupiter, Saturn and their moons up close.
        </p>
        <ImageWithCaption
          :image-src="telescopeAndJupiterSaturnMoon"
          image-alt="Telescope and Jupiter, Saturn, and Moon"
          image-caption="My telescope and a photo I took of Jupiter, Saturn, and the Moon."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>Now, with a camera, I also do astrophotography, capturing the Milky Way and other celestial objects.</p>
        <ImageWithCaption
          :image-src="milkyWayWideFieldShot"
          image-alt="Milky Way Wide Field Shot"
          image-caption="A wide field shot of the Milky Way I took in Oued Amlil, Morocco."
          @open-image-modal="handleOpenImageModal"
        />
      </div>
    </section>

    <section>
      <h2>What I do now</h2>
      <p>
        My life today is a balance of all the things I love. I try to juggle between programming, gaming for an hour
        each day, working out, listening to podcasts (I use
        <a href="https://antennapod.org/" target="_blank">AntennaPod</a>, it is free and
        <a href="https://github.com/AntennaPod/AntennaPod" target="_blank">open-source</a>), and stargazing. I also
        continue to share my knowledge and
        <a href="https://github.com/ImadSaddik" target="_blank">contribute to the open-source community</a>. This mix of
        work and hobbies keeps my days interesting and helps me learn something new every day.
      </p>
    </section>
  </div>

  <ImageEnlarger
    :is-visible="isImageModalVisible"
    :enlarged-image-src="enlargedImageSrc"
    @close-image-modal="handleCloseImageModal"
  />
</template>

<script>
// Constants
import { ABOUT_ME_PAGE_VISITED_KEY } from "@/constants.js";

// Components
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import CodeBlock from "@/components/CodeBlock.vue";

// Images
import myYouTubeChannel from "@/assets/my_youtube_channel.png";
import freeCodeCampContributions from "@/assets/free_code_camp_contributions.svg";
import venusDuringSunset from "@/assets/venus_shining_during_sunset.svg";
import telescopeAndJupiterSaturnMoon from "@/assets/telescope_and_jupiter_saturn_moon.jpeg";
import milkyWayWideFieldShot from "@/assets/milky_way_wide_field_shot.jpeg";
import approximatingSquareWaveFunction from "@/assets/approximating_square_wave_function_with_fourier_transform.gif";
import randomAyahGeneratorScreenshots from "@/assets/random_ayah_generator_screenshots.svg";
import meLookingAtSunset from "@/assets/me_looking_at_sunset_ai.jpeg";
import moulayIsmailUpClose from "@/assets/moulay_ismail_up_close.jpeg";
import estmUpClose from "@/assets/estm_up_close.jpeg";
import ensamUpClose from "@/assets/ensam_up_close.jpeg";
import bestPaperAward from "@/assets/best_paper_award.jpeg";

export default {
  name: "AboutMeFullStory",
  emits: ["page-visited", "show-toast"],
  components: {
    ImageWithCaption,
    ImageEnlarger,
    CodeBlock,
  },
  mounted() {
    document.title = "About Imad Saddik";
    this.$emit("page-visited", ABOUT_ME_PAGE_VISITED_KEY);
  },
  data() {
    return {
      myYouTubeChannel,
      freeCodeCampContributions,
      venusDuringSunset,
      telescopeAndJupiterSaturnMoon,
      milkyWayWideFieldShot,
      approximatingSquareWaveFunction,
      randomAyahGeneratorScreenshots,
      meLookingAtSunset,
      moulayIsmailUpClose,
      estmUpClose,
      ensamUpClose,
      bestPaperAward,

      enlargedImageSrc: "",
      isImageModalVisible: false,
      assemblyCodeSnippet: `org     $fe00

        ldx     #$0100
        clr     $0050
        clr     $0051
        clr     $0052
loopn   cpx     #$010a
        beq     fin
        ldaa    ,x
        bmi     negatif
        beq     null
        inc     $0052
        inx
        bra     loopn
null    inc     $0051
        inx
        bra     loopn
negatif inc     $0050
        inx
        bra     loopn
fin     swi
        org     $0100
        fcb     -16,-2,-3,-4,0,0,21,31,14,15
        end`,
    };
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

<style scoped>
p {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin: var(--gap-md) 0;
  line-height: 1.6;
}

h1 {
  font-size: var(--font-size-big);
  margin-top: 0;
  margin-bottom: var(--gap-md);
}

h2 {
  margin: var(--gap-md) 0;
  font-size: var(--font-size-big-medium);
}

h3 {
  margin: var(--gap-sm) 0;
  font-size: var(--font-size-medium);
}

img {
  width: 100%;
  height: auto;
  margin: 0;
}

.about-me-full-story-container {
  width: 50%;
  padding: var(--gap-xl);
  margin-top: var(--gap-xxl);
}
</style>
