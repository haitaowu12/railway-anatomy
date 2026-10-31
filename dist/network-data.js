// Public-source context for an original, fictional railway composition.
// Source records are reused from catalog.js; no operator layout is reproduced.
export const NETWORK_SOURCES = [];

export const NETWORK_CONCEPTS = [
  {
    id: 'network-overview', label: 'The connected railway',
    summary: 'Places, vehicles and systems come together to provide a railway service.',
    details: [
      'Start with a place or asset, then open its systems and equipment. Stations, the running line, the depot and the control centre have different jobs; power and information connect across those places.',
      'The three overlays separate vehicle movement, traction energy and operational information. They are different relationships on the same fictional railway, not three different railway designs.'
    ],
    sources: ['K01', 'P01', 'O01', 'O04'],
    caveat: 'An authored schematic: distances, buildings, track connections and equipment quantities do not describe an installed railway.',
    related: ['network-route', 'network-station', 'network-depot', 'network-control-centre', 'network-substation', 'network-telecommunications']
  },
  {
    id: 'network-route', label: 'Running line & track connections',
    summary: 'The route connects passenger stops and the tracks that support and guide each vehicle.',
    details: [
      'Rails, their supports and fastening systems form the physical route. Switches and crossings connect tracks where a vehicle needs another path.',
      'Open the trackwork views to inspect support arrangements, a turnout, its point drive and the wheel–rail interface. A drawn connection alone does not establish permission to use it.'
    ],
    sources: ['K01', 'K12', 'S10'],
    caveat: 'The route is compressed for navigation; no gradients, curve radii, clearances or route capacities are calculated.',
    related: ['network-turnback', 'running-rail', 'track-turnout', 'track-ballasted', 'network-train']
  },
  {
    id: 'network-station', label: 'Passenger stations',
    summary: 'The passenger interface brings the train, platform and station services together.',
    details: [
      'Platform access and passenger information meet the train at the station. Communications and supervision connect the station with wider railway operations.',
      'Open the station to inspect its passenger systems, platform protection, mechanical and electrical plant, fire systems and control interfaces.'
    ],
    sources: ['F03', 'N09'],
    caveat: 'Three repeated stops illustrate a route. Their platform and access layouts are not station design recommendations.',
    related: ['platform-screen-door', 'station-pis', 'station-pa', 'station-scada', 'network-telecommunications']
  },
  {
    id: 'network-turnback', label: 'Turnback & junction',
    summary: 'Track connections provide a physical path for a service to change direction or route.',
    details: [
      'The end of this fictional route includes a converging connection and a short reversing road. The track arrangement and the signalling that controls its use are separate parts of the explanation.',
      'Inspect the turnout to see switch rails, crossings and a point mechanism. Then follow its interface to detection and interlocking.'
    ],
    sources: ['K12', 'S10', 'S11'],
    caveat: 'This is an illustrative connection, not an interlocking table, movement sequence or validated turnback design.',
    related: ['track-turnout', 'track-point-machine', 'track-point-detection', 'interlocking', 'network-route']
  },
  {
    id: 'network-train', label: 'The train',
    summary: 'A moving vehicle interfaces with track, traction power, train control and passengers.',
    details: [
      'The overview uses small train silhouettes to show the vehicle within the railway. Open the vehicle to inspect its body, bogies, propulsion, braking and supporting equipment.',
      'Propulsion and train-control communication remain independent technology choices. Their detailed equipment is visible at the vehicle and subsystem levels.'
    ],
    sources: ['P04', 'P10', 'T04'],
    caveat: 'The overview silhouettes are not propulsion diagrams. Their motion does not simulate a timetable, speed or braking performance.',
    related: ['carbody', 'bogie', 'traction-inverter', 'train-control', 'network-station']
  },
  {
    id: 'network-depot', label: 'Depot & yard',
    summary: 'The service railway connects to a place for vehicle care, work and storage.',
    details: [
      'The branch leads through a yard throat to different facility tracks. The depot contains a maintenance hall, wash equipment and stabling roads.',
      'Open the depot to follow the distinctions between arrival, required work, vehicle condition and release to service.'
    ],
    sources: ['O04', 'O13'],
    caveat: 'The compact layout is fictional. A connected track or a stored vehicle does not establish movement authority or readiness for service.',
    related: ['network-maintenance', 'network-stabling', 'depot-throat', 'depot-controller', 'depot-personnel-protection']
  },
  {
    id: 'network-maintenance', label: 'Maintenance & servicing',
    summary: 'Workshop and servicing equipment give access to the vehicle interfaces that need attention.',
    details: [
      'The hall represents inspection and component work; the smaller wash structure represents exterior cleaning. A public service-centre example combines these with wheel machining and roof access.',
      'Open the maintenance views for the individual mechanisms and their distinct access and protection interfaces.'
    ],
    sources: ['O04', 'O06', 'O11'],
    caveat: 'This is equipment anatomy, not a maintenance instruction or authorization to access, lift or isolate a vehicle.',
    related: ['depot-inspection-pit', 'depot-roof-access', 'depot-lifting-jacks', 'depot-wheel-lathe', 'depot-wash-plant']
  },
  {
    id: 'network-stabling', label: 'Stabling roads',
    summary: 'Dedicated tracks hold vehicles between service or workshop duties.',
    details: [
      'Stabling is one facility function alongside inspection, cleaning and repair. A vehicle can occupy a storage road while its work or allocation remains unresolved.',
      'Open the depot view to locate storage roads and their connection to the yard throat.'
    ],
    sources: ['O13'],
    caveat: 'Road length, fleet capacity and service availability are not inferred from the number of vehicles drawn.',
    related: ['depot-stabling', 'depot-throat', 'depot-controller', 'network-train']
  },
  {
    id: 'network-control-centre', label: 'Operations control centre',
    summary: 'Operators supervise the service using information from across the railway.',
    details: [
      'Traffic supervision brings train position, timetable and route requests together. Power, station and communications functions remain distinct even when operators can see them in a shared room.',
      'Open the control centre to inspect workstations, communications and event records. Supervision and safety-related movement protection have different responsibilities.'
    ],
    sources: ['O01', 'O02'],
    caveat: 'Room arrangement and workstation counts are illustrative. An information link does not imply unrestricted control authority.',
    related: ['operations-centre', 'operations-traffic-supervision', 'operations-power-control', 'operations-radio-dispatch', 'network-telecommunications']
  },
  {
    id: 'network-substation', label: 'Traction power substation',
    summary: 'Conversion, distribution and protection connect an electrical supply to the trains.',
    details: [
      'This atlas uses a DC traction example. A transformer and rectifier convert incoming AC, and DC switchgear distributes and protects the traction supply.',
      'Choose the power overlay to distinguish outgoing and return relationships, then open the substation for the equipment and circuit.'
    ],
    sources: ['P01'],
    caveat: 'Paths are separated to make the circuit readable. This overview does not set conductor positions, voltage, feeder sections or station-building supplies.',
    related: ['transformer', 'rectifier', 'dc-switchgear', 'positive-rail', 'negative-rail', 'network-train']
  },
  {
    id: 'network-telecommunications', label: 'Railway information backbone',
    summary: 'Information paths link locations while the systems using them retain their different functions.',
    details: [
      'The information overlay links station equipment, the depot, the traction substation and the control centre. It represents logical connections rather than one cable carrying every service.',
      'Open station networks to distinguish passenger information, video, plant supervision and other communications interfaces. Their integration does not make them interchangeable with train protection.'
    ],
    sources: ['O02', 'F20', 'T05'],
    caveat: 'No shared physical topology, redundancy level, network security arrangement or safety certification is asserted.',
    related: ['network-switch', 'fiber-backbone', 'station-scada', 'train-radio', 'network-control-centre']
  }
];

export const NETWORK_VIEWS = {
  railway: {
    label: 'Railway overview', title: 'A connected railway', component: 'network-overview', level: 'Railway',
    note: 'A fictional railway at three scales: the route, its places and their equipment. Select a place to inspect it. Track geometry and paths are schematic.',
    variants: [
      {
        id: 'movement', label: 'Train movements', title: 'Passenger service and fleet care share a railway',
        description: 'Teal paths connect three passenger stops, the turnback and a depot branch. Select a train, station or facility to go inside. Paths show connectivity, not permission to move or an operating plan.',
        nodes: ['Passenger stops', 'Running line / turnback', 'Depot branch', 'Care / stabling'],
        sources: ['K01', 'K12', 'O13']
      },
      {
        id: 'power', label: 'Traction power', title: 'The energy circuit crosses location boundaries',
        description: 'Amber and cyan distinguish outgoing and return relationships in this DC traction example. The substation converts, distributes and protects the supply; the vehicle uses it through its own equipment. These are illustrative paths, not cable routes.',
        nodes: ['AC supply', 'Conversion / protection', 'Traction circuit', 'Vehicle equipment'],
        sources: ['P01', 'P04'], component: 'network-substation'
      },
      {
        id: 'information', label: 'Information links', title: 'Connected equipment keeps its own responsibilities',
        description: 'Violet links connect the control centre with station, power and depot equipment. The overlay shows information relationships. A shared connection or display does not itself provide movement authority or verified isolation.',
        nodes: ['Local equipment', 'Information transport', 'Supervision', 'Commands / status'],
        sources: ['O01', 'O02'], component: 'network-telecommunications'
      }
    ]
  }
};

export const NETWORK_PRIMARY = Object.fromEntries(NETWORK_CONCEPTS.map(({id}) => [id, ['railway', id === 'network-substation' ? 'power' : id === 'network-telecommunications' || id === 'network-control-centre' ? 'information' : 'movement']]));

export const NETWORK_DOMAIN = {
  id: 'network', number: '00', label: 'Whole railway', short: 'Railway',
  description: 'Places, systems and interfaces', view: 'railway', component: 'network-overview',
  views: ['railway'], parts: NETWORK_CONCEPTS.map(({id}) => id)
};

export const NETWORK_DESTINATIONS = {
  'network-route': {domain: 'track', view: 'track-support', component: 'track-ballasted', variant: 'ballasted'},
  'network-station': {domain: 'station', view: 'station', component: 'station-pa'},
  'network-turnback': {domain: 'track', view: 'turnout', component: 'track-turnout'},
  'network-train': {domain: 'vehicle', view: 'vehicle', component: 'carbody'},
  'network-depot': {domain: 'depot', view: 'depot-overview', component: 'depot-layout', variant: 'layout'},
  'network-maintenance': {domain: 'depot', view: 'depot-maintenance', component: 'depot-inspection-pit', variant: 'inspection'},
  'network-stabling': {domain: 'depot', view: 'depot-overview', component: 'depot-stabling', variant: 'night'},
  'network-control-centre': {domain: 'operations', view: 'operations-centre', component: 'operations-centre', variant: 'service'},
  'network-substation': {domain: 'power', view: 'substation', component: 'transformer'},
  'network-telecommunications': {domain: 'station', view: 'station-networks', component: 'network-switch'}
};
