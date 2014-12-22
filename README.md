collision
=========

A very simple implementation of 2d collision detection &amp; movement implemented in plain JavaScript.

* The only supported shape is the axis-aligned bounding box.
* Every time step, each actor is moved first along the x-axis and then along the y-axis.
* To move along an axis, the bounding box is extended along the axis to cover the whole area that is passed through.
* Of all the other bounding boxes that intersect with the extended bounding box, the closest one to the original position (if any) is used to limit the movement along the axis.
* In order to avoid intersecting all boxes against all other boxes, a sparse grid structure is used.
* The grid is simply a JavaScript object with properties of the form "x,y": [a1, a2, ...] where x,y is the coordinate covered by the bounding boxes of a1, a2, ...
* Each box may cover multiple coordinates. In the demo, the grid has a row/column size of 200; thus a platform of length 300 will appear in two to three coordinates along the x-axis.

Since the movement is done one axis at a time, high velocities will give strange results, where diagonal movement will appear to "leap through" corners. To avoid this, we do the following: If the velocity is above the threshold, the movement (all of the steps above) is subdivided into N steps, each with a velocity below the threshold (10 px in the demo).

Controls: Arrow keys. You can jump mid-air, which is necessary to navigate the randomly generated test-map.
