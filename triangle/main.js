import vertex from "./vertexShader.js";
import fragment from "./fragment.js";
import {createShader,getContext,resizeCanvas,getCanvas,randomColor,createSimpleProgram} from './webglHelp.js'

//获取canvas
let canvas = getCanvas('#canvas');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);
//创建定点着色器
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
//创建片元着色器
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
//创建着色器程序
let program = createSimpleProgram(gl, vertexShader, fragmentShader);
//使用该着色器程序
gl.useProgram(program);
// 创建缓冲区
const buffer=gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,buffer)

//获取顶点着色器中的变量a_Position的位置。
let a_Position = gl.getAttribLocation(program, 'a_Position');
let a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
let u_Color = gl.getUniformLocation(program, 'u_Color');
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
// 启用a_Position
gl.enableVertexAttribArray(a_Position);
// 定义顶点如何从buffer中取数据
//每次取两个数据
let size = 2;
//每个数据的类型是32位浮点型
let type = gl.FLOAT;  
//不需要归一化数据
let normalize = false; 
// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
let stride = 0;   
// 从缓冲起始位置开始读取     
let offset1 = 0; 
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
gl.vertexAttribPointer(a_Position, size, type, normalize, stride, offset1)
const positions=[]

canvas.addEventListener("click", e=>{
    positions.push(e.pageX, e.pageY);
    // 顶点信息为6个数据即3个顶点时执行绘制操作，因为三角形由三个顶点组成。
    if(positions.length % 6 == 0) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        let color = randomColor();
        gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
        render(gl);
    }
})
gl.clearColor(0, 0, 0, 1);
function render(gl){
    gl.clear(gl.COLOR_BUFFER_BIT);
    let primitiveType = gl.TRIANGLES;
    let drawOffset = 0;
    if(positions.length >0){
        gl.drawArrays(primitiveType, drawOffset, positions.length / 2);
    }
}
render(gl);


// 创建缓冲区
// const buffer=gl.createBuffer()
// gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
// // 往缓冲区中写入数据
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positons), gl.STATIC_DRAW);
// // 启用a_Position
// gl.enableVertexAttribArray(a_Position);
// // 设置从缓冲区中取数据的方式
// //每次取两个数据
// let size = 2;
// //每个数据的类型是32位浮点型
// let type = gl.FLOAT;  
// //不需要归一化数据
// let normalize = false; 
// // 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
// let stride = 0;   
// // 从缓冲起始位置开始读取     
// let offset1 = 0; 
// // 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
// gl.vertexAttribPointer(a_Position, size, type, normalize, stride, offset1)
// gl.uniform4f(u_Color, 1, 0, 0, 1);
// // 开始绘制
// //绘制图元设置为三角形
// let primitiveType = gl.TRIANGLES;
// //从顶点数组的开始位置取顶点数据
// let offset = 0;
// //因为我们要绘制三个点，所以执行三次顶点绘制操作。
// let count = 3;
// gl.drawArrays(primitiveType, offset, count);
