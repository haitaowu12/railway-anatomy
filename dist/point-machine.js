const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));

// One authored throw supplies both the physical mechanism and its readouts.
export function pointMachineState(fraction = 0, variant = 'proved') {
  const phase = clamp(fraction), interrupted = variant === 'unproved';
  const travel = clamp((phase - .18) / .54);
  const movement = travel * travel * (3 - 2 * travel) * (interrupted ? .52 : 1);
  const lock = phase < .15 ? 1 - clamp(phase / .15)
    : !interrupted && phase > .76 ? clamp((phase - .76) / .14) : 0;
  const proof = !interrupted && phase >= .96;
  const position = movement === 0 ? 'End A' : movement >= .999 ? 'End B'
    : interrupted && phase >= .72 ? 'Stopped short' : 'Moving A → B';
  const locking = lock >= .999 ? (phase < .15 ? 'End A locked' : 'End B locked')
    : lock <= .001 ? 'Released' : phase < .15 ? 'Releasing' : 'Engaging at B';
  return {phase, movement, lock, proof, position, locking, indication: proof ? 'Returned' : 'Not returned'};
}

export function pointIndicationDiagram(variant = 'proved') {
  const state = pointMachineState(1, variant), status = state.proof ? 'available' : 'unavailable';
  return {
    title: 'Follow the end-B indication',
    description: state.proof
      ? 'The returned point indication supplies one input to the interlocking. Train detection and the other route conditions are checked alongside it.'
      : 'The throw stopped short. With no end-B indication, the point condition remains missing at the interlocking.',
    sources: ['K17', 'S10'],
    nodes: [
      {id:'points', label:'Point machine & blades', component:'track-point-machine', location:'Trackside', role:state.proof ? 'End B reached and locked' : 'Stopped between the ends', status, statusLabel:state.position},
      {id:'detector', label:'Position & lock indication', component:'track-point-detection', location:'Trackside', role:'Reports the required end condition', status, statusLabel:state.proof ? 'End-B indication returned' : 'No end-B indication'},
      {id:'logic', label:'Interlocking', component:'interlocking', location:'Route protection', role:'Combines the point indication with other route inputs', status, statusLabel:state.proof ? 'Point condition received' : 'Point condition missing'},
      {id:'other', label:'Other route conditions', component:'train-detection', location:'Route protection', role:'Train detection and conflicting-route checks', status:'unknown', statusLabel:'Check alongside the points'},
      {id:'output', label:'Route output', component:'lineside-signal', location:'Route output', role:state.proof ? 'Depends on all required route conditions' : 'Required point indication is absent', status:state.proof ? 'unknown' : 'unavailable', statusLabel:state.proof ? 'Further route checks required' : 'Point proof missing'},
    ],
    edges: [
      {from:'logic', to:'points', label:'Point movement command'},
      {from:'points', to:'detector', label:'Physical position and locking state'},
      {from:'detector', to:'logic', label:'Returned end-B indication', status, statusLabel:state.proof ? 'Received' : 'Missing'},
      {from:'other', to:'logic', label:'Other required inputs'},
      {from:'logic', to:'output', label:'Evaluate the required route conditions'},
    ],
  };
}
