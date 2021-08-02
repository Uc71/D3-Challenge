# Links Between Health and Personal Finances in U.S. States

To use this project, clone this repository to your computer and click the .html file.

I used gitbash to create a local server to host my data.csv file, and then linked to the url of that server in the app.js file.
I made variables for the width and height of the graph, as well as for the margins around the graph and the radii of the circles in the graph.
I labelled my axes and nested the labels inside of a function to make the position of the labels change with the size of the window.
I used xtext and ytext, embedded in a function to reposition the svgs in respponse to window changes, to append svgs of the variables below the graph and also to the graph's left.
Then, I made a visualization function to make visible the csv data.

I declared curx and cury as variables to hold the data chosen to be shown in each axis.
I then made a tool function to reveal the x and y values and variable types whenever one mouses over a circle.

I created functions to select the min and max values from each data column.
I made set of attributes for each svg image to change the svg's appearance when it changes between active and inactive when clicked or unclicked.

Using the data min and max values selected earlier, I made a function to rescale the tick marks on the axis for every change of plotted variable.
I made tool rules for selecting the x and y values for each circle, as well as the name of the circle's state, whenever a mouseover occurs.
If the state abbreviation was too large for a given circle, I added 1/3 of the circle's radius to the height of the text, moving the letters closer to the center of the dot.

I made the ticks and labels on each axis, as well as each dot's radius, responsive to changes in xscale and yscale. 
I did the same to the overall sizes of the axes. 
I used a resize function to do all of this.
