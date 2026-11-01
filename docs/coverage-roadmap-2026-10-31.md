# Railway Anatomy: coverage roadmap

**31 October 2026 — six teaching layers implemented in the 5.1.0 candidate. Source checks and Chrome review passed; publication is tracked with the release review.**

The six priorities proposed after 5.0.0 now have connected model views, contextual comparisons, concepts, public references, guided questions and longer explanations. They extend the existing railway → place/system → assembly structure. This is completion of the bounded teaching layers below, rather than a claim that these engineering subjects are exhaustively modeled. See the [candidate review](release-5.1.0.md) for verification and release status.

| Priority | Implemented teaching layer | Comparisons |
|---|---|---|
| 1. Electrification alternatives | [Complete supply chain](../dist/index.html#explore/power/electrification/study-collector/ac) | DC conductor and conventional AC overhead arrangements replace supply conversion, collection, onboard conversion and return interfaces together. |
| 2. Wheel–rail interaction | [Wheel–rail response](../dist/index.html#explore/vehicle/adhesion/adhesion-contact/rolling) | Rolling, spin, slide, brake modulation and sanding distinguish rotation, travel, demand and intervention. |
| 3. Infrastructure maintenance | [Infrastructure work](../dist/index.html#explore/track/infrastructure-care/route-inspection/inspect) | Inspection, work, completion and follow-up checks retain a separate bearing observation and work boundary. |
| 4. Resilience and cyber dependencies | [Shared dependencies](../dist/index.html#explore/operations/dependencies/dependency-services/normal) | Communications, common power, identity and recording loss; restored connectivity and checked evidence remain separate. |
| 5. Accessibility and the passenger journey | [Street to train](../dist/index.html#explore/station/accessible-journey/access-entrance/available) | Lift outage, alternate lift, boarding gap and bridging plate change the selected route and information needs. |
| 6. Configuration and assurance | [Configuration & handover](../dist/index.html#explore/depot/change-evidence/change-item/installed) | Installed B equipment, baseline identity, test subject, outstanding issue, disposition and reviewed decision change separately. |

## Evidence and remaining depth

**Electrification:** Siemens’s AC supply overview and ABB’s conventional AC chain and Indian Railways’ public trainset architecture support the selected comparison alongside the existing DC sources. The transformer’s primary supply/return and secondary converter circuit are distinct. Neutral sections, protection coordination, bonding design and numerical power calculations need additional defined-system evidence.

**Adhesion:** RSSB and Knorr-Bremse public material support qualitative contact and mitigation explanations. Wheel rotation and travel use authored rates; they are not a dynamics solution. Stopping distances, creep curves, friction estimates, sanding effectiveness and controller performance remain outside the study.

**Infrastructure:** Network Rail public material supports the relationships among earthworks, drainage, structures and inspection. The fictional culvert has an open section; removing its visible deposit does not close the bridge observation or release the work boundary. Structural assessment, inspection intervals, defect thresholds and repair procedures remain outside the model.

**Resilience:** Published NIST SP 800-82 Revision 3 and ENISA’s railway zoning/conduit report support dependency and recovery questions. Configuration checks never recreate missing history. No real network, access setting, attack instruction, automatic failover or recovery time is supplied.

**Accessibility:** ERA’s dated EU application guidance, TransLink’s public operator guidance and RNIB’s research summary connect physical passage with information, assistance and disruption. The station is fictional. Route geometry proves no accessibility compliance, passenger capacity or evacuation result.

**Configuration and assurance:** Crossrail’s public record-package example and ORR’s jurisdiction-specific change guidance support links among item identity, evidence, issues and decisions. The model supplies no actual approval, regulatory significance judgment or universal RAMS lifecycle.

Further additions should deepen one of these explicit questions with appropriate evidence, rather than add another completion badge or imply that a schematic has qualified a real railway.
