import { readFile } from 'node:fs/promises';
import * as THREE from '../dist/vendor/three.module.js';

// Only DOM/GPU boundaries are substituted. Model construction, selection,
// animation, camera math and public APIs execute the shipping implementation.
export async function viewerHarness(callbacks = {}) {
  const source=await readFile(new URL('../dist/viewer.js',import.meta.url),'utf8');
  const dependencies={THREE:{...THREE}};
  for(const [,exports,file]of source.matchAll(/^import\s+\{([^}]+)\}\s+from\s+'([^']+)';/gm)){
    if(file.includes('vendor/'))continue;
    const module=await import(new URL('../dist/'+file.replace('./',''),import.meta.url));
    for(const name of exports.split(',').map(x=>x.trim()))dependencies[name]=module[name];
  }
  let renderer,nextFrame;
  class GeometryRenderer{
    constructor(){renderer=this;this.shadowMap={};this.listeners=new Map();this.domElement={style:{},setAttribute(){},addEventListener:(name,fn)=>this.listeners.set(name,fn),removeEventListener(){},remove(){},getBoundingClientRect:()=>({left:0,top:0,width:1100,height:700})};}
    setClearColor(){}setPixelRatio(){}setSize(){}dispose(){}render(scene,camera){this.scene=scene;this.camera=camera;}
  }
  class Controls{constructor(camera){this.camera=camera;this.target=new THREE.Vector3();}update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld(true);}addEventListener(){}dispose(){}}
  Object.assign(dependencies,{OrbitControls:Controls,SVGRenderer:GeometryRenderer,window:{devicePixelRatio:1,matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}})},document:{hidden:false,addEventListener(){},removeEventListener(){}},ResizeObserver:class{observe(){}disconnect(){}},requestAnimationFrame:fn=>{nextFrame=fn;return 1;},cancelAnimationFrame:()=>{}});
  dependencies.THREE.WebGLRenderer=GeometryRenderer;
  const code=source.replace(/^import\s+[\s\S]*?;\n/gm,'').replace('export function createViewer','function createViewer');
  const create=new Function(...Object.keys(dependencies),code+'\nreturn createViewer;')(...Object.values(dependencies));
  const viewer=create({clientWidth:1100,clientHeight:700,appendChild(){}},callbacks);
  let time=0;const draw=()=>nextFrame(time+=16);draw();
  return {viewer,draw,get renderer(){return renderer;},root:()=>renderer.scene.children.find(n=>n.name.startsWith('view-')&&n.visible)};
}
export { THREE };
