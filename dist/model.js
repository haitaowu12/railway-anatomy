import {SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS} from './atlas-config.js';
import {applyMotionGuides} from './motion-guides.js';
export {PART_CONTEXTS};
export const variantsFor=(id,view)=>PART_VIEW_VARIANTS[id]?.[view]||[];
export const variantFor=(id,view)=>{const preferred=PART_VARIANTS[id]||'default',available=view?variantsFor(id,view):[];return available.length&&!available.includes(preferred)?available[0]:preferred;};
export const DOMAINS = SYSTEMS;

export const VIEWS = {
  system:{label:'Whole system',title:'The energy journey',component:'utility',note:'Amber: outgoing DC. Cyan: return. The green receiving train and wayside resistor are alternative braking-energy destinations. Geometry and flows are schematic.'},
  substation:{label:'Substation',title:'Convert, distribute, protect',component:'transformer',note:'Open the enclosure to reveal the transformer, diode rectifier and DC distribution. The station layout, ratings and auxiliary arrangements are illustrative.'},
  guideway:{label:'Guideway',title:'Four functions at track level',component:'reaction-rail',note:'Two running rails support the wheels. Separate outgoing and return conductors complete this chosen DC circuit. The central reaction rail is the passive LIM secondary.'},
  vehicle:{label:'Vehicle',title:'A train is more than its motor',component:'carbody',note:'Roof, passenger and underframe equipment are shown in illustrative positions. Open the enclosure or select a component to inspect its role.'},
  bogie:{label:'Bogie & sensors',title:'Support, brake and sense motion',component:'bogie',note:'The wheelsets support and guide the train; the LIM provides propulsion force. The axle sensor estimates rotation. Wheel-slide cues concern friction braking.'},
  lim:{label:'Linear motor',title:'Force across an air gap',component:'lim-primary',note:'The primary is train-mounted. In motoring, its field travels opposite the thrust direction in the primary’s frame. Field arches and induced-current loops illustrate interaction; they are not a solved electromagnetic field.'},
  control:{label:'Control architecture',title:'Protect, drive and supervise',component:'atp',note:'Violet paths carry information. ATP, ATO and TCMS are functional layers; the separate boxes do not prescribe computer count. The selected wayside arrangement is one CBTC example.'},
  communications:{label:'Communication paths',title:'Different messages, different jobs',component:'train-network',note:'Violet dashed paths represent logical information services, not a wiring plan. Control radio, onboard data, audio and video have distinct responsibilities even where infrastructure is shared.'},
  services:{label:'Inside the vehicle',title:'Keep the vehicle working',component:'apu',note:'Explore auxiliary conversion, batteries, HVAC fans and ducts, doors, compressed air and passenger systems. The arrangement and supported loads are illustrative.'},
};

Object.assign(VIEWS,NEW_VIEWS);
applyMotionGuides(VIEWS);
VIEWS['depot-support'].variants.find(v=>v.id==='planning').presentation='process';
export const defaultVariant=view=>VIEWS[view]?.variants?.[0]?.id||'default';
export const cutawayFor=view=>['communications-network','communications-scada','communications-telephony','communications-passenger','communications-security','control','communications','services','station','station-plant','tunnel-ventilation','station-networks','fire-systems','ventilation-unit','switch-drive','cbtc-network','etcs','seltrac','interlocking','train-detection','platform-interface','operations-centre','depot-maintenance','depot-wash','depot-protection','depot-workshop','depot-utilities','depot-support','depot-condition','depot-components','depot-testing','occ-supervision','occ-incident','occ-equipment','occ-workplace'].includes(view);
const VIEW_OVERRIDES = {
  utility:'system','ac-switchgear':'substation',transformer:'substation',rectifier:'substation','dc-switchgear':'substation',breaker:'substation','wayside-resistor':'substation',grounding:'substation','facility-transformer':'substation',disconnect:'substation','substation-control':'substation','control-battery':'substation','positive-rail':'guideway','negative-rail':'guideway',collector:'guideway','running-rail':'guideway','reaction-rail':'guideway',carbody:'vehicle',bogie:'bogie','traction-inverter':'vehicle','lim-primary':'lim','motor-slip':'lim',brakes:'bogie','parking-brake':'bogie',regeneration:'system',tachometer:'bogie',accelerometer:'control',balise:'control','brake-control':'control',ats:'control','wayside-radio':'communications','zone-controller':'control',apu:'services','vehicle-battery':'services',hvac:'services',compressor:'services',doors:'services','door-control':'services',
};
export const MODEL_TARGETS = {'moving-block':'movement-authority','braking-curve':'atp','train-integrity':'train-control','etcs-level-1':'leu','etcs-level-2':'rbc','station-hvac':'hvac-air-handler','motor-slip':'lim-primary','parking-brake':'brakes',regeneration:'traction-inverter','brake-control':'brakes'};
export const targetFor = id => MODEL_TARGETS[id] || id;
export const domainFor = id => DOMAINS.find(d=>d.parts.includes(id));
export const viewFor = id => PART_VIEWS[id] || VIEW_OVERRIDES[id] || domainFor(id)?.view || 'system';
export const RELATED = {
  utility:['transformer','rectifier'],transformer:['rectifier','ac-switchgear'],rectifier:['dc-switchgear','regeneration'],breaker:['disconnect','dc-switchgear'],grounding:['negative-rail','breaker'],
  'positive-rail':['collector','negative-rail','reaction-rail'],'negative-rail':['positive-rail','grounding'],collector:['positive-rail','traction-inverter'],
  'reaction-rail':['lim-primary','running-rail'],'running-rail':['reaction-rail','bogie'],'lim-primary':['reaction-rail','traction-inverter','motor-slip'],'motor-slip':['lim-primary','reaction-rail'],
  'traction-inverter':['lim-primary','regeneration','apu'],regeneration:['wayside-resistor','brakes','rectifier'],'wayside-resistor':['regeneration','brakes'],brakes:['brake-control','tachometer','parking-brake'],
  'parking-brake':['brakes','compressor'],bogie:['lim-primary','brakes','tachometer'],carbody:['bogie','hvac','doors'],
  atp:['ato','ats','zone-controller'],ato:['atp','tcms','brake-control'],ats:['atp','ato'],
  'train-control':['atp','ato','tcms'],tcms:['train-control','traction-inverter','train-network'],'zone-controller':['train-radio','atp','ats'],
  tachometer:['accelerometer','balise','brake-control'],accelerometer:['tachometer','balise'],balise:['tachometer','train-control'],'brake-control':['brakes','tachometer','ato'],
  'train-radio':['wayside-radio','radio-antenna','train-control'],'radio-antenna':['train-radio','wayside-radio'],'wayside-radio':['zone-controller','train-radio'],
  'train-network':['tcms','passenger-info','cctv'],'passenger-info':['pa-intercom','train-network'],'pa-intercom':['passenger-info','train-radio'],cctv:['train-network','passenger-info'],
  apu:['vehicle-battery','hvac','traction-inverter'],'vehicle-battery':['apu','tcms'],hvac:['apu','tcms'],compressor:['brakes','apu'],doors:['door-control','tcms'],'door-control':['doors','ato','tcms'],
};

Object.assign(RELATED,PART_RELATIONS);

export const MODES = [{id:'motoring',label:'Accelerate'},{id:'regeneration',label:'Regenerate'},{id:'coasting',label:'Coast & supply loads'},{id:'isolated',label:'Line supply removed'}];
export const EXPERIMENTS = {
  control:[{id:'nominal',label:'Normal information flow'},{id:'door-open',label:'Door closure not confirmed'},{id:'wheel-slip',label:'Wheel-slide cue'}],
  communications:[{id:'nominal',label:'Messages flowing'},{id:'radio-loss',label:'Hold control radio'}],
  services:[{id:'nominal',label:'Supporting loads'},{id:'door-open',label:'Door closure not confirmed'}],
};

export function applyExperiment(state, value) {
  const next={...state};
  if(MODES.some(x=>x.id===value)) {next.mode=value;next.scenario='nominal';}
  else if(['nominal','radio-loss','door-open','wheel-slip','regen-limited'].includes(value)) {
    next.scenario=value;
    if(value==='regen-limited'){next.mode='regeneration';next.sink='resistor';}
    else if(value==='door-open'||value==='radio-loss'||value==='wheel-slip'){next.mode='coasting';}
  }
  return next;
}

export function describeFlow(state) {
  const {domain,mode,scenario,sink}=state;
  const variants=VIEWS[state.view]?.variants;
  if(variants){const item=variants.find(v=>v.id===state.variant)||variants[0];return {...item,kind:['track','station'].includes(domain)?'structure':'signal'};}
  if(scenario==='radio-loss') return {title:'A passenger service is not movement permission',description:'This authored example holds control-radio updates: the radio path is interrupted while onboard information services remain distinct. No radio timeout, permitted travel distance or universal stopping response is simulated.',nodes:['Train state','Control-radio update held','Onboard protection'],kind:'signal',sources:['T02','T05','T12']};
  if(scenario==='door-open') return {title:'The required door-closed and locked confirmations are missing',description:'The door controller has not received all the required closed-and-locked status signals. A door may still be open, unlocked or have an unconfirmed status; the missing confirmation alone does not identify the cause. This illustration shows an open door and withholds propulsion. A close command is not the same as a returned confirmation. Actual interlocks and degraded-operation rules depend on the railway.',nodes:['Close command','Closed / locked status not confirmed','Departure condition not satisfied','Propulsion withheld'],kind:'signal',sources:['T09','T04']};
  if(scenario==='wheel-slip') return {title:'Wheel rotation can disagree with vehicle motion',description:'The highlighted axle sensor illustrates a wheel-slide concern during friction braking. The arithmetic experiment below is a separate, invented distance bias. It does not imply that wheel slide always overestimates distance or that this LIM drives the wheels.',nodes:['Wheel rotation','Compare independent sensing','Position estimate + uncertainty'],kind:'signal',sources:['T06','T07','T08']};
  if(domain==='control') return {title:'A request, a permission and a response are different things',description:'ATO manages driving within the ATP operating envelope. Vehicle management coordinates subsystem commands and status. Motion sensors provide feedback; ATS supervises the service across the railway.',nodes:['Wayside information + sensors','ATP limits / ATO request','Vehicle equipment','Measured response'],kind:'signal',sources:['T01','T03','T04']};
  if(domain==='communications') return {title:'Follow the information, then find the decision',description:'Radio and onboard networks transport information. Train-control functions interpret control information; displays, speakers, intercom and video serve other purposes. Colours identify logical paths, not mandatory separate cables.',nodes:['Wayside network','Radio link','Onboard network','Control / passenger services'],kind:'signal',sources:['T02','T05','T10','T12']};
  if(state.view==='services') return {title:'Supporting systems need power and coordination',description:'The auxiliary converter supplies suitable electrical power for supporting loads. TCMS links commands and status. Air conditioning, doors and the compressor each perform a different physical job; battery support depends on the vehicle design.',nodes:['DC supply','Auxiliary conversion','Comfort + service loads','Status / commands'],kind:'signal',sources:['P05','P07','P08','T04']};
  if(mode==='regeneration') return sink==='resistor'
    ? {title:'Surplus electrical energy becomes heat',description:'In this chosen arrangement, the braking train supplies a controlled wayside resistor when a receptive train is unavailable. Friction braking remains another mechanism. The diode rectifier does not send this energy into the AC utility.',nodes:['Moving train','LIM + converter','DC conductors','Wayside resistor → heat'],sources:['P12','P04','P06','P01']}
    : {title:'Another train receives braking energy',description:'The converter returns electrical energy to a receptive DC network. The green receiving train represents a compatible load. Energy recovery depends on the receiving path and equipment; the illustrated diode rectifier does not reverse into the AC utility.',nodes:['Moving train','LIM + converter','DC conductors','Receptive train'],sources:['P04','P12','P01']};
  if(mode==='coasting') return {title:'No propulsive thrust; auxiliary loads can remain supplied',description:'The model removes the motor’s thrust cue while keeping the auxiliary supply path visible. Coasting does not mean that HVAC, control electronics or communications stop using energy.',nodes:['AC supply','Rectifier + DC circuit','Auxiliary converter','Supporting loads'],sources:['P05','P04']};
  if(mode==='isolated') return {title:'The illustrated line supply path is removed',description:'Power-flow cues are suppressed. A separate vehicle battery may support selected functions depending on the design. This is an energy-path illustration, not an electrical isolation procedure or proof that equipment is safe to touch.',nodes:['Line supply removed','No illustrated line-power flow','Selected stored-energy loads'],kind:'idle',sources:['P05']};
  return {title:'Electrical energy becomes linear thrust',description:'The transformer and rectifier provide the selected DC supply. Current collectors feed the onboard converter; the inverter energizes the LIM primary. The primary interacts with the reaction rail while a separate return conductor completes this example’s circuit.',nodes:['AC → transformer → rectifier','DC conductors + collectors','Inverter → LIM','Linear thrust'],sources:['P01','P02','P04','P11']};
}

export const wheelEstimate = errorPercent => 100*(1+Number(errorPercent)/100);

