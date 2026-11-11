# Reading discovery — 11 November 2026

## Audit and scope

Baseline: `971c4d95a94486076b1498efc3e273ea863e5545`.

The equipment explorer already has separate physical and connection views, named
sequence stages, stepping, reduced-motion handling and linked reading routes.
Those surfaces are retained. The reading edition contains 333 concepts, 14 system
guides and 228 distinct public source records, but its only lookup was a list of
section anchors. A reader looking for a part or publisher had to navigate the
long document or use the browser's text finder. Direct concept fragments also
landed on closed disclosures.

## Change

The reading edition now offers a progressive lookup built from its own rendered
articles. Results distinguish component/function, system guide and public source,
show the subject or publisher, and link to the original article. Exact title
matches rank first; all query words must occur in the entry. Readers can narrow
the type, see the match count, reveal further results, or clear an unsuccessful
query. A selected or bookmarked concept opens its explanation, receives focus
and retains its existing route into the explorer. Source links and full reading
content remain available when JavaScript is off.
Show more moves keyboard focus to the first newly added result, including the
final expansion when the button disappears, so forward Tab reaches the new entries.

The existing paper/blue identity, typography, source ownership and model content
are retained. Results use two columns on wider screens and one on phones; controls
retain visible focus and 44 px minimum targets. Motion is limited to result-link
feedback and is removed under reduced motion.

The method references are the frontend entry point, UI motion defaults, Stageshow
native-interface branch and Unslop light-refinement branch in Second Brain at
`c0dea84f1c3dd8135d6f6c50bc894299d09371c5`. No shared skill package is copied here.

## Verification

- Existing `npm run check` passed: 39 top-level checks, including the retained
  geometry, content, navigation and reading suites.
- The added `scripts/check-reading-search.mjs` passed against all 575 indexed
  articles: title ranking, part/function/guide/source requests, type filtering,
  no-result recovery inputs and actual destination anchors. It is included in
  the standard check command for subsequent runs. Its production pagination
  handler regression also checks focus after each expansion of the generated
  reading content, including the final expansion.
- A DOM execution of the generated reading page passed initial deep-link reveal,
  result destination, type filter, no-match state, clear/focus recovery, result
  pagination, fragment reveal and malformed-fragment handling.
- The pagination-focus regression failed before the follow-up fix: focus stayed
  on Show more. Afterward, a generated-page DOM execution passed all five
  expansions of the 68 “point” results; the final expansion hid Show more and
  retained focus on the first newly added result. The focused lookup checker
  passed again; unrelated checks retained their earlier results.
- `npm run build` and `npm run check:release` passed with 158 version-consistent
  local dependency references.

The generated reading page rendered at desktop and 390 px. Searching for “point” returned 68 entries, and the fifth expansion focused the first newly shown result when Show more disappeared. The component filter narrowed “point machine” to two results at 390 px. Keyboard activation opened the linked disclosure and focused its anchor. A no-match search displayed recovery guidance and Clear returned focus to the search field. No deployment was run.
