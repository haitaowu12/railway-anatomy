const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
export const TURNOUT = {halfGauge:.9, toe:-4.4, heel:-.8, end:6.8, offset:3.1, start:-5.7, finish:5.7};
export function branchCentre(x) {
  const t=clamp((x-TURNOUT.toe)/(TURNOUT.end-TURNOUT.toe));
  return TURNOUT.offset*t*t*(3-2*t);
}
export function branchSlope(x) {
  const t=clamp((x-TURNOUT.toe)/(TURNOUT.end-TURNOUT.toe));
  return TURNOUT.offset*6*t*(1-t)/(TURNOUT.end-TURNOUT.toe);
}
export function branchOffset(x,offset) {
  const slope=branchSlope(x),normal=Math.hypot(1,slope);
  return [x-offset*slope/normal,branchCentre(x)+offset/normal];
}
let lo=TURNOUT.toe,hi=TURNOUT.end;
for(let i=0;i<40;i++){const x=(lo+hi)/2;if(branchOffset(x,-TURNOUT.halfGauge)[1]<TURNOUT.halfGauge)lo=x;else hi=x;}
export const CROSSING_PARAMETER=(lo+hi)/2;
export const CROSSING_X=branchOffset(CROSSING_PARAMETER,-TURNOUT.halfGauge)[0];

// One prescribed wheelset path drives the drawing, stages and position readout.
// These dimensionless positions do not solve wheel/rail contact or vehicle dynamics.
export function turnoutPosition(phase=0,route='straight',detail=false) {
  const branch=route==='diverging',cross=branch?CROSSING_PARAMETER:CROSSING_X;
  const start=detail?cross-1.25:TURNOUT.start,finish=detail?cross+1.5:TURNOUT.finish;
  const x=start+clamp(phase)*(finish-start),slope=branch?branchSlope(x):0;
  const z=branch?branchCentre(x):0;
  const wheels=[-1,1].map(side=>branch?branchOffset(x,side*TURNOUT.halfGauge):[x,side*TURNOUT.halfGauge]);
  let distance=0,last=[start,branch?branchCentre(start):0];
  for(let i=1;i<=96;i++){
    const p=start+(x-start)*i/96,next=[p,branch?branchCentre(p):0];distance+=Math.hypot(next[0]-last[0],next[1]-last[1]);last=next;
  }
  return {x,z,yaw:-Math.atan(slope),wheels,distance,cross,start,finish};
}
export function turnoutGuide(route='straight',detail=false) {
  const branch=route==='diverging',cross=branch?CROSSING_PARAMETER:CROSSING_X;
  const start=detail?cross-1.25:TURNOUT.start,finish=detail?cross+1.5:TURNOUT.finish;
  const at=x=>clamp((x-start)/(finish-start));
  const support=[
    {at:0,label:'Approach the crossing',description:'Keep both wheels in view. One approaches the crossing; the other runs beside its check rail.'},
    {at:at(cross-.45),label:'Wing rail and wheel tread',description:'The wing rail provides a running surface beside the flange passage. The tread carries the wheel; the flange passes through the flangeway.'},
    {at:at(cross+.16),label:'Nose and opposite check rail',description:`The ${branch?'near':'far'} wheel passes the crossing nose. Across the axle, the check rail can guide the back of the ${branch?'far':'near'} wheel flange, keeping the crossing wheel on the intended side of the nose.`},
    {at:at(cross+.75),label:'Continue onto the nose',description:'Support transfers between the wing rail and crossing nose. Their contact regions can overlap; the wheel is not shown dropping into a hole.'},
    {at:1,label:'Beyond the crossing',description:'Both wheels continue on the selected rail pair. This fixed, tread-bearing crossing stays still for either route.'},
  ];
  return {label:detail?'Wheel support and guidance at a fixed crossing':'From selected blades to the crossing',duration:detail?13:18,loop:false,steps:detail?support:[
    {at:0,label:'Route set and locked',description:`${branch?'B: the near blade is closed and the far blade open.':'A: the near blade is open and the far blade closed.'} The blades remain locked throughout this illustrated passage.`},
    {at:at(TURNOUT.toe+.35),label:'Through the switch',description:branch?'The closed near blade leads one wheel onto the curved inner rail. The other follows the curved stock rail.':'The closed far blade leads one wheel onto the straight inner rail. The other stays on the straight stock rail.'},
    {at:at(TURNOUT.heel+.25),label:'Along the closure rails',description:'Follow the pair of running rails from the switch towards the crossing. The axle connects the two wheel paths.'},
    {at:at(cross-.65),label:'Approach the crossing',description:`The ${branch?'near':'far'} wheel approaches the fixed crossing; the opposite wheel approaches the check rail for this route.`},
    {at:at(cross+.16),label:'Across the crossing',description:'The wing rail and nose carry the crossing wheel tread. The opposite check rail limits lateral movement through the back of the other wheel flange.'},
    {at:1,label:'Continue on the selected route',description:branch?'Both wheels have followed the diverging route. The fixed crossing has not moved.':'Both wheels have followed the straight route. The fixed crossing has not moved.'},
  ]};
}
export function turnoutState(phase=0,route='straight',detail=false) {
  const p=turnoutPosition(phase,route,detail),guide=turnoutGuide(route,detail);
  const step=[...guide.steps].reverse().find(s=>s.at<=clamp(phase)+1e-6)||guide.steps[0];
  const branch=route==='diverging';
  return {...p,route:branch?'Diverging':'Straight',blades:branch?'B · locked':'A · locked',location:step.label,crossingWheel:branch?'Near wheel':'Far wheel',checkWheel:branch?'Far wheel':'Near wheel'};
}
