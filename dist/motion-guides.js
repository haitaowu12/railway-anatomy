// Enable playback only where motion explains an authored mechanism. These
// captions describe the illustration, not a real railway operating sequence.
export function applyMotionGuides(views){
  views.lim.motion=true;
  views.lim.animation={label:'Travelling field and the passive reaction rail',steps:[
    {at:0,label:'Primary & secondary',description:'The windings belong to the train-mounted primary. The reaction rail is the passive secondary across the air gap.'},
    {at:.3,label:'Travelling field',description:'The field arches progress along the primary. They are an explanatory pattern, not a solved electromagnetic field.'},
    {at:.65,label:'Induced response',description:'The current-loop cues sit in the passive reaction rail. No traction-power connection is attached to that rail.'},
    {at:1,label:'Force interface',description:'Compare the field direction and thrust cue. Keep the air-gap force interface separate from wheel support and current collection.'},
  ]};
  const wash=views['depot-wash'];
  for(const variant of wash.variants){
    if(!['wash','mobile'].includes(variant.id)){variant.motion=false;continue;}
    const mobile=variant.id==='mobile';variant.motion=true;
    variant.animation={label:mobile?'Moving gantry around a stationary vehicle':'Vehicle moving through fixed brushes',steps:[
      {at:0,label:'Starting position',description:mobile?'The vehicle stays in place; the brush gantry begins at one end.':'The brush portal stays in place; the vehicle begins its illustrative movement.'},
      {at:.25,label:'Relative movement',description:'The brushes rotate while the selected moving assembly travels. Water collection and treatment are separate equipment.'},
      {at:.5,label:'Other end',description:mobile?'The gantry reaches the other end of the illustrated sweep; the train has not moved.':'The train reaches the other end of the illustrated travel; the portal has not moved.'},
      {at:.75,label:'Return sweep',description:'The animation returns to show the relative motion again. It does not prescribe a washing procedure, speed or clearance.'},
      {at:1,label:'Cycle complete',description:'The illustration returns to its starting geometry. Inspect the brushes, drain, pumps and tanks separately.'},
    ]};
  }
}
