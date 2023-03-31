import vertex from "./vertexShader.js";
import fragment from "./fragment.js";
import { resizeCanvas, createShader, createSimpleProgram, loadTexture } from '../webglHelp.js';


// 为了让gl有类型推导，我们需要这样手动创建一个canvas标签或者使用ts
/*** @type {WebGLRenderingContext} */
let gl;
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
//设置canvas尺寸为满屏
resizeCanvas(canvas);
document.body.appendChild(canvas);
gl = canvas.getContext('webgl');

// 初始化webgl
/*** @type {WebGLRenderingContext} gl */
const initWebgl = () => {
    //创建定点着色器
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    //创建片元着色器
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    //创建着色器程序
    let program = createSimpleProgram(gl, vertexShader, fragmentShader);

    //使用该着色器程序
    gl.useProgram(program);

    let positions = [
        30,
        30,
        0,
        0,
        30,
        300,
        0,
        1,
        300,
        300,
        1,
        1,
        30,
        30,
        0,
        0,
        300,
        300,
        1,
        1,
        300,
        30,
        1,
        0
    ];

    // 找到着色器中的全局变量 u_Texture;
    var u_Texture = gl.getUniformLocation(program, "u_Texture");
    var u_Screen_Size = gl.getUniformLocation(program, "u_Screen_Size");
    gl.uniform2f(u_Screen_Size, canvas.width, canvas.height);
    var a_Position = gl.getAttribLocation(program, "a_Position");
    var a_Uv = gl.getAttribLocation(program, "a_Uv");

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Uv);
    // 创建缓冲区
    var buffer = gl.createBuffer();
    // 绑定缓冲区为当前缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 设置 a_Position 属性从缓冲区读取数据方式
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0);
    // 设置 a_Uv 属性从缓冲区读取数据方式
    gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8);
    // 向缓冲区传递数据
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
    );

    //设置清屏颜色为黑色。
    gl.clearColor(0, 0, 0, 1);
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (positions.length <= 0) {
            return;
        }
        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 4);
    }

    loadTexture(gl, './wave.jpg', u_Texture, function () {
        render();
    });
};

window.onload = () => {
    initWebgl();
};
