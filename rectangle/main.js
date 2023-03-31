import vertex from "./vertexShader.js";
import fragment from "./fragment.js";
import { createShader, createSimpleProgram, randomColor } from './webglHelp.js';

let a_Position, a_Color;
// 为了让gl有类型推导，我们需要这样手动创建一个canvas标签或者使用ts
/*** @type {WebGLRenderingContext} */
let gl;
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.appendChild(canvas);
gl = canvas.getContext('webgl');
let renderType = 'simple';

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

    // 获取 canvas 尺寸。
    let a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
    // 将 canvas 尺寸传递给顶点着色器。
    gl.vertexAttrib2f(a_Screen_Size, 1920, 947);

    a_Position = gl.getAttribLocation(program, 'a_Position');
    a_Color = gl.getAttribLocation(program, 'a_Color');

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

};

const commonFunc = (positions, indices) => {
    // 创建缓冲区
    let buffer = gl.createBuffer();
    // 绑定缓冲区为当前缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 设置 a_Position 属性从缓冲区读取数据方式
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0);
    // 设置 a_Color 属性从缓冲区读取数据方式
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8);
    // 向缓冲区传递数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    if (indices) {
        //创建索引缓冲区
        let indicesBuffer = gl.createBuffer();
        //绑定索引缓冲区
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        //向索引缓冲区传递索引数据
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
};

// 使用基本三角形绘制矩形
const initBaseRect = () => {
    var positions = [
        30, 30, 255, 0, 0, 1,    //V0
        30, 300, 255, 0, 0, 1,   //V1
        300, 300, 255, 0, 0, 1,  //V2
        30, 30, 0, 255, 0, 1,    //V0
        300, 300, 0, 255, 0, 1,  //V2
        300, 30, 0, 255, 0, 1    //V3
    ];
    commonFunc(positions);
    /*渲染*/
    function render(gl) {
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //利用索引方式进行绘制
        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
    }
    render(gl);
};

// 简单使用索引缓冲区创建矩形
const initBufferSimple = () => {
    // 定义组成矩形的两个三角形，共计六个顶点，每个顶点包含2个坐标分量和4个颜色分量。
    let positions = [
        //V0
        200, 200, 255, 0, 0, 1,
        //V1
        200, 500, 0, 255, 0, 1,
        //V2
        500, 500, 0, 255, 0, 1,
        //V3
        500, 200, 0, 0, 255, 1
    ];
    //定义绘制索引数组
    let indices = [0, 1, 2, 0, 2, 3];
    commonFunc(positions, indices);
    /*渲染*/
    function render(gl) {
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //利用索引方式进行绘制
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    render(gl);
};

// 使用三角扇绘制矩形
const initBufferShan = () => {
    // 三角扇需要绘制4个三角形
    const positions = [
        165, 165, 255, 255, 0, 1, //V0
        30, 30, 255, 0, 0, 1,    //V1
        30, 300, 255, 0, 0, 1,   //V2
        300, 300, 255, 0, 0, 1,  //V3
        300, 30, 0, 255, 0, 1,   //V4
        30, 30, 255, 0, 0, 1,    //V1
    ];
    //定义绘制索引数组
    let indices = positions.map((item, index) => { return index; });
    commonFunc(positions, indices);
    /*渲染*/
    function render(gl) {
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //利用索引方式进行绘制
        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
    }
    render(gl);
};

// 使用三角扇绘制圆形
const initBufferCircle = () => {
    // 这里定义一个生成圆形坐标的函数
    let sin = Math.sin;
    let cos = Math.cos;
    const createCircleVertex = (x, y, radius, n) => {
        const positions = [x, y, 255, 0, 0, 1];
        for (let i = 0; i <= n; i++) {
            var angle = i * Math.PI * 2 / n;
            positions.push(x + radius * sin(angle), y + radius * cos(angle), 255, 0, 0, 1);
        }
        return positions;
    };
    const positions = createCircleVertex(300, 300, 150, 33);
    //定义绘制索引数组
    let indices = positions.map((item, index) => { return index; });
    commonFunc(positions, indices);
    /*渲染*/
    function render(gl) {
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //利用索引方式进行绘制
        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
    }
    render(gl);
};

// 使用三角扇绘制圆环
const initBufferRing = () => {
    // 这里定义一个生成圆形坐标的函数
    let sin = Math.sin;
    let cos = Math.cos;
    function createRingVertex(x, y, innerRadius, outerRadius, n) {
        var positions = [];
        var color = randomColor();
        for (var i = 0; i <= n; i++) {
            if (i % 2 == 0) {
                color = randomColor();
            }
            var angle = i * Math.PI * 2 / n;
            positions.push(x + innerRadius * sin(angle), y + innerRadius * cos(angle), color.r, color.g, color.b, color.a);
            positions.push(x + outerRadius * sin(angle), y + outerRadius * cos(angle), color.r, color.g, color.b, color.a);
        }
        var indices = [];
        for (var i = 0; i < n; i++) {
            var p0 = i * 2;
            var p1 = i * 2 + 1;
            var p2 = (i + 1) * 2 + 1;
            var p3 = (i + 1) * 2;
            if (i == n - 1) {
                p2 = 1;
                p3 = 0;
            }
            indices.push(p0, p1, p2, p2, p3, p0);
        }
        return {
            positions: positions,
            indices: indices
        };
    }
    const { positions, indices } = createRingVertex(300, 300, 100, 200, 50);
    commonFunc(positions, indices);
    /*渲染*/
    function render(gl) {
        //设置清屏颜色为黑色。
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //利用索引方式进行绘制
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    render(gl);
};

const baseBtn = document.getElementById('base');
const simpleBtn = document.getElementById('simple');
const shanBtn = document.getElementById('shan');
const circleBtn = document.getElementById('circle');
const ringBtn = document.getElementById('ring');
baseBtn.onclick = () => {
    renderType = 'base';
    initBaseRect();
};
simpleBtn.onclick = () => {
    renderType = 'simple';
    initBufferSimple();
};
shanBtn.onclick = () => {
    renderType = 'shan';
    initBufferShan();
};
circleBtn.onclick = () => {
    renderType = 'circle';
    initBufferCircle();
};
ringBtn.onclick = () => {
    renderType = 'ring';
    initBufferRing();
};

window.onload = () => {
    initWebgl();
    initBaseRect();
};
