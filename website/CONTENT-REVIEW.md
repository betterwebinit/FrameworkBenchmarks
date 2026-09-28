# Original-site information review

Reviewed against the public TechEmpower site on 2026-09-28 UTC.

| Original information / feature | New portal |
| --- | --- |
| Published rounds 3–23, plus links to rounds 1–2 | Results selector and guide archive |
| Physical / cloud environments | Per-round selector; 37 public datasets mirrored |
| Seven workload types | Results tabs, methodology cards and original requirement links |
| Best throughput | Ranking with published duration and connect/read/write/5xx subtraction |
| Query count / concurrency samples | Explicit sample selector and all-samples table |
| Latency average, maximum, standard deviation | Latency view |
| Framework overhead | Declared baseline relationship; ratio and named baseline |
| Stack attribute filters | Language, platform, server, class, database, ORM, application/database OS, approach |
| Realistic / Stripped distinction | Realistic default and explicit approach filter |
| Failed / incomplete implementations | Visible failure status; no fabricated performance score |
| Implementation metadata | Expandable per-row details |
| Raw JSON, run logs, run details, round announcements | Source links below each dataset and per-row logs |
| Introduction and motivation | Guide |
| Terminology | Guide glossary |
| Environment history | Physical and cloud hardware history in guide |
| Procedure, primer, warmup and measurement | Guide |
| Configuration, tests, interpretation and contribution questions | 18 guide questions |
| Source, test requirements, discussions, continuous runs and updates | Guide resource cards |
| Private result exploration | Local JSON import; file stays in the browser |

Source: https://www.techempower.com/benchmarks/

The cloud JSON endpoints for rounds 12 and 14 returned 404 during collection.
These datasets are not fabricated or advertised as available; their original
publication links remain accessible in the archive. The guide records this gap.

Numerical check against the rendered original round 23 Fortunes leaderboard:
may-minihttp 1,327,378; h2o 1,226,814; ntex-db 1,210,348 requests/s.
Automated regression checks preserve these values.

This is an independent viewer, not a claim to reproduce every upstream scoring
convention. No composite or cross-round score is generated. Query workloads
default to the final published query count. Overhead uses declared baselines.
Local imports use measured timestamps and are clearly labeled approximate.
