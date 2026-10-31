# Railway Anatomy: coverage roadmap

**31 October 2026 — proposed future work, ordered by learning value.**

The current atlas already connects the whole railway with movement, power and information overlays. Its [view configuration](../dist/model.js) and [source catalog](../dist/catalog.js) cover track assemblies, signalling alternatives, station systems, vehicle equipment, expanded depot maintenance, and five OCC views. Inspection, component maintenance, functional checks, work handover, request/indication boundaries and acknowledgement versus resolution are now represented. The priorities below extend that coverage; they are not claims about implemented features or committed delivery dates.

## 1. Electrification beyond the present DC example

**Learner question:** What must change between the supply network and the train when the electrification arrangement changes?

The current substation and collection example is grounded in DC traction. A future comparison should connect supply conversion, distribution, current collection, onboard conversion and return paths. Replace the equipment and connections together: an overhead collector must not appear while an incompatible supply arrangement remains underneath. Start with one bounded AC example, then examine different collection arrangements separately.

**Evidence needed:** [Siemens AC traction power supply](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/ac-traction-power-supply.html) is a primary starting point. Add public operator diagrams and vehicle documentation before depicting neutral sections, protection boundaries or return-current arrangements.

## 2. Wheel–rail adhesion and vehicle response

**Learner question:** Why can a commanded traction or braking effort differ from the force available at the rail?

Existing bogie, propulsion and brake assemblies provide the hardware; the missing teaching layer is their interaction with contact conditions. A focused contact view could link wheel rotation, vehicle motion, brake demand, wheel-slide protection and sanding. Compare qualitative states first, with explicit separation between a requested effort and the observed response. Connect this view back to wheel condition and maintenance without repeating the wheel workshop.

**Evidence needed:** Begin with [RSSB adhesion research](https://www.rssb.co.uk/research/flagship-research-activities/adhesion/), then obtain public brake-system explanations and validated experimental evidence before adding numerical stopping distances, creep curves or dynamic predictions.

## 3. Permanent-way and structure maintenance

**Learner question:** How does an observed infrastructure condition become an investigation, work location and verified repair?

The app currently explains track components and vehicle maintenance in greater detail than maintenance of the route itself. Extend a track section into drainage, formation, earthworks and a small bridge or tunnel interface. An inspection alternative should expose the measurement location; a work alternative should change the affected assembly; a record should identify what remains unverified. This would connect infrastructure condition to operations without inventing an automatic restriction threshold.

**Evidence needed:** Use [Network Rail’s infrastructure maintenance overview](https://www.networkrail.co.uk/our-work/looking-after-the-railway/) alongside public inspection and monitoring material. Specific defects, acceptance criteria and restoration decisions require their own evidence.

## 4. Resilience and cyber dependencies across systems

**Learner question:** Which function remains available when a shared dependency is lost?

The OCC already distinguishes display loss from an alternative application path. The next step should extend that distinction across communications, power, identity, configuration and recording. A dependency view could compare independent paths with a shared point of failure, showing exactly which interfaces disappear. A separate restoration example could distinguish recovering a connection from recovering verified service and records.

**Evidence needed:** [NIST SP 800-82 Revision 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final) provides a public OT-security foundation; add railway-specific primary guidance. Keep diagrams generic, without real network addresses, security configurations, attack instructions or unsupported recovery guarantees.

## 5. Accessibility and the complete passenger journey

**Learner question:** Can a passenger reach, understand and use every interface from the street to the train?

Current station and platform views emphasize equipment and protective systems. A future journey view should connect entrances, fare gates, vertical circulation, information, assistance, the platform and vehicle boarding interface. Selecting a lift outage or a different boarding arrangement should visibly change the available route and information requirements. Passenger flow can be introduced as a separate question, rather than implied by decorative moving crowds.

**Evidence needed:** The [ERA PRM TSI application guide](https://www.era.europa.eu/system/files/2023-12/PRM_TSI_Guide.pdf) offers a jurisdiction-specific reference. Add public operator accessibility guidance and user research; any capacity or evacuation model needs separate validated assumptions.

## 6. Configuration, assurance and change handover

**Learner question:** What evidence connects a changed assembly with the version tested and handed into service?

Maintenance release and depot functional checks are already covered. Extend them into a generic lifecycle linking requirement, interface definition, configuration, verification result, outstanding issue and accepted change. An interactive example could reveal that equipment is installed but its documented configuration or test evidence does not yet match. Include reliability, availability, maintainability and safety as distinct questions rather than a completion badge.

**Evidence needed:** [ORR’s public change-risk guidance](https://www.orr.gov.uk/guidance-compliance/rail/health-safety/laws/european-railway-safety-legislation) is a starting point, with its jurisdiction stated. Obtain public assurance and configuration examples before depicting approval responsibilities or a formal lifecycle.
