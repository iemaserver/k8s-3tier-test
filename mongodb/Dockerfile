# ---------- Stage 1: prepare config + init scripts ----------
# Normalises line endings (files edited on Windows get CRLF, which can break
# mongod.conf parsing) and sets read-only permissions, using a tiny Alpine image
# so none of these tools end up in the final image.
FROM alpine:3.20 AS prep
WORKDIR /build
COPY mongod.conf init-mongo.js ./
RUN sed -i 's/\r$//' mongod.conf init-mongo.js \
    && chmod 0444 mongod.conf init-mongo.js

# ---------- Stage 2: MongoDB runtime ----------
# There is no official Alpine MongoDB image; the Ubuntu "jammy" base is the
# smallest officially supported one.
FROM mongo:7.0-jammy AS runtime

COPY --from=prep /build/mongod.conf /etc/mongo/mongod.conf
COPY --from=prep /build/init-mongo.js /docker-entrypoint-initdb.d/init-mongo.js

EXPOSE 27017

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD mongosh --quiet --eval "db.adminCommand('ping').ok" || exit 1

CMD ["mongod", "--config", "/etc/mongo/mongod.conf"]
