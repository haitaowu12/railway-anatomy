const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));

// A/B correspondence needs both blades and both locks, not a drive command.
export function pointCorrespondence({near,far}) {
  const valid=blade=>blade.available&&blade.locked&&blade.closed!==blade.open;
  if(!valid(near)||!valid(far))return 'Neither';
  if(near.open&&far.closed)return 'A';
  if(near.closed&&far.open)return 'B';
  return 'Neither';
}

export function pointMachineState(fraction = 0, variant = 'proved') {
  const phase=clamp(fraction),interrupted=variant==='unproved',travel=clamp((phase-.18)/.54);
  const movement=travel*travel*(3-2*travel)*(interrupted?.52:1);
  const lock=phase<.15?1-clamp(phase/.15):!interrupted&&phase>.76?clamp((phase-.76)/.14):0;
  const atA=movement===0,atB=movement>=.999,locked=lock>=.999;
  const near={closed:atB,open:atA,locked,available:true};
  const far={closed:atA,open:atB,locked,available:variant!=='detector-missing'};
  const indication=pointCorrespondence({near,far}),proof=indication==='B';
  const position=atA?'End A':atB?'End B':interrupted&&phase>=.72?'Stopped short':'Moving A → B';
  const locking=locked?(phase<.15?'Both locked at A':'Both locked at B'):lock<=.001?'Released':phase<.15?'Releasing':'Engaging at B';
  const bladeLabel=blade=>blade.closed?'Closed':blade.open?'Open':interrupted&&phase>=.72?'Between ends':'Moving';
  return {phase,movement,lock,proof,position,locking,indication,near,far,nearPosition:bladeLabel(near),farPosition:bladeLabel(far)};
}

export function pointIndicationDiagram(variant = 'proved') {
  const state = pointMachineState(1, variant), status = state.proof ? 'available' : 'unavailable',missing=variant==='detector-missing';
  return {
    title: 'Follow the end-B indication',
    description: state.proof
      ? 'The returned point indication supplies one input to the interlocking. Train detection and the other route conditions are checked alongside it.'
      : missing?'The blades reached B and both locks engaged, but one detector input is missing. The interlocking has no B indication.':'The throw stopped short of B, so the blade positions and locks needed for B indication were never established. The interlocking is missing that route input.',
    sources: ['PM01','PM03','PM04','S10'],
    nodes: [
      {id:'points', label:'Point machine & blades', component:'track-point-machine', location:'Trackside', role:state.proof||missing ? 'Near blade closed · far blade open · locked' : 'Stopped between the ends', status:missing?'available':status, statusLabel:state.position},
      {id:'detector', label:'Blade & lock detection', component:'track-point-detection', location:'Trackside', role:'Checks both blades and their locks', status, statusLabel:state.proof ? 'B indication returned' : missing?'One detector input missing':'No B indication'},
      {id:'logic', label:'Interlocking', component:'interlocking', location:'Route protection', role:'Combines the point indication with other route inputs', status, statusLabel:state.proof ? 'Point condition received' : 'Point condition missing'},
      {id:'other', label:'Other route conditions', component:'train-detection', location:'Route protection', role:'Train detection and conflicting-route checks', status:'unknown', statusLabel:'Check alongside the points'},
      {id:'output', label:'Route output', component:'lineside-signal', location:'Route output', role:state.proof ? 'Depends on all required route conditions' : 'Required point indication is absent', status:state.proof ? 'unknown' : 'unavailable', statusLabel:state.proof ? 'Further route checks required' : 'Point proof missing'},
    ],
    edges: [
      {from:'logic', to:'points', label:'Point movement command'},
      {from:'points', to:'detector', label:'Physical position and locking state'},
      {from:'detector', to:'logic', label:'Returned B indication', status, statusLabel:state.proof ? 'Received' : 'Missing'},
      {from:'other', to:'logic', label:'Other required inputs'},
      {from:'logic', to:'output', label:'Evaluate the required route conditions'},
    ],
  };
}
