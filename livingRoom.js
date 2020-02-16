class Model{
	constructor(fileName){
		this.name = fileName
	}

}

class Scene{
	constructor(gl, size){
		this.size = size
		this.gl = gl

		// Vertex shader program 
		var VSHADER_SOURCE =
		'attribute vec4 a_Position;\n' +
		'void main() {\n' +
		' gl_Position = a_Position;\n' +
		' gl_PointSize = 10.0;\n' +
		'}\n';
		
		var FSHADER_SOURCE =
		'void main() {\n' +
		' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
		'}\n';

		if (!initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)){
			console.log('Failed to initialise shaders for WebGL');
			return;
		}

		var a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');

		if (a_Position < 0) {
			console.log('Failed to get the storage location of a_Position'); return;
		}
		// Pass vertex position to attribute variable
		this.gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

		// Set the color for clearing <canvas>
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// Clear <canvas>
		this.gl.clear(gl.COLOR_BUFFER_BIT);

		this.gl.drawArrays(gl.POINTS, 0, 1);

	}
}

function main(){
	// Retrieve <canvas> element
	var canvas = document.getElementById('webgl');
	// Get the rendering context for WebGL 
	var gl = getWebGLContext(canvas);
	if (!gl) {
	console.log('Failed to get the rendering context for WebGL');
	return; 
	}
	var Scene1 = new Scene(gl);
	// Instantiate Scene which instantiates all objects in folder
}