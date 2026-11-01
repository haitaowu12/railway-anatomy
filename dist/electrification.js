// Collection, electrical supply and return are distinct design choices. These
// four coherent teaching arrangements are not a catalogue of installed fleets.
export const DEFAULT_ELECTRIFICATION = 'fourth-rail-dc';
export const ELECTRIFICATION_CHOICES = Object.freeze([
  {id:'fourth-rail-dc',label:'Fourth rail · DC',collection:'Conductor rail + two shoes',supply:'DC',returnPath:'Separate return conductor',description:'Wayside rectification feeds a supply conductor; a second conductor and shoe complete the normal traction circuit.',resistorLocation:'wayside',sources:['EL01','EL02','P01']},
  {id:'third-rail-dc',label:'Third rail · DC',collection:'Conductor rail + shoe',supply:'DC',returnPath:'Wheels + running rails',description:'A conductor rail supplies the vehicle. Wheelset return connections and bonded running rails complete the normal traction circuit.',resistorLocation:'wayside',sources:['EL01','EL02','P01']},
  {id:'overhead-dc',label:'Overhead · DC',collection:'Contact wire + pantograph',supply:'DC',returnPath:'Wheels + running rails',description:'Wayside rectification supplies an overhead contact wire. A pantograph feeds the onboard DC path; running rails provide the return.',resistorLocation:'wayside',sources:['EL03','P01','P04']},
  {id:'overhead-ac',label:'Overhead · AC',collection:'Contact wire + pantograph',supply:'AC',returnPath:'Wheels + running rails',description:'An AC feeder supplies the contact wire. A conventional onboard transformer and line converter feed the DC link; the primary circuit returns through the running rails.',resistorLocation:'onboard',sources:['E01','E02','EL03']},
]);
export const ELECTRIFICATION_VIEWS = Object.freeze(['system','substation','guideway','vehicle','bogie','electrification']);
export function normalizeElectrification(value){
  const candidate = value === 'dc' ? DEFAULT_ELECTRIFICATION : value === 'ac' ? 'overhead-ac' : value;
  return ELECTRIFICATION_CHOICES.some(choice=>choice.id===candidate) ? candidate : DEFAULT_ELECTRIFICATION;
}
export function electrificationProfile(value){return ELECTRIFICATION_CHOICES.find(choice=>choice.id===normalizeElectrification(value));}
export function electrificationForComponent(value,id){
  const current=normalizeElectrification(value);
  if(['negative-rail','collector-return-shoe'].includes(id))return 'fourth-rail-dc';
  if(['collector','collector-positive-shoe','positive-rail'].includes(id)&&current.startsWith('overhead'))return 'third-rail-dc';
  if(['pantograph','pantograph-base','pantograph-arms','pantograph-head','overhead-contact-wire','overhead-support'].includes(id)&&!current.startsWith('overhead'))return 'overhead-dc';
  if(['onboard-transformer','study-onboard-transformer','line-converter','line-converter-module','onboard-braking-resistor','ac-feeder-switchgear'].includes(id))return 'overhead-ac';
  if(['running-rail-return','wheel-return'].includes(id)&&current==='fourth-rail-dc')return 'third-rail-dc';
  if(['rectifier','rectifier-diode-stack','rectifier-cooling','rectifier-busbar','wayside-resistor','dc-switchgear','breaker','breaker-arc-chute'].includes(id)&&current==='overhead-ac')return 'fourth-rail-dc';
  return current;
}
export function electrificationNote(state){
  if(!ELECTRIFICATION_VIEWS.includes(state.view)||state.view.startsWith('power-'))return '';
  const profile=electrificationProfile(state.electrification),ac=profile.supply==='AC';
  return `${profile.label}: ${profile.description} ${ac?'The transformer primary circuit and its secondary converter circuit are electrically separate.':'The chosen wayside diode rectifier does not send regenerated power back to the AC utility.'} Collection does not determine propulsion or train control. Geometry is illustrative; no installed arrangement, voltage rating or operating procedure is prescribed.`;
}
export function electrificationFlow(state,base){
  if(!['system','substation','guideway','vehicle','bogie','electrification'].includes(state.view))return base;
  if(['control','communications'].includes(state.domain)||['door-open','wheel-slip','radio-loss'].includes(state.scenario))return base;
  const p=electrificationProfile(state.electrification),ac=p.supply==='AC',rotary=state.technology?.propulsion==='rotary';
  const drive=rotary?'Motor inverter → rotary motor → axle':'Motor inverter → LIM primary / reaction rail';
  if(state.mode==='isolated')return {title:'Supply interruption is a separate condition',description:'The illustrated feeder breaker is open and the traction paths are hidden. This visual condition is not proof of a dead, earthed or safe-to-work railway. Collection and return hardware remain visible for inspection.',nodes:['Feeder interruption','Collection equipment remains present','No traction-current trace'],sources:p.sources};
  if(state.mode==='regeneration'){
    const resistor=(state.sink||state.receptivity)==='resistor';
    return {title:resistor?'Electrical braking with limited network receptivity':'Electrical braking with a receiving train',description:resistor?(ac?'The selected onboard braking chopper diverts DC-link energy to a resistor when the illustrated network does not receive it. The train-side resistor becomes the visible heat destination; a wayside DC resistor is absent. This is one designed braking arrangement, not a claim that all AC fleets use it.':'The traction converter returns energy to the DC network. In this selected arrangement a wayside resistor absorbs surplus energy as heat. The diode rectifier does not reverse into the utility.'):`The selected ${rotary?'rotary drive':'LIM drive'} and converter return electrical energy through the ${p.collection.toLowerCase()}. A compatible receiving train absorbs it through the same supply and return network. The illustration does not assume export to the utility.`,nodes:[rotary?'Kinetic energy → wheelset / motor':'Kinetic energy → LIM / converter',ac?'Onboard converter / DC link':'DC traction network',resistor?(ac?'Onboard resistor → heat':'Wayside resistor → heat'):'Compatible receiving train',p.returnPath],sources:[...p.sources,'P12']};
  }
  if(state.mode==='coasting')return {title:'Supporting loads can remain supplied',description:`The ${p.collection.toLowerCase()} and ${p.returnPath.toLowerCase()} remain part of the supply circuit while propulsion demand is absent. Auxiliary conversion supplies supporting loads. The line is a topology cue, not a measurement of current.`,nodes:[p.label,'Onboard supply / auxiliary converter','Supporting loads','No propulsion cue'],sources:p.sources};
  return {title:'Follow supply, conversion and return',description:`${p.description} ${rotary?'The motor inverter feeds a rotary motor and axle drive.':'The motor inverter feeds the LIM primary; the passive reaction rail is not a traction supply conductor.'} Amber marks the selected supply path and cyan its return; copper identifies the isolated transformer secondary circuit in AC. The paths show topology, not instantaneous AC current direction.`,nodes:[ac?'AC feeder transformer + switchgear':'Wayside transformer + diode rectifier',p.collection,ac?'Onboard transformer → line converter → DC link':'Onboard DC link',drive,p.returnPath],sources:p.sources};
}
