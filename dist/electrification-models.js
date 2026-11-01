import {createEquipmentDetails} from './equipment-details.js';
import { normalizeElectrification } from './electrification.js';
// Public-source architecture, original qualitative geometry. Supply ratings,
// clearances, protection coordination and operating procedures are not modeled.
export const POWER_CAMERAS={
  'power-transformer':{camera:[7.5,6.1,8],target:[0,1.9,0],distance:16},
  'power-rectifier':{camera:[7,5.4,8],target:[0,1.5,0],distance:15},
  'power-switchgear':{camera:[5.5,4.5,7],target:[0,1.6,0],distance:13},
};

export function buildPowerView(id,api){
  if(!POWER_CAMERAS[id])return null;
  const {M,startModel,group,box,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,registerAnimator}=api;
  const root=startModel(id),E=createEquipmentDetails(api);box(root,[6.2,.18,5.0],M.deck,[0,-.12,0]);
  if(id==='power-transformer')E.powerInterfaces(makePowerTransformer(root,'transformer',[0,0,0],1.35),{kind:'transformer'});
  if(id==='power-rectifier')E.powerInterfaces(makePowerRectifier(root,'rectifier',[0,0,0],1.45),{kind:'rectifier'});
  if(id==='power-switchgear'){
    const ac=group(root,'ac-switchgear-detail'),dc=group(root,'dc-switchgear-detail');
    E.powerInterfaces(makePowerSwitchgear(ac,'ac-switchgear',[0,0,0],{scale:1.5}),{kind:'switchgear'});
    E.powerInterfaces(makePowerSwitchgear(dc,'dc-switchgear',[0,0,0],{dc:true,scale:1.5}),{kind:'switchgear',dc:true});
    registerAnimator(s=>{ac.visible=s.variant==='ac';dc.visible=s.variant!=='ac';});ac.visible=false;
  }
  return root;
}

export function buildElectrificationView(api){
  const {THREE,M,startModel,group,part,makeTrack,makeTrain,makeSubstation,powerTrace}=api;
  const root=startModel('electrification');
  const supply=part(root,'supply-conversion');
  const station=makeSubstation(supply,.65,[-10,0,0]);
  const railway=group(root,'electrification-rail-corridor',[7,0,0]);railway.scale.setScalar(.8);
  const track=makeTrack(railway,21,{detail:false,section:true});
  const train=makeTrain(railway,{full:true});
  // These study concepts reference the actual shared equipment. Identity
  // wrappers do not invent duplicate hardware or alter connection coordinates.
  const aliases={collector:'study-collector',pantograph:'study-collector','onboard-transformer':'study-onboard-transformer',
    'traction-inverter':'study-converter','line-converter':'study-converter',
    'lim-primary':'study-drive','rotary-traction-motor':'study-drive','traction-gearbox':'study-drive',
    'negative-rail':'study-return','running-rail-return':'study-return','wheel-return':'study-return'};
  const matched=[];for(const host of [track,train])host.traverse(node=>{if(aliases[node.userData.component])matched.push(node);});
  for(const node of matched){const wrapper=part(node.parent,aliases[node.userData.component]);wrapper.add(node);}
  railway.updateWorldMatrix(true,false);station.updateWorldMatrix(true,false);
  const railPoint=p=>railway.localToWorld(new THREE.Vector3(...p)).toArray();
  const supplyPoint=p=>station.localToWorld(new THREE.Vector3(...p)).toArray();
  for(const profile of ['fourth-rail-dc','third-rail-dc','overhead-dc','overhead-ac']){
    const isOverhead=profile.startsWith('overhead'),feed=isOverhead?[-10,5.2,0]:[-10,.63,1.117];
    const ret=profile==='fourth-rail-dc'?[-10,.37,1.117]:[-10,.195,.72];
    const active=s=>normalizeElectrification(s.electrification||s.variant)===profile;
    powerTrace(root,`${profile}-study-supply`,[supplyPoint([7,.38,-.55]),[-3.8,.35,-.5],[-2.2,isOverhead?3.5:.45,0],railPoint(feed)],M.positive,active);
    powerTrace(root,`${profile}-study-return`,[railPoint(ret),[-2.2,.2,1.5],[-4.5,.2,1.5],supplyPoint([7,.25,.03])],M.negative,active);
  }
  return root;
}

