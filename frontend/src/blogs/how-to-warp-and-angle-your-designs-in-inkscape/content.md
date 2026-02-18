---
title: "How to place text and logos in perspective in Inkscape"
subtitle: "A simple guide to warping designs to fit angled or curved surfaces for realistic mockups."
date: "January 31, 2026"
tags: ["Inkscape", "Design", "SVG", "Perspective"]
---

## Introduction

Recently, I wanted to place a logo on a 3D server design, but I ran into a problem. When I pasted the logo on top, it looked flat and fake because it didn't align with the perspective of the surface.

This guide will show you two ways to fix this: one for flat text and one for curved surfaces.

::: youtube [https://www.youtube.com/embed/pFrnlXTtLZU](https://www.youtube.com/embed/pFrnlXTtLZU)
:::

## The problem

When you place a flat 2D design onto a picture of a 3D object, it doesn't account for the perspective. It looks like something floating on top rather than an integrated part of the object.

To fix this, you need to warp your design. However, Inkscape has different tools for this: the **Perspective** extension and the **Envelope Deformation** path effect.

![Flat logo and text do not match the top surface](./1_flat_logo_does_not_match_the_top_surface.svg "The flat logo and text do not match the top surface.")

## The solution

Before starting, there is one critical rule: These tools only work on **Paths**. They won't work on editable text or standard imported images.

- **For text:** Select it and press `Shift` + `Ctrl` + `C` to convert it to a path or go to `Path > Object to Path`.
- **For images:** You must trace them first using `Path > Trace Bitmap`.

### The Perspective extension

This method works best on flat, angled surfaces like a wall or a book cover. Draw a shape that matches the surface you want to place your text or logo on.

::: info Note
When drawing the shape, start at the bottom-left corner and move clockwise. This ensures the text orientation remains correct.

However, the drawing order does not matter for logos.
:::

![Draw a shape matching the surface](./2_draw_shape_matching_surface.svg "Draw a shape matching the surface.")

Make sure your text is on top of the shape in the layer order. You can check this in the `Layers` panel (`Shift` + `Ctrl` + `L`). After that, select your text path first, hold `Shift`, and select the target shape second.

::: warning Warning
Make sure that both objects are paths. If they are not, the extension will not work correctly.
:::

Go to `Extensions > Modify Path > Perspective`.

Inkscape will snap the four corners of your text to the corners of the shape.

![Using the Perspective extension](./3_using_perspective_extension.svg "The text snaps perfectly when drawn clockwise from bottom left (left), but fails with incorrect drawing direction (right).")

As you can see, the text matches the surface angle perfectly, provided it was drawn correctly.

### Envelope Deformation

The Perspective extension falls short on curved surfaces because it creates a linear distortion between corners. For a curved roof or a bottle, you need **Envelope Deformation**.

![Perspective extension fails on curved surfaces](./4_perspective_fails_on_circle.svg "The Perspective extension distorts text poorly on curved surfaces because it only maps to the four corners.")

Select your logo path and open the `Path Effects` panel by pressing `Ctrl` + `&`. Click the arrow icon and search for "Envelope Deformation".

![Adding Envelope Deformation](./5_adding_envelope_deformation.svg "Select Envelope Deformation from the Path Effects panel.")

Draw a shape that matches the curved surface you want to place your logo on. This shape will act as a guide for warping. Center the logo over this shape.

![Draw a shape matching the curved surface](./6_draw_shape_matching_curved_surface.svg "Draw a shape matching the curved surface.")

Select the logo and make sure that it is on top of the guide shape in the layer order. In the Path Effects panel, you will see options for **Top bend path**, **Right bend path**, etc.

Click the small "Edit on-canvas" <InlineIcon icon="/src/assets/icons/tool_node_editor.svg" /> icon next to the **Top bend path** option. You will see a green line appear with two handles.

![Editing the top bend path](./7_editing_top_bend_path.svg "Click the 'Edit on-canvas' icon to reveal the green bend line with handles.")

Pick one of the green handles and snap it to the corresponding corner of your guide shape. Do the same for the other handle.

![Aligning the top bend handles](./8_aligning_top_bend_handles.svg "Align the top bend handles to the guide shape corners.")

Repeat this process for the other sides: **Right bend path**, **Bottom bend path**, and **Left bend path**. Each time, click the "Edit on-canvas" <InlineIcon icon="/src/assets/icons/tool_node_editor.svg" /> icon and snap the handles to the corners of your guide shape.

![Aligning all bend handles](./9_aligning_all_bend_handles.svg "Align all bend handles to the guide shape corners.")

::: warning Important
This tool creates a "live" effect. To make the shape permanent, select your finished object and go to `Path > Object to Path`.
:::

## Conclusion

You now have two powerful techniques to make your designs fit perfectly onto 3D objects:

- **Perspective** for flat, angled surfaces like walls and book covers
- **Envelope Deformation** for curved surfaces like bottles, spheres, and rounded objects

With these tools, your logos and text will sit naturally within the 3D space rather than floating on top. Remember to convert your text and images to paths first, and always finalize your work with `Path > Object to Path` to lock in your effects.

Happy designing!
