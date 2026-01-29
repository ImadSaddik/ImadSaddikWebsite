<template>
  <ArticleLayout
    :title="title"
    sub-title="Secure your server by blocking incoming traffic and banning brute-force attackers."
    creation-date="January 29, 2026"
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
        Right now, your server is like a house with the front door locked (SSH keys) but every window wide open. By
        default, a fresh Linux server accepts connections on any port. This is not ideal.
      </p>
      <p>
        In this section, you will configure a firewall to block all incoming traffic by default, allowing only the
        connections you explicitly trust, using <strong>UFW</strong> (Uncomplicated Firewall). You will also install
        <strong>Fail2Ban</strong> to automatically ban bots that try to guess your SSH keys.
      </p>

      <AdmonitionBlock title="Important" type="warning">
        <p>
          Throughout this guide, you will see text inside angle brackets like <InlineCode text="<your_username>" /> or
          <InlineCode text="<your_server_ip>" />. These are <strong>placeholders</strong>. You must replace them with
          your actual values and <strong>remove the brackets</strong> when running the commands.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="configure-the-firewall" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#configure-the-firewall">Configure the firewall</a>
      </h2>
      <p>
        Ubuntu comes with a tool called <strong>UFW</strong> (Uncomplicated Firewall). It is designed to be easy to use
        while providing robust security.
      </p>
      <p>Check the current status of your firewall.</p>
      <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        It should say <InlineCode text="Status: inactive" />. Before you activate it, you must explicitly allow SSH
        connections.
      </p>

      <AdmonitionBlock title="Important" type="warning">
        <p>
          If you enable the firewall without allowing SSH first, you will lock yourself out of the server immediately.
        </p>
      </AdmonitionBlock>

      <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now that SSH is allowed, you can safely enable the firewall.</p>
      <CodeBlock :code="bashCodeSnippet3" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        The system will warn you that this command might disrupt existing SSH connections. Type
        <InlineCode text="y" /> and hit <InlineCode text="Enter" />.
      </p>
      <CodeOutput :code-output="codeOutput1" />

      <p>Verify the status again to see the active rules.</p>
      <CodeBlock :code="bashCodeSnippet4" language="bash" @show-toast="handleShowToastEvent" />

      <p>The output gives you a detailed list. Pay close attention to the Default policy and the ALLOW IN rules.</p>
      <CodeOutput :code-output="codeOutput2" />

      <p>Here is how to interpret this output:</p>
      <BulletPoint>
        <strong>Default: deny (incoming)</strong>: This is the most important rule. It means every single port on your
        server is blocked unless you explicitly allow it.
      </BulletPoint>
      <BulletPoint>
        <strong>ALLOW IN</strong>: These are your exceptions. Right now, you are only allowing traffic for SSH (port
        22).
      </BulletPoint>

      <AdmonitionBlock title="Note" type="info">
        <p>
          Later in the guide, when you install the web server
          <a href="https://nginx.org/" target="_blank">(Nginx)</a>, you will come back here to open ports
          <a href="https://en.wikipedia.org/wiki/Port_%28computer_networking%29#Common_port_numbers" target="_blank"
            >80 (HTTP)</a
          >
          and
          <a href="https://en.wikipedia.org/wiki/Port_%28computer_networking%29#Common_port_numbers" target="_blank"
            >443 (HTTPS)</a
          >. For now, keeping them closed is safer.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="protect-ssh-with-fail2ban" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#protect-ssh-with-fail2ban">Protect SSH with Fail2Ban</a>
      </h2>
      <p>
        If you check your authentication logs (<InlineCode text="/var/log/auth.log" />), you will likely see a stream of
        failed login attempts. These are automated bots scanning the internet, trying to guess passwords for common
        usernames like <InlineCode text="admin" />, <InlineCode text="root" />, or <InlineCode text="test" />.
      </p>
      <p>Here is a real example from my own server logs:</p>
      <CodeOutput :code-output="codeOutput3" />

      <p>
        Even though they cannot get in (because you disabled password authentication), they waste your server's CPU and
        fill up your disk space with logs.
      </p>
      <p>
        To stop this, install <a href="https://github.com/fail2ban/fail2ban" target="_blank">Fail2Ban</a>. This tool
        monitors your logs in real-time. If an IP address fails to log in too many times, Fail2Ban instantly updates the
        firewall to block that IP completely.
      </p>

      <ImageWithCaption
        :image-src="fail2BanIllustration"
        image-alt="How Fail2Ban turns log entries into firewall rules"
        image-caption="How Fail2Ban turns log entries into firewall rules."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Fail2Ban is available in Ubuntu's default repositories. Install it with this command:</p>
      <CodeBlock :code="bashCodeSnippet5" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        By default, Fail2Ban only bans attackers for 10 minutes. This is often too short; persistent bots will just come
        back later. To increase this to 1 day, create a local configuration file.
      </p>

      <AdmonitionBlock title="Important" type="warning">
        <p>
          Never edit the <InlineCode text=".conf" /> file directly, as system updates will overwrite it. Always use a
          <InlineCode text=".local" /> file for your customizations.
        </p>
      </AdmonitionBlock>

      <p>Create the file using nano.</p>
      <CodeBlock :code="bashCodeSnippet6" language="bash" @show-toast="handleShowToastEvent" />

      <p>Paste the following configuration:</p>
      <CodeBlock :code="fileContentSnippet1" language="ini" @show-toast="handleShowToastEvent" />

      <p>Here is what these settings do:</p>
      <BulletPoint> <InlineCode text="enabled" />: Turns on protection for SSH. </BulletPoint>
      <BulletPoint> <InlineCode text="bantime" />: Bans the IP for 1 day. </BulletPoint>
      <BulletPoint> <InlineCode text="maxretry" />: Allows a user to fail 5 times before being banned. </BulletPoint>
      <BulletPoint>
        <InlineCode text="findtime" />: The window of time (10 minutes) in which those 5 failures must occur to trigger
        a ban.
      </BulletPoint>

      <p>
        Save and exit (<InlineCode text="Ctrl+O" />, <InlineCode text="Enter" />, <InlineCode text="Ctrl+X" />). Restart
        the Fail2Ban service for the new configuration to take effect:
      </p>
      <CodeBlock :code="bashCodeSnippet7" language="bash" @show-toast="handleShowToastEvent" />

      <p>Once installed, enable the service to start automatically when the server reboots.</p>
      <CodeBlock :code="bashCodeSnippet8" language="bash" @show-toast="handleShowToastEvent" />

      <p>You can verify your new ban time (86400 seconds = 24 hours) with this command:</p>
      <CodeBlock :code="bashCodeSnippet9" language="bash" @show-toast="handleShowToastEvent" />

      <p>To see if the tool is working, check the status of the SSH jail.</p>
      <CodeBlock :code="bashCodeSnippet10" language="bash" @show-toast="handleShowToastEvent" />

      <p>The output will look like this:</p>
      <CodeOutput :code-output="codeOutput4" />

      <p>
        If you see IPs in the "Banned IP list", it means the tool is working. That specific IP from the logs is now
        blocked and can no longer connect to the server.
      </p>
    </section>

    <section>
      <h2 id="recovery-console" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#recovery-console">Recovery console</a>
      </h2>
      <p>
        What happens if you make a mistake? For example, if you accidentally run <InlineCode text="ufw enable" /> before
        allowing OpenSSH, or if you configure SSH keys incorrectly and lose access to your private key.
      </p>
      <p>
        If you get locked out, DigitalOcean provides a Recovery Console. This feature gives you direct access to the
        machine through your browser, bypassing SSH entirely.
      </p>
      <OrderedList>
        <OrderedItem> Go to the DigitalOcean dashboard and click on your project. </OrderedItem>
        <OrderedItem> Click the name of your droplet to open its details. </OrderedItem>
        <OrderedItem> Click on the <strong>Access</strong> button in the left sidebar. </OrderedItem>
        <OrderedItem> Click <strong>Launch Recovery Console</strong>. </OrderedItem>
      </OrderedList>

      <ImageWithCaption
        :image-src="clickDroplet"
        image-alt="Accessing the Recovery Console from the DigitalOcean dashboard"
        image-caption="Access the Recovery Console from the DigitalOcean dashboard."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Once the console opens, you will need to log in.</p>

      <AdmonitionBlock title="Warning" type="warning">
        <p>
          The Recovery Console requires a password to log in. If you created your user without a password, or if you
          forgot it, you will need to reset the root password first using the "Reset Root Password" button on the same
          Access page.
        </p>
      </AdmonitionBlock>

      <p>
        The keyboard mapping in the Recovery Console can be tricky. It is a good idea to type your password in the
        username field first just to see if the characters match what you are pressing, then delete it and log in
        properly.
      </p>

      <ImageWithCaption
        :image-src="launchRecoveryConsole"
        image-alt="The Recovery Console login screen"
        image-caption="The Recovery Console login screen."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Once you are logged in, you can run the missing command to fix the issue. For example, if you forgot to allow
        SSH:
      </p>
      <CodeBlock :code="bashCodeSnippet11" language="bash" @show-toast="handleShowToastEvent" />

      <p>After fixing the issue, close the browser window and try to SSH from your terminal again.</p>
      <CodeBlock :code="bashCodeSnippet12" language="bash" @show-toast="handleShowToastEvent" />
    </section>

    <section>
      <h2 id="conclusion" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#conclusion">Conclusion</a>
      </h2>
      <p>
        Your foundation is solid. You have a secure server that blocks unauthorized traffic and automatically bans
        attackers. By combining <strong>UFW</strong> for port management and <strong>Fail2Ban</strong> for automated
        intrusion prevention, you have significantly reduced your server's attack surface.
      </p>
      <p>
        Security is an ongoing process. Keep your system updated, monitor your logs occasionally, and always follow the
        principle of least privilege when opening new ports or services.
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
import * as codeSnippets from "./codeSnippets.js";
import markdownContent from "./content.md";

// Images
import coverImage from "./coverImage.svg";
import fail2BanIllustration from "./1_fail2ban_firewall_rules_illustration.svg";
import clickDroplet from "./2_click_droplet_digital_ocean.png";
import launchRecoveryConsole from "./3_launch_recovery_console.png";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import BulletPoint from "@/components/BulletPoint.vue";
import OrderedList from "@/components/OrderedList.vue";
import OrderedItem from "@/components/OrderedItem.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "HowToConfigureFirewallUfwFail2banUbuntu",
  components: {
    CodeBlock,
    CodeOutput,
    ImageEnlarger,
    InlineCode,
    ArticleLayout,
    AdmonitionBlock,
    ImageWithCaption,
    BulletPoint,
    OrderedList,
    OrderedItem,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to configure a firewall with UFW and Fail2Ban";

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
      tags: ["Security", "UFW", "Fail2Ban", "Ubuntu", "Firewall"],
      markdownContent,

      // Images
      coverImage,
      fail2BanIllustration,
      clickDroplet,
      launchRecoveryConsole,

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
