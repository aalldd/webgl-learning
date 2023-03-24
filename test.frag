#version 330 core
// 输入数据 aPos输入是一个（x,y）的向量
// aColor是一个4维向量
attribute vec2 aPos;
attribute vec4 aColor;
// 输出至片段着色器的数据
out vec4 Color;
void main()
{
    
    // color在顶点着色器里不用，直接输出
    Color=aColor;
    // gl_Position是内置函数，这里是4个参数，x,y,z还有alpha值，暂时alpha值为1
    gl_Position=vec4(aPos,0.,1.);
}