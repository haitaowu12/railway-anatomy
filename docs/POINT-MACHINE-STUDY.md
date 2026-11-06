# Point-machine study

[Open the journey](https://haitaowu12.github.io/railway-anatomy/#learn/point-proof) · [Field guide](https://haitaowu12.github.io/railway-anatomy/reading.html#guide-point-machine)

## The four-rod arrangement

The study has two operating rods and two detector rods. Each blade has one of each. Near and far refer to distance from the machine. The short rods connect to the near blade; the long rods pass beneath the near stock rail to the far blade. The operating rods transmit push/pull force. The detector rods follow the blades independently of that force path.

This arrangement is documented in Alstom’s **P80 Point Machine/EN/12.2015** brochure. Rod counts and connections vary across families; separate lock rods and external locking systems distribute these functions differently. Stretcher bars couple blades and are not interchangeable with detector rods.

| Reference | What it establishes |
|---|---|
| [Alstom P80, December 2015 brochure](https://pdfcoffee.com/alstom-p80-pdf-free.html), General description and Key technical features | Two independent operating rods, two detector rods and locking of both open and closed blades. This is a public text mirror of the original supplier brochure. |
| [voestalpine UNISTAR HR](https://www.voestalpine.com/railway-systems/en/products/unistar-hr-point-machine/), Technical description and characteristics | Separate power and drive/locking/detection modules, internal prism locks, and installations with or without stretcher bars. |
| [voestalpine UNISTAR ELP](https://www.voestalpine.com/railway-systems/en/products/unistar-elp-end-position-detector/), Product description | Two detector rods monitor the open and closed switch point. |
| [Vossloh MCEM91](https://www.vossloh.com/en/products/mcem91-point-machine), Electromechanical operation and Operation | Electromechanical actuation, internal locking and end-position detection in another product family. |
| [Siemens point-operating systems](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/components/wayside-components/point-operating-systems.html) | Alternative internal/external locking and detection arrangements. |
| [Siemens electronic interlocking](https://www.mobility.siemens.com/uk/en/portfolio/rail-infrastructure/mainline/interlocking-systems.html) | Route checks and interfaces with points, signals and train detection. |

The geometry is an original functional schematic. The actuator envelope, two positive lock bolts/openings and contact symbols explain the functions; they do not reproduce the P80 or another supplier’s internal mechanism. Rod dimensions, blade sections, clearances and playback timing are illustrative. No supplier’s speed, force or safety rating is assigned to the model.

## Read the mechanism

At **A**, the near blade is open and the far blade closed. Both illustrated locks hold their operating slides, and A is indicated when the corresponding detector inputs are available.

The locks withdraw before blade movement. A indication drops as unlocking starts. The two operating rods move the blades while their detector rods follow. The blades flex toward their retained heels. Neither A nor B is indicated during the movement.

At **B**, the near blade is closed against its stock rail and the far blade stands open for flange clearance. The locks engage their aligned openings. The closed-blade, open-blade and lock conditions together establish B correspondence. The two detector rods cover different blades; they are not two redundant votes for one blade.

The six stage buttons pause these functions for explanation. The last stage follows the already established indication to the interlocking; it adds no separate post-lock equipment delay. A and B identify the two ends of this study; Normal/Reverse assignments depend on the installation.

## Compare incomplete conditions

- **Stopped short:** both blades remain between the ends, the locks stay released and neither end is indicated. The illustration does not diagnose a particular cause.
- **One detector missing:** the blades reach B and both locks engage, but the far-blade detector input is unavailable. B is not indicated. The rods still show the physical blade positions; an absent input is not represented as an incorrectly positioned blade.

The contact symbols express these correspondence conditions, not a complete signalling circuit. The interlocking diagram treats the B indication as one required input alongside train detection and conflicting-route checks. It does not infer a clear signal from point indication alone.

## Continue through the complete turnout

**Follow wheels** opens the selected complete route: A is straight and B diverges. The wheelset study keeps that blade setting locked during passage. **Inspect the selected point setting** returns to the corresponding A or B physical endpoint. For an incomplete indication, **Compare wheel routes** opens a separate complete-route example. See [the turnout study](TURNOUT-STUDY.md) for the crossing and opposite check-rail relationships.
