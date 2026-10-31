// A teaching configuration, not a catalogue of commissioned combinations.
export const DEFAULT_TECHNOLOGY=Object.freeze({propulsion:'lim',control:'loop'});
export const PROPULSION_CHOICES=[{id:'lim',label:'Linear induction motor (LIM)'},{id:'rotary',label:'Rotary motor + axle drive'}];
export const CONTROL_CHOICES=[{id:'loop',label:'Loop CBTC · SelTrac example'},{id:'radio',label:'Radio CBTC'},{id:'fixed',label:'Conventional fixed block'},{id:'etcs1',label:'ETCS Level 1'},{id:'etcs2',label:'ETCS Level 2'}];
export function normalizeTechnology(value={},fallback=DEFAULT_TECHNOLOGY){value=value&&typeof value==='object'?value:{};return {propulsion:PROPULSION_CHOICES.some(x=>x.id===value.propulsion)?value.propulsion:fallback.propulsion,control:CONTROL_CHOICES.some(x=>x.id===value.control)?value.control:fallback.control};}
export function technologyFromUrl(search,saved={}){saved=saved&&typeof saved==='object'?saved:{};const q=new URLSearchParams(search);return normalizeTechnology({propulsion:q.get('propulsion')||saved.propulsion,control:q.get('control')||saved.control});}
export function technologyForView(technology,view,variant){
  let control=technology.control;
  if(view==='seltrac')control=variant==='loop'?'loop':'radio';
  else if(view==='cbtc-network')control='radio';
  else if(view==='signalling')control='fixed';
  else if(view==='etcs')control=variant==='level-2'?'etcs2':'etcs1';
  return {...technology,control};
}
export function technologyForComponent(technology,id){
  const next={...technology};
  if(['lim-primary','reaction-rail','motor-slip'].includes(id))next.propulsion='lim';
  if(['rotary-traction-motor','traction-gearbox'].includes(id))next.propulsion='rotary';
  if(['seltrac-loop','loop-interface','loop-pickup'].includes(id))next.control='loop';
  if(['train-radio','wayside-radio','seltrac-g9'].includes(id))next.control='radio';
  return next;
}
export function controlRoute(control){return ({loop:{view:'seltrac',variant:'loop',component:'seltrac-loop'},radio:{view:'cbtc-network',variant:'normal',component:'cbtc'},fixed:{view:'signalling',variant:'clear',component:'fixed-block'},etcs1:{view:'etcs',variant:'level-1',component:'etcs-level-1'},etcs2:{view:'etcs',variant:'level-2',component:'etcs-level-2'}})[control]||controlRoute('loop');}
export function technologyScope(technology,view){
  const control=CONTROL_CHOICES.find(x=>x.id===technology.control)?.label;
  return `${technology.propulsion==='rotary'?'Rotary axle drive':'LIM propulsion'} + ${control}. Propulsion and control are independent. ${view==='lim'?'This close-up studies a LIM.':['etcs1','etcs2'].includes(technology.control)?'The ETCS study does not change the DC supply example.':'Original schematic teaching example.'}`;
}
export function technologyNote(state,fallback){
  const t=state.technology||DEFAULT_TECHNOLOGY,rotary=t.propulsion==='rotary',loop=t.control==='loop';
  const control=loop?'Violet insulated data-loop wires and the undercar pickup carry train-control information. They are separate from the DC conductors and any LIM reaction rail.':t.control==='radio'?'Control radio carries CBTC information; operational voice and passenger information remain different services.':'The named signalling study shows its own control arrangement; the DC vehicle context does not become a mainline electrification design.';
  if(state.view==='guideway')return `${rotary?'Running rails now support and guide an axle-driven train. No LIM reaction rail is shown.':'The central passive reaction rail interacts with the train-mounted LIM; running rails support and guide the wheels.'} The selected outgoing and return DC conductors carry traction power. ${control}`;
  if(state.view==='bogie')return `${rotary?'Rotary motors transmit torque through gearboxes to the axles; wheel–rail adhesion transfers tractive force.':'The LIM primary produces force through its interaction with the reaction rail; the wheels support and guide the train.'} Friction brakes and wheel-speed sensing retain their separate roles. ${loop?'The undercar loop pickup is a data device, not a collector shoe.':''}`;
  if(['vehicle','system'].includes(state.view))return `${rotary?'The selected train uses rotary motors and axle gearboxes.':'The selected train uses short-primary LIM propulsion.'} ${control} Geometry, equipment positions and paths are schematic.`;
  if(['control','communications'].includes(state.view))return `${control} ATP protection, driving requests and supervisory functions remain distinct. Functional boxes do not prescribe physical computer counts.`;
  return fallback;
}
export function technologyFlow(state,base){
  const t=state.technology||DEFAULT_TECHNOLOGY,rotary=t.propulsion==='rotary',loop=t.control==='loop';
  if(state.view&&['lim','seltrac','cbtc-network','signalling','etcs','interlocking','train-detection'].includes(state.view))return base;
  if(state.scenario==='radio-loss'&&loop)return {title:'Hold a train-control update',description:'The chosen loop information path is interrupted in this teaching case. Passenger displays and operational voice do not supply replacement movement permission. No timeout, stopping distance or real operating response is calculated.',nodes:['Loop update held','External information unavailable','Onboard protection remains distinct'],kind:'signal',sources:['S02','S03']};
  if(state.domain==='communications')return {...base,title:'Information transport is separate from permission',description:loop?'Train-control information uses the insulated inductive loop and undercar pickup in this example. Operational radio, passenger audio, displays and video perform different jobs. A working passenger service is not authority to move.':t.control==='radio'?'CBTC information uses the selected control-radio link. Operational voice, displays, passenger audio and video remain separate services; their availability does not establish movement permission.':'Inspect the named control study for its signalling path. Vehicle communications still carry supervisory and passenger information, independently of the physical propulsion choice.',nodes:loop?['Wayside loop interface','Inductive data loop','Undercar pickup','Onboard control / supervision']:['Selected control interface','Onboard equipment','Operational / passenger services'],sources:loop?['S02','S03','T10']:base.sources};
  if(!rotary||!['power','vehicle'].includes(state.domain)&&state.view!=='guideway')return base;
  if(state.scenario==='door-open'||state.scenario==='wheel-slip'||state.mode==='isolated'||state.view==='services')return base;
  if(state.mode==='regeneration')return {...base,description:state.sink==='resistor'?'During electrical braking, wheel–rail forces turn the axles, gearboxes and rotary machines. The converter returns electrical energy to the DC network; surplus energy can reach the selected wayside resistor and become heat. This diode-rectifier example does not export to the AC utility. Friction braking remains distinct.':'During electrical braking, wheel–rail forces turn the axles, gearboxes and rotary machines. Their converter supplies electrical energy to a receptive DC network, represented here by another compatible train. Recovery depends on available receiving equipment and paths.',nodes:['Vehicle kinetic energy','Axles / rotary machines / converter','DC network',state.sink==='resistor'?'Wayside resistor → heat':'Receptive train']};
  if(state.mode==='coasting')return {...base,description:'The selected rotary drive has no propulsive torque cue while auxiliary loads can remain supplied. Coasting does not mean HVAC, control electronics and communications stop drawing electrical power.',nodes:['DC supply','Auxiliary converter','Supporting loads','No propulsion demand']};
  return {title:'Electrical energy becomes axle torque and tractive force',description:'The selected DC supply feeds the vehicle converter. It energizes rotary traction motors, which transmit torque through gearboxes to the axles. Wheel–rail adhesion transfers longitudinal force to the vehicle. Propulsion type does not determine the train-control communication technology.',nodes:['DC supply + collector','Inverter / rotary motor','Gearbox / axle','Wheel–rail force'],sources:['P01','P04','X02']};
}
