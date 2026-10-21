FROM node:22-bookworm-slim

# LibreOffice Writer + Draw handle PDF import; the fonts keep text metrics close to Word's defaults.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      libreoffice-writer libreoffice-draw \
      fonts-liberation fonts-dejavu-core fonts-crosextra-carlito fonts-crosextra-caladea \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY server.mjs .

ENV NODE_ENV=production PORT=8080 HOME=/tmp
USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:8080/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
