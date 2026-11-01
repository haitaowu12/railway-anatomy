// Original schematic figures mark a role's relationship to equipment. Their
// number and positions are composition choices, never a staffing prescription.
export function addRoleFigure(parent,api,position,{role='railway-worker',seated=false,rotation=0,scale=1}={}){
  const {THREE,group,mesh,box,cylinder,mat}=api;
  const person=group(parent,`role-figure-${role}`,position);person.rotation.y=rotation;person.scale.setScalar(scale);
  person.userData.representativeRole=role;
  const clothing=mat(0x617d78,.9,.02),neutral=mat(0xc7c4b5,.9,.01),dark=mat(0x354842,.9,.02);
  const hip=seated?.74:.85,shoulder=hip+.49;
  cylinder(person,.2,.5,clothing,[0,hip+.25,0],null,10);
  mesh(person,new THREE.SphereGeometry(.16,10,7),neutral,[0,shoulder+.24,0]);
  for(const side of [-1,1]){
    cylinder(person,.065,.42,clothing,[side*.25,hip+.29,seated?-.14:0],seated?[.7,0,side*.12]:[0,0,side*.16],8);
    if(seated){box(person,[.13,.13,.45],dark,[side*.12,hip-.1,-.16]);cylinder(person,.065,.46,dark,[side*.12,hip-.35,-.35],null,8);box(person,[.17,.09,.29],dark,[side*.12,hip-.6,-.42]);}
    else{cylinder(person,.075,.72,dark,[side*.12,.43,0],null,8);box(person,[.17,.1,.29],dark,[side*.12,.06,-.06]);}
  }
  return person;
}
