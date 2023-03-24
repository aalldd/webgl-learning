var random = Math.random;
function randomColor() {
	return {
		r: random() * 255,
		g: random() * 255,
		b: random() * 255,
		a: random() * 1
	};
}

const $$ = (str) => {
	if (!str) return null;
	if (str.startsWith('#')) {
		return document.querySelector(str);
	}
	let result = document.querySelectorAll(str);
	if (result.length == 1) {
		return result[0];
	}
	return result;
};

const createShader = (gl, type, source) => {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	//检测是否编译正常。
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.error(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
};

const createShaderFromScript = (gl, type, scriptId) => {
	let sourceScript = $$('#' + scriptId);
	if (!sourceScript) {
		return null;
	}
	return createShader(gl, type, sourceScript.innerHTML);
};

const createSimpleProgram = (gl, vertexShader, fragmentShader) => {
	if (!vertexShader || !fragmentShader) {
		console.warn('着色器不能为空');
		return;
	}
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	let success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}
	console.error(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
	//创建着色器程序
	const program = gl.createProgram();
	//将顶点着色器挂载在着色器程序上。
	gl.attachShader(program, vertexShader);
	//将片元着色器挂载在着色器程序上。
	gl.attachShader(program, fragmentShader);
	//链接着色器程序
	gl.linkProgram(program);
};

const getCanvas = (id) => {
	return $$(id);
};

const resizeCanvas = (canvas, width, height) => {
	if (canvas.width !== width) {
		canvas.width = width ? width : window.innerWidth;
	}
	if (canvas.height !== height) {
		canvas.height = height ? height : window.innerHeight;
	}
};

const getContext = (canvas) => {
	return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
};

export {
	randomColor,$$,getContext,resizeCanvas,getCanvas,createProgram,createSimpleProgram,createShaderFromScript,createShader
}
