# PDF to Word converter service

Headless LibreOffice behind a tiny HTTP API. The Next.js site sends PDFs here and gets a `.docx` back.

```
docker build -t toolbunch-converter ./converter
docker run --rm -p 8080:8080 -e ALLOWED_ORIGINS=http://localhost:3000 toolbunch-converter
```

Then set `NEXT_PUBLIC_CONVERTER_URL=http://localhost:8080` in `.env.local` and restart `npm run dev`.

## Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated site origins allowed to call the service. Set to your real domain in production. |
| `MAX_MB` | `50` | Largest accepted PDF. |
| `MAX_CONCURRENT` | `2` | Conversions running at once (each uses ~300-600 MB RAM and a CPU core). |
| `MAX_QUEUE` | `8` | Requests allowed to wait. More get a 503 "busy". |
| `RATE_LIMIT_PER_MIN` | `6` | Per-IP conversions per minute. Needs `x-forwarded-for` when behind a proxy. |
| `TIMEOUT_MS` | `120000` | Hard stop for one conversion. |

## Deploying

Any host that runs a Docker container works (Fly.io, Railway, Render, a VPS). Give it at least 1 GB RAM
and put it behind HTTPS (the site is served over HTTPS, so browsers block plain-HTTP calls). Files exist
only in a per-request temp directory that is deleted when the request finishes; nothing is logged or stored.

## Limits to know about

LibreOffice rebuilds each page as positioned text boxes and images. It looks close to the PDF but is not
flowing Word text, tables usually become boxes rather than real tables, and complex design PDFs will not be
perfect. Scanned PDFs have no text to convert (OCR is a separate step).
