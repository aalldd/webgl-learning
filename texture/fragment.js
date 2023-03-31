const fragment =/*glsl*/`
//浮点数设置为中等精度
precision mediump float;
      varying vec2 v_Uv;
      uniform sampler2D u_Texture;
      void main(){
          // 点的最终颜色。
          gl_FragColor = texture2D(u_Texture, vec2(v_Uv.x, v_Uv.y));
      }
`;

export default fragment;