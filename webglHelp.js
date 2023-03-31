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

const loadTexture = (gl, src, attribute, callback) => {
	let img = new Image();
	img.crossOrigin = 'anonymous';
	img.onload = function () {
		gl.activeTexture(gl.TEXTURE0);
		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(attribute, 0);
		callback && callback();
	};
	img.src = src;
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

const standardOpts = {
	size: 2,
	normalize: false,
	stride: 0,
	offset: 0
};

// 创建缓冲区 针对非索引缓冲区
const createBuffer = (gl, targetEles, options) => {
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	if (targetEles.length === 1 && options.length === 1) {
		let targetEle = targetEles[0];
		let option = options[0];
		//获取顶点着色器中的变量a_Position的位置。
		let target = gl.getAttribLocation(gl.program, targetEle);
		const resOpts = Object.assign(standardOpts, option);
		resOpts.type = option.type || gl.FLOAT;
		gl.vertexAttribPointer(target, resOpts.size, resOpts.type, resOpts.normalize, resOpts.stride, resOpts.offset);
		gl.enableVertexAttribArray(target);
		return buffer;
	} else {
		// 如果传递了多个targetEles,说明一个缓冲区里需要存储多种数据,这样，我们要求参数targetEles的长度和options一致，一个ele对应一个option
		if (targetEles.length === options.length) {
			targetEles.forEach((targetEle, index) => {
				let option = options[index];
				//获取顶点着色器中的变量a_Position的位置。
				let target = gl.getAttribLocation(gl.program, targetEle);
				const resOpts = Object.assign(standardOpts, option);
				resOpts.type = option.type || gl.FLOAT;
				gl.vertexAttribPointer(target, resOpts.size, resOpts.type, resOpts.normalize, resOpts.stride, resOpts.offset);
				gl.enableVertexAttribArray(target);
			});
			return buffer;
		} else {
			console.error('缓冲区设置错误，缓冲区数据类型与设置与一一对应！');
			return;
		}
	}

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
	loadTexture, randomColor, $$, getContext, resizeCanvas, getCanvas, createProgram, createSimpleProgram, createShaderFromScript, createShader, createBuffer, standardOpts
};
