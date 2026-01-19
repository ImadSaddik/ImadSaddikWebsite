<template>
  <ArticleLayout
    :title="title"
    sub-title="How to set up a secure environment on DigitalOcean (or others) with Ubuntu 24.04 LTS."
    creation-date="January 18, 2026"
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
        Before you deploy any code, you need a secure environment. We use DigitalOcean here, but these concepts apply to
        AWS EC2, Linode, or even a Raspberry Pi.
      </p>
      <p>
        By the end of this article, you will have a server running <InlineCode text="Ubuntu 24.04 LTS" />, accessed
        securely via SSH keys, with password authentication completely disabled.
      </p>

      <AdmonitionBlock title="Tip" type="tip">
        <p>Prefer video? Watch this article walkthrough:</p>
        <YouTubePlayer video-url="https://www.youtube.com/embed/e7Tz_YRfoCc" />
      </AdmonitionBlock>

      <AdmonitionBlock title="Warning" type="warning">
        <p>
          Throughout this guide, you will see text inside angle brackets like <InlineCode text="<your_username>" /> or
          <InlineCode text="<your_key_name>" />. These are <strong>placeholders</strong>. You must replace them with
          your actual values and <strong>remove the brackets</strong> when running the commands.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="create-the-project" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#create-the-project">Create the project</a>
      </h2>
      <p>
        In this guide, we use DigitalOcean to host your web application. If you don’t have an account,
        <a href="https://m.do.co/c/4f9010fc5eb3" target="_blank">create one here</a> to get
        <strong>$200 in free credit</strong>.
      </p>
      <p>
        After creating your account, create a project to hold your resources. Click on the
        <strong>New project</strong> button.
      </p>

      <ImageWithCaption
        :image-src="createNewProject"
        image-alt="Screenshot of DigitalOcean dashboard highlighting the New Project button"
        image-caption="The location of the <strong>+ New Project</strong> button on the DigitalOcean dashboard."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Give your project a name and a description. Choose a <strong>descriptive</strong> name so you can remember the
        purpose of the project later. I named mine "imad-saddik". Click on <strong>Create Project</strong> when you are
        done.
      </p>

      <ImageWithCaption
        :image-src="projectInfo1"
        image-alt="Screenshot of project creation form with name and description fields"
        image-caption="Give the project a name and a description."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        DigitalOcean will ask if you want to move resources to this project. Click <strong>Skip for now</strong> since
        you are starting from scratch.
      </p>

      <ImageWithCaption
        :image-src="projectInfo2"
        image-alt="Screenshot of move resources dialog with Skip for now button"
        image-caption="Skip this step because you don’t have any resources yet."
        @open-image-modal="handleOpenImageModal"
      />
    </section>

    <section>
      <h2 id="create-the-droplet" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#create-the-droplet">Create the droplet</a>
      </h2>
      <p>
        Now, create the virtual machine. In DigitalOcean, these are called "droplets". Click on
        <strong>Create</strong> in the top menu, then select <strong>droplets</strong>.
      </p>
      <p>
        A droplet is a Linux-based virtual machine that runs on virtualized hardware. This machine will host the code
        for your website.
      </p>

      <ImageWithCaption
        :image-src="createDroplet"
        image-alt="Screenshot of Create menu dropdown with Droplets option highlighted"
        image-caption="Click <strong>Create</strong>, then select <strong>droplets</strong> to start setting up your server."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Choose a <strong>Region</strong> where your VM will be hosted. Always select a region geographically near you or
        your target users. I live in Morocco, so I chose the Frankfurt (Germany) datacenter.
      </p>

      <ImageWithCaption
        :image-src="chooseRegion"
        image-alt="Screenshot of datacenter region selector showing various global locations"
        image-caption="Select the region where your droplet will be hosted."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Next, choose an <strong>Operating System</strong>. Linux is the standard for servers. Select
        <strong>Ubuntu 24.04 (LTS)</strong> because it is stable and well-supported.
      </p>

      <ImageWithCaption
        :image-src="chooseImage"
        image-alt="Screenshot of operating system selection with Ubuntu 24.04 LTS option"
        image-caption="Choose the operating system for your droplet."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Now you need to choose the size of your virtual machine. You can pick between <strong>shared CPU</strong> and
        <strong>dedicated CPU</strong>. Inside each option, you must decide how much <strong>RAM</strong>,
        <strong>disk space</strong>, and how many <strong>CPU cores</strong> you want.
      </p>
      <p>
        Dedicated VMs are more expensive because the resources are <strong>reserved only for you</strong>. Adding more
        RAM, disk space, or CPU cores will also increase the price.
      </p>
      <p>
        Fortunately, you can <strong>change the droplet size later</strong> if needed. For now, create a droplet with a
        shared CPU and the lowest resources. This costs <strong>$4 per month</strong>, and I will show you how to
        upgrade it later.
      </p>

      <ImageWithCaption
        :image-src="chooseSize"
        image-alt="Screenshot of droplet size options showing CPU, RAM, and storage configurations"
        image-caption="Select the droplet size that fits your needs."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        If you need more storage, click <strong>Add Volume</strong> and enter the size in GB. This feature is not free;
        it costs <strong>$1 per month per 10 GB</strong>. You can also enable automatic backups if you need them.
      </p>

      <ImageWithCaption
        :image-src="spaceAndBackup"
        image-alt="Screenshot of additional storage volume and backup configuration options"
        image-caption="Additional storage and backup options."
        @open-image-modal="handleOpenImageModal"
      />
    </section>

    <section>
      <h2 id="configure-authentication" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#configure-authentication">Configure authentication</a>
      </h2>
      <p>
        This is a critical security step. You can access your server using a <strong>password</strong> or an
        <strong>SSH key</strong>.
      </p>
      <p>Select <strong>SSH Key</strong> and click on the <strong>Add SSH Key</strong> button.</p>

      <ImageWithCaption
        :image-src="authentication"
        image-alt="Screenshot of authentication method selector with SSH Key option and Add SSH Key button"
        image-caption="Select SSH key for better security."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        <strong>Always use an SSH key.</strong> Passwords are vulnerable to brute-force attacks, whereas SSH keys are
        significantly more secure. Think of it like a real lock and key:
      </p>

      <BulletPoint>
        The <strong>public key</strong> is the lock. You put this on the server (the droplet). Anyone can see the lock,
        but that does not help them open the door.
      </BulletPoint>
      <BulletPoint>
        The <strong>private key</strong> is the physical key. You keep this on your computer. You never share it.
      </BulletPoint>

      <p>
        When you try to connect, the server checks if your "key" fits its "lock." If it does, you get in without a
        password.
      </p>

      <ImageWithCaption
        :image-src="sshKeysWork"
        image-alt="Diagram showing SSH key authentication flow between client and server"
        image-caption="How SSH keys verify your identity."
        @open-image-modal="handleOpenImageModal"
      />

      <p>The diagram above shows the conversation that happens between your computer and the server:</p>
      <ol>
        <li>
          <strong>SSH request</strong>: Your computer contacts the server and says, "I want to connect using this
          specific key ID".
        </li>
        <li>
          <strong>Challenge</strong>: The server is cautious. It sends back a random string of characters (called a
          <a href="https://en.wikipedia.org/wiki/Cryptographic_nonce" target="_blank">nonce</a>) and says, "Prove you
          own the private key by signing this random message".
        </li>
        <li>
          <strong>Send signature</strong>: Your computer takes that random message and "signs" it using your private
          key. This creates a unique digital signature that gets sent back to the server.
        </li>
        <li>
          <strong>The result</strong>: The server uses the public key (which you uploaded to it) to verify the
          signature. If the signature matches, the server knows you have the private key and grants access.
        </li>
      </ol>

      <p>
        To generate a key, open the terminal on your local computer. Use the
        <a href="https://en.wikipedia.org/wiki/EdDSA#Ed25519" target="_blank">Ed25519</a> algorithm, which is faster and
        more secure than the older RSA standard.
      </p>
      <CodeBlock :code="bashCodeSnippet1" language="bash" @show-toast="handleShowToastEvent" />

      <p>Here is what the arguments do:</p>
      <BulletPoint> <InlineCode text="-t ed25519" />: Specifies the modern Ed25519 algorithm. </BulletPoint>
      <BulletPoint>
        <InlineCode text="-f ~/.ssh/<your_key_name>" />: Saves the key with a specific name so you don’t overwrite your
        default keys.
      </BulletPoint>
      <BulletPoint> <InlineCode text="-C <key_comment>" />: Adds a comment to help you identify the key. </BulletPoint>

      <p>
        The system will ask you to add a <strong>passphrase</strong>. This is an extra password to protect your private
        key. If someone steals your private key file, they cannot use it without this passphrase.
      </p>

      <CodeOutput :code-output="codeOutput1" />

      <p>I strongly recommend adding a passphrase for your personal key.</p>
      lock down the
      <AdmonitionBlock title="Info" type="info">
        <p>
          If you need a key for a CI/CD pipeline later (to deploy code automatically), generate a separate key pair
          without a passphrase. Never remove the passphrase from your personal key.
        </p>
      </AdmonitionBlock>

      <p>You have generated the key pair. Now, copy the public key.</p>
      <CodeBlock :code="bashCodeSnippet2" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        The command displays your public key. Copy the entire text starting with <InlineCode text="ssh-ed25519" />.
        Paste it into the box, give it a name, and click <strong>Add SSH Key</strong>.
      </p>

      <ImageWithCaption
        :image-src="addingPublicKey"
        image-alt="Screenshot of adding SSH public key to DigitalOcean"
        image-caption="Add the public SSH key."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You can add more than one SSH key by clicking the <strong>New SSH Key</strong> button. This allows you to add a
        specific key for your CI without a passphrase, while keeping the one on your computer protected with a
        passphrase.
      </p>

      <ImageWithCaption
        :image-src="additionalSshKeys"
        image-alt="Screenshot showing multiple SSH keys added to droplet configuration"
        image-caption="Add multiple SSH keys."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You are almost done. Select <strong>Add improved metrics monitoring and alerting</strong> because it is free.
      </p>

      <ImageWithCaption
        :image-src="advancedOptions"
        image-alt="Screenshot of advanced options showing monitoring and alerting checkbox"
        image-caption="Select the free monitoring option."
        @open-image-modal="handleOpenImageModal"
      />
    </section>

    <section>
      <h2 id="finalize-and-connect" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#finalize-and-connect">Finalize and connect</a>
      </h2>
      <p>
        Give your droplet a name you can recognize, add tags, and assign it to the project you created. You can deploy
        multiple droplets, but for now, keep the quantity set to <strong>1 droplet</strong>.
      </p>

      <ImageWithCaption
        :image-src="finalStep"
        image-alt="Screenshot of droplet finalization form with hostname, tags, and project fields"
        image-caption="Give your droplet a name, tags, and assign it to a project."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Click on <strong>Create droplet</strong>. The site redirects you to the project page. Under
        <strong>Resources</strong>, you should see a <strong>green dot</strong> next to your droplet. This means it is
        running.
      </p>

      <ImageWithCaption
        :image-src="dropletInProject"
        image-alt="Screenshot of project resources page showing active droplet with green status indicator"
        image-caption="Ensure that the droplet is running and assigned to the project."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Later, if you find that this VM cannot handle the traffic, you can click on <strong>Upsize</strong> to add more
        resources.
      </p>

      <ImageWithCaption
        :image-src="upsizeDroplet"
        image-alt="Screenshot of droplet resize options showing CPU, RAM, and disk upgrade choices"
        image-caption="Increase resources by upsizing."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        You are now ready to connect to your VM. Find the <strong>IP address</strong> on the project page. Copy the IP
        address shown next to your droplet's name.
      </p>

      <ImageWithCaption
        :image-src="findIpAddress"
        image-alt="Screenshot highlighting the IP address field in the droplet overview"
        image-caption="Locate the IP address of the VM."
        @open-image-modal="handleOpenImageModal"
      />

      <p>
        Use the SSH command to connect to the machine. Pass your private key using the <InlineCode text="-i" /> flag and
        add your IP address after <InlineCode text="root@" />.
      </p>
      <CodeBlock :code="bashCodeSnippet3" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        A security warning appears about the authenticity of the host. Type <InlineCode text="yes" /> and hit
        <InlineCode text="Enter" /> to continue.
      </p>
      <CodeOutput :code-output="codeOutput2" />

      <p>
        Sometimes, the server is not fully ready even though the status says "Running". If you see a
        <strong>Connection closed</strong> message immediately after typing yes, don’t worry.
      </p>
      <p>If this happens, just wait a few seconds and run the SSH command again. It should work the second time.</p>
      <CodeOutput :code-output="codeOutput3" />

      <p>Once connected, you will see a welcome message similar to this:</p>
      <CodeOutput :code-output="codeOutput4" />

      <p>Update your VM packages by running the following commands:</p>
      <CodeBlock :code="bashCodeSnippet4" language="bash" @show-toast="handleShowToastEvent" />

      <AdmonitionBlock title="Warning" type="warning">
        <p>
          If you see a configuration screen during the update, select
          <strong>keep the local version currently installed</strong>. This option ensures you keep the working SSH
          configuration that DigitalOcean set up for you.
        </p>
      </AdmonitionBlock>

      <ImageWithCaption
        :image-src="opensshWarning"
        image-alt="Screenshot of dpkg configuration prompt asking to keep or replace sshd_config"
        image-caption="Handle the configuration conflict."
        @open-image-modal="handleOpenImageModal"
      />

      <p>Reboot the machine to complete the upgrade and start using the new kernel and packages.</p>
      <CodeBlock :code="bashCodeSnippet5" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        The connection will close, but you can connect via SSH to the server again after it reboots. If you want to exit
        the VM, type exit and hit <InlineCode text="Enter" /> or hit <InlineCode text="Ctrl+D" />.
      </p>
    </section>

    <section>
      <h2 id="create-a-non-root-user-and-configure-ssh-access" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#create-a-non-root-user-and-configure-ssh-access"
          >Create a non-root user and configure SSH access</a
        >
      </h2>
      <p>
        Running everything as <strong>root</strong> is dangerous. If you make a mistake, it might be unrecoverable.
        Also, if an attacker finds a vulnerability in your app while it is running as root, they gain full control of
        your server.
      </p>
      <p>Create a new user to act as a security barrier.</p>
      <CodeBlock :code="bashCodeSnippet6" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        It will ask you to set a password and fill in some details. You can skip the details by pressing
        <InlineCode text="Enter" />.
      </p>
      <CodeOutput :code-output="codeOutput5" />

      <p>
        Give the new user administrative privileges
        <a href="https://www.sudo.ws/news/" target="_blank">(sudo)</a>.
      </p>
      <CodeBlock :code="bashCodeSnippet7" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Now, log out of the server (<InlineCode text="exit" /> or <InlineCode text="Ctrl+D" />) and attempt to log in as
        your new user.
      </p>
      <CodeBlock :code="bashCodeSnippet8" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        You will get an error. This happens because the SSH key you authorized exists only in the
        <InlineCode text="root" /> user's <InlineCode text="authorized_keys" /> file. The new user (<InlineCode
          text="<your_username>"
        />) has an empty list. You need to copy the key from <InlineCode text="root" /> to
        <InlineCode text="<your_username>" />.
      </p>
      <CodeOutput :code-output="codeOutput6" />

      <p>Log back in as <strong>root</strong>.</p>
      <CodeBlock :code="bashCodeSnippet9" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Run these commands to copy the authorized keys to the new user. Copy the entire directory and preserve the
        strict root permissions using the <InlineCode text="--preserve=mode" /> flag.
      </p>
      <CodeBlock :code="bashCodeSnippet10" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, exit and try to log in as your new user again.</p>
      <CodeBlock :code="bashCodeSnippet11" language="bash" @show-toast="handleShowToastEvent" />

      <p>It should work now. You will see a prompt like this:</p>
      <CodeOutput :code-output="codeOutput7" />

      <p>
        Before you move on to the next step, you must verify that your new user can actually perform administrative
        tasks. If you disable root login and find out your user cannot use sudo, you will be locked out of your own
        server.
      </p>
      <CodeBlock :code="bashCodeSnippet12" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        If the command works, you will see the contents of the root directory. If you get an error saying your user is
        "not in the sudoers file", <strong>STOP</strong>. Do not disable root login until you fix the user permissions.
      </p>
      <p>From now on, you will stop using <InlineCode text="root" /> and use this account instead.</p>
    </section>

    <section>
      <h2 id="disable-root-ssh-access" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#disable-root-ssh-access">Disable root SSH access</a>
      </h2>
      <p>
        Now that your new user is set up, you should disable direct login for the root account. This reduces your attack
        surface.
      </p>
      <p>Open the SSH configuration file:</p>
      <CodeBlock :code="bashCodeSnippet13" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Find the line <InlineCode text="PermitRootLogin yes" /> and change it to <InlineCode text="no" />. Also, find
        the line <InlineCode text="PasswordAuthentication yes" /> and change it to <InlineCode text="no" />. This
        explicitly forces the server to use SSH keys and reject all password login attempts.
      </p>
      <AdmonitionBlock title="Tip" type="tip">
        <p>
          To search in nano, press <InlineCode text="Ctrl+W" />, type the search term, and hit
          <InlineCode text="Enter" />.
        </p>
      </AdmonitionBlock>
      <CodeBlock :code="fileContentSnippet1" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        Save the file by pressing <InlineCode text="Ctrl+O" /> (to write out/save), then exit nano with
        <InlineCode text="Ctrl+X" />. After that, restart the SSH service to apply the changes.
      </p>
      <CodeBlock :code="bashCodeSnippet14" language="bash" @show-toast="handleShowToastEvent" />

      <p>Now, exit the server.</p>
      <CodeBlock :code="bashCodeSnippet15" language="bash" @show-toast="handleShowToastEvent" />

      <p>Try to log in as <InlineCode text="root" />.</p>
      <CodeBlock :code="bashCodeSnippet16" language="bash" @show-toast="handleShowToastEvent" />

      <p>
        You should see a message indicating that authentication was rejected. Depending on your local SSH configuration,
        you will see one of these two errors:
      </p>
      <CodeOutput :code-output="codeOutput8" />

      <p>Both errors mean the same thing: The root account is now locked against remote login.</p>

      <AdmonitionBlock title="Info" type="info">
        <p>
          Setting <InlineCode text="PasswordAuthentication no" /> is optional because DigitalOcean already disabled
          password authentication when you created the droplet (assuming you selected SSH key authentication).
        </p>
        <p>
          However, it is good practice to set it manually. This ensures your server remains secure if you run your setup
          scripts on a different provider that does not create those default cloud settings.
        </p>
        <p>
          Unlike many Linux services where the "last configuration wins", SSH uses a "first match wins" rule. It applies
          the first value it finds for a setting and ignores the rest.
        </p>
        <p>DigitalOcean's default <InlineCode text="sshd_config" /> file includes this line at the very top:</p>
        <p><InlineCode text="Include /etc/ssh/sshd_config.d/*.conf" /></p>
        <p>
          This means SSH reads the files in the <InlineCode text=".d" /> folder before reading the rest of your main
          file. You can see this hidden rule by running:
        </p>
        <CodeBlock :code="bashCodeSnippet17" language="bash" @show-toast="handleShowToastEvent" />
        <p>You will see something like this:</p>
        <CodeOutput :code-output="codeOutput9" />
        <p>Because SSH sees this "no" first, it locks that setting in.</p>
        <p>
          So why did we edit the main file? We edit the main <InlineCode text="sshd_config" /> file as a safety net.
        </p>
        <p>
          If you ever use your setup script to configure a fresh server on a bare-metal provider or a different cloud,
          that <InlineCode text="50-cloud-init.conf" /> file might not exist. By explicitly setting
          <InlineCode text="PasswordAuthentication no" /> in your main configuration, you guarantee your server is
          secure regardless of the hosting provider.
        </p>
      </AdmonitionBlock>
    </section>

    <section>
      <h2 id="simplify-ssh-access" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#simplify-ssh-access">Simplify SSH access</a>
      </h2>
      <p>
        Typing the full SSH command with the key path and IP address every time is tedious. You can configure your local
        SSH client to remember these details for you.
      </p>
      <p>On your <strong>local computer</strong> (not the server), open or create the SSH config file:</p>
      <CodeBlock :code="bashCodeSnippet18" language="bash" @show-toast="handleShowToastEvent" />

      <p>Add the following configuration block at the bottom of the file:</p>
      <CodeBlock :code="fileContentSnippet2" language="bash" @show-toast="handleShowToastEvent" />

      <p>Here is what these lines do:</p>
      <BulletPoint> <strong>Host:</strong> This is the shortcut name you want to use. </BulletPoint>
      <BulletPoint> <strong>HostName:</strong> The actual IP address of your server. </BulletPoint>
      <BulletPoint> <strong>User:</strong> The username you created on the server. </BulletPoint>
      <BulletPoint> <strong>IdentityFile:</strong> The path to the specific private key for this server. </BulletPoint>
      <BulletPoint>
        <strong>IdentitiesOnly:</strong> This tells SSH to <strong>only</strong> use the specific key file listed here.
        This prevents the "Too many authentication failures" error if you have many keys on your computer.
      </BulletPoint>

      <p>Save the file and exit. Now, instead of typing this long command:</p>
      <CodeBlock :code="bashCodeSnippet19" language="bash" @show-toast="handleShowToastEvent" />

      <p>You can simply type:</p>
      <CodeBlock :code="bashCodeSnippet20" language="bash" @show-toast="handleShowToastEvent" />

      <p>Your computer will automatically look up the IP, user, and key, and log you straight in.</p>
    </section>

    <section>
      <h2 id="what-is-next" class="article-body-header" data-table-of-contents>
        <a class="clickable-header-link" href="#what-is-next">What is next?</a>
      </h2>
      <p>
        You have successfully configured a clean Ubuntu server and secured it with SSH keys. However, your server is
        still exposed to the open internet.
      </p>
      <p>
        Your next step should be to lock down the network. You should look into configuring
        <a
          href="https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands"
          target="_blank"
          >UFW</a
        >
        to block unwanted traffic, setting up
        <a href="https://github.com/fail2ban/fail2ban" target="_blank">Fail2Ban</a> to stop brute-force attacks, and
        using the Recovery Console if you ever get locked out.
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
import createNewProject from "./1_1_create_new_project_inkscape.png";
import projectInfo1 from "./1_2_information_about_project_step_1.png";
import projectInfo2 from "./1_3_information_about_project_step_2.png";
import createDroplet from "./1_4_create_droplet_inkscape.jpg";
import chooseRegion from "./1_5_choose_region.png";
import chooseImage from "./1_6_choose_an_image.png";
import chooseSize from "./1_7_choose_size.png";
import spaceAndBackup from "./1_8_space_and_backup.png";
import authentication from "./1_9_authentication.png";
import sshKeysWork from "./1_10_how_ssh_keys_work.png";
import addingPublicKey from "./1_11_adding_a_public_key.png";
import additionalSshKeys from "./1_12_add_additional_ssh_keys.jpg";
import advancedOptions from "./1_13_advanced_options.png";
import finalStep from "./1_14_final_step_before_creating_droplet.png";
import dropletInProject from "./1_15_droplet_in_project_page.png";
import upsizeDroplet from "./1_16_upsize_droplet.png";
import findIpAddress from "./1_17_find_ip_address.png";
import opensshWarning from "./1_18_configure_open_ssh_server_warning.png";

// Constants
import { ARTICLE_TYPES } from "@/constants";

// Components
import CodeBlock from "@/components/CodeBlock.vue";
import CodeOutput from "@/components/CodeOutput.vue";
import InlineCode from "@/components/InlineCode.vue";
import YouTubePlayer from "@/components/YouTubePlayer.vue";
import ArticleLayout from "@/components/ArticleLayout.vue";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";
import ImageEnlarger from "@/components/ImageEnlarger.vue";
import BulletPoint from "@/components/BulletPoint.vue";

// Composables
import { useImageModal } from "@/composables/useImageModal.js";
import { useArticleContent } from "@/composables/useArticleContent.js";

export default {
  name: "HowToSetUpASecureCloudServerWithUbuntuAndSSH",
  components: {
    CodeBlock,
    CodeOutput,
    ImageEnlarger,
    InlineCode,
    YouTubePlayer,
    ArticleLayout,
    AdmonitionBlock,
    ImageWithCaption,
    BulletPoint,
  },
  emits: ["show-toast", "article-read"],
  setup(_, { emit }) {
    const title = "How to set up a secure cloud server with Ubuntu and SSH";

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
      tags: ["DevOps", "Security", "Ubuntu", "DigitalOcean", "SSH"],
      markdownContent,

      // Images
      coverImage,
      createNewProject,
      projectInfo1,
      projectInfo2,
      createDroplet,
      chooseRegion,
      chooseImage,
      chooseSize,
      spaceAndBackup,
      authentication,
      sshKeysWork,
      addingPublicKey,
      additionalSshKeys,
      advancedOptions,
      finalStep,
      dropletInProject,
      upsizeDroplet,
      findIpAddress,
      opensshWarning,

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
