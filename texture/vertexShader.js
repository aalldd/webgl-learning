const vertexShader =/*glsl*/`
    precision mediump float;
   // 接收顶点坐标 (x, y)
   attribute vec2 a_Position;
   // 接收 canvas 尺寸(width, height)
   uniform vec2 u_Screen_Size;
   // 接收JavaScript传递过来的顶点 uv 坐标。
   attribute vec2 a_Uv;
   // 将接收的uv坐标传递给片元着色器
   varying vec2 v_Uv;
   void main(){
     vec2 position = (a_Position / u_Screen_Size) * 2.0 - 1.0;
     position = position * vec2(1.0,-1.0);
     gl_Position = vec4(position, 0, 1);
     // 将接收到的uv坐标传递给片元着色器
     v_Uv = a_Uv;
   }
`;

export default vertexShader;