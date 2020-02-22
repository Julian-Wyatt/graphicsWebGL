// references:
// https://github.com/arthurlee/WebGLProgrammingGuideBookStudy/blob/master/official_source_code/examples/ch10/OBJViewer.js
// Practical 3 - Chair.js

class Scene {

	constructor (gl,canvas) {

		this.gl = gl;
		this.canvas = canvas;

		// region shaders
		// point light per fragment
		let VSHADER_SOURCE =
		"#ifdef GL_ES\n" +
		"precision mediump float;\n" +
		"#endif\n" +
		"attribute vec4 a_Position;\n" +
		"attribute vec4 a_Color;\n" +
		"attribute vec4 a_Normal;\n" +        // Normal
		"attribute vec2 a_TexCoords;\n" +
		"uniform mat4 u_ModelMatrix;\n" +
		"uniform mat4 u_NormalMatrix;\n" +
		// 'uniform mat4 u_ViewMatrix;\n' +
		"uniform mat4 u_MVPMatrix;\n" +
		// 'uniform mat4 u_ProjMatrix;\n' +
		"uniform vec3 u_LightColor;\n" +     // Light color
		"uniform vec3 u_LightPosition;\n" + // Light direction (in the world coordinate, normalized)
		"uniform vec3 u_AmbientLight;\n" +
		"uniform bool u_isLighting;\n" +
		"varying vec4 v_Color;\n" +
		"varying vec3 v_Normal;\n" +
		"varying vec3 v_Position;\n" +
		"varying vec2 v_TexCoords;\n" +
		"void main() {\n" +
		// '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
		"  gl_Position = u_MVPMatrix * u_ModelMatrix * a_Position;\n" +
		"  if(u_isLighting)\n" +
		"  {\n" +
		"	v_Position = vec3(u_ModelMatrix * a_Position);\n" +

		"	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" +
		" 	v_Color = a_Color;\n" + "  }\n" +
		"  else\n" +
		"  {\n" +
		"     v_Color = a_Color;\n" +
		"  }\n" +
		"  v_TexCoords = a_TexCoords;\n" +
		"}\n";
		// Fragment shader program for point light
		let FSHADER_SOURCE =
		"#ifdef GL_ES\n" +
		"precision mediump float;\n" +
		"#endif\n" +
		"uniform bool u_UseTextures;\n" +    // Texture enable/disable flag
		"uniform vec3 u_LightColor;\n" +	// light colour
		"uniform vec3 u_LightPosition;\n" +	// position of the light source
		"uniform vec3 u_AmbientLight;\n" + 	// ambient light colour
		"varying vec3 v_Normal;\n" +
		"varying vec3 v_Position;\n" +
		"varying vec4 v_Color;\n" +
		"uniform sampler2D u_Sampler;\n" +
		"varying vec2 v_TexCoords;\n" +
		"void main() {\n" +
		// Normalize normal because it's interpolated and not 1.0 (length)
		"	vec3 normal = normalize(v_Normal);\n" +
		// Calculate the light direction and make it 1.0 in length
		"	vec3 lightDirection = normalize(u_LightPosition - v_Position);\n" +
		// The dot product of the light direction and the normal
		"	float nDotL = max(dot(lightDirection,normal),0.0);\n" +
		// Calculate the final color from diffuse and ambient reflection
		"	vec3 ambient = u_AmbientLight * v_Color.rgb;\n" +
		"  vec3 diffuse;\n" +
		"  if (u_UseTextures) {\n" +
		// '     vec4 TexColor = texture2D(u_Sampler, v_TexCoords);\n' +
		// '     diffuse = u_LightColor * TexColor.rgb * nDotL * 1.2;\n' +
		"     diffuse = u_LightColor.rgb * nDotL * 1.2;\n" +
		"  	  gl_FragColor = vec4(diffuse + ambient, v_Color.a) * texture2D( u_Sampler, v_TexCoords );\n" +
		"  } else {\n" +
		// "	vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n"+
		"	vec3 diffuse = u_LightColor.rgb * vec3(0.8,0.8,0.8) * nDotL;\n" +
		"  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n" +
		"  }\n" +

		"}\n";


		// // Fragment shader program for cell shading
		// var FSHADER_SOURCE =
		// '#ifdef GL_ES\n' +
		// 'precision mediump float;\n' +
		// '#endif\n' +
		// 'uniform vec3 u_LightColor;\n' +	//light colour
		// "uniform vec3 u_LightPosition;\n"+	//position of the light source
		// "uniform vec3 u_AmbientLight;\n" + 	//ambient light colour
		// 'varying vec3 v_Normal;\n' +
		// 'varying vec3 v_Position;\n' +
		// 'varying vec4 v_Color;\n' +
		// 'void main() {\n' +
		// // Normalize normal because it's interpolated and not 1.0 (length)
		// " const float A = 0.1;\n"+
		// " const float B = 0.3;\n"+
		// " const float C = 0.6;\n"+
		// " const float D = 1.0;\n"+

		// "	vec3 normal = normalize(v_Normal);\n"+
		// // Calculate the light direction and make it 1.0 in length
		// "	vec3 lightDirection = normalize(u_LightPosition - v_Position);\n"+
		// // The dot product of the light direction and the normal
		// "	float nDotL = max(dot(lightDirection,normal),0.0);\n"+
		// "if (nDotL < A) nDotL = 0.0;\n"+
		// "else if (nDotL < B) nDotL = B;\n"+
		// "else if (nDotL < C) nDotL = C;\n"+
		// "else nDotL = D;\n"+

		// " vec3 E = vec3(0, 0, 1);\n"+
		// " vec3 H = normalize(nDotL + E);\n"+

		// // The dot product of the H value and the normal
		// "	float nDotH = max(dot(H,normal),0.0);\n"+
		// // Calculate the final color from diffuse and ambient reflection
		// "	vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n"+
		// "	vec3 ambient = u_AmbientLight * v_Color.rgb;\n"+
		// '  gl_FragColor = vec4(diffuse * (ambient+nDotL), v_Color.a);\n' +
		// '}\n';


		// Initialize shaders
		if (!initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {

			console.log("Failed to intialize shaders.");
			return;

		}

		// #endregion shaders

		this.program = this.gl.program;
		this.viewMatrix = new Matrix4();  // The view matrix
		this.projMatrix = new Matrix4();  // The projection matrix
		this.mvpMatrix = new Matrix4();
		this.models = [];
		// Set clear color to white and enable hidden surface removal
		this.gl.clearColor(0.8, 0.8, 0.8, 0.8);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Clear color and depth buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Get the storage locations of uniform attributes

		this.program.a_Position = this.gl.getAttribLocation(this.program, "a_Position");
		this.program.a_Normal = this.gl.getAttribLocation(this.program, "a_Normal");
		this.program.a_Color = this.gl.getAttribLocation(this.program, "a_Color");
		this.program.a_TexCoords = this.gl.getAttribLocation(this.program, "a_TexCoords");
		this.program.u_ModelMatrix = this.gl.getUniformLocation(this.program, "u_ModelMatrix");
		this.program.u_NormalMatrix = this.gl.getUniformLocation(this.program,"u_NormalMatrix");
		this.program.u_MVPMatrix = this.gl.getUniformLocation(this.program,"u_MVPMatrix");
		this.program.u_LightColor = this.gl.getUniformLocation(this.program, "u_LightColor");
		this.program.u_LightPosition = this.gl.getUniformLocation(this.program, "u_LightPosition");
		this.program.u_AmbientLight = this.gl.getUniformLocation(this.program, "u_AmbientLight");

		// Trigger using lighting or not
		this.program.u_isLighting = this.gl.getUniformLocation(this.gl.program, "u_isLighting");

		if (!this.program.u_MVPMatrix || !this.program.u_LightPosition) {

			console.log("Failed to Get the storage locations of u_ViewMatrix, and/or u_ProjMatrix");
			return;

		}
		this.program.u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");
		if (!this.program.u_Sampler) {

			console.log("Failed to get the storage location of u_Sampler");
			return false;

		}
		this.program.u_UseTextures = gl.getUniformLocation(this.program, "u_UseTextures");
		if (!this.program.u_UseTextures) {

			console.log("Failed to get the storage location for texture map enable flag");
			return;

		}

		// Set the light color (white)
		// this.gl.uniform3f(this.program.u_LightColor, 1, 1, 1);
		// this.gl.uniform4f(this.program.u_LightColor, 1, 1, 1, 1);
		this.lightScalar = 0.6;
		this.gl.uniform3f(this.program.u_LightColor, 1 * this.lightScalar, 1 * this.lightScalar, 1 * this.lightScalar);
		// this.gl.uniform3f(this.program.u_AmbientLight, 0.2, 0.2, 0.2);
		this.gl.uniform3f(this.program.u_AmbientLight,0.01, 0.01, 0.01);
		this.lightPosition = new Vector3([0,10,0]);
		this.gl.uniform3f(this.program.u_LightPosition, this.lightPosition.elements[0],this.lightPosition.elements[1], this.lightPosition.elements[2]);

		// Calculate the view matrix and the projection matrix

		this.eye = new Eye(1.1,4,10);

		this.viewMatrix.setLookAt(this.eye.x, this.eye.y, this.eye.z, 0, 0, 0, 0, 1.0, 0.0);
		this.projMatrix.setPerspective(90, this.canvas.width / this.canvas.height, 1, 100);

		this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix);

		// Pass the model, view, and projection matrix to the uniform variable respectively
		// this.gl.uniformMatrix4fv(this.program.u_ViewMatrix, false, this.viewMatrix.elements);
		// this.gl.uniformMatrix4fv(this.program.u_ProjMatrix, false, this.projMatrix.elements);
		this.gl.uniformMatrix4fv(this.program.u_MVPMatrix, false, this.mvpMatrix.elements);


		this.gl.uniform1i(this.program.u_isLighting, true); // Will apply lighting
		this.depth = -25;

	}
	newModel (name,primitive,texture, pos, scale) {

		let model = new Model({"filename":name,"gl":this.gl,"program":this.program, "pos": pos, "scale":scale,"primitive": primitive,"texture":texture});

		this.models.push(model);
		return model;

	}
	draw () {

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		for (let i = 0;i < this.models.length;i++) {

			if (this.models[i].drawingInfo) {

				this.models[i].bindBuffers(this.gl,this.program);
				if (this.models[i].primitive == 1) {

					this.gl.drawElements(this.gl.TRIANGLES, this.models[i].drawingInfo.indices.length, this.gl.UNSIGNED_BYTE, 0);

				}
				else{

					this.gl.drawElements(this.gl.TRIANGLES, this.models[i].drawingInfo.indices.length, this.gl.UNSIGNED_SHORT, 0);

				}

			}

		}

		this.gl.uniform3f(this.program.u_LightPosition, this.lightPosition.elements[0],this.lightPosition.elements[1], this.lightPosition.elements[2]);
		this.gl.uniform3f(this.program.u_LightColor, 1 * this.lightScalar, 1 * this.lightScalar, 1 * this.lightScalar);

	}
	updateCamera (deltaTime) {

		this.rate = deltaTime;
		let temp;
		if (keypressed["37"] == true) {

			// "left arrow pressed"
			this.eye.y += this.rate;

		}
		if(keypressed["38"] == true) {

			// "up arrow clicked"
			// this.eye.x+=this.rate/60;
			temp = this.eye.x + this.rate;
			if (temp > 1.1) {

				this.eye.x = 1.1;

			}
			else{

				this.eye.x = temp;

			}

		}
		if (keypressed["39"] == true) {

			// "right arrow clicked"
			this.eye.y -= this.rate;

		}
		if (keypressed["40"] == true) {

			// "down arrow clicked"
			// this.eye.x-=this.rate/60;

			temp = this.eye.x - this.rate;
			// if (temp<-0.35){
			// 	this.eye.x = -0.35;
			// }
			if (temp < -0.9) {

				this.eye.x = -0.9;

			}
			else{

				this.eye.x = temp;

			}

		}
		if (keypressed["87"] == true) {

			temp = this.depth + this.rate * 10;
			if (temp > -10) {

				this.depth = -10;

			}
			else{

				this.depth = temp;

			}

		}
		if (keypressed["83"] == true) {

			temp = this.depth - this.rate * 10;
			if (temp < -45) {

				this.depth = -45;

			}
			else{

				this.depth = temp;

			}

		}


		this.viewMatrix = new Matrix4().setIdentity();

		mat4.translate(this.viewMatrix.elements,this.viewMatrix.elements, vec3.fromValues(0,0,this.depth));
		mat4.rotateX(this.viewMatrix.elements,this.viewMatrix.elements, this.eye.x);
		mat4.rotateY(this.viewMatrix.elements,this.viewMatrix.elements, this.eye.y);

		// this.gl.uniformMatrix4fv(this.program.u_ViewMatrix, false, this.viewMatrix.elements);

		this.mvpMatrix.set(this.projMatrix).multiply(this.viewMatrix);

		// Pass the model, view, and projection matrix to the uniform variable respectively
		this.gl.uniformMatrix4fv(this.program.u_MVPMatrix, false, this.mvpMatrix.elements);

	}

}


class Model {


	constructor ({filename,gl,program, pos, scale, rot, primitive}) {

		this.name = filename;

		this.textures = [];
		this.activeTexture = 0;
		// Coordinate transformation matrix
		this.modelMatrix = new Matrix4();
		this.position = new Vector3([0,0,0]);
		this.scale = new Vector3([1,1,1]);
		this.rotation = new Vector3([0,0,0]);

		// 0 for non primitive and will request for obj with given filename
		// 1 for primitive ie cube stored in this file
		// 2 for empty object for parenting
		this.primitive = primitive;
		if (this.primitive < 2) {

			this.normalMatrix = new Matrix4();
			this.initVertexBuffers(gl,program);
			if (this.primitive == 0) {

				readOBJFile(this.name,gl,program,this,1,0);

			}
			else{

				this.initCube();

			}

		}
		this.modelMatrix.setTranslate(0,0,0);


		if (pos) {

			this.modelMatrix.translate(pos.elements[0],pos.elements[1],pos.elements[2]);

		}
		else{

			this.modelMatrix.translate(0,0,0);

		}
		if (scale) {

			this.modelMatrix.scale(scale.elements[0],scale.elements[1],scale.elements[2]);

		}
		else{

			this.modelMatrix.scale(1,1,1);

		}
		if (rot) {

			this.modelMatrix.rotate(rot.elements[1],0,1,0);
			this.modelMatrix.rotate(rot.elements[0],1,0,0);
			this.modelMatrix.rotate(rot.elements[2],0,0,1);

		}


		this.children = [];
		this.dampening = 8;
		this.prevAngle = 0;


	}

	addChild (model) {

		this.children.push(model);

	}

	updateChildren () {

		for (let i = 0;i < this.children.length;i++) {


			// this.children[i].modelMatrix.elements = mat4.multiply(this.children[i].modelMatrix.elements,this.modelMatrix.elements,this.children[i].modelMatrix.elements)
			this.children[i].updateModelMatrix();
			this.children[i].modelMatrix.elements = mat4.multiply(this.children[i].modelMatrix.elements,this.modelMatrix.elements,this.children[i].modelMatrix.elements);
			this.children[i].updateChildren();

		}

	}

	updateScale (scale) {

		this.scale.elements[0] *= scale.elements[0];
		this.scale.elements[1] *= scale.elements[1];
		this.scale.elements[2] *= scale.elements[2];
		this.updateModelMatrix();

	}

	updatePos (pos) {

		this.position.elements[0] += pos.elements[0];
		this.position.elements[1] += pos.elements[1];
		this.position.elements[2] += pos.elements[2];
		this.updateModelMatrix();

	}
	updateRot (rot) {

		this.rotation.elements[0] += rot.elements[0];
		this.rotation.elements[1] += rot.elements[1];
		this.rotation.elements[2] += rot.elements[2];
		this.updateModelMatrix();

	}
	updateModelMatrix () {

		this.modelMatrix = this.modelMatrix.setIdentity();
		this.modelMatrix.translate(this.position.elements[0],this.position.elements[1],this.position.elements[2]);


		this.modelMatrix.scale(this.scale.elements[0],this.scale.elements[1],this.scale.elements[2]);


		this.modelMatrix.rotate(this.rotation.elements[1],0,1,0);
		this.modelMatrix.rotate(this.rotation.elements[0],1,0,0);
		this.modelMatrix.rotate(this.rotation.elements[2],0,0,1);

		this.updateChildren();

	}
	printTransform () {

		console.log(this.name);
		console.log("Position:");
		console.log(this.position);
		console.log("Scale:");
		console.log(this.scale);
		console.log("Rotation:");
		console.log(this.rotation);

	}

	SHM (posX,posY, dampeningRate) {

		// var angle = Math.atan(this.modelMatrix.elements[13]/this.modelMatrix.elements[12]);

		// // console.log(this.name)
		// // console.log(angle*180/Math.PI)
		// angle = angle
		// // this.modelMatrix.rotate(this.prevAngle - angle,0,0,1);
		// this.modelMatrix.rotate(angle,0,0,1);

		this.modelMatrix.translate(posX / this.dampening,posY / this.dampening,0);

		// this.modelMatrix.translate(posX/this.dampening,0,0);


		// this.modelMatrix.rotat

		// this.modelMatrix.lookAt(this.modelMatrix.elements[12],this.modelMatrix.elements[13],this.modelMatrix.elements[14],0,0,0,0,1,0)
		for(let i = 0;i < this.children.length;i++) {

			this.children[i].SHM(posX * dampeningRate, posY * dampeningRate, dampeningRate);

		}

		this.prevAngle = angle;
		/*

		tan-1 (xDisplacement/Height)


		|\
		| \
		|  \
		|   \
		 ----

		*/

	}

	createEmptyArrayBuffer (gl, a_attribute, num, type) {

		let buffer = gl.createBuffer();
		if (!buffer) {

			console.log("Failed to create the buffer object");
			return null;

		}
		gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
		// var FSIZE = this.drawingInfo.vertices.BYTES_PER_ELEMENT;
		// gl.vertexAttribPointer(a_attribute,num,type,false,FSIZE *num,0);

		gl.vertexAttribPointer(a_attribute,num,type,false,0,0);
		gl.enableVertexAttribArray(a_attribute);
		return buffer;

	}

	initVertexBuffers (gl,program) {

		this.vertexBuffer = this.createEmptyArrayBuffer(gl,program.a_Position,3,gl.FLOAT);
		this.normalBuffer = this.createEmptyArrayBuffer(gl,program.a_Normal,3,gl.FLOAT);
		if (this.primitive == 1) {

			this.colourBuffer = this.createEmptyArrayBuffer(gl,program.a_Color,3,gl.FLOAT);

		}
		else{

			this.colourBuffer = this.createEmptyArrayBuffer(gl,program.a_Color,4,gl.FLOAT);

		}

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		if (this.drawingInfo) {

			if (typeof (this.drawingInfo.textCoords) != undefined) {

				this.texCoordsBuffer =  this.createEmptyArrayBuffer(gl,program.a_TexCoords,2,gl.FLOAT);

			}

		}

	}

	bindBuffers (gl,program) {

		// get drawing info
		// Acquire the vertex coordinates and colors from OBJ file


		this.initVertexBuffers(gl,program);

		if (this.textures[this.activeTexture]) {

			if (this.textures[this.activeTexture].loaded) {

				this.textures[this.activeTexture].bindTexture(gl,program);

			}

		}
		else{

			// Enable texture mapping
			gl.uniform1i(program.u_UseTextures, false);

		}

		// Write data into the buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.drawingInfo.vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.drawingInfo.normals, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.drawingInfo.colours, gl.STATIC_DRAW);

		// Write the indices to the buffer object
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.drawingInfo.indices, gl.STATIC_DRAW);

		if (typeof (this.drawingInfo.textCoords) != undefined) {

			gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.drawingInfo.textCoords, gl.STATIC_DRAW);

		}

		this.normalMatrix.setInverseOf(this.modelMatrix);
		this.normalMatrix.transpose();

		gl.uniformMatrix4fv(program.u_NormalMatrix, false, this.normalMatrix.elements);

		gl.uniformMatrix4fv(program.u_ModelMatrix, false, this.modelMatrix.elements);

	}
	changeTexture () {

		this.activeTexture = (this.activeTexture + 1) % this.textures.length;

	}

	initCube () {

		// Create a cube
		//    v6----- v5
		//   /|      /|
		//  v1------v0|
		//  | |     | |
		//  | |v7---|-|v4
		//  |/      |/
		//  v2------v3

		let vertices = new Float32Array([   // Coordinates
			0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, // v0-v1-v2-v3 front
			0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, // v0-v3-v4-v5 right
			0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
			-0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, // v1-v6-v7-v2 left
			-0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, // v7-v4-v3-v2 down
			0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5  // v4-v7-v6-v5 back
		]);
		for (let i = 0;i < vertices.length;i++) {

			vertices[i] *= 2;

		}


		let colors = new Float32Array([    // Colors
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,      // v0-v1-v2-v3 front
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,      // v0-v3-v4-v5 right
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,      // v0-v5-v6-v1 up
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,      // v1-v6-v7-v2 left
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1,      // v7-v4-v3-v2 down
			1, 1, 1,   1, 1, 1,   1, 1, 1,  1, 1, 1       // v4-v7-v6-v5 back
		]);

		let normals = new Float32Array([    // Normal
			0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
			1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
			0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
			-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
			0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
			0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
		]);

		// Texture Coordinates
		let texCoords = new Float32Array([
			1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v0-v1-v2-v3 front
			0.0, 1.0,    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,  // v0-v3-v4-v5 right
			1.0, 0.0,    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,  // v0-v5-v6-v1 up
			1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,  // v1-v6-v7-v2 left
			0.0, 0.0,    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,  // v7-v4-v3-v2 down
			0.0, 0.0,    1.0, 0.0,   1.0, 1.0,   0.0, 1.0   // v4-v7-v6-v5 back
		]);

		// Indices of the vertices
		let indices = new Uint8Array([
			0, 1, 2,   0, 2, 3,    // front
			4, 5, 6,   4, 6, 7,    // right
			8, 9,10,   8,10,11,    // up
			12,13,14,  12,14,15,    // left
			16,17,18,  16,18,19,    // down
			20,21,22,  20,22,23     // back
		]);

		this.drawingInfo = new DrawingInfo(vertices,normals,colors,indices,texCoords);

	}

}

// #region obj importing


function readOBJFile (fileName, gl,program, model, scale, reverse) {

	let request = new XMLHttpRequest();
	request.onreadystatechange = function () {

		if (request.readyState === 4 && request.status !== 404) {

			onReadOBJFile(request.responseText, fileName, scale, reverse)
				.then(function (objDoc) {

					model.objdoc = objDoc;
					model.drawingInfo = model.objdoc.getDrawingInfo();
					model.read = true;
					console.log("loaded");
					// model.onReadComplete(gl,program);
					// model.draw(gl,program);

				}
				);

		}

	};
	request.open("GET",fileName,true);
	request.send();

}

async function onReadOBJFile (fileString, fileName, scale, reverse) {

	try{

		let objdoc = new objDoc(fileName);
		let result = await objdoc.parse(fileString, scale, reverse);
		if (!result) {

			console.log("OBJ file parsing error.");
			return;

		}
		return objdoc;

	}
	catch(e) {

		console.log(e);

	}

}


class objDoc {

	constructor (fileName) {

		this.fileName = fileName;
		this.mtls = Array(0);
		this.vertices = Array(0);
		this.objects = Array(0);
		this.normals = Array(0);
		this.vertexTextures = Array(0);

	}
	parse (fileString, scale, reverseNormal) {

		let lines = fileString.split("\n");
		lines.push(null);
		let index =  0;
		let currentObject = null;
		let line;

		let objectName;
		let object;

		let x;
		let y;
		let z;
		let vertex;

		let u;
		let v;
		let textCoord;

		let normal;

		let face;
		while ((line = lines[index++]) != null) {

			let words = line.split(" ");
			if (words[0] == null || words[0] == "#") {

				continue;

			}
			switch(words[0]) {

			// case "#":
			// 	// skip comments
			// 	continue;
			case "mtllib":
				// read material chunk
				break;
			case "o":

				for (let i = 1;i < words.length; i++) {

					objectName = objectName + words[i];

				}
				object = new OBJObject(objectName);
				this.objects.push(object);
				currentObject = object;
				continue;
			case "v":
				x = words[1] * scale;
				y = words[2] * scale;
				z = words[3] * scale;
				vertex = new Vertex (x,y,z);
				this.vertices.push(vertex);
				continue;
			case "vt":
				u = words[1];
				v = words[2];
				// ignore depth
				textCoord = new VertexTexture (u,v);
				this.vertexTextures.push(textCoord);
				continue;
			case "vn":
				x = words[1];
				y = words[2];
				z = words[3];
				normal = new Normal (x,y,z);
				this.normals.push(normal);
				continue;
			case "f":
				face = this.parseFace(words,reverseNormal);
				currentObject.addFace(face);
				continue;

			}

		}
		return true;

	}
	parseFace (words,reverse) {

		let face = new Face();
		for (let i = 1; i < words.length;i++) {

			let word = words[i];
			if(word == null) break;

			let subWords = word.split("/");
			if(subWords.length >= 1) {

				let vi = parseInt(subWords[0]) - 1;
				face.vIndices.push(vi);

			}
			if(subWords.length >= 3) {

				let ni = parseInt(subWords[2]) - 1;
				face.nIndices.push(ni);

			}else{

				face.nIndices.push(-1);

			}
			if (subWords[1].length > 0) {

				let ti = parseInt(subWords[1]) - 1;
				face.texIndices.push(ti);

			}

		}

		// if (face.texIndices.length == face.vIndices.length){
		// 	for (let i=0;i<face.vIndices.length;i++){
		// 		this.vertices[face.texIndices]
		// 	}
		// }

		// calc normal
		let v0 = [
			this.vertices[face.vIndices[0]].x,
			this.vertices[face.vIndices[0]].y,
			this.vertices[face.vIndices[0]].z];
		let v1 = [
			this.vertices[face.vIndices[1]].x,
			this.vertices[face.vIndices[1]].y,
			this.vertices[face.vIndices[1]].z];
		let v2 = [
			this.vertices[face.vIndices[2]].x,
			this.vertices[face.vIndices[2]].y,
			this.vertices[face.vIndices[2]].z];

		// calculate surface nornal and set to normal
		let normal = calcNormal(v0, v1, v2);
		// check if the normal was found
		if (normal == null) {

			if (face.vIndices.length >= 4) {

				// if the surface is square calculate the normal using another combination of three points
				let v3 = [
					this.vertices[face.vIndices[3]].x,
					this.vertices[face.vIndices[3]].y,
					this.vertices[face.vIndices[3]].z];
				normal = calcNormal(v1, v2, v3);

			}
			if(normal == null) {

				// as the normal still wasnt found use the y-dir normal
				normal = [0.0, 1.0, 0.0];

			}

		}
		if(reverse) {

			normal[0] = -normal[0];
			normal[1] = -normal[1];
			normal[2] = -normal[2];

		}
		face.normal = new Normal(normal[0], normal[1], normal[2]);

		// Devide to triangles if face contains over 3 points.

		if(face.vIndices.length > 3) {

			let n = face.vIndices.length - 2;
			let newVIndices = new Array(n * 3);
			let newNIndices = new Array(n * 3);
			let newVTIndices = new Array(n * 3);
			for(let i = 0; i < n; i++) {

				newVIndices[i * 3 + 0] = face.vIndices[0];
				newVIndices[i * 3 + 1] = face.vIndices[i + 1];
				newVIndices[i * 3 + 2] = face.vIndices[i + 2];
				newNIndices[i * 3 + 0] = face.nIndices[0];
				newNIndices[i * 3 + 1] = face.nIndices[i + 1];
				newNIndices[i * 3 + 2] = face.nIndices[i + 2];
				newVTIndices[i * 3 + 0] = face.texIndices[0];
				newVTIndices[i * 3 + 1] = face.texIndices[i + 1];
				newVTIndices[i * 3 + 2] = face.texIndices[i + 2];

			}
			face.vIndices = newVIndices;
			face.nIndices = newNIndices;
			face.texIndices = newVTIndices;

		}
		face.numIndices = face.vIndices.length;

		return face;

	}
	getDrawingInfo () {

		// Create an arrays for vertex coordinates, normals, colors, and indices
		let numIndices = 0;
		for(let i = 0; i < this.objects.length; i++) {

			numIndices += this.objects[i].numIndices;

		}


		let numVertices = numIndices;
		let vertices = new Float32Array(numVertices * 3);
		let textCoords = new Float32Array(numVertices * 2);
		let normals = new Float32Array(numVertices * 3);
		let colors = new Float32Array(numVertices * 4);
		let indices = new Uint16Array(numIndices);

		// Set vertex, normal and color
		let index_indices = 0;
		for(let i = 0; i < this.objects.length; i++) {

			let object = this.objects[i];
			for(let j = 0; j < object.faces.length; j++) {

				let face = object.faces[j];
				let color = this.findColor(face.materialName);
				let faceNormal = face.normal;
				for(let k = 0; k < face.vIndices.length; k++) {

					// Set index
					indices[index_indices] = index_indices;
					// Copy vertex
					let vIdx = face.vIndices[k];
					let vertex = this.vertices[vIdx];

					vertices[index_indices * 3 + 0] = vertex.x;
					vertices[index_indices * 3 + 1] = vertex.y;
					vertices[index_indices * 3 + 2] = vertex.z;

					// vertex Texture Info
					// if (this.vertexTextures[vIdx]){
					// 	var vertexText = this.vertexTextures[vIdx];
					// 	textCoords[index_indices * 2 + 0] = vertexText.u;
					// 	textCoords[index_indices * 2 + 1] = vertexText.v;
					// }

					let tIdx = face.texIndices[k];
					let vertexText = this.vertexTextures[tIdx];
					textCoords[index_indices * 2 + 0] = vertexText.U;
					textCoords[index_indices * 2 + 1] = vertexText.V;
					// Copy color
					colors[index_indices * 4 + 0] = color.r;
					colors[index_indices * 4 + 1] = color.g;
					colors[index_indices * 4 + 2] = color.b;
					colors[index_indices * 4 + 3] = color.a;
					// Copy normal
					let nIdx = face.nIndices[k];
					if(nIdx >= 0) {

						let normal = this.normals[nIdx];
						normals[index_indices * 3 + 0] = normal.x;
						normals[index_indices * 3 + 1] = normal.y;
						normals[index_indices * 3 + 2] = normal.z;

					}else{

						normals[index_indices * 3 + 0] = faceNormal.x;
						normals[index_indices * 3 + 1] = faceNormal.y;
						normals[index_indices * 3 + 2] = faceNormal.z;

					}
					index_indices ++;

				}

			}

		}

		return new DrawingInfo(vertices, normals, colors, indices, textCoords);

	}
	findColor (name) {

		if (name) {

			for(let i = 0; i < this.mtls.length; i++) {

				for(let j = 0; j < this.mtls[i].materials.length; j++) {

					if(this.mtls[i].materials[j].name == name) {

						return(this.mtls[i].materials[j].color);

					}

				}

			}
			return(new Colour(0.8, 0.8, 0.8, 1));

		}
		else{

			return(new Colour(0.8, 0.8, 0.8, 1));

		}

	}

}

// #endregion obj import

class Texture {

	constructor (name,gl) {

		this.name = name;
		this.loaded = false;
		this.img = new Image();
		this.img.src = "/Texture/" + this.name;
		this.img.onload = this.onTextureLoad(gl);

	}
	onTextureLoad (gl) {

		this.textureBuffer = gl.createTexture();
		this.loaded = true;

	}
	bindTexture (gl,program) {

		if (this.img) {

			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

			// Enable texture unit0
			gl.activeTexture(gl.TEXTURE0);

			// Bind the texture object to the target

			gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
			// Set the texture image

			// console.log(this.img.src + "\t"+this.img.height+"\t"+this.img.width)
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.img);
			if (isPower2(this.img.width) && isPower2(this.img.height)) {

				gl.generateMipmap(gl.TEXTURE_2D);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

			}
			else if (this.img.width == this.img.height) {

				// console.log("square"+this.name)

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

			}
			else{

				console.log("clamp the fuck out\t" + this.name + "\t" + this.img.height + "\t" + this.img.width);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			}


			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);


			// Assign u_Sampler to TEXTURE0
			gl.uniform1i(program.u_Sampler, 0);

			// Enable texture mapping
			gl.uniform1i(program.u_UseTextures, true);

		}
		else{

			// Disable texture mapping
			gl.uniform1i(program.u_UseTextures, false);

		}

	}

}

// #region basic classes and common function
class Vertex {

	constructor (x,y,z) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

}
class VertexTexture {

	constructor (U,V) {

		this.U = U;
		this.V = V;

	}

}
class Eye {

	constructor (x,y,z) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

}
class Normal {

	constructor (x,y,z) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

}
class Colour {

	constructor (r,g,b,a) {

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;

	}

}
class Face {

	constructor () {

		this.vIndices = new Array(0);
		this.nIndices = new Array(0);
		this.texIndices = new Array(0);

	}

}
class OBJObject {

	constructor (name) {

		this.name = name;
		this.faces = new Array(0);
		this.numIndices = 0;

	}
	addFace (face) {

		this.faces.push(face);
		this.numIndices += face.numIndices;

	}

}
class DrawingInfo {

	constructor (vertices,normals,colours,indices,textCoords) {

		this.vertices = vertices;
		this.normals = normals;
		this.colours = colours;
		this.indices = indices;
		this.textCoords = textCoords;

	}

}
function isPower2 (num) {

	if ((num & (num - 1)) == 0) {

		return true;

	}
	return false;

}
function calcNormal (p0, p1, p2) {

	// v0: a vector from p1 to p0, v1; a vector from p1 to p2
	let v0 = new Float32Array(3);
	let v1 = new Float32Array(3);
	for (let i = 0; i < 3; i++) {

	  v0[i] = p0[i] - p1[i];
	  v1[i] = p2[i] - p1[i];

	}

	// The cross product of v0 and v1
	let c = new Float32Array(3);
	c[0] = v0[1] * v1[2] - v0[2] * v1[1];
	c[1] = v0[2] * v1[0] - v0[0] * v1[2];
	c[2] = v0[0] * v1[1] - v0[1] * v1[0];

	// Normalize the result
	let v = new Vector3(c);
	v.normalize();
	return v.elements;

}
// #endregion basic classes and common function


let lastTime = 0;
let deltaTime;

let startLoadAnimation = false;
let ranStartAnimation = false;
let lightAnimation = false;
let deltaFlash = 3;
let lightMoveAnimation = false;
let lightTime = 0;

let angle;
function update (currTime) {

	deltaTime = (currTime - lastTime) / 1000;

	if (!ranStartAnimation) {

		if (startLoadAnimation) {

			Scene1.walls.children[0].updateRot(new Vector3([0,0,-deltaTime * 45]));
			Scene1.walls.children[1].updateRot(new Vector3([deltaTime * 45,0,0]));
			Scene1.walls.children[2].updateRot(new Vector3([0,0,deltaTime * 45]));
			Scene1.walls.children[3].updateRot(new Vector3([-deltaTime * 45,0,0]));

			if (Scene1.walls.children[0].rotation.elements[2] < -90) {

				ranStartAnimation = true;

			}

		}

	}

	if (lightAnimation) {

		deltaFlash -= deltaTime;
		if (deltaFlash < 0)
		{
			
		}

	}


	if (lightMoveAnimation) {


		lightTime += deltaTime;

		let angle = Math.cos(2 * Math.PI * lightTime) * Math.exp(-lightTime / 4) * 2;
		Scene1.fitting.updateRot(new Vector3([angle,0,angle]));


		Scene1.lightPosition.elements[0] = Scene1.fitting.children[0].children[0].modelMatrix.elements[12];
		Scene1.lightPosition.elements[1] = Scene1.fitting.children[0].children[0].modelMatrix.elements[13] - 1;
		Scene1.lightPosition.elements[2] = Scene1.fitting.children[0].children[0].modelMatrix.elements[14];

		if (lightTime > 10) {

			lightMoveAnimation = false;
			lightTime = 0;
			let temp = Scene1.fitting.rotation;

			Scene1.fitting.updateRot(new Vector3([temp.elements[0] * -1,0,temp.elements[2]]));

		}

	}


	Scene1.updateCamera(deltaTime);
	Scene1.draw();

	lastTime = currTime;
	window.requestAnimationFrame(update);

}


function printMatrix (mat,name,round) {

	if (name) {

		console.log("--------------Start  " + name + "--------------");

	}
	else{

		console.log("--------------Start  mat4--------------");

	}

	// console.log("| "+Math.round(mat.elements[0]*100)/100+", "+Math.round(mat.elements[4]*100)/100+", "+Math.round(mat.elements[8]*100)/100+", "+Math.round(mat.elements[12]*100)/100+" |");
	// console.log("| "+Math.round(mat.elements[1]*100)/100+", "+Math.round(mat.elements[5]*100)/100+", "+Math.round(mat.elements[9]*100)/100+", "+Math.round(mat.elements[13]*100)/100+" |");
	// console.log("| "+Math.round(mat.elements[2]*100)/100+", "+Math.round(mat.elements[6]*100)/100+", "+Math.round(mat.elements[10]*100)/100+", "+Math.round(mat.elements[14]*100)/100+" |");
	// console.log("| "+Math.round(mat.elements[3]*100)/100+", "+Math.round(mat.elements[7]*100)/100+", "+Math.round(mat.elements[11]*100)/100+", "+Math.round(mat.elements[15]*100)/100+" |");


	console.log("| " + mat.elements[0] + ", " + mat.elements[4] + ", " + mat.elements[8] + ", " + mat.elements[12] + " |");
	console.log("| " + mat.elements[1] + ", " + mat.elements[5] + ", " + mat.elements[9] + ", " + mat.elements[13] + " |");
	console.log("| " + mat.elements[2] + ", " + mat.elements[6] + ", " + mat.elements[10] + ", " + mat.elements[14] + " |");
	console.log("| " + mat.elements[3] + ", " + mat.elements[7] + ", " + mat.elements[11] + ", " + mat.elements[15] + " |");

	console.log("--------------END--------------");

}


let Scene1;
var keypressed = {};
function main () {

	  // Retrieve <canvas> element

  	let canvas = document.getElementById("webgl");

  	// Get the rendering context for WebGL
	let gl = getWebGLContext(canvas);
	if (!gl) {

		console.log("Failed to get the rendering context for WebGL");
		return;

	}

	  Scene1 = new Scene(gl,canvas);

	let woodText = new Texture("table",Scene1.gl,Scene1.program);
	let carpet = new Texture("carpet",Scene1.gl,Scene1.program);
	let sofa1Text = new Texture("sofa1",Scene1.gl,Scene1.program);
	let sofa2Text = new Texture("sofa2",Scene1.gl,Scene1.program);
	let ceramic = new Texture("ceramic",Scene1.gl,Scene1.program);
	let shadeText = new Texture("shade",Scene1.gl,Scene1.program);

	let TVtext1 = new Texture("TV1",Scene1.gl,Scene1.program);
	let TVtext2 = new Texture("TV2",Scene1.gl,Scene1.program);
	let TVtext3 = new Texture("TV3",Scene1.gl,Scene1.program);
	let TVtext4 = new Texture("TV4",Scene1.gl,Scene1.program);
	let metalText = new Texture("metal",Scene1.gl,Scene1.program);
	let wallText = new Texture("wall",Scene1.gl,Scene1.program);


	// #region Table
	let tableParent = Scene1.newModel("tableParent",2);
	let tableTop = Scene1.newModel("tableTop",0);
	let leg1 = Scene1.newModel("tableLeg",0);
	let leg2 = Scene1.newModel("tableLeg",0);
	let leg3 = Scene1.newModel("tableLeg",0);
	let leg4 = Scene1.newModel("tableLeg",0);
	tableParent.addChild(tableTop);
	tableParent.addChild(leg1);
	tableParent.addChild(leg2);
	tableParent.addChild(leg3);
	tableParent.addChild(leg4);


	leg1.updatePos(new Vector3([3,0,8]));
	leg1.updateScale(new Vector3([1,0.7,1]));


	leg2.updatePos(new Vector3([-3,0,8]));
	leg2.updateScale(new Vector3([1,0.7,1]));

	leg3.updateRot(new Vector3([0,180,0]));
	leg3.updatePos(new Vector3([-3,0,-8]));
	leg3.updateScale(new Vector3([1,0.7,1]));


	leg4.updateRot(new Vector3([0,180,0]));
	leg4.updatePos(new Vector3([3,0,-8]));
	leg4.updateScale(new Vector3([1,0.7,1]));


	tableParent.updatePos(new Vector3([0,-0.9,0]));

	tableParent.updateScale(new Vector3([0.7,0.2,0.7]));

	let mug = Scene1.newModel("mug",0);
	mug.updateScale(new Vector3([0.6,0.6,0.6]));
	mug.updatePos(new Vector3([0,-0.6,-3.5]));
	let plate = Scene1.newModel("plate",0);
	plate.updateScale(new Vector3([1.1,1.1,1.1]));
	plate.updatePos(new Vector3([0.8,-0.4,0]));

	mug.textures.push(ceramic);
	plate.textures.push(ceramic);
	leg1.textures.push(woodText);
	leg2.textures.push(woodText);
	leg3.textures.push(woodText);
	leg4.textures.push(woodText);
	tableTop.textures.push(woodText);


	// #endregion Table


	// #region sofas

	let sofa1 = Scene1.newModel("sofa1",0);
	sofa1.updatePos(new Vector3([8.9,-2.5,1.2]));


	let sofa2 = Scene1.newModel("sofa2",0);
	sofa2.updatePos(new Vector3([5,-2.5,9.5]));
	sofa2.updateRot(new Vector3([0,-30,0]));
	sofa2.updatePos(new Vector3([1.2,0,0]));

	let sofa3 = Scene1.newModel("sofa2",0);
	sofa3.updatePos(new Vector3([6,-2.5,-6]));
	sofa3.updateRot(new Vector3([0,30,0]));
	sofa3.updatePos(new Vector3([2.5,0,1]));

	sofa1.textures.push(sofa1Text);
	sofa2.textures.push(sofa2Text);
	sofa3.textures.push(sofa2Text);

	// #endregion sofas


	let TVStand = Scene1.newModel("TV_Stand",0);
	TVStand.updatePos(new Vector3([-8,-1.7,3.6]));
	TVStand.updateScale(new Vector3([0.8,0.9,1]));
	let StandText = new Texture("table",Scene1.gl,Scene1.program);
	TVStand.textures.push(StandText);

	let TV = Scene1.newModel("TV",0);
	TV.updatePos(new Vector3([-8,0.3,0]));
	TV.updateScale(new Vector3([0.5,0.6,0.6]));


	TV.textures.push(TVtext1);
	TV.textures.push(TVtext2);
	TV.textures.push(TVtext3);
	TV.textures.push(TVtext4);


	let soundbar = Scene1.newModel("Soundbar",0);
	soundbar.updatePos(new Vector3([-8,-1.5,-0.2]));
	soundbar.updateScale(new Vector3([0.5,0.5,0.4]));
	soundbar.textures.push(metalText);

	let floor = Scene1.newModel("quad",0);
	floor.updatePos(new Vector3([0,-3,0]));
	floor.updateScale(new Vector3([10,1,10]));

	floor.textures.push(carpet);


	let lightFitting = Scene1.newModel("fitting",2);

	let cable1 = Scene1.newModel("lightCable",0);
	let cable2 = Scene1.newModel("lightCable",0);


	let bulb = Scene1.newModel("bulb",0);
	let shade = Scene1.newModel("shade",0);
	lightFitting.children.push(cable1);
	cable1.children.push(cable2);
	cable2.children.push(bulb);
	cable2.children.push(shade);

	bulb.updateRot(new Vector3([180,0,0]));
	bulb.updateScale(new Vector3([0.6,0.6,0.6]));

	shade.updatePos(new Vector3([0,1,0]));

	cable2.updatePos(new Vector3([0,-3.4,0]));

	cable1.updatePos(new Vector3([0,-3.4,0]));

	lightFitting.updatePos(new Vector3([0,15,0]));
	lightFitting.updateScale(new Vector3([0.4,0.4,0.4]));

	Scene1.fitting = lightFitting;

	// #region walls
	let wallsRoot = Scene1.newModel("wallRoot",2);

	let wall1Parent = Scene1.newModel("wall1Parent",2);
	let wall1 =  Scene1.newModel("wall",0);
	wall1.updateRot(new Vector3([0,90,0]));
	wall1.updateScale(new Vector3([1,2.5,2.5]));


	wall1Parent.children.push(wall1);

	wall1Parent.updatePos(new Vector3([9.8,-2.8,0]));

	wallsRoot.children.push(wall1Parent);

	let wall2Parent = Scene1.newModel("wall2Parent",2);
	let wall2 =  Scene1.newModel("wall",0);

	wall2.updateScale(new Vector3([2.51,2.5,1]));
	wall2Parent.children.push(wall2);
	wall2Parent.updatePos(new Vector3([0,-2.8,9.8]));

	wallsRoot.children.push(wall2Parent);

	let wall3Parent = Scene1.newModel("wall3Parent",2);
	let wall3 =  Scene1.newModel("wall",0);

	wall3.updateRot(new Vector3([0,90,0]));
	wall3.updateScale(new Vector3([1,2.5,2.5]));
	wall3Parent.children.push(wall3);
	wall3Parent.updatePos(new Vector3([-9.8,-2.8,0]));

	wallsRoot.children.push(wall3Parent);

	let wall4Parent = Scene1.newModel("wall4Parent",2);
	let wall4 =  Scene1.newModel("wall",0);


	wall4.updateScale(new Vector3([2.51,2.5,1]));
	wall4Parent.children.push(wall4);
	wall4Parent.updatePos(new Vector3([0,-2.8,-9.8]));

	wallsRoot.children.push(wall4Parent);

	wall1.textures.push(wallText);
	wall2.textures.push(wallText);
	wall3.textures.push(wallText);
	wall4.textures.push(wallText);


	Scene1.walls = wallsRoot;

	// #endregion walls

	document.onkeydown = function (ev) {

		// for events on update/ multi key presses
		keypressed[ev.keyCode] = true;

		// events on key press
		if (keypressed["84"]) {

			// use for specific model ie TV for changing image
			// t pressed
			TV.changeTexture();

		}
		if (keypressed["32"]) {

			// initial load
			// spacebar pressed
			startLoadAnimation = true;

		}
		if (keypressed["76"]) {

			// l pressed
			lightAnimation = !lightAnimation;
			if (!lightAnimation) {

				Scene1.lightScalar = 0.65;

			}

		}
		if (keypressed["77"]) {

			// m pressed
			lightMoveAnimation = true;

		}
		// if (keypressed["48"]){
		// 	// 0 pressed
		// 	lightMoveAnimation = false;

		// }


	};
	document.onkeyup = function (ev) {

		keypressed[ev.keyCode] = false;

	};
	window.requestAnimationFrame(update);

}

