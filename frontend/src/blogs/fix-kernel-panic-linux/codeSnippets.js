export const bashCodeSnippet1 = `uname -r`;

export const codeOutput1 = `6.11.0-29-generic`;

export const bashCodeSnippet2 = `dpkg --list | grep linux-image`;

export const codeOutput2 = `rc  linux-image-6.11.0-17-generic                  6.11.0-17.17~24.04.2                          amd64        Signed kernel image generic
rc  linux-image-6.11.0-19-generic                  6.11.0-19.19~24.04.1                          amd64        Signed kernel image generic
rc  linux-image-6.11.0-21-generic                  6.11.0-21.21~24.04.1+1                        amd64        Signed kernel image generic
rc  linux-image-6.11.0-24-generic                  6.11.0-24.24~24.04.1                          amd64        Signed kernel image generic
rc  linux-image-6.11.0-25-generic                  6.11.0-25.25~24.04.1                          amd64        Signed kernel image generic
rc  linux-image-6.11.0-26-generic                  6.11.0-26.26~24.04.1                          amd64        Signed kernel image generic
rc  linux-image-6.11.0-28-generic                  6.11.0-28.28~24.04.1                          amd64        Signed kernel image generic
ii  linux-image-6.11.0-29-generic                  6.11.0-29.29~24.04.1                          amd64        Signed kernel image generic
iF  linux-image-6.14.0-24-generic                  6.14.0-24.24~24.04.3                          amd64        Signed kernel image generic
rc  linux-image-6.8.0-41-generic                   6.8.0-41.41                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-44-generic                   6.8.0-44.44                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-45-generic                   6.8.0-45.45                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-47-generic                   6.8.0-47.47                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-48-generic                   6.8.0-48.48                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-49-generic                   6.8.0-49.49                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-50-generic                   6.8.0-50.51                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-51-generic                   6.8.0-51.52                                   amd64        Signed kernel image generic
rc  linux-image-6.8.0-52-generic                   6.8.0-52.53                                   amd64        Signed kernel image generic
ii  linux-image-generic-hwe-24.04                  6.14.0-24.24~24.04.3                          amd64        Generic Linux kernel image `;

export const bashCodeSnippet3 = `sudo apt purge linux-image-6.14.0-24-generic linux-headers-6.14.0-24-generic`;

export const bashCodeSnippet4 = `sudo apt autoremove --purge`;

export const bashCodeSnippet5 = `sudo update-grub`;
