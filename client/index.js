// import { mat4, vec3 } from "./lib/gl-matrix";

class Scene{
	constructor(gl,canvas){
		this.gl = gl;
		this.canvas = canvas;
		// point light per fragment
		var VSHADER_SOURCE =
		'#ifdef GL_ES\n' +
		'precision mediump float;\n' +
		'#endif\n' +
		'attribute vec4 a_Position;\n' +
		'attribute vec4 a_Color;\n' +
		'attribute vec4 a_Normal;\n' +        // Normal
		'uniform mat4 u_ModelMatrix;\n' +
		'uniform mat4 u_NormalMatrix;\n' +
		'uniform mat4 u_ViewMatrix;\n' +
		'uniform mat4 u_ProjMatrix;\n' +
		'uniform vec3 u_LightColor;\n' +     // Light color
		'uniform vec3 u_LightPosition;\n' + // Light direction (in the world coordinate, normalized)
		"uniform vec3 u_AmbientLight;\n" +
		'varying vec4 v_Color;\n' +
		"varying vec3 v_Normal;\n" +
		"varying vec3 v_Position;\n" +
		'uniform bool u_isLighting;\n' +
		'void main() {\n' +
		'  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
		'  if(u_isLighting)\n' + 
		'  {\n' +
		"	v_Position = vec3(u_ModelMatrix * a_Position);\n"+
		"	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n"+
		' 	v_Color = a_Color;\n' +'  }\n' +
		'  else\n' +
		'  {\n' +
		'     v_Color = a_Color;\n' +
		'  }\n' + 
		'}\n';
		  // Fragment shader program for point light
		var FSHADER_SOURCE =
		'#ifdef GL_ES\n' +
		'precision mediump float;\n' +
		'#endif\n' +
		'uniform vec3 u_LightColor;\n' +	//light colour
		"uniform vec3 u_LightPosition;\n"+	//position of the light source
		"uniform vec3 u_AmbientLight;\n" + 	//ambient light colour
		'varying vec3 v_Normal;\n' +
		'varying vec3 v_Position;\n' +
		'varying vec4 v_Color;\n' +
		'void main() {\n' +
		// Normalize normal because it's interpolated and not 1.0 (length)
		"	vec3 normal = normalize(v_Normal);\n"+
		// Calculate the light direction and make it 1.0 in length
		"	vec3 lightDirection = normalize(u_LightPosition - v_Position);\n"+
		// The dot product of the light direction and the normal
		"	float nDotL = max(dot(lightDirection,normal),0.0);\n"+
		// Calculate the final color from diffuse and ambient reflection
		"	vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n"+
		"	vec3 ambient = u_AmbientLight * v_Color.rgb;\n"+
		'  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
		'}\n';



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
			console.log('Failed to intialize shaders.');
			return;
		}
		this.program = this.gl.program;
		this.viewMatrix = new Matrix4();  // The view matrix
		this.projMatrix = new Matrix4();  // The projection matrix
		this.models = [];
		// Set clear color to white and enable hidden surface removal
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Clear color and depth buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Get the storage locations of uniform attributes
		
		// var u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
		this.program.a_Position = this.gl.getAttribLocation(this.program, 'a_Position');
		this.program.a_Normal = this.gl.getAttribLocation(this.program, 'a_Normal');
		this.program.a_Color = this.gl.getAttribLocation(this.program, 'a_Color');
		this.program.u_ViewMatrix = this.gl.getUniformLocation(this.program, 'u_ViewMatrix');
		this.program.u_ModelMatrix = this.gl.getUniformLocation(this.program, 'u_ModelMatrix');
		this.program.u_NormalMatrix = this.gl.getUniformLocation(this.program,"u_NormalMatrix");
		this.program.u_ProjMatrix = this.gl.getUniformLocation(this.program, 'u_ProjMatrix');
		this.program.u_LightColor = this.gl.getUniformLocation(this.program, 'u_LightColor');
		this.program.u_LightPosition = this.gl.getUniformLocation(this.program, 'u_LightPosition');
		this.program.u_AmbientLight = this.gl.getUniformLocation(this.program, 'u_AmbientLight');

		// Trigger using lighting or not
		this.program.u_isLighting = this.gl.getUniformLocation(this.gl.program, 'u_isLighting'); 

		if (!this.program.u_ViewMatrix || !this.program.u_LightPosition || !this.program.u_ProjMatrix ) { 
			console.log('Failed to Get the storage locations of u_ViewMatrix, and/or u_ProjMatrix');
			return;
		}

		// Set the light color (white)
		this.gl.uniform3f(this.program.u_LightColor, 1, 1, 1);
		this.gl.uniform3f(this.program.u_AmbientLight, 0.2, 0.2, 0.2);
		this.gl.uniform3f(this.program.u_LightPosition, -2, -2, -2);

		// Calculate the view matrix and the projection matrix

		this.eye = new Eye(0.5,0,10);
	
		this.viewMatrix.setLookAt(this.eye.x, this.eye.y, this.eye.z, 0, 0, 0, 0, 1.0, 0.0);
		this.projMatrix.setPerspective(90, this.canvas.width/this.canvas.height, 1, 100);

		// Pass the model, view, and projection matrix to the uniform variable respectively
		this.gl.uniformMatrix4fv(this.program.u_ViewMatrix, false, this.viewMatrix.elements);
		this.gl.uniformMatrix4fv(this.program.u_ProjMatrix, false, this.projMatrix.elements);

		this.gl.uniform1i(this.program.u_isLighting, true); // Will apply lighting
		this.depth = -10;

	}
	newModel(name,primitive, pos, scale){

		var model = new Model({"filename":name,"gl":this.gl,"program":this.program, "pos": pos, "scale":scale,"primitiveBool": primitive});
		if (!primitive){
			readOBJFile(name,this.gl,this.program,model,1,0);
		}
		else{
			model.initVertexBuffers(this.gl,this.program);
			model.initCube();
		}


		this.models.push(model);
		return model;

	}
	draw(){
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); 
		for (let i=0;i<this.models.length;i++){

			if (this.models[i].drawingInfo){
				this.models[i].bindBuffers(this.gl,this.program);
				// console.log(this.models[i].drawingInfo);
				if (this.models[i].primitive){
					this.gl.drawElements(this.gl.TRIANGLES, this.models[i].drawingInfo.indices.length, this.gl.UNSIGNED_BYTE, 0);
				}
				else{
					this.gl.drawElements(this.gl.TRIANGLES, this.models[i].drawingInfo.indices.length, this.gl.UNSIGNED_SHORT, 0);
				}
				
			}
		}
	}
	updateCamera(){
		keypressed
		this.rate = 1;
		
		if (keypressed["37"]==true){
			// console.log("left arrow pressed");
			this.eye.y+=this.rate/60;
		}
		if(keypressed["38"]==true){
			// console.log("up arrow clicked")
			// this.eye.x+=this.rate/60;
			var temp = this.eye.x+this.rate/60;
			if (temp>1.1){
				this.eye.x = 1.1;
			}
			else{
				this.eye.x = temp;
			}

		}
		if (keypressed["39"]==true){
			// console.log("right arrow clicked")
			this.eye.y-=this.rate/60;
		}
		if (keypressed["40"]==true){
			// console.log("down arrow clicked")
			// this.eye.x-=this.rate/60;

			var temp = this.eye.x-this.rate/60;
			if (temp<-0.35){
				this.eye.x = -0.35;
			}
			else{
				this.eye.x = temp;
			}
		}
		if (keypressed["87"]==true){
			var temp = this.depth+this.rate/10;
			if (temp>-6.5){
				this.depth = -6.5;
			}
			else{
				this.depth = temp;
			}
		}
		if (keypressed["83"]==true){
			var temp = this.depth-this.rate/10;
			if (temp<-30){
				this.depth = -30;
			}
			else{
				this.depth = temp;
			}
		}


		this.viewMatrix= new Matrix4().setIdentity();

		mat4.translate(this.viewMatrix.elements,this.viewMatrix.elements, vec3.fromValues(0,0,this.depth));
		mat4.rotateX(this.viewMatrix.elements,this.viewMatrix.elements, this.eye.x);
		mat4.rotateY(this.viewMatrix.elements,this.viewMatrix.elements, this.eye.y);

		this.gl.uniformMatrix4fv(this.program.u_ViewMatrix, false, this.viewMatrix.elements);
	}
}



class Model {


	constructor({filename,gl,program, pos, scale, rot, primitiveBool}){
		this.name = filename;

		
		
		// Coordinate transformation matrix
		this.primitive = primitiveBool;
		this.modelMatrix = new Matrix4();
		this.normalMatrix = new Matrix4();
		this.initVertexBuffers(gl,program);
		this.modelMatrix.setTranslate(0,0,0);


		if (pos){
			this.modelMatrix.translate(pos.elements[0],pos.elements[1],pos.elements[2]); 
		}
		else{
			this.modelMatrix.translate(0,0,0);
		}
		if (scale){
			this.modelMatrix.scale(scale.elements[0],scale.elements[1],scale.elements[2]);
		}
		else{
			this.modelMatrix.scale(1,1,1);
		}
		if (rot){
			this.modelMatrix.rotate(rot.elements[1],0,1,0);
			this.modelMatrix.rotate(rot.elements[0],1,0,0);
			this.modelMatrix.rotate(rot.elements[2],0,0,1);
		}


		this.children = [];

	}

	addChild(model){
		this.children.push(model);
		var newChildMatrix = new Matrix4(this.modelMatrix);
		model.modelMatrix = newChildMatrix;
	}

	// updateTransforms(pos, scale, rot){
		
	// 	if (pos){
	// 		this.modelMatrix.translate(pos.elements[0],pos.elements[1],pos.elements[2]); 
	// 	}
	// 	if (scale){
	// 		this.modelMatrix.scale(scale.elements[0],scale.elements[1],scale.elements[2]);
	// 	}

	// 	if (rot){
	// 		this.modelMatrix.rotate(rot.elements[1],0,1,0);
	// 		this.modelMatrix.rotate(rot.elements[0],1,0,0);
	// 		this.modelMatrix.rotate(rot.elements[2],0,0,1);
	// 	}
	// 	for (let i=0;i<this.children.length;i++){
	// 		this.children[i].updateTransforms(pos,scale,rot);
	// 	}
	// }

	updateTransforms(pos, scale, rot){
		
		if (pos){
			this.updatePos(pos);
		}
		if (scale){
			this.updateScale(scale);
		}

		if (rot){
			this.modelMatrix.rotate(rot.elements[1],0,1,0);
			this.modelMatrix.rotate(rot.elements[0],1,0,0);
			this.modelMatrix.rotate(rot.elements[2],0,0,1);
		}
		// for (let i=0;i<this.children.length;i++){
		// 	this.children[i].updateTransforms(pos,scale,rot);
		// }
	}

	updatePos(pos){
		if (pos){
			this.modelMatrix.translate(pos.elements[0],pos.elements[1],pos.elements[2]); 
		}
		for (let i=0;i<this.children.length;i++){
			this.children[i].updatePos(pos);
		}
	}
	updateScale(scale){
		if (scale){
			this.modelMatrix.scale(scale.elements[0],scale.elements[1],scale.elements[2]);
		}
		for (let i=0;i<this.children.length;i++){
			this.children[i].updateScale(scale);
		}
	}
	updateRot(rot){
		if (rot){
			this.modelMatrix.rotate(rot.elements[1],0,1,0);
			this.modelMatrix.rotate(rot.elements[0],1,0,0);
			this.modelMatrix.rotate(rot.elements[2],0,0,1);
		}
		for (let i=0;i<this.children.length;i++){
			this.children[i].updateRot(rot);
		}
	}

	createEmptyArrayBuffer(gl, a_attribute, num, type){
		var buffer = gl.createBuffer();
		if (!buffer) {
			console.log('Failed to create the buffer object');
			return null;
		  }
		gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
		// var FSIZE = this.drawingInfo.vertices.BYTES_PER_ELEMENT;
		// gl.vertexAttribPointer(a_attribute,num,type,false,FSIZE *num,0);

		gl.vertexAttribPointer(a_attribute,num,type,false,0,0);
		gl.enableVertexAttribArray(a_attribute);
		return buffer;
	}

	initVertexBuffers(gl,program){

		this.setVertexBuffer(this.createEmptyArrayBuffer(gl,program.a_Position,3,gl.FLOAT));
		this.setNormalBuffer(this.createEmptyArrayBuffer(gl,program.a_Normal,3,gl.FLOAT));
		if (this.primitive){
			this.setColourBuffer(this.createEmptyArrayBuffer(gl,program.a_Color,3,gl.FLOAT));
		}
		else{
			this.setColourBuffer(this.createEmptyArrayBuffer(gl,program.a_Color,4,gl.FLOAT));
		}
		
		this.setIndexBuffer(gl.createBuffer());
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	bindBuffers(gl,program){
		// get drawing info
		// Acquire the vertex coordinates and colors from OBJ file
		this.initVertexBuffers(gl,program);
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

		this.normalMatrix.setInverseOf(this.modelMatrix);
		this.normalMatrix.transpose();

		gl.uniformMatrix4fv(program.u_NormalMatrix, false, this.normalMatrix.elements);

		gl.uniformMatrix4fv(program.u_ModelMatrix, false, this.modelMatrix.elements);
	}

	// #region Getters and Setters 
	setVertexBuffer(newVB){
		this.vertexBuffer = newVB;
	}
	setNormalBuffer(newNB){
		this.normalBuffer = newNB;
	}
	setColourBuffer(newCB){
		this.colourBuffer = newCB;
	}
	setIndexBuffer(newIB){
		this.indexBuffer = newIB;
	}
	getVertexBuffer(){
		return this.vertexBuffer;
	}
	getNormalBuffer(){
		return this.normalBuffer;
	}
	getColourBuffer(){
		return this.colourBuffer;
	}
	// #endregion 

	initCube(){
		// Create a cube
		//    v6----- v5
		//   /|      /|
		//  v1------v0|
		//  | |     | |
		//  | |v7---|-|v4
		//  |/      |/
		//  v2------v3
		
		var vertices = new Float32Array([   // Coordinates
			0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, // v0-v1-v2-v3 front
			0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, // v0-v3-v4-v5 right
			0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
		   -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, // v1-v6-v7-v2 left
		   -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, // v7-v4-v3-v2 down
			0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5  // v4-v7-v6-v5 back
		 ]);
		 for (let i=0;i<vertices.length;i++){
			 vertices[i]*=2;
		 }
	   
	   
		 var colors = new Float32Array([    // Colors
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
		   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
		]);
	   
	   
		 var normals = new Float32Array([    // Normal
		   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
		   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
		   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
		  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
		   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
		   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
		 ]);
	   
	   
		 // Indices of the vertices
		 var indices = new Uint8Array([
			0, 1, 2,   0, 2, 3,    // front
			4, 5, 6,   4, 6, 7,    // right
			8, 9,10,   8,10,11,    // up
		   12,13,14,  12,14,15,    // left
		   16,17,18,  16,18,19,    // down
		   20,21,22,  20,22,23     // back
		]);

		this.drawingInfo = new DrawingInfo(vertices,normals,colors,indices);
	}
	
}

function readOBJFile(fileName, gl,program, model, scale, reverse){

	var request = new XMLHttpRequest();
	request.onreadystatechange = function (){
		if (request.readyState === 4 && request.status !== 404) {
			onReadOBJFile(request.responseText, fileName, scale, reverse)
			.then(function(objDoc){

					model.objdoc = objDoc;
					model.drawingInfo = model.objdoc.getDrawingInfo();
					model.read = true;
					console.log("loaded")
					// model.onReadComplete(gl,program);
					// model.draw(gl,program);

				}
			); 
		}
	}
	request.open("GET",fileName,true);
	request.send();
}

async function onReadOBJFile(fileString, fileName, scale, reverse){
	try{
		var objdoc = new objDoc(fileName);
		var result = await objdoc.parse(fileString, scale, reverse);
		if (!result) {

			console.log("OBJ file parsing error.");
			return;
		}
		return objdoc;
	}
	catch(e){
		console.log(e);
	}

}


class objDoc{
	constructor(fileName){
		this.fileName = fileName;
		this.mtls = Array(0);
		this.vertices = Array(0);
		this.objects = Array(0);
		this.normals = Array(0);

	}
	parse(fileString, scale, reverseNormal){
		var lines = fileString.split("\n");
		lines.push(null);
		var index =  0;
		var currentObject = null;
		var currentMaterialName = "";
		var line;
		while ((line=lines[index++])!=null){
			var words = line.split(" ");
			if (words[0] == null || words[0]=="#"){
				continue;
			}
			switch(words[0]){
				// case "#":
				// 	// skip comments
				// 	continue;
				case "mtllib":
					// read material chunk
					break;
				case "o":
					var objectName
					for (var i=1;i<words.length; i++){
						objectName = objectName + words[i];
					}
					var object = new OBJObject(objectName)
					this.objects.push(object);
					currentObject = object;
					continue;
				case "v":
					var x = words[1]*scale;
					var y = words[2]*scale;
					var z = words[3]*scale;
					var vertex = new Vertex (x,y,z);
					this.vertices.push(vertex);
					continue;
				case "vn":
					var x = words[1];
					var y = words[2];
					var z = words[3];
					var normal = new Normal (x,y,z);
					this.normals.push(normal);
					continue;
				case "f":
					var face = this.parseFace(words,reverseNormal);
					currentObject.addFace(face);
					continue;
			}
		}
		return true;
	}
	parseFace(words,reverse){
		var face = new Face();
		for (var i=1; i<words.length;i++){
			let word = words[i];
			if(word == null) break;

			var subWords = word.split('/');

			if(subWords.length >= 1){
			  var vi = parseInt(subWords[0]) - 1;
			  face.vIndices.push(vi);
			}
			if(subWords.length >= 3){
			  var ni = parseInt(subWords[2]) - 1;
			  face.nIndices.push(ni);
			}else{
			  face.nIndices.push(-1);
			}
		}
		// calc normal

		var v0 = [
		this.vertices[face.vIndices[0]].x,
		this.vertices[face.vIndices[0]].y,
		this.vertices[face.vIndices[0]].z];
		var v1 = [
			this.vertices[face.vIndices[1]].x,
			this.vertices[face.vIndices[1]].y,
			this.vertices[face.vIndices[1]].z];
		var v2 = [
			this.vertices[face.vIndices[2]].x,
			this.vertices[face.vIndices[2]].y,
			this.vertices[face.vIndices[2]].z];
		
		// calculate surface nornal and set to normal
		var normal = calcNormal(v0, v1, v2);
		// check if the normal was found
		if (normal == null) {
			if (face.vIndices.length >= 4) { 
				// if the surface is square calculate the normal using another combination of three points
				var v3 = [
					this.vertices[face.vIndices[3]].x,
					this.vertices[face.vIndices[3]].y,
					this.vertices[face.vIndices[3]].z];
				normal = calcNormal(v1, v2, v3);
			}
			if(normal == null){
				// as the normal still wasnt found use the y-dir normal
			  	normal = [0.0, 1.0, 0.0];
			}
		}
		if(reverse){
			normal[0] = -normal[0];
			normal[1] = -normal[1];
			normal[2] = -normal[2];
		}
		face.normal = new Normal(normal[0], normal[1], normal[2]);

		// Devide to triangles if face contains over 3 points.

		if(face.vIndices.length > 3){
			var n = face.vIndices.length - 2;
			var newVIndices = new Array(n * 3);
			var newNIndices = new Array(n * 3);
			for(var i=0; i<n; i++){
			  newVIndices[i * 3 + 0] = face.vIndices[0];
			  newVIndices[i * 3 + 1] = face.vIndices[i + 1];
			  newVIndices[i * 3 + 2] = face.vIndices[i + 2];
			  newNIndices[i * 3 + 0] = face.nIndices[0];
			  newNIndices[i * 3 + 1] = face.nIndices[i + 1];
			  newNIndices[i * 3 + 2] = face.nIndices[i + 2];
			}
			face.vIndices = newVIndices;
			face.nIndices = newNIndices;
		  }
		  face.numIndices = face.vIndices.length;
		
		  return face;

	}
	getDrawingInfo(){
		  // Create an arrays for vertex coordinates, normals, colors, and indices
		  var numIndices = 0;
		  for(var i = 0; i < this.objects.length; i++){
			numIndices += this.objects[i].numIndices;
		  }
		  var numVertices = numIndices;
		  var vertices = new Float32Array(numVertices * 3);
		  var normals = new Float32Array(numVertices * 3);
		  var colors = new Float32Array(numVertices * 4);
		  var indices = new Uint16Array(numIndices);
		
		  // Set vertex, normal and color
		  var index_indices = 0;
		  for(var i = 0; i < this.objects.length; i++){
			var object = this.objects[i];
			for(var j = 0; j < object.faces.length; j++){
			  var face = object.faces[j];
			  var color = this.findColor(face.materialName);
			  var faceNormal = face.normal;
			  for(var k = 0; k < face.vIndices.length; k++){
				// Set index
				indices[index_indices] = index_indices;
				// Copy vertex
				var vIdx = face.vIndices[k];
				var vertex = this.vertices[vIdx];
				vertices[index_indices * 3 + 0] = vertex.x;
				vertices[index_indices * 3 + 1] = vertex.y;
				vertices[index_indices * 3 + 2] = vertex.z;
				// Copy color
				colors[index_indices * 4 + 0] = color.r;
				colors[index_indices * 4 + 1] = color.g;
				colors[index_indices * 4 + 2] = color.b;
				colors[index_indices * 4 + 3] = color.a;
				// Copy normal
				var nIdx = face.nIndices[k];
				if(nIdx >= 0){
				  var normal = this.normals[nIdx];
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
		
		  return new DrawingInfo(vertices, normals, colors, indices);
	}
	findColor(name){
		if (name){
			for(var i = 0; i < this.mtls.length; i++){
				for(var j = 0; j < this.mtls[i].materials.length; j++){
					if(this.mtls[i].materials[j].name == name){
					return(this.mtls[i].materials[j].color)
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

class Vertex{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
class Eye{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Normal {
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
class Colour {
	constructor(r,g,b,a){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
}
class Face{
	constructor(){
		this.vIndices = new Array(0);
		this.nIndices = new Array(0);
	}
}
class OBJObject {
	constructor (name){
		this.name = name;
		this.faces = new Array(0);
		this.numIndices = 0;
	}
	addFace(face){
		this.faces.push(face);
		this.numIndices += face.numIndices;
	}
}
class DrawingInfo{
	constructor(vertices,normals,colours,indices){
		this.vertices = vertices;
		this.normals = normals;
		this.colours = colours;
		this.indices = indices;
	}
}

function calcNormal(p0, p1, p2) {
	// v0: a vector from p1 to p0, v1; a vector from p1 to p2
	var v0 = new Float32Array(3);
	var v1 = new Float32Array(3);
	for (var i = 0; i < 3; i++){
	  v0[i] = p0[i] - p1[i];
	  v1[i] = p2[i] - p1[i];
	}
  
	// The cross product of v0 and v1
	var c = new Float32Array(3);
	c[0] = v0[1] * v1[2] - v0[2] * v1[1];
	c[1] = v0[2] * v1[0] - v0[0] * v1[2];
	c[2] = v0[0] * v1[1] - v0[1] * v1[0];
  
	// Normalize the result
	var v = new Vector3(c);
	v.normalize();
	return v.elements;
  }



function update(){
	
	Scene1.updateCamera();

	Scene1.draw();
	window.requestAnimationFrame(update);
}



var keypressed = {};
function main() {
  	// Retrieve <canvas> element
  	var canvas = document.getElementById('webgl');

  	// Get the rendering context for WebGL
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

  	Scene1 = new Scene(gl,canvas);

  	var basicCube = Scene1.newModel("cube",false);
//   var newCube2 = Scene1.newModel("cube",false);
//   var newCube3 = Scene1.newModel("cube",false);
// //   newCube3.updateTransforms(new Vector3([-2,-2,-2]));
//   newCube2.addChild(newCube3);

//   newCube3.updateTransforms(new Vector3([2,2,2]));
//   newCube2.updateTransforms(undefined, new Vector3([0.1,0.1,0.1]))
//   newCube3.updateTransforms(undefined, new Vector3([10,10,10]));
// //   newCube2.modelMatrix.translate(3,3,3);
// //   var mug = Scene1.newModel("mug",false);
// //   mug.modelMatrix.translate(-3,-3,-3);


	//#region Table

	var tableTop = Scene1.newModel("tableTop",true);
	tableTop.updateTransforms(undefined, new Vector3([6,0.5,3]))


	var leg1 = Scene1.newModel("leg1",true);
	tableTop.addChild(leg1);
	leg1.modelMatrix.setIdentity();
	leg1.updateTransforms(new Vector3([8,-1.2,3]),new Vector3([0.6,2,0.6]));

	var leg2 = Scene1.newModel("leg2",true);
	tableTop.addChild(leg2);
	leg2.modelMatrix.setIdentity();
	leg2.updateTransforms(new Vector3([-8,-1.2,3]),new Vector3([0.6,2,0.6]));

	var leg3 = Scene1.newModel("leg3",true);
	tableTop.addChild(leg3);
	leg3.modelMatrix.setIdentity();
	leg3.updateTransforms(new Vector3([-8,-1.2,-3]),new Vector3([0.6,2,0.6]));

	var leg4 = Scene1.newModel("leg4",true);
	tableTop.addChild(leg4);
	leg4.modelMatrix.setIdentity();
	leg4.updateTransforms(new Vector3([8,-1.2,-3]),new Vector3([0.6,2,0.6]));

	// tableTop.updateTransforms(undefined, new Vector3([0.5,0.5,0.5]))
	tableTop.updateTransforms(new Vector3([0,-2,0]))
	// console.log(tableTop.modelMatrix);
	// tableTop.modelMatrix.elements = mat4.multiplyScalar(tableTop.modelMatrix.elements,tableTop.modelMatrix.elements,100);
	// console.log(tableTop.modelMatrix);

	//#endregion Table

	var floor = Scene1.newModel("quad",false);
	floor.updateTransforms(new Vector3([0,-10,0]), new Vector3([20,1,20]))

	// var sofa1 = Scene1.newModel("sofa1",false);


	
	document.onkeydown = function(ev){
		keypressed[ev.keyCode] = true;

	};
	document.onkeyup = function(ev){
		keypressed[ev.keyCode] = false;
	};




	window.requestAnimationFrame(update);

}

