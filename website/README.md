# framework benchmarks website

Better Web portal for the FrameworkBenchmarks community fork. English at `/`, Brazilian Portuguese at `/pt/`.

## Development and publication

Requires Node.js 22.13+ and an authenticated Cloudflare Wrangler session for deployment.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run deploy
```

Production: https://frameworkbenchmarks.better-web.org

`wrangler.json` binds the Worker to this Custom Domain in the OpenDigital account. Use the project-local Wrangler through `npm run deploy`; deployment targets the generated `dist/server/wrangler.json` and matching assets.

## Catalog provenance

`scripts/generate-catalog.mjs` builds `public/catalog.json` and `app/catalog-summary.json` from the repository's `frameworks/**/benchmark_config.json`. Each row represents one framework configuration directory. Counts represent configurations, variants and distinct configured language labels, not validated or ranked performance. Coverage is a union across variants. The snapshot commit is visible in the UI.

## Local result inspection

The results workspace accepts the `results.json` schema produced by `toolset/utils/results.py`. Files are read locally in the browser and are never uploaded. Files must be under 10 MB. Users select a test type and one workload sample; entries explicitly listed as failed are excluded.

Approximate throughput is `totalRequests / (endTime - startTime)` using measured timestamps in seconds from the runner. Missing or invalid timings are excluded. This is not the official TechEmpower ranking algorithm. Only 25 entries are shown in the results table; this does not claim statistical significance or compare unlike environments. Latency values are preserved from each raw sample. Error events sum the reported connect, read, write, timeout and non-2xx/3xx counters.

Parser tests cover failures, invalid timestamps, measured duration, workload intervals, malformed inputs and valid zero throughput.

## Attribution

The existing root `LICENSE` and TechEmpower copyright attribution are preserved. The public portal identifies itself as an independent Better Web derivative, links the original methodology and official results, and does not imply TechEmpower endorsement.

The Sites Vite build plugin is retained for compatible packaging; production publication uses Wrangler as requested.
