# Contributing to Railway Anatomy

Railway Anatomy is a young public learning project. It helps graduates, newcomers and people crossing railway disciplines understand how equipment, systems and responsibilities connect. Corrections, additions and questions are welcome from learners as well as experienced practitioners.

You can contribute through a [GitHub issue](https://github.com/haitaowu12/railway-anatomy/issues/new/choose) or a pull request. You do not need to write code or already know the answer to report an explanation that is confusing.

## Report a correction

Link the page or name the view, component, guide or process step. Describe what seems wrong and what the reader might reasonably infer from it. If the problem appears only after a comparison or other interaction, include those steps and the selected options.

A suggested correction and a public source are useful when available. Please distinguish a factual error from an alternative practice: a particular railway, supplier or jurisdiction may use a different arrangement. If only a publisher's abstract or listing is accessible, say so rather than implying that you have reviewed the complete publication.

For a display or interaction problem, include the browser, approximate viewport and a screenshot where helpful. Crop out personal or confidential information. A short description is sufficient if a screenshot is inconvenient.

## Propose an addition

Start with the question the learner should be able to answer. Explain where the subject belongs, what it connects to and what is missing from the current explanation. Useful additions often clarify a single interface or distinction instead of adding another broad overview.

Choose a representation that suits the question:

- Use **3D** when physical placement, assembly, removable parts or movement explains the subject.
- Use a **2D connection diagram** for endpoints, functions, directions and information paths.
- Use a **2D process or stakeholder map** for contributions, evidence, decisions, conditions and rework.
- Use **prose or a comparison table** when it communicates the point more clearly.

The existing content modules and public references provide starting points. Larger additions benefit from a short issue before implementation so their boundaries and connections can be discussed. The dated roadmap is background, not a reserved feature list or a delivery commitment.

## Keep contributions public and well scoped

Use public primary sources where possible: railway bodies, operators, infrastructure managers, published research and equipment documentation. Add a source record explaining what the reader can learn and which part of the contribution it supports. Preserve the date, jurisdiction, product generation and any access limit that matters.

Do not submit confidential documents, non-public project details, private links, personal data, credentials or screenshots from restricted systems. Do not reproduce published figures, tables, forms or substantial text without the necessary rights. Public accessibility alone does not make material free to copy. Original explanations and schematic geometry should cite the public evidence behind them.

Separate established facts from an authored teaching example. Avoid unlabelled capacities, dimensions, timing, control sequences or acceptance thresholds. A supervisory indication, a request, a verified physical condition and an authority to act can be different things. Process maps should explain those boundaries without becoming instructions for operating or maintaining a railway.

## Make a code or content change

Keep a pull request focused on a coherent learning or usability improvement. Preserve useful component IDs and routes, and update related navigation or links when a change requires it. Add explanations and sources to the appropriate domain module; keep physical models, communications diagrams and process content in their respective modules.

For a model alternative, change the actual represented equipment or relationship and keep the accompanying explanation consistent. Use existing selection and assembly helpers so the new parts can be inspected. A diagram needs meaningful node labels, named connections and a readable narrow-screen arrangement. Static content should remain understandable when animation is paused.

Serve the site from the repository root with:

```bash
python -m http.server --directory dist
```

Use Node.js 24 for the checks. If explanations, guides or sources changed, regenerate the reading page before checking:

```bash
npm run reading
npm run check
```

Inspect affected interactions in a browser, including a narrow viewport where layout changed. Verify relevant alternatives and links rather than only the initial view. Add a focused regression when it protects a meaningful behaviour; prose-only corrections do not need artificial tests.

In the pull request, explain the problem, what changed, the public evidence used and what was actually checked. State any remaining uncertainty. Do not describe an untested renderer, device or deployment as verified.

## Review and credit

Expect review of the explanation, its source scope, its relationship to other content and its usability. Questions and proposed corrections are part of improving the project; constructive disagreement is welcome. Contributions should be material you have the right to share under the project's [MIT licence](LICENSE), while third-party dependencies and referenced publications retain their own rights.
