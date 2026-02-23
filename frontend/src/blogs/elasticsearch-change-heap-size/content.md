---
title: "Change the heap size for Elasticsearch"
subtitle: "How to change the heap size for Elasticsearch to improve performance and reduce memory usage."
date: "August 21, 2025"
tags: ["Elasticsearch"]
---

## Introduction

In this article, I will show you how to change the `heap size`. For a more detailed walkthrough, check out the video tutorial:

::: youtube [https://www.youtube.com/embed/guQuHmpPMXs](https://www.youtube.com/embed/guQuHmpPMXs)
:::

You can also find all related notebooks and slides in my [GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course).

## Heap size

Elasticsearch is a powerful tool, but it can be resource-intensive by default. If you're like me and using it for small projects, you'll want to configure it to consume less memory by adjusting the `heap size`.

Heap size refers to the amount of memory allocated to an application for dynamic memory allocation during runtime. By default, `Elasticsearch` allocates 50% of your system's available memory. For instance, my system has `16GB` of RAM, so whenever I start the container, `Elasticsearch` uses `8GB`. This slows down my PC significantly and can even cause it to freeze due to memory exhaustion.

For small projects and local setups, allocating just `1–2GB` is usually sufficient.

## Changing the heap size

Follow these steps to adjust the heap size.

### Start the container

Open your terminal and run:

```bash
sudo docker start elasticsearch
```

::: info
If you assigned a different name to the container, replace `elasticsearch` with that name in the command.
:::

### Access the container

Execute the following command to enter the `elasticsearch` container:

```bash
sudo docker exec -u 0 -it elasticsearch bash
```

### Create the "heap.options" file

Navigate to the `jvm.options.d` folder and configure the `heap size`. Run these commands to create the file and set the memory limits:

```bash
echo "-Xms2g" > /usr/share/elasticsearch/config/jvm.options.d/heap.options
echo "-Xmx2g" >> /usr/share/elasticsearch/config/jvm.options.d/heap.options
```

Verify the file contents with:

```bash
cat /usr/share/elasticsearch/config/jvm.options.d/heap.options
```

You should see this in the output:

```output
-Xms2g
-Xmx2g
```

In this example, `Elasticsearch` is configured to use `2GB` of memory. You can adjust the value by replacing `2` with your desired amount.

## Conclusion

Changing the `heap size` for `Elasticsearch` is key to making it work well for your specific needs, especially for smaller projects. By following the steps outlined, you can easily adjust memory usage and keep your system running smoothly.
