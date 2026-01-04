# Change the heap size for Elasticsearch

How to change the heap size for Elasticsearch to improve performance and reduce memory usage.

**Date:** August 21, 2025
**Tags:** Elasticsearch

---

## Introduction

In this article, I'll show you how to change the **heap size**. For a more detailed walkthrough, check out the video tutorial:

[https://www.youtube.com/watch?v=guQuHmpPMXs](https://www.youtube.com/watch?v=guQuHmpPMXs)

You can also find all related notebooks and slides in my [GitHub repository](https://github.com/ImadSaddik/ElasticSearch_Python_Course).

---

## Heap size

Elasticsearch is a powerful tool, but it can use a lot of resources by default. If you're using it for small projects, you'll want to configure it to use less memory by adjusting the **heap size**.

Heap size is the amount of memory given to an application to use while it's running. By default, **Elasticsearch** takes 50% of your system's available memory. For example, my system has **16GB** of RAM, so whenever I start the container, **Elasticsearch** uses **8GB**. This can slow down my PC a lot.

For small projects and local setups, just **1–2GB** is usually enough.

---

## Changing the heap size

Follow these steps to adjust the heap size.

### Start the container

Open your terminal and run:

```bash
sudo docker start elasticsearch
```

> **Note:** If you gave your container a different name, replace `elasticsearch` with that name in the command.

### Access the container

Run the following command to enter the `elasticsearch` container:

```bash
sudo docker exec -u 0 -it elasticsearch bash
```

### Create the "heap.options" file

Go to the `jvm.options.d` folder and set the **heap size**. Run these commands to create the file and set the memory limits:

```bash
echo "-Xms2g" > /usr/share/elasticsearch/config/jvm.options.d/heap.options
echo "-Xmx2g" >> /usr/share/elasticsearch/config/jvm.options.d/heap.options
```

Check the file's contents with:

```bash
cat /usr/share/elasticsearch/config/jvm.options.d/heap.options
```

You should see this in the output:

```text
-Xms2g
-Xmx2g
```

In this example, **Elasticsearch** is set to use **2GB** of memory. You can change the value by replacing `2` with the amount you want.

---

## Conclusion

Changing the **heap size** for **Elasticsearch** is key to making it work well for your needs, especially for smaller projects. By following these steps, you can easily adjust memory usage and keep your system running smoothly.
