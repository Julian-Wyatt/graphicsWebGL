# graphicsWebGL
Computer Graphics coursework - Year 2 Durham University

## Running the program

Firstly, ensure node package manager is installed on your system.
If not it can be installed here: https://nodejs.org/en/download/

Then, in the current working directory, in the terminal, run `npm install`

Then run `npm start`

Page should now be available at localhost:8000

## Instructions

Move around room with arrow keys

Zoom in with w and out with s

Please see animations below for further controls

### Animations

* t - Change TV channel
* l - Make light flicker
* c - Change shader - swaps between point light and toon shading
* b - Move chair between two points
* n - Make cushions spin
* m - Make light sway
* g - drink from mug

All animations have relevant html buttons

HTML: switch for light flicker & dimmer for the light

## Models

* Walls,
* Floor,
* TV,
* sofa1,
* sofa2,
* cushion,
* TV stand,
* Chair,
* Table
* Plate,
* Mug,
* Soundbar,
* Lamp shade,
* Foot rest

## Textures

* TV - 1,2,3,4
* Wood,
* Metal,
* Shade,
* Leather,
* Cotton/ Sofa2,
* Mug (plain white with message), white section used on other objects
* carpet,
* wallTexture,

## Files

* server.js
* package.json
* package-lock.json
* README.md
* Textures
	* mug.png
	* fabric.jpg
	* fabricNormal.jpg
	* floor.jpg
	* Shade.jpg
	* skybox.png
	* sofa1.jpg
	* sofa2.jpg
	* sofa2Normal.jpg
	* TV1.png
	* TV2.png
	* TV3.png
	* TV4.png
	* wall.jpg
	* wallNormal.jpg
	* wood.png
* Models
	* bulb.obj
	* chairLeg.obj
	* chairSeat.obj
	* cushion.obj
	* footRest.obj
	* lampBase.obj
	* lampShade.obj
	* lampStand.obj
	* lampCable.obj
	* mug.obj
	* plate.obj
	* quad.obj
	* skybox.obj
	* sofa1.obj
	* sofa2.obj
	* soundbar.obj
	* table.obj
	* TV_Stand.obj
	* TV.obj
	* wall.obj
* client
	* lib
		* cuon-matrix.js
		* cuon-utils.js
		* gl-matrix.js
		* initShaders.js
		* webgl-debug.js
		* webgl-utils.js
	* index.html
	* index.js

## Sources
Textures were sourced from:
* https://www.textures.com
* https://3dtextures.me
* Miscellaneous textures sourced through https://images.google.com

Models developed by myself using blender: https://www.blender.org

Code adapted and developed from:
* lecture slides,
* Practical 3 - Chair.js,
* https://prideout.net/blog/old/blog/index.html@p=22.html - toon shading (from lecture slides)
* https://github.com/arthurlee/WebGLProgrammingGuideBookStudy/blob/master/official_source_code/examples/ch10/OBJViewer.js - obj importing (textbook source code)
* https://apoorvaj.io/exploring-bump-mapping-with-webgl/ - normal mapping
* https://www.geeks3d.com/20130122/normal-mapping-without-precomputed-tangent-space-vectors/	- annotated out (convert world space to tangent space)
* http://glmatrix.net - matrix library

* https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives - normal mapping Tangent to world space within fragment
* https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_090_normal_bump_mapping/normal_bump_frag.html - normal mapping Tangent to world space within fragment
