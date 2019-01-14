FROM haskell:8 as build

RUN apt-get update && \
  apt-get install -y --no-install-recommends libpq-dev && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /opt/server

COPY ./question-submit.cabal /opt/server/question-submit.cabal

RUN cabal update

COPY Main.hs .

RUN cabal install

FROM debian:stretch

RUN apt-get update && \
  apt-get install -y --no-install-recommends libpq-dev && \
  rm -rf /var/lib/apt/lists/*

COPY --from=build /root/.cabal/bin/question-submit /usr/local/bin

CMD ["/usr/local/bin/question-submit"]
