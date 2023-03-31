const fragment=/*glsl*/`
//浮点数设置为中等精度
precision mediump float;
varying vec4 v_Color;

void main(){
		// 将颜色处理成 GLSL 允许的范围[0， 1]。
		vec4 color = v_Color / vec4(255, 255, 255, 1);
			// 点的最终颜色。
			gl_FragColor = color;

	}
`

export default fragment