<template>
  <div class="about-me-full-story-container">
    <section>
      <h1>Read my story</h1>

      <div>
        <p>
          I was born in
          <b><a href="https://en.wikipedia.org/wiki/Meknes" target="_blank">Meknes</a>, Morocco, in 2001</b>. My early
          childhood was simple. Back then, computers and phones were not common, so I spent most of my time outside,
          playing football and other traditional Moroccan street games with my friends in the streets.
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
          My academic journey started in <b>2016</b> when I joined <b>Lycee (high school in French) Moulay Ismail</b>.
          At this school, science classes were taught in French, not Arabic like before. It was hard at first, but I got
          used to it quickly. I spent 3 years there, studying
          <a href="https://en.wikipedia.org/wiki/Electrical_engineering" target="_blank">Electrical Engineering</a>.
        </p>
        <ImageWithCaption
          :image-src="moulayIsmailUpClose"
          image-alt="Lycee Moulay Ismail Up Close"
          image-caption="A photo of Lycee Moulay Ismail, the high school I attended in Meknes, Morocco."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          I really enjoyed learning about
          <a href="https://en.wikipedia.org/wiki/Electricity_generation" target="_blank">how electricity is made</a>,
          <a href="https://en.wikipedia.org/wiki/Electric_power_transmission" target="_blank">how it travels</a> to our
          homes and factories, and how it powers everything we use. We also learned how computers work, including
          digital logic, microcontrollers, and how to write programs in
          <a href="https://en.wikipedia.org/wiki/Assembly_language" target="_blank">assembly language</a>. We did not
          spend too much time on programming because the focus was more on hardware and electrical systems.
        </p>
        <p>
          In <b>2019</b>, I graduated from high school and wanted to study
          <a href="https://en.wikipedia.org/wiki/Computer_science" target="_blank">Computer Science</a>, but since my
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
          >, <a href="https://en.wikipedia.org/wiki/Signal_processing" target="_blank">signal processing</a>,
          <a href="https://en.wikipedia.org/wiki/Induction_motor" target="_blank">induction motors</a>,
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
          During my time at ESTM, I also learned the
          <a href="https://en.wikipedia.org/wiki/C_(programming_language)" target="_blank">C programming language</a>.
          We didn't build anything big with it, we just used it to solve programming challenges and practice
          problem-solving skills. Two years have passed and I graduated in <b>2021</b> with a DUT (Diplome Universitaire
          de Technologie) in Electrical Engineering.
        </p>
        <p>
          After that, I joined <a href="http://www.ensam-umi.ac.ma/" target="_blank">ENSAM</a> (Ecole Nationale
          Superieure d'Arts et Metiers) in Meknes to pursue a 3-year engineering degree in
          <a href="https://en.wikipedia.org/wiki/Industrial_engineering" target="_blank">Industrial Engineering</a>,
          <a href="https://en.wikipedia.org/wiki/Artificial_intelligence" target="_blank">AI</a>
          & <a href="https://en.wikipedia.org/wiki/Data_science" target="_blank">Data Science</a>.
        </p>
      </div>

      <div>
        <h3>ENSAM - Ecole Nationale Superieure d'Arts et Metiers</h3>
        <p>
          After studying Electrical Engineering for 5 years, I wanted to learn something new and exciting. That's why I
          chose to specialize in Industrial Engineering, AI & Data Science. It was a tough decision because I had to
          deal with subjects like
          <a href="https://en.wikipedia.org/wiki/Thermodynamics" target="_blank">thermodynamics</a>,
          <a href="https://en.wikipedia.org/wiki/Materials_science" target="_blank">materials science</a>, and
          <a href="https://en.wikipedia.org/wiki/Welding" target="_blank">welding</a> - stuff I didn't find interesting.
          But I pushed through because I wanted to achieve my goal of becoming an
          <a href="https://en.wikipedia.org/wiki/Engineer" target="_blank">engineer</a>.
        </p>
        <ImageWithCaption
          :image-src="ensamUpClose"
          image-alt="ENSAM Up Close"
          image-caption="A photo of ENSAM, the engineering school I attended."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          I learned two more programming languages at ENSAM:
          <a href="https://en.wikipedia.org/wiki/Python_(programming_language)" target="_blank">Python</a> and
          <a href="https://en.wikipedia.org/wiki/Java_(programming_language)" target="_blank">Java</a>. We started with
          Java in the first year. I fell in love with it because I could use it to build Android apps, this was the
          first time I used a programming language to build something useful. In the last two years, we learned Python
          for data science and machine learning. I loved Python because it's easy to use and has lots of libraries that
          make complex things simple.
        </p>
        <p>
          In my final year before graduation, I did my internship in
          <a href="https://en.wikipedia.org/wiki/Strasbourg" target="_blank">Strasbourg</a>, France. This was the first
          time I left my city after living there for 22 years. I worked at a research lab called
          <a href="https://lineact.cesi.fr/en/" target="_blank">CESI Lineact</a>. The project was interesting because it
          combined <a href="https://en.wikipedia.org/wiki/Machine_learning" target="_blank">machine learning</a> with
          electrical engineering.
        </p>
        <p>
          I built a model that predicts how much energy a solar panel will produce. The model used historical data from
          buildings in Strasbourg. It had to handle many variables like the solar panel type, size, placement, and
          weather conditions. This work received the <b>first best paper award</b> at the
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
      <p>
        And that marked the end of my academic journey. From high school to earning an engineering degree, it was a
        challenging yet rewarding experience that shaped who I am today.
      </p>
    </section>

    <section>
      <h2>How I became a programmer</h2>

      <div>
        <h3>Assembly language</h3>
        <p>
          I got my first taste of programming at Lycee Moulay Ismail, where we used
          <a href="https://www.microchip.com/en-us/product/PIC16F877" target="_blank">PIC16F877</a> microcontrollers.
          Later, at ESTM, we worked with
          <a href="https://en.wikipedia.org/wiki/Motorola_68HC11" target="_blank">Motorola 68HC11</a> microcontrollers
          and programmed them in <b>assembly language</b>. Starting with assembly was tough, but it taught me how simple
          instructions can work together to build complex systems.
        </p>
        <p>
          Here is a program written in <b>Motorola 68HC11 assembly language</b> that I found on my hard drive. Back in
          the lab, we used to work on code like this all the time. Looking at it now, I honestly can’t make sense of it
          anymore! I had to ask an LLM to figure out that this program counts the number of positive, negative, and zero
          values in a block of memory.
        </p>
        <CodeBlock :code="assemblyCodeSnippet" language="asm" @show-toast="handleShowToastEvent" />
      </div>

      <div>
        <h3>The C programming language</h3>
        <p>
          When I studied at ESTM, I spent two years programming in <b>C</b>. I focused on solving difficult problems,
          and I found it easier to write code in <b>C</b> than in assembly. Even though I learned a lot, I didn't build
          any projects with <b>C</b>. We only used it for practice. Because of this, programming in <b>C</b> felt less
          rewarding to me compared to my earlier experience of seeing a microcontroller do what I told it to do.
        </p>
      </div>

      <div>
        <h3>Java</h3>
        <p>
          Everything changed when I started at ENSAM. In my first year, we learned <b>Java</b> and studied
          <a href="https://en.wikipedia.org/wiki/Object-oriented_programming" target="_blank"
            >OOP (Object Oriented Programming)</a
          >
          concepts while solving problems. I looked up YouTube tutorials to see what I could create with Java and
          discovered I could build Android apps, thanks to this
          <a
            href="https://www.youtube.com/watch?v=fis26HvvDII&list=PL22-qG2MGGhAqt-zr2_8nPX0rM-Ej1D2X&index=2"
            target="_blank"
            >course on freeCodeCamp</a
          >. I really enjoyed working with Java because I could finally make useful things. Here are some apps I built
          for myself.
        </p>

        <h4>Random ayah generator</h4>
        <p>
          I use this app every day before I go to
          <a href="https://en.wikipedia.org/wiki/Salah" target="_blank">pray</a>. For each prayer, you need to read a
          pair of verses (ayahs) from the <a href="https://en.wikipedia.org/wiki/Quran" target="_blank">Quran</a>, and
          this app helps me quickly find two random ayahs. Discovering new ayahs keeps things fresh and encourages me to
          explore different parts of the Quran more.
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
        <h4>DoCamp - RAG on mobile</h4>
        <p>
          I created this app to participate in the
          <a href="https://ai.google.dev/competition" target="_blank">Gemini API developer competition</a>. The name
          <b>DoCamp</b> is a combination of the words <b>Doc</b> and <b>Camp</b>. I used it to chat with my personal
          documents on my phone.
        </p>
        <p>
          I was motivated to build this app because I did not see anyone bring
          <a href="https://www.ibm.com/think/topics/retrieval-augmented-generation" target="_blank"
            >RAG (Retrieval-Augmented Generation)</a
          >
          to mobile, and I wanted to be the first to do it. The app is no longer maintained because the
          <a href="https://ai.google.dev/gemini-api/docs" target="_blank">Gemini API</a>
          changed multiple times and I did not have the time to keep up with it.
        </p>
        <p>
          The app uses <a href="https://gemini.google.com/app" target="_blank">Gemini</a> as the LLM and an
          <a href="https://aws.amazon.com/what-is/embeddings-in-machine-learning/">embedding model</a>
          from Google, both of them are accessed through the API. Now, we have open source models like
          <a href="https://ai.google.dev/gemma/docs/gemma-3n" target="_blank">Gemma3</a> and
          <a href="https://developers.googleblog.com/en/introducing-embeddinggemma/" target="_blank">EmbeddingGemma</a>
          that can be run locally on the phone, which is amazing. I will probably update the app to use these models in
          the future. In any case, you can find the app in this
          <a href="https://github.com/ImadSaddik/DoCamp" target="_blank">GitHub repository</a>.
        </p>
      </div>

      <div>
        <h3>Python</h3>
        <p>
          I started learning Python during my last two years at ENSAM while studying data science and machine learning.
          Python is perfect for these subjects, and it was easy for me to pick up since I already knew other programming
          languages.
        </p>
        <p>
          Python is simple to read and write, and it has lots of
          <a href="https://pypi.org/" target="_blank">helpful libraries</a>. You can build almost anything with it. I
          really enjoyed our school projects because, for the first time, we learned by working on real projects.
        </p>
      </div>

      <div>
        <h3>Web development</h3>
        <p>
          I first got into
          <a href="https://en.wikipedia.org/wiki/Web_development" target="_blank">web development</a> during my time at
          ENSAM while working on machine learning projects. Back then, I needed a way to showcase my models. Initially,
          I used <a href="https://streamlit.io/" target="_blank">Streamlit</a>, but a friend encouraged me to learn web
          development instead. He explained that it would give me more control over the interface and allow for greater
          customization.
        </p>
        <p>
          I took his advice and began learning web development from the ground up, without relying on any framework at
          first. I started by mastering the fundamentals of
          <a href="https://en.wikipedia.org/wiki/HTML" target="_blank">HTML</a>,
          <a href="https://en.wikipedia.org/wiki/CSS" target="_blank">CSS</a>, and
          <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>. With that knowledge, I
          built a website for each machine learning project I worked on during my studies.
        </p>
        <p>
          As for web frameworks, at first I didn’t really understand why they were needed. The same friend suggested I
          try
          <a href="https://react.dev/" target="_blank">React</a>, so I gave it a shot. I followed a few YouTube courses
          and experimented with it in my projects. However, I found React confusing at the time and decided to go back
          to using plain JavaScript.
        </p>
        <p>
          A few months later, during my internship, I was given a project to build a web app, this time using
          <a href="https://vuejs.org/" target="_blank">Vue.js</a>. To learn it, I followed this
          <a
            href="https://www.youtube.com/watch?v=Yg5zkd9nm6w&list=PL22-qG2MGGhAqt-zr2_8nPX0rM-Ej1D2X&index=11&t=1767s"
            target="_blank"
            >freeCodeCamp course</a
          >
          that also showed how to connect Vue with Python on the backend. Oh boy, I loved it! Vue.js made building web
          apps so much easier and a lot more fun.
        </p>
        <p>
          Now, with a few years of experience, I finally understand why I did not enjoy React. It was the
          <a href="https://legacy.reactjs.org/docs/introducing-jsx.html" target="_blank">JSX</a>. I like keeping HTML,
          CSS, and JavaScript separate, and that is exactly what Vue gives you: template, script, and style in one file.
          It honestly felt like it was made for me. And by the way, I prefer the
          <a href="https://guide.vueframework.com/api/options-api.html" target="_blank">Options API</a>.
        </p>
        <p>
          Another thing I really like about Vue is how simple
          <a href="https://en.wikipedia.org/wiki/State_management" target="_blank">state management</a> is. You can get
          a lot done with just a few lines of code. In React, on the other hand, you often end up writing tons of
          <a href="https://en.wikipedia.org/wiki/Boilerplate_code" target="_blank">boilerplate</a> just to manage state,
          and that quickly becomes a pain as the app grows bigger.
        </p>
      </div>
    </section>

    <section>
      <h2>Linux changed my life</h2>
      <div>
        <p>
          During my time at ESTM, I purchased my first laptop, which ran
          <a href="https://en.wikipedia.org/wiki/Windows_10" target="_blank">Windows 10</a>. The laptop was bulky, slow,
          and overheated a lot during the summer. Although I wasn't satisfied with it, I had no other option since I
          needed it for my studies. At that time, I had never heard of
          <a href="https://en.wikipedia.org/wiki/Linux" target="_blank">Linux</a>.
        </p>
        <p>
          Toward the end of my second year at ESTM, a random video popped up in my YouTube recommendations. While I
          can't recall the exact video, its message was something like,
          <InlineCode
            text="If you're using Windows, you should switch to
          Linux."
          />
          I watched the video and decided to give Linux a shot. I installed
          <a href="https://system76.com/pop/" target="_blank">Pop!_OS</a> on my laptop because the video mentioned it
          was user-friendly and had a Windows-like feel.
        </p>
        <p>
          Once I installed Pop!_OS, I was blown away by how fast and responsive my laptop became. From that point on, I
          never looked back. These days, I primarily use
          <a href="https://ubuntu.com/download" target="_blank">Ubuntu</a> as my operating system. I don't quite
          remember how I transitioned to it, but I did.
        </p>
      </div>

      <div>
        <p>
          Switching to Linux completely flipped my life. Back when I was on Windows, if you couldn’t buy software, you’d
          just
          <a href="https://en.wikipedia.org/wiki/Software_cracking" target="_blank">crack it</a>, especially in a
          country like Morocco. Even schools and universities were full of pirated programs, haha.
        </p>
        <p>
          But with Linux, everything is free and
          <a href="https://opensource.org/" target="_blank">open source</a>. I fell in love with this ecosystem where
          people share their work with the world, and it pushed me to start sharing my own stuff too.
        </p>
        <p>
          Back in school, I used to share my notes with classmates. I’ve always been a pretty organized person, so my
          notes were clean and easy to follow. People always hit me up right before exams (classic last-minute students,
          lol), and I was more than happy to share.
        </p>
        <p>
          Before graduating from ESTM, I launched a
          <a href="https://www.youtube.com/@e.eacademy1382/videos" target="_blank">YouTube channel</a> to teach
          Electrical Engineering topics. I was scared I’d forget everything since I was switching majors at ENSAM. Later
          on, I stopped posting because I wasn’t studying Electrical Engineering anymore and didn’t feel as confident
          teaching it.
        </p>
        <p>
          At ENSAM, I did the same thing but switched focus to programming and Linux. And that’s still what I
          <a href="https://www.youtube.com/@3CodeCampers" target="_blank">create content</a> about today.
        </p>
        <ImageWithCaption
          :image-src="myYouTubeChannel"
          image-alt="My YouTube Channel (3CodeCamp)"
          image-caption="A screenshot of my YouTube channel, 3CodeCamp."
          @open-image-modal="handleOpenImageModal"
        />
        <p>
          I also found a ton of inspiration from
          <a href="https://www.freecodecamp.org/" target="_blank">freeCodeCamp</a>, a channel where I learned so many
          new concepts myself. Later, I got the chance to collaborate with them and created courses on topics like
          <a
            href="https://www.youtube.com/watch?v=a4HBKEda_F8&list=PLMSb3cZXtIfoj0guEc9UV_oSEQmA4_hvs&index=2"
            target="_blank"
            >Elasticsearch</a
          >,
          <a
            href="https://www.youtube.com/watch?v=9Ge0sMm65jo&list=PLMSb3cZXtIfoj0guEc9UV_oSEQmA4_hvs&index=3&t=105s"
            target="_blank"
            >how to train LLMs from scratch</a
          >, and
          <a
            href="https://www.youtube.com/watch?v=8WBS0dT0h2I&list=PLMSb3cZXtIfoj0guEc9UV_oSEQmA4_hvs&index=4&t=1185s"
            target="_blank"
            >the evolution of the Transformer architecture</a
          >.
        </p>
        <ImageWithCaption
          :image-src="freeCodeCampContributions"
          image-alt="freeCodeCamp Contributions"
          image-caption="Few courses I created for freeCodeCamp."
          @open-image-modal="handleOpenImageModal"
        />
        <p>Thank you, <b>Linux</b>!</p>
      </div>
    </section>

    <section>
      <h2>I love the universe!</h2>

      <div>
        <p>
          My life isn’t only about programming and engineering, I also love
          <a href="https://en.wikipedia.org/wiki/Astronomy" target="_blank">astronomy</a>. It’s not a very common hobby
          here in Morocco, and honestly, I stumbled into it by pure chance.
        </p>
        <p>
          I remember one day, while waiting at a grocery store, I looked up and saw a bright dot in the sky. I was
          confused because the sun's light was still there. When I got home, I searched for what it was and discovered
          it was not a star, but <a href="https://en.wikipedia.org/wiki/Venus" target="_blank">Venus</a>, the evening
          star.
        </p>
        <ImageWithCaption
          :image-src="venusDuringSunset"
          image-alt="Venus During Sunset"
          image-caption="Venus shining during sunset at Meknes, Morocco <i>(dot added manually)</i>."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>
          That little moment kicked off my curiosity. I started researching more and more, and every day I learned
          something new that made me fall deeper in love with the
          <a href="https://en.wikipedia.org/wiki/Universe" target="_blank">universe</a>. This all happened during the
          start of the <a href="https://en.wikipedia.org/wiki/COVID-19" target="_blank">pandemic</a>, which for me was a
          blessing in disguise. I spent countless nights staring at the stars, just thinking about how massive the
          universe is.
        </p>
        <p>
          I learned to recognize
          <a href="https://en.wikipedia.org/wiki/Constellation" target="_blank">constellations</a>,
          <a href="https://en.wikipedia.org/wiki/Planet" target="_blank">planets</a>, and
          <a href="https://en.wikipedia.org/wiki/List_of_brightest_stars" target="_blank">bright stars</a>. While
          memorizing star names, I discovered that many of them have
          <a href="https://en.wikipedia.org/wiki/List_of_Arabic_star_names" target="_blank">Arabic origins</a>. That
          made me proud, because as an <a href="https://en.wikipedia.org/wiki/Arabs" target="_blank">Arab</a>, I
          realized how much my ancestors
          <a href="https://en.wikipedia.org/wiki/Astronomy_in_the_medieval_Islamic_world" target="_blank">
            contributed to astronomy</a
          >.
        </p>
        <p>
          Eventually, I bought a pair of binoculars so I could see things more closely. Through them, I spotted some of
          <a href="https://en.wikipedia.org/wiki/Moons_of_Jupiter" target="_blank">Jupiter’s moons</a>,
          <a href="https://en.wikipedia.org/wiki/Open_cluster" target="_blank">open clusters</a>, and even the
          <a href="https://en.wikipedia.org/wiki/Andromeda_Galaxy" target="_blank">Andromeda galaxy</a>. Later, during
          my end-of-studies internship in France, I finally got the chance to buy my first
          <a href="https://en.wikipedia.org/wiki/Telescope" target="_blank">telescope</a>.
        </p>
        <p>
          Owning a telescope was always a dream of mine, and I finally made it happen. I got a
          <a
            href="https://www.astroshop.eu/telescopes/skywatcher-dobson-telescope-n-130-650-heritage-flextube-dob/p,14966"
            target="_blank"
            >130/650 Dobsonian telescope</a
          >
          (130 mm <a href="https://en.wikipedia.org/wiki/Aperture" target="_blank">aperture</a>, 650 mm
          <a href="https://en.wikipedia.org/wiki/Focal_length" target="_blank">focal length</a>). It’s simple to use and
          shows amazing views of the night sky. With it, I’ve seen Jupiter’s bands, Saturn’s rings, and the craters of
          the Moon. Honestly, it was a magical experience I’ll never forget.
        </p>
        <ImageWithCaption
          :image-src="telescopeAndJupiterSaturnMoon"
          image-alt="Telescope and Jupiter, Saturn, and Moon"
          image-caption="My telescope alongside a photo I took of Jupiter, Saturn, and the Moon. The camera doesn’t capture their true beauty, they look much more stunning to the naked eye."
          @open-image-modal="handleOpenImageModal"
        />
      </div>

      <div>
        <p>
          I also got into <a href="https://en.wikipedia.org/wiki/Astrophotography" target="_blank">astrophotography</a>.
          At first, I was using just my phone, but later I bought a second-hand
          <a href="https://en.wikipedia.org/wiki/Canon_EOS_1300D" target="_blank">Canon 1300D</a> to take things
          further. Here’s one of my favorite shots of the
          <a href="https://en.wikipedia.org/wiki/Milky_Way" target="_blank">Milky Way</a> I captured with it in a
          <a href="https://en.wikipedia.org/wiki/Bortle_scale" target="_blank">bortle</a> class 3 area.
        </p>
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
        each day, working out, listening to
        <a href="https://en.wikipedia.org/wiki/Podcast" target="_blank">podcasts</a> (I use
        <a href="https://antennapod.org/" target="_blank">AntennaPod</a>, it is free and
        <a href="https://github.com/AntennaPod/AntennaPod" target="_blank">open source</a>), and stargazing. I also
        continue to share my knowledge and
        <a href="https://github.com/ImadSaddik" target="_blank">contribute to the open source community</a>. This mix of
        work and hobbies keeps my days interesting and helps me learn something new every day.
      </p>
      <p>
        If you’d like to connect, you can find me on
        <a href="https://github.com/ImadSaddik" target="_blank">GitHub</a>,
        <a href="https://www.linkedin.com/in/imadsaddik/" target="_blank">LinkedIn</a>, or send me an
        <a href="mailto:simad3647@gmail.com">email</a>. I like meeting new people, don't hesitate to reach out!
      </p>

      <ImageWithCaption
        :image-src="sombreroGalaxy"
        image-alt="Sombrero Galaxy"
        image-caption="My favorite galaxy, the <a href='https://en.wikipedia.org/wiki/Sombrero_Galaxy' target='_blank'>Sombrero galaxy</a>."
        @open-image-modal="handleOpenImageModal"
      />
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
import InlineCode from "@/components/InlineCode.vue";

// Images
import myYouTubeChannel from "@/assets/my_youtube_channel.png";
import freeCodeCampContributions from "@/assets/free_code_camp_contributions.svg";
import venusDuringSunset from "@/assets/venus_shining_during_sunset.svg";
import telescopeAndJupiterSaturnMoon from "@/assets/telescope_and_jupiter_saturn_moon.jpeg";
import milkyWayWideFieldShot from "@/assets/milky_way_wide_field_shot.jpeg";
import randomAyahGeneratorScreenshots from "@/assets/random_ayah_generator_screenshots.svg";
import meLookingAtSunset from "@/assets/me_looking_at_sunset_ai.jpeg";
import moulayIsmailUpClose from "@/assets/moulay_ismail_up_close.jpeg";
import estmUpClose from "@/assets/estm_up_close.jpeg";
import ensamUpClose from "@/assets/ensam_up_close.jpeg";
import bestPaperAward from "@/assets/best_paper_award.jpeg";
import sombreroGalaxy from "@/assets/sombrero_galaxy.jpeg";

export default {
  name: "AboutMeFullStory",
  emits: ["page-visited", "show-toast"],
  components: {
    ImageWithCaption,
    ImageEnlarger,
    CodeBlock,
    InlineCode,
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
      randomAyahGeneratorScreenshots,
      meLookingAtSunset,
      moulayIsmailUpClose,
      estmUpClose,
      ensamUpClose,
      bestPaperAward,
      sombreroGalaxy,

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

h4 {
  margin: var(--gap-sm) 0;
  font-size: var(--font-size-small);
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
