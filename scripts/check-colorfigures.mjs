import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {ColorfiguresRenderer,prepareColorfiguresGeometry} from '../dist/colorfigures-renderer.js';

class Element{
 constructor(){this.dataset={};this.style={};this.width=300;this.height=150;this.context={setTransform(){},fillRect(){},setLineDash(){},fill(){this.fills=(this.fills||0)+1;},stroke(){}};}
 setAttribute(){}replaceChildren(){}getContext(){return this.context;}
}
globalThis.document={createElement:()=>new Element(),createElementNS:()=>new Element()};
globalThis.Path2D=class{constructor(path){assert(!/NaN|Infinity/.test(path));this.path=path;}};
const camera=()=>{const c=new T.OrthographicCamera(-4,4,3,-3,.1,30);c.position.set(0,0,10);c.lookAt(0,0,0);return c;};

test('coplanar triangles form six box faces without internal triangle ink',()=>{
 const g=prepareColorfiguresGeometry(new T.BoxGeometry(2,4,6));assert.equal(g.faces.length,6);assert(g.faces.every(f=>f.loops.length===1&&f.loops[0].length===4));
});
test('perforated caps retain their real inner boundary',()=>{
 const shape=new T.Shape();shape.moveTo(-2,-2);shape.lineTo(2,-2);shape.lineTo(2,2);shape.lineTo(-2,2);shape.closePath();const hole=new T.Path();hole.absarc(0,0,.7,0,Math.PI*2,true);shape.holes.push(hole);
 const g=prepareColorfiguresGeometry(new T.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:false,curveSegments:6}));assert.equal(g.faces.filter(f=>f.loops.length===2).length,2);
});
test('face depth, translucent material and always-visible dashed paths survive the adapter',()=>{
 const scene=new T.Scene(),far=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial({color:0x0000ff})),near=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:.4}));near.position.z=1;scene.add(near,far);
 const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-1,0,-1),new T.Vector3(1,0,-1)]),new T.LineDashedMaterial({color:0x00ff00,depthTest:false}));scene.add(line);
 const r=new ColorfiguresRenderer({raster:false});r.setSize(800,600);r.render(scene,camera());const svg=r.domElement.innerHTML;
 assert(svg.indexOf('#0000ff')<svg.indexOf('#ff0000'));assert(svg.includes('opacity="0.4"'));assert(svg.lastIndexOf('#00ff00')>svg.indexOf('#ff0000'));assert(svg.includes('stroke-dasharray="5 4"'));assert(!/NaN|Infinity/.test(svg));
});
test('instance transforms reach both drawing surfaces, and unchanged sizing preserves the canvas',()=>{
 const scene=new T.Scene(),mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0xffb829}),2);mesh.setMatrixAt(0,new T.Matrix4().makeTranslation(-2,0,0));mesh.setMatrixAt(1,new T.Matrix4().makeTranslation(2,0,0));scene.add(mesh);
 for(const raster of [false,true]){const r=new ColorfiguresRenderer({raster});r.setSize(800,600);r.render(scene,camera());assert.equal(r.info.memory.geometries,2);assert.equal(r.info.render.faces,2);if(raster){assert.equal(r.context.fills,2);const widths=[];let width=r.domElement.width;Object.defineProperty(r.domElement,'width',{get:()=>width,set:v=>{widths.push(v);width=v;}});r.setSize(800,600);assert.deepEqual(widths,[]);}else{assert(r.domElement.innerHTML.includes('150.0'));assert(r.domElement.innerHTML.includes('650.0'));}}
});

test('retained drawing paths update with camera, selection material, geometry and motion',()=>{
 const scene=new T.Scene(),mesh=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0x113355}));scene.add(mesh);
 const r=new ColorfiguresRenderer({raster:false}),c=camera();r.render(scene,c);const original=r.domElement.innerHTML;
 r.render(scene,c);assert.equal(JSON.parse(r.domElement.dataset.renderStats).reused,1);assert.equal(r.domElement.innerHTML,original);
 for(const change of [()=>{mesh.position.x=1;},()=>{mesh.material.color.setHex(0xff0000);},()=>{mesh.geometry=new T.BoxGeometry(2,2,2);},()=>{c.position.x=2;c.lookAt(0,0,0);},()=>{mesh.material.opacity=.4;}]){
  const before=r.domElement.innerHTML;change();r.render(scene,c);assert.equal(JSON.parse(r.domElement.dataset.renderStats).reused,0);assert.notEqual(r.domElement.innerHTML,before);
 }
 mesh.visible=false;r.render(scene,c);assert.equal(r.info.render.faces,0);assert.equal(r.domElement.innerHTML,'');
});

// Sample the composited drawing, rather than merely counting prepared faces.
function fillAt(svg,x,y){
 let result;
 for(const match of svg.matchAll(/<path d="([^"]+)" fill="(#[a-f0-9]+)"/g)){
  let inside=false;
  for(const subpath of match[1].split('M').filter(Boolean)){
   const values=subpath.match(/-?\d+(?:\.\d+)?/g).map(Number),points=[];
   for(let i=0;i<values.length;i+=2)points.push([values[i],values[i+1]]);
   for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [a,b]=points[i],[c,d]=points[j];
    if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)inside=!inside;
   }
  }
  if(inside)result=match[2];
 }
 return result;
}
test('the actual turnout bed never paints over sleeper centres or ends during orbit',async()=>{
 const {viewerHarness}=await import('./viewer-test-harness.mjs');
 const h=await viewerHarness();h.viewer.setView('turnout');h.draw();
 const root=h.root(),sleepers=[];root.updateMatrixWorld(true);
 root.traverseVisible(node=>{
  if(!node.isMesh)return;
  if(node.userData.component==='track-sleeper'){
   node.material=new T.MeshBasicMaterial({color:0xff0000});sleepers.push(node);
  }else if(node.geometry.type==='BoxGeometry'&&node.geometry.parameters.width>10&&node.geometry.parameters.height<1){
   node.material=new T.MeshBasicMaterial({color:0x0000ff});
  }else node.visible=false;
 });
 assert(sleepers.length>0,'the real turnout must contain sleepers');
 const scene=new T.Scene();scene.add(root);const r=new ColorfiguresRenderer({raster:false});r.setQuality('detail');r.setSize(800,600);
 const target=new T.Vector3(0,.65,1.4);
 for(const [x,y,z]of [[13,15,17],[-13,15,17],[13,15,-17],[-13,15,-17],[17,5,13],[17,30,13]]){
  const c=new T.PerspectiveCamera(36,4/3,.03,120);c.position.copy(target).add(new T.Vector3(x,y,z));c.lookAt(target);r.render(scene,c);
  for(const sleeper of sleepers.filter((_,i)=>i%4===0)){
   const bounds=new T.Box3().setFromObject(sleeper),centre=bounds.getCenter(new T.Vector3());
   for(const offset of [-.3,0,.3]){
    const point=new T.Vector3(centre.x,bounds.max.y,centre.z+offset*(bounds.max.z-bounds.min.z)).project(c);
    const color=fillAt(r.domElement.innerHTML,(point.x+1)*400,(1-point.y)*300);
    assert(color&&parseInt(color.slice(1,3),16)>parseInt(color.slice(5,7),16),`actual sleeper at ${centre.x}, ${offset} hidden from ${[x,y,z]} by ${color}`);
   }
  }
 }
});

test('closed direct-fixation concrete hides its internal reinforcing bars',async()=>{
 const {viewerHarness}=await import('./viewer-test-harness.mjs');
 const h=await viewerHarness();h.viewer.setView('rail-fastening');h.viewer.setVariant('direct');h.viewer.setCutaway(false);h.draw();
 const root=h.root(),plinth=root.getObjectByName('direct-rail-seat').getObjectByName('track-plinth'),bars=[];
 root.traverseVisible(node=>{
  if(!node.isMesh)return;
  let ancestor=node;while(ancestor&&ancestor!==plinth)ancestor=ancestor.parent;
  if(!ancestor){node.visible=false;return;}
  const bar=node.geometry.type==='CylinderGeometry';node.material=new T.MeshBasicMaterial({color:bar?0xff0000:0x0000ff});if(bar)bars.push(node);
 });
 assert.equal(bars.length,2,'both authored reinforcing bars must be exercised');
 const scene=new T.Scene();scene.add(root);const r=new ColorfiguresRenderer({raster:false});r.setQuality('detail');r.setSize(800,600);
 const c=new T.PerspectiveCamera(36,4/3,.03,120);c.position.set(4,3,5);c.lookAt(0,.65,0);r.render(scene,c);
 for(const bar of bars){
  const point=bar.getWorldPosition(new T.Vector3()).project(c),color=fillAt(r.domElement.innerHTML,(point.x+1)*400,(1-point.y)*300);
  assert(color&&parseInt(color.slice(5,7),16)>parseInt(color.slice(1,3),16),'solid concrete must cover its internal reinforcement');
 }
});

test('exposed equipment surfaces remain visible over actual floors, ballast, roofs and walls',async()=>{
 const {viewerHarness}=await import('./viewer-test-harness.mjs'),h=await viewerHarness({}, {width:800,height:600});
 const cases=[
  {view:'substation',target:'transformer',cover:n=>n.geometry.type==='BoxGeometry'&&n.geometry.parameters.width===16},
  {view:'switch-drive',target:'track-point-machine',cover:n=>n.userData.component==='track-ballast'},
  {view:'vehicle',target:'hvac',cover:n=>n.geometry.type==='ExtrudeGeometry'&&ancestor(n,'carbody')},
  {view:'operations-centre',target:'occ-shared-display',cover:n=>n.geometry.type==='BoxGeometry'&&n.geometry.parameters.width===18&&n.geometry.parameters.height===3.6},
 ];
 function ancestor(node,id){while(node){if(node.userData.component===id)return true;node=node.parent;}return false;}
 for(const item of cases){
  h.viewer.setView(item.view);h.viewer.setCutaway(false);h.viewer.setSignals(false);h.draw();
  const root=h.root(),targets=[],meshes=[];
  root.traverseVisible(node=>{
   if(!node.isMesh)return;
   const target=ancestor(node,item.target),cover=item.cover(node);
   if(!target&&!cover){node.visible=false;return;}
   node.material=new T.MeshBasicMaterial({color:target?0xff0000:0x0000ff,side:T.DoubleSide});
   meshes.push(node);if(target)targets.push(node);
  });
  assert(targets.length&&meshes.length>targets.length,`${item.view}: actual target and covering surface are present`);
  const r=new ColorfiguresRenderer({raster:false});r.setQuality('detail');r.setSize(800,600);
  for(const preset of ['isometric','side','top']){
   h.viewer.setCameraPreset(preset);h.draw();const c=h.renderer.camera;
   r.render(root,c);const svg=r.domElement.innerHTML,ray=new T.Raycaster();let exposed=0;
   for(let y=32;y<600;y+=17)for(let x=32;x<800;x+=17){
    ray.setFromCamera(new T.Vector2(x/400-1,1-y/300),c);
    const hit=ray.intersectObjects(meshes,false)[0];if(!hit||!targets.includes(hit.object))continue;
    const normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    // Probe exposed tops/fronts rather than model seams that intersect the support.
    if(item.view==='operations-centre'?Math.abs(normal.z)<.9:normal.y<.9)continue;
    const color=fillAt(svg,x,y);exposed++;
    assert(color&&parseInt(color.slice(1,3),16)>parseInt(color.slice(5,7),16),`${item.view}/${preset}: equipment erased at ${x},${y}`);
   }
   if(preset==='isometric')assert(exposed>=5,`${item.view}: sample visible equipment rather than an empty scene`);
  }
  r.dispose();
 }
});

test('approaching a face clips its near corner without dropping the visible surface or ink',()=>{
 const scene=new T.Scene(),mesh=new T.Mesh(new T.PlaneGeometry(8,5),new T.MeshBasicMaterial({color:0xff0000,side:T.DoubleSide}));
 mesh.rotation.y=Math.PI/3;scene.add(mesh);
 const c=new T.PerspectiveCamera(45,4/3,.25,30);c.position.set(0,0,2);c.lookAt(0,0,0);
 for(const raster of [false,true]){
  const r=new ColorfiguresRenderer({raster});r.setQuality('detail');r.setSize(800,600);r.render(scene,c);
  if(raster)assert(r.context.fills>0,'visible geometry must reach the canvas');
  else{
   assert(!/NaN|Infinity/.test(r.domElement.innerHTML));
   const color=fillAt(r.domElement.innerHTML,400,300);
   assert(color&&parseInt(color.slice(1,3),16)>0,'the surface intersected by the central ray must remain painted');
  }
  r.dispose();
 }
});
