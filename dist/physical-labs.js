// Deterministic teaching calculations. All numerical parameters below are
// original synthetic examples, not measurements or operating recommendations.
export const PHYSICAL_LAB_SOURCES = [
  {id:'PL01',title:'Nodal analysis with conductance matrices',publisher:'MIT 6.200',url:'https://circuits.mit.edu/S26/psets/01/nodes_G_matrix',description:'Ohm’s law and Kirchhoff current balance expressed as a conductance matrix.',scope:'Supports the circuit equations. The two-section DC topology and every numerical value are synthetic; no railway protection setting or switching procedure is adopted.'},
  {id:'PL02',title:'Improving Fan System Performance: A Sourcebook for Industry',publisher:'US Department of Energy and AMCA',url:'https://www.energy.gov/sites/prod/files/2014/05/f16/fan_sourcebook.pdf',description:'Fan/system-curve intersections, system resistance and speed relationships.',scope:'Supports the working-point method and similarity laws. The displayed fan curve and component resistance coefficients are invented, with constant density and no stall or smoke-control model.'},
  {id:'PL03',title:'The Effect of a Variable Disc Pad Friction Coefficient for the Mechanical Brake System of a Railway Vehicle',publisher:'Nam-Jin Lee and Chul-Goo Kang, PLOS ONE (2015)',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC4534372/',description:'Wheelset force/torque balances and the distinction between brake torque, rail contact force and creepage; equations 7, 8 and 12.',scope:'The lab reduces the balances to one equivalent translating mass and one rotating wheelset. It does not reuse the paper’s vehicle, contact parameters, controller, test results or braking distances.'},
];

const number=(value,fallback,min,max)=>{const n=value==null||value===''||typeof value==='boolean'?NaN:Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};
const choice=(value,options,fallback)=>options.includes(value)?value:fallback;
const round=(n,d=3)=>Number(n.toFixed(d));
const range=(id,label,min,max,step,unit,value)=>({id,label,type:'range',min,max,step,unit,default:value});
const select=(id,label,options,value)=>({id,label,type:'select',default:value,options:options.map(([value,label])=>({value,label}))});

export function solveElectricalSections(values={}) {
  const arrangement=choice(values.arrangement,['separated','coupled'],'separated');
  const condition=choice(values.condition,['normal','fault','local-open'],'fault');
  const telemetry=choice(values.telemetry,['current','stale'],'current');
  const resistance=number(values.resistance,.12,.02,1);
  const feederAOpen=condition==='local-open',faultAtA=condition!=='normal';
  const source=1,feederResistance=.1,tieResistance=.2,loadResistance=4;
  const ga=feederAOpen?0:1/feederResistance,gb=1/feederResistance,gt=arrangement==='coupled'?1/tieResistance:0,gl=1/loadResistance,gf=faultAtA?1/resistance:0;
  // (ga+gt+gl+gf)Va - gt Vb = ga E; -gt Va+(gb+gt+gl)Vb=gb E.
  const a=ga+gt+gl+gf,d=gb+gt+gl,det=a*d-gt*gt;
  const voltageA=source*(ga*d+gt*gb)/det,voltageB=source*(gb*a+gt*ga)/det;
  const currentA=ga*(source-voltageA),currentB=gb*(source-voltageB),tieCurrent=gt*(voltageB-voltageA);
  const loadA=gl*voltageA,loadB=gl*voltageB,faultCurrent=gf*voltageA;
  const sourcePower=source*(currentA+currentB);
  const lossPower=currentA**2*feederResistance+currentB**2*feederResistance+tieCurrent**2*tieResistance+(voltageA**2+voltageB**2)/loadResistance+(faultAtA?voltageA**2/resistance:0);
  return {arrangement,condition,telemetry,resistance,feederAOpen,faultAtA,voltageA,voltageB,currentA,currentB,tieCurrent,loadA,loadB,faultCurrent,sourcePower,lossPower,
    residualA:currentA+tieCurrent-loadA-faultCurrent,residualB:currentB-tieCurrent-loadB};
}

function electricalResult(values) {
  const s=solveElectricalSections(values);
  const snapshot=s.telemetry==='stale'?solveElectricalSections({...values,condition:s.feederAOpen?'fault':s.condition}):s;
  const scan=Array.from({length:101},(_,i)=>solveElectricalSections({...values,resistance:.02+i*.98/100}));
  return {
    summary:s.feederAOpen?(s.arrangement==='coupled'?'The local feeder is open, while the connected section still supplies the fault from source B in this ideal circuit.':'The separated boundary prevents source B feeding section A after the assumed local opening.'):'The physical boundary determines which source contributes to the section-A circuit. A supervisory snapshot is a separate observation.',
    metrics:[{label:'Section A voltage',value:round(s.voltageA),unit:'p.u.'},{label:'Section B voltage',value:round(s.voltageB),unit:'p.u.'},{label:'Source A contribution',value:round(s.currentA),unit:'p.u.'},{label:'Source B contribution',value:round(s.currentB),unit:'p.u.'},{label:'Fault current at A',value:round(s.faultCurrent),unit:'p.u.'}],
    diagram:{type:'dc-sections',coupled:s.arrangement==='coupled',feederAOpen:s.feederAOpen,faultAtA:s.faultAtA},
    series:[{label:'Source A current',color:'#4970cf',points:scan.map(p=>({x:p.resistance,y:p.currentA}))},{label:'Source B current',color:'#168875',points:scan.map(p=>({x:p.resistance,y:p.currentB}))},{label:'Selected fault current',color:'#bd6d22',points:[{x:s.resistance,y:s.faultCurrent}]}],
    xLabel:'Synthetic fault resistance (p.u.)',yLabel:'Current (p.u.)',
    rows:[
      {label:'Source A → feeder A → section A',status:s.feederAOpen?'Open branch':'Connected branch',detail:`Physical current ${round(s.currentA)} p.u.; section voltage ${round(s.voltageA)} p.u. The opening is an imposed example state, not a calculated trip decision.`},
      {label:'Source B → feeder B → section B',status:'Connected branch',detail:`Physical current ${round(s.currentB)} p.u.; section voltage ${round(s.voltageB)} p.u.`},
      {label:'Section boundary',status:s.arrangement==='coupled'?'Electrically coupled':'Separated',detail:s.arrangement==='coupled'?`The tie carries ${round(s.tieCurrent)} p.u. from B toward A.`:'The ideal positive-conductor gap carries zero current between the sections.'},
      {label:'Return reference',status:'Common 0 reference',detail:'Both source returns, the two resistive loads and the optional fault shunt connect to the explicit common return in this simplified circuit.'},
      {label:'Supervisory record',status:s.telemetry==='stale'?'Stale snapshot':'Current snapshot',detail:`Reported A feeder: ${snapshot.feederAOpen?'open':'closed'}; reported A voltage ${round(snapshot.voltageA)} p.u. Changing record freshness does not change the solved electrical circuit.`},
    ],
    explanation:'Kirchhoff current balance solves two node voltages, then I=(E−V)/R gives each branch current. All values use synthetic bases: E=1, feeder R=0.1, coupling R=0.2 and each load R=4 p.u.; no physical voltage/current base is assigned. The resistance slider changes the optional fault shunt only. The graph scans resistance at the selected topology; in the normal case the fault branch is absent, so the resistance does not affect the circuit. No capacitance, inductance, arc, moving collector, protection threshold, trip time or safe-to-work determination is modeled.',
  };
}

export function solveFanWorkingPoint(values={}) {
  const speed=number(values.speed,1,.4,1.2),filter=number(values.filter,25,20,200),damper=number(values.damper,30,10,300),coil=number(values.coil,50,20,150);
  const duct=40,k=filter+damper+coil+duct,shutoff=700*speed*speed,fanSlope=180;
  // P_f(Q,n)=n² P_f(Q/n,1)=700 n²−180 Q²; P_s(Q)=ΣK_i Q².
  const flow=Math.sqrt(shutoff/(fanSlope+k)),pressure=k*flow*flow,airPower=flow*pressure;
  const losses={duct:duct*flow**2,filter:filter*flow**2,coil:coil*flow**2,damper:damper*flow**2};
  return {speed,filter,damper,coil,duct,k,shutoff,fanSlope,flow,pressure,airPower,losses,freeFlow:Math.sqrt(shutoff/fanSlope)};
}

function fanResult(values) {
  const s=solveFanWorkingPoint(values),q=Array.from({length:101},(_,i)=>s.freeFlow*i/100);
  return {summary:`The synthetic fan and complete plant path meet at ${round(s.flow)} m³/s and ${round(s.pressure,1)} Pa. Raising resistance reduces the flow at the same fan speed; raising speed moves the fan curve.`,
    metrics:[{label:'Working flow Q',value:round(s.flow),unit:'m³/s'},{label:'Working pressure Δp',value:round(s.pressure,1),unit:'Pa'},{label:'Air power QΔp',value:round(s.airPower,1),unit:'W'},{label:'Relative fan speed',value:round(s.speed),unit:'n/n₀'}],
    series:[{label:'Fan pressure',color:'#4970cf',points:q.map(x=>({x,y:Math.max(0,s.shutoff-s.fanSlope*x*x)}))},{label:'Complete system resistance',color:'#bd6d22',points:q.map(x=>({x,y:s.k*x*x}))},{label:'Working point',color:'#168875',points:[{x:s.flow,y:s.pressure}]}],
    xLabel:'Volume flow Q (m³/s)',yLabel:'Pressure rise or loss Δp (Pa)',
    rows:[{label:'Duct path',status:`${round(s.losses.duct,1)} Pa`,detail:'Fixed synthetic K=40 Pa·s²/m⁶.'},{label:'Filter',status:`${round(s.losses.filter,1)} Pa`,detail:`Selected synthetic K=${s.filter} Pa·s²/m⁶; this is a resistance comparison, not a filter-loading calibration.`},{label:'Coil',status:`${round(s.losses.coil,1)} Pa`,detail:`Selected synthetic K=${s.coil} Pa·s²/m⁶.`},{label:'Damper',status:`${round(s.losses.damper,1)} Pa`,detail:`Selected synthetic K=${s.damper} Pa·s²/m⁶; no blade-angle calibration is assumed.`},{label:'Pressure balance',status:`${round(s.pressure,1)} Pa total`,detail:'At the working point, fan rise equals the sum of all four series-component losses.'}],
    explanation:'The invented reference fan curve is Δp=700−180Q² Pa, with Q in m³/s. Speed similarity gives Δp_f=700n²−180Q²; the chosen turbulent-loss approximation gives Δp_s=(Kduct+Kfilter+Kcoil+Kdamper)Q². Their unique positive intersection sets the flow. Air power is QΔp, not electrical input power. Constant density, no static pressure offset and a monotone fan branch are assumed; efficiency, stall, leakage, heat exchange, acoustic performance and smoke-management duties are outside this comfort-ventilation example.',
  };
}

export function simulateWheelRailResponse(values={},options={}) {
  const mu=number(values.mu,.12,.04,.35),demand=number(values.demand,.22,0,.4),inertia=number(values.inertia,.06,.02,.2),programme=choice(values.programme,['hold','release'],'release');
  const step=number(options.step,.0005,.0001,.001),duration=2,steps=Math.ceil(duration/step),dt=duration/steps;
  const samples=[],energy=[],stiffness=6;let u=1,w=1,maxSlip=0,locked=false;
  const brake=t=>demand*Math.min(1,t/.08)*(programme==='release'?Math.max(0,Math.min(1,(1.12-t)/.12)):1);
  const state=(t,velocity,wheel)=>{const slip=(velocity-wheel)/Math.max(velocity,1e-8),force=mu*Math.tanh(stiffness*slip/mu),b=brake(t);let dw=(force-b)/inertia;if(wheel<=0&&dw<0)dw=0;return {t,u:velocity,w:wheel,slip,force,brake:b,du:-force,dw};};
  let nextSample=0;
  for(let i=0;i<=steps;i++){
    const t=i*dt,a=state(t,u,w);maxSlip=Math.max(maxSlip,a.slip);locked ||= w<1e-8&&u>.1;energy.push(.5*u*u+.5*inertia*w*w);
    if(i===steps||t+dt*.25>=nextSample*.02){samples.push({time:t,velocity:u,wheel:w,slip:a.slip,force:a.force,brake:a.brake});nextSample++;}
    if(i===steps)break;
    // Heun integration; the zero-speed constraint prevents reverse wheel
    // rotation from a braking command. No wheel-slide controller is added.
    const predicted=state(t+dt,Math.max(0,u+dt*a.du),Math.max(0,w+dt*a.dw));
    u=Math.max(0,u+dt*(a.du+predicted.du)/2);w=Math.max(0,w+dt*(a.dw+predicted.dw)/2);
  }
  return {mu,demand,inertia,programme,stiffness,samples,energy,maxSlip,locked,final:samples.at(-1)};
}

function wheelResult(values) {
  const s=simulateWheelRailResponse(values),f=s.final;
  const line=(key,label,color)=>({label,color,points:s.samples.map(p=>({x:p.time,y:p[key]}))});
  return {summary:`At τ=2, vehicle speed is ${round(f.velocity*100,1)}% of its initial value and wheel peripheral speed is ${round(f.wheel*100,1)}%. Their difference produces ${round(f.slip*100,1)}% braking slip in this synthetic model.`,
    metrics:[{label:'Vehicle speed / initial speed',value:round(f.velocity),unit:'v/v₀'},{label:'Wheel peripheral speed / initial speed',value:round(f.wheel),unit:'Rω/v₀'},{label:'Final braking slip',value:round(f.slip*100,1),unit:'%'},{label:'Peak braking slip',value:round(s.maxSlip*100,1),unit:'%'},{label:'Final contact force / normal load',value:round(f.force),unit:'F/N'}],
    series:[line('velocity','Vehicle speed v/v₀','#4970cf'),line('wheel','Wheel peripheral speed Rω/v₀','#168875'),line('slip','Braking slip (v−Rω)/v','#ad4d80'),line('brake','Applied brake torque T/(NR)','#bd6d22'),line('force','Rail contact force F/N','#687182')],
    xLabel:'Dimensionless time τ=tg/v₀',yLabel:'Dimensionless ratio (quantity named in legend)',
    rows:[{label:'Command experiment',status:s.programme==='release'?'Apply then release':'Hold the demand',detail:s.programme==='release'?'The authored input rises over 0≤τ≤0.08, is held to τ=1, and falls to zero by τ=1.12. This is an input experiment, not a protection algorithm.':'The authored input rises over 0≤τ≤0.08 and then remains constant through τ=2.'},{label:'Contact law',status:`Synthetic ceiling μ=${s.mu}`,detail:'F/N=μ tanh(6s/μ), where s is braking slip. The slope and ceiling are invented teaching parameters, without wet/dry rail labels or a post-peak friction drop.'},{label:'Rotational response',status:`I/(MR²)=${s.inertia}`,detail:s.locked?'The wheel reaches zero rotation during this example while the translating mass still moves. Brake demand, wheel rotation and vehicle speed therefore remain distinct.':'The wheel remains rotating during this example. Brake demand and contact force remain different quantities.'},{label:'Scope of the time axis',status:'Normalized time only',detail:'Neither initial speed nor a dimensional vehicle mass is assigned. No stopping distance, stopping-time prediction or operational brake setting is produced.'}],
    explanation:'Let u=v/v₀, w=Rω/v₀, κ=I/(MR²), b=T/(NR), f=F/N, N=Mg and τ=tg/v₀. The reduced balances are du/dτ=−f and dw/dτ=(f−b)/κ; braking slip is s=(u−w)/u. The synthetic smooth contact law is linear near zero slip and bounded by |f|≤μ. One equivalent translating mass and one rotating wheelset are used on a level straight track with constant normal load. The example omits lateral motion, suspension dynamics, load transfer, thermal changes, aerodynamic drag, real contact calibration and wheel-slide protection. All plotted ratios have separate definitions despite sharing a dimensionless axis.',
  };
}

export const PHYSICAL_LABS = [
  {id:'electrical-sections',title:'Electrical sections and independent indications',workspace:'energy',view:'system',conceptId:'dc-switchgear',question:'After an assumed local opening, which source can still feed section A—and can a stale display change that circuit?',boundary:'Two invented DC section arrangements. Steady resistive circuits and explicit common return only; no switching sequence, AC neutral-section behavior, protection coordination or work authorization.',sources:['PL01','P01'],controls:[select('arrangement','Section boundary',[['separated','Separated positive conductors'],['coupled','Electrically coupled sections']],'separated'),select('condition','Illustrated physical condition',[['normal','Normal resistive loads'],['fault','Additional resistive fault at A'],['local-open','Fault at A; local feeder assumed open']],'fault'),range('resistance','Synthetic fault resistance',.02,1,.02,'p.u.',.12),select('telemetry','Supervisory observation',[['current','Current physical-state snapshot'],['stale','Retained earlier snapshot']],'current')],evaluate:electricalResult},
  {id:'fan-working-point',title:'Fan and complete plant working point',workspace:'station',view:'ventilation-unit',variant:'air-handler',conceptId:'hvac-air-handler',question:'How does one changed filter, coil or damper resistance shift the flow through the complete air path?',boundary:'Synthetic comfort-ventilation curves with explicit SI units. Numerical coefficients are original examples, not tested equipment or smoke-control design data.',sources:['PL02','DP02'],controls:[range('speed','Relative fan speed n/n₀',.4,1.2,.05,'ratio',1),range('filter','Filter resistance K',20,200,5,'Pa·s²/m⁶',25),range('coil','Coil resistance K',20,150,5,'Pa·s²/m⁶',50),range('damper','Damper resistance K',10,300,10,'Pa·s²/m⁶',30)],evaluate:fanResult},
  {id:'wheel-rail-response',title:'Wheel speed, slip and braking demand',workspace:'vehicle',view:'adhesion',variant:'slide',conceptId:'adhesion-contact',question:'When brake demand exceeds the chosen contact capability, how do vehicle speed and wheel rotation diverge—and what changes after release?',boundary:'Dimensionless single-wheelset teaching dynamics with synthetic inputs. No real train, rail-condition classification, stopping distance, calibrated protection setting or WSP controller.',sources:['PL03','H01'],controls:[range('mu','Synthetic contact-force ceiling μ',.04,.35,.01,'F/N',.12),range('demand','Brake torque demand T/(NR)',0,.4,.01,'ratio',.22),range('inertia','Rotational inertia ratio I/(MR²)',.02,.2,.01,'ratio',.06),select('programme','Authored command experiment',[['hold','Apply and hold'],['release','Apply, then release']],'release')],evaluate:wheelResult},
];
