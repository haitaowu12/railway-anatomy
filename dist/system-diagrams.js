import {electrificationProfile} from './electrification.js';
// Functional relationships are diagrams. A node is a function or an interface,
// never a promise that the railway has one physical cabinet for that function.
const node=(id,label,component,location,role)=>({id,label,component,location,role});
const edge=(from,to,label,direction)=>({from,to,label,...(direction?{direction}:{})});
const diagram=(title,description,nodes,edges,extra={})=>({title,description,nodes,edges,...extra});
const status=(item,condition,statusLabel)=>({...item,status:condition===null?'unknown':condition?'available':'unavailable',statusLabel});

export function dependencyState(variant='normal') {
  const supply=variant!=='power-loss',pathA=variant!=='network-loss';
  const stationLive=supply, powerLive=supply&&pathA;
  const identity=variant!=='identity-loss', configuration=!['restored'].includes(variant);
  const historyGap=['record-loss','restored','checked'].includes(variant),recorder=variant!=='record-loss'&&supply;
  const stationRequests=stationLive&&identity&&configuration,powerRequests=powerLive&&identity&&configuration;
  return {supply,pathA,pathB:true,stationLive,powerLive,identity,configuration,recorder,historyGap,
    stationRequests,powerRequests,requests:stationRequests&&powerRequests,
    rows:[
      ['Station live information',stationLive?'Available via '+(pathA?'A or B':'B'):'Unavailable','The fictional station application has two communication paths but one common application supply.'],
      ['Power live information',powerLive?'Available via A':'Unavailable','This fictional power application has only path A. A station alternate path is not its alternate.'],
      ['New station request',!stationLive?'No communication / application path':!identity?'Identity unavailable':!configuration?'Configuration unconfirmed':'Prerequisites represented','The station path and application, identity and consistent configuration are separate prerequisites. Permission and execution are not inferred.'],
      ['New power request',!powerLive?'No communication / application path':!identity?'Identity unavailable':!configuration?'Configuration unconfirmed':'Prerequisites represented','Station path B does not provide a request path for the power application.'],
      ['Recording infrastructure',recorder?'Recorder available':'Recording interrupted','An available recorder does not establish receipt of fresh source data.'],
      ['Fresh information available to record',!recorder?'Neither application':stationLive&&powerLive?'Both selected live sources':stationLive?'Station source only':'Neither selected source',!pathA?'Power information cannot be treated as fresh through the failed path A. Stored last-known data remains separately identified.':'Fresh information requires a live source path as well as available recording equipment. Stored last-known data remains separately identified.'],
      ['Historical record',historyGap?'Earlier gap remains':'No earlier gap modeled','Restoring a connection does not recreate observations that were not recorded.'],
      ['Recovery evidence',variant==='checked'?'Checks represented':variant==='restored'?'Outstanding':'Case-dependent','Selected comparison states have no timed failover or operational release meaning.'],
    ]};
}

export function journeyState(variant='available') {
  const mainLift=!['outage','alternative'].includes(variant), alternate=variant==='alternative';
  const platform=mainLift||alternate, boarding=platform&&variant!=='aid-required';
  return {mainLift,alternate,platform,boarding,
    route:!platform?'Route interrupted before the platform':!boarding?'Platform reached; boarding unresolved':alternate?'Alternative lift route reaches the train':'Selected route reaches the train',
    rows:[
      ['Entrance and gate','Connected','A wide gate is one part of a complete usable route.'],
      ['Near lift',mainLift?'Available':'Unavailable','Stairs do not replace this step-free connection.'],
      ['Alternative lift',alternate?'Selected and connected':'Not assumed available','Only the explicitly selected fictional alternative creates this second route.'],
      ['Platform',platform?'Reachable':'No demonstrated step-free route','Check the whole route, including approach and destination.'],
      ['Vehicle boarding',!platform?'Not reached':variant==='aid-required'?'Aid/assistance still required':variant==='aid-placed'?'Illustrated bridging plate in place':'Connected in the selected example','Platform access and the vehicle gap are distinct interfaces. A drawn plate does not prove a usable or compliant deployment.'],
      ['Information and assistance','Separate service','Wayfinding, audible/visual information and assistance remain relevant even where the physical route is usable.'],
    ]};
}

const controlNodes=()=>[
  node('supervision','Service supervision','ats','Supervision','Plan and operating picture'),
  node('route','Route protection','interlocking','Wayside functions','Requests checked against conditions'),
  node('protection','Train protection','atp','Onboard functions','Supervise permitted limits'),
  node('driving','Automatic driving','ato','Onboard functions','Requests within protection limits'),
  node('vehicle','Traction and brake interfaces','train-control','Onboard functions','Defined vehicle interfaces; TCMS allocation varies'),
];

export function systemDiagram(state,definition={}) {
  const {view,variant='default'}=state,chosen=definition.variants?.find(v=>v.id===variant);
  const description=chosen?.description||definition.note||'';
  if(view==='electrification') {
    const p=electrificationProfile(state.electrification),ac=p.supply==='AC',overhead=p.id.startsWith('overhead'),fourth=p.id==='fourth-rail-dc';
    return diagram(p.label+': supply, conversion and return',p.description+' The motor architecture remains an independent choice. Arrows show circuit relationships, not instantaneous AC current direction.',[
      node('source',ac?'AC supply transformer':'Transformer and rectifier','supply-conversion','Wayside supply',ac?'Feeds the AC contact system':'Feeds the DC contact system'),
      node('contact',overhead?'Contact wire':'Supply conductor rail',overhead?'overhead-contact-wire':'positive-rail','Collection and return','Supply-side contact'),
      node('collector',overhead?'Pantograph':'Supply collector shoe',overhead?'pantograph':'collector-positive-shoe','Vehicle',p.collection),
      node('conversion',ac?'Onboard transformer and line converter':'Onboard DC link',ac?'onboard-transformer':'dc-link','Vehicle',ac?'Isolated transformer secondary feeds line conversion':'DC supply interface'),
      node('traction','Motor inverter and load','traction-inverter','Vehicle','LIM or rotary drive selected separately'),
      node('return',fourth?'Return shoe and separate rail':'Wheelset and running-rail return',fourth?'collector-return-shoe':'running-rail-return','Collection and return',p.returnPath),
    ],[edge('source','contact','Supply-side connection'),edge('contact','collector','Sliding electrical contact'),edge('collector','conversion','Onboard supply input'),edge('conversion','traction','DC-link energy feeds the motor inverter'),edge('conversion','return',ac?'Transformer primary return; secondary circuit remains separate':'Normal traction-return path'),edge('return','source','Return to the supply boundary')],{sources:p.sources});
  }
  if(view==='control')return diagram('Protect, drive and supervise',
    'These are distinct responsibilities. Function allocation, hosting and interface details vary. Propulsion type does not select the train-control architecture.',controlNodes(),[
      edge('supervision','route','Service or route request; not movement permission'),edge('route','protection','Movement limits through the selected control architecture'),edge('protection','driving','Applicable protection envelope; the actual interface varies'),edge('driving','vehicle','Driving requests through defined traction and brake interfaces'),edge('protection','vehicle','Protection intervention through its defined train interface'),edge('vehicle','supervision','Reported status through the selected communications services'),
    ],{sources:['CI12','CI13']});
  if(view==='cbtc-network')return diagram('CBTC: transport, localization and protection',description,[
    node('localization','Localization','odometry','Train','Position estimate and uncertainty'),
    node('onboard','Onboard protection','train-control','Train','Supervises the train'),
    node('radio','Train–wayside transport','train-radio','Communications','Carries the defined messages'),
    node('wayside','Wayside control functions','zone-controller','Wayside','Uses relevant train and route information'),
    node('routes','Route protection','interlocking','Wayside','Separate route and point conditions'),
  ],[edge('localization','onboard','Position information with its defined confidence'),edge('onboard','radio','Train reports and received movement information','both'),edge('radio','wayside','Control-message exchange; transport is not the decision','both'),edge('routes','wayside','Route conditions through the selected interface')]);
  if(view==='signalling'||view==='interlocking')return diagram(view==='interlocking'?'Request, physical movement, proof and route output':'Detection and route protection',description,[
    node('request','Route request','ats','Operating interface','A request, not proved conditions'),
    node('logic','Interlocking','interlocking','Route protection',variant==='unproved'?'Proof incomplete':'Evaluates relevant conditions'),
    node('points','Point mechanism','point-machine','Field equipment','Movement is distinct from indication'),
    node('detection','Train detection','train-detection','Field equipment',variant==='occupied'?'Occupied example':'Defined detection input'),
    node('output','Signal / route output','lineside-signal','Operating interface','Meaning depends on the signalling design'),
  ],[edge('request','logic','Request is evaluated against route conditions'),edge('logic','points','Point movement command'),edge('points','logic',variant==='unproved'?'Required position/locking proof is absent':'Separate position and locking proof'),edge('detection','logic','Defined occupancy or clear indication'),edge('logic','output',variant==='unproved'||variant==='occupied'?'The selected example withholds the permissive condition':'Only the selected conditions are illustrated; no complete interlocking is implemented')]);
  if(view==='etcs') {
    if(variant==='level-2')return diagram('ETCS Level 2: radio and reference are different paths',description,[
      node('route','Interlocking','interlocking','Infrastructure','Relevant route information'),node('rbc','Radio Block Centre','rbc','Infrastructure','Generates defined movement information'),
      node('radio','Railway radio transport','gsm-r-frmcs','Communications','Radio bearer selected by the system'),
      node('onboard','ETCS onboard','etcs-onboard','Train','Continuous onboard supervision'),node('reference','Balise reference','balise','Infrastructure','Location reference'),
    ],[edge('route','rbc','Infrastructure state'),edge('rbc','radio','Movement information and train reports','both'),edge('radio','onboard','Defined ETCS radio exchange','both'),edge('reference','onboard','A separate passing location reference')]);
    return diagram('ETCS Level 1: a passing telegram, continuing supervision',description,[
      node('route','Interlocking','interlocking','Infrastructure','Signalling conditions'),node('leu','Lineside electronic unit','leu','Infrastructure','Switchable telegram selection'),node('balise','Switchable balise','balise','Track interface','Passing telegram in this example'),node('onboard','ETCS onboard','etcs-onboard','Train','Supervision continues between updates'),
    ],[edge('route','leu','Relevant signalling information'),edge('leu','balise','Selected switchable-balise information'),edge('balise','onboard','Telegram received while passing; not a continuous radio link')]);
  }
  if(view==='seltrac') {
    const loop=variant==='loop';
    return diagram(loop?'Legacy SelTrac loop: information, not traction power':variant==='g9'?'SelTrac G9: logical functions and hosting':'SelTrac: radio transport',description,[
      node('onboard','Onboard control','train-control','Train','Protection and driving responsibilities'),
      node('interface',loop?'Under-car loop pickup':'Train radio',loop?'loop-pickup':'train-radio','Train','Communication interface'),
      node('bearer',loop?'Inductive data loop':'Wayside communications',loop?'seltrac-loop':'wayside-radio','Communications','Selected information transport'),
      node('wayside',variant==='g9'?'Hosted control functions':'Wayside control functions',variant==='g9'?'seltrac-g9':'zone-controller','Wayside functions','Allocation is supplier/generation dependent'),
    ],[edge('onboard','interface','Defined onboard interface','both'),edge('interface','bearer','Train–wayside message exchange','both'),edge('bearer','wayside','Control messages; no universal cabinet allocation','both')]);
  }
  if(view==='communications')return diagram('Separate the onboard information services',
    'A shared physical network may carry several services, but convergence and cross-service gateways require an explicit design. This map shows no assumed bridge between train-control radio and the onboard service network.',[
      node('train','Train-control function','train-control','Control service','Control messages'),node('radio','Train–wayside radio','train-radio','Communications','Selected transport'),
      node('network','Onboard data network','train-network','Communications','Defined service interfaces'),node('vehicle','Vehicle management','tcms','Vehicle services','Equipment status and requests'),
      node('passenger','Passenger information','passenger-info','Vehicle services','Passenger messages'),
    ],[edge('train','radio','Control messages over the defined interface','both'),edge('network','vehicle','Vehicle-service data','both'),edge('network','passenger','Passenger-service information')],{sources:['CM03','CM07','F20','CI12']});
  if(view==='dependencies') {
    const s=dependencyState(variant);
    return diagram('Two services can still share a failure',description,[
      status(node('power','Common application supply','dependency-power','Shared dependencies','Same application supply for both services'),s.supply,s.supply?'Supply present':'Supply lost'),
      status(node('identity','Identity service','dependency-identity','Shared dependencies','A prerequisite for a new request'),s.identity,s.identity?'Identity service present':'Identity unavailable'),
      status(node('configuration','Configuration consistency','dependency-configuration','Shared dependencies','Separate from connectivity'),s.configuration?true:null,s.configuration?'Prerequisite represented':'Configuration unconfirmed'),
      status(node('station','Station information service','dependency-services','Applications','Paths A or B; common application supply'),s.stationLive,s.stationLive?'Live path available':'No live path'),
      status(node('powerapp','Power supervision service','power-scada','Applications','Path A only; common application supply'),s.powerLive,s.powerLive?'Live path available':'No live path'),
      status(node('a','Network path A','dependency-network','Transport and record','Shared by these two selected services'),s.pathA,s.pathA?'Path present':'Path lost'),
      status(node('b','Station alternate B','dependency-network','Transport and record','Station service only'),s.pathB,'Station path present'),
      status(node('record','Recorder','dependency-recording','Transport and record',s.historyGap?'Earlier gap is retained':'Source freshness is separate'),s.recorder,s.recorder?'Recorder available':'Recording interrupted'),
    ],[
      status(edge('power','station','Required application supply'),s.supply,s.supply?'Supply present':'Supply lost'),
      status(edge('power','powerapp','Same shared supply'),s.supply,s.supply?'Supply present':'Supply lost'),
      status(edge('identity','station','Identity prerequisite for a new request'),s.identity,s.identity?'Prerequisite present':'Identity unavailable'),
      status(edge('identity','powerapp','Identity prerequisite for a new request'),s.identity,s.identity?'Prerequisite present':'Identity unavailable'),
      status(edge('configuration','station','Configuration prerequisite'),s.configuration?true:null,s.configuration?'Represented':'Unconfirmed'),
      status(edge('configuration','powerapp','Configuration prerequisite'),s.configuration?true:null,s.configuration?'Represented':'Unconfirmed'),
      status(edge('a','station','Station information and request path','both'),s.pathA,s.pathA?'Path present':'Path lost'),
      status(edge('b','station','Station alternate information and request path','both'),s.pathB,'Station path only'),
      status(edge('a','powerapp','Power information and request path; no B alternative','both'),s.pathA,s.pathA?'Path present':'Path lost'),
      status(edge('station','record','Selected recording branch'),s.recorder&&s.stationLive,s.recorder&&s.stationLive?'Fresh source path represented':'Recording or source unavailable'),
      status(edge('powerapp','record','Selected recording branch'),s.recorder&&s.powerLive,s.recorder&&s.powerLive?'Fresh source path represented':'Recording or source unavailable'),
    ],{rows:s.rows,result:'Compare each service, request path and evidence claim separately. Dashed paths show unavailable or unconfirmed relationships.',sources:chosen?.sources||['R01','R02']});
  }
  if(view==='accessible-journey') {
    const s=journeyState(variant);
    return diagram('A complete journey includes the boarding interface',description,[
      status(node('entrance','Street and entrance','access-entrance','Concourse','Route begins before the platform'),true,'Selected connection'),
      status(node('gate','Gate passage','access-gate','Concourse','Physical passage'),true,'Selected connection'),
      status(node('near','Near lift','access-lift','Vertical route','Separate from the stairs'),s.mainLift,s.mainLift?'Available in example':'Lift unavailable'),
      status(node('alternate','Alternative lift','access-lift','Vertical route','Requires a connected approach and exit'),s.alternate?true:null,s.alternate?'Alternative selected':'Availability not assumed'),
      status(node('platform','Platform route','access-information','Platform and boarding','A separate interface from vehicle boarding'),s.platform,s.platform?'Platform reached':'Route interrupted'),
      status(node('boarding','Boarding interface','access-boarding','Platform and boarding',variant==='aid-placed'?'Illustrated plate bridges the gap':'Gap / vehicle interface'),s.boarding,s.boarding?'Connected in example':s.platform?'Boarding unresolved':'Not reached'),
      status(node('help','Information and assistance','access-assistance','Concourse','Supports the person; not a physical detour'),null,'Service availability not established'),
    ],[
      status(edge('entrance','gate','Selected entrance and wide gate'),true,'Selected connection'),
      status(edge('gate','near','Approach to the near lift'),s.mainLift,s.mainLift?'Connected':'Unavailable onward lift'),
      status(edge('gate','alternate','Possible alternative approach'),s.alternate?true:null,s.alternate?'Alternative selected':'Not assumed'),
      status(edge('near','platform','Near-lift vertical connection'),s.mainLift,s.mainLift?'Connected':'Lift unavailable'),
      status(edge('alternate','platform','Alternative vertical connection'),s.alternate?true:null,s.alternate?'Connected':'Not assumed'),
      status(edge('platform','boarding','Platform to vehicle boarding interface'),s.boarding,s.boarding?'Connected in example':s.platform?'Gap / assistance unresolved':'Platform not reached'),
      status(edge('help','platform','Wayfinding and assistance; not a physical route'),null,'Availability separately established'),
    ],{rows:s.rows,result:s.route,sources:chosen?.sources||['A01','A02','A03']});
  }
  if(view==='tunnel-ventilation'&&variant==='smoke-objective')return diagram('Ventilation objective, controller and returned evidence',description,[
    node('objective','Engineered smoke objective','smoke-control','Design and operations','Depends on zone and incident'),node('controller','Tunnel ventilation controller','tvcs-controller','Local control','Owns the defined mode logic and interlocks'),
    node('fan','Fan equipment','tunnel-fan','Plant','Command and measured state differ'),node('damper','Damper equipment','tunnel-damper','Plant','Returned position is a separate input'),node('supervision','Supervisory interface','station-scada','Design and operations','Optional status / permitted mode requests'),
  ],[edge('objective','controller','Approved control design defines eligible modes; the diagram gives no fan recipe'),edge('controller','fan','Defined commands and returned plant feedback','both'),edge('controller','damper','Defined commands and separate position evidence','both'),edge('controller','supervision','Selected monitoring / request interface if provided','both')],{interfaceDomain:'tunnel'});
  if(view==='occ-equipment'){
    const alternate=variant==='alternate',display=variant!=='display-loss';
    return diagram('One chosen host; separate display and recording',description,[
      status(node('service','Application host A','occ-application-service','Application','Selected before the information trace'),alternate?null:true,alternate?'Not selected':'Host A selected'),
      status(node('alternate','Application host B','occ-alternate-service','Application','A selected alternative, not automatic failover'),alternate?true:null,alternate?'Host B selected':'Not selected'),
      status(node('network','Data-network interface','occ-supervisory-network','Distribution','Declared application information path'),true,'Path available in example'),
      status(node('display','Operator display','occ-task-display','Presentation and record','Presentation is separate from the host'),display,display?'Picture available':'Picture unavailable'),
      status(node('record','Event recorder','operations-event-recording','Presentation and record','Recording is separate from the task picture'),true,'Recording path available'),
    ],[
      status(edge('service','network','Application information from host A'),alternate?null:true,alternate?'Not the selected host':'Selected information source'),
      status(edge('alternate','network','Application information from host B'),alternate?true:null,alternate?'Selected information source':'Not the selected host'),
      status(edge('network','display','Task-display branch'),display,display?'Picture available':'Presentation unavailable'),
      status(edge('network','record','Independent recording branch'),true,'Record path remains available'),
    ],{sources:chosen?.sources||['F17','F19','OC08'],rows:[['Application selection',alternate?'Host B selected':'Host A selected','The choice precedes the example; no failover detection, timing or transfer is simulated.'],['Task picture',display?'Available':'Unavailable','A missing display does not establish that the host, network or field plant has failed.'],['Recording path','Available in this example','A record can continue without a task picture; its source and quality still require interpretation.'],['Remote plant condition','No conclusion from screen availability','The observation and its validity must be assessed through their own interfaces.']],result:'Display loss, application selection and recording are different states.'});
  }
  if(view==='depot-testing')return diagram('A test fixture and a test conclusion are different',description,[
    node('subject','Identified vehicle / item','depot-functional-checks','Test definition','Configuration and work scope'),node('conditions','Declared test conditions','depot-diagnostics','Test definition',variant==='movement'?'Defined movement-test boundary':'Defined stationary-test boundary'),
    node('observe','Stimulus and observation','depot-functional-checks','Evidence','Expected and observed response'),node('record','Result and limitations','change-test','Evidence','Traceable to the subject'),node('decision','Maintenance release interface','depot-maintenance-release','Review','A separate responsible decision'),
  ],[edge('subject','conditions','Match the test to the item and configuration'),edge('conditions','observe','Define what can be observed under these conditions'),edge('observe','record','Retain response, timing, exceptions and limitations'),edge('record','decision','Evidence supports only its declared scope; animation cannot issue a release')],{rows:[['Subject','Identified','Vehicle/item, configuration and relevant work are traceable.'],['Conditions',variant==='movement'?'Movement':'Stationary','No speeds, stopping limits or depot operating instructions are prescribed.'],['Observation','Retained','Expected response is compared with the actual observation, including an unsuccessful result.'],['Conclusion','Bounded','A component check does not establish every vehicle function or movement permission.']],result:'Use the physical test arrangement as context; examine evidence here.'});
  return null;
}

export const DIAGRAM_VIEWS=['control','cbtc-network','signalling','etcs','seltrac','interlocking','communications','dependencies','accessible-journey','occ-equipment','depot-testing'];
