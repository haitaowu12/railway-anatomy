// Original furniture and sheet-metal construction. Perforations are real holes;
// published equipment examples establish function, not these generic dimensions.
export function plateWithOpenings(THREE,{width,depth,thickness,radius=.12,holes=[]}){
  const x=width/2,z=depth/2,r=Math.min(radius,x*.4,z*.4),s=new THREE.Shape();
  s.moveTo(-x+r,-z);s.lineTo(x-r,-z);s.quadraticCurveTo(x,-z,x,-z+r);
  s.lineTo(x,z-r);s.quadraticCurveTo(x,z,x-r,z);s.lineTo(-x+r,z);
  s.quadraticCurveTo(-x,z,-x,z-r);s.lineTo(-x,-z+r);s.quadraticCurveTo(-x,-z,-x+r,-z);
  // The extrusion rotates XY to XZ; invert shape Y so the public coordinates
  // remain the installed tabletop's X/Z coordinates.
  for(const [hx,hz,hr] of holes){const p=new THREE.Path();p.absarc(hx,-hz,hr,0,Math.PI*2,true);s.holes.push(p);}
  const g=new THREE.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false,curveSegments:6});
  g.rotateX(-Math.PI/2);g.translate(0,-thickness/2,0);g.userData.openings=holes.map(h=>[...h]);return g;
}

export function perforatedPanel(THREE,{width,height,thickness,columns=5,rows=4,holeRadius=.025,openingWidth=width,openingHeight=height,openingOffset=[0,0]}){
  const s=new THREE.Shape();s.moveTo(-width/2,-height/2);s.lineTo(width/2,-height/2);s.lineTo(width/2,height/2);s.lineTo(-width/2,height/2);s.closePath();
  for(let j=0;j<rows;j++)for(let i=0;i<columns;i++){const p=new THREE.Path();p.absarc(openingOffset[0]+(i-(columns-1)/2)*openingWidth/(columns+1),openingOffset[1]+(j-(rows-1)/2)*openingHeight/(rows+1),holeRadius,0,Math.PI*2,true);s.holes.push(p);}
  const g=new THREE.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false,curveSegments:4});g.translate(0,0,-thickness/2);g.userData.openingCount=rows*columns;return g;
}

// The SVG painter has no depth buffer. Explicitly enclosed electronics can
// otherwise paint across an opaque screen. Hide them only for that draw call,
// preserving real geometry, inspection availability and selection identity.
export function drawWithEnclosureOcclusion(root,{cutaway=false,exploded=0},draw){
  if(cutaway||exploded>0)return draw();
  const concealed=[];
  root.traverseVisible(o=>{if(o.isMesh&&o.userData.concealedWhenAssembled){concealed.push(o);o.visible=false;}});
  try{return draw();}finally{for(const o of concealed)o.visible=true;}
}
