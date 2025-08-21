export const bashCodeSnippet1 = `sudo docker start elasticsearch`;

export const bashCodeSnippet2 = `sudo docker exec -u 0 -it elasticsearch bash`;

export const bashCodeSnippet3 = `echo "-Xms2g" > /usr/share/elasticsearch/config/jvm.options.d/heap.options
echo "-Xmx2g" >> /usr/share/elasticsearch/config/jvm.options.d/heap.options`;

export const bashCodeSnippet4 = `cat /usr/share/elasticsearch/config/jvm.options.d/heap.options`;

export const codeOutput1 = `-Xms2g
-Xmx2g`;
