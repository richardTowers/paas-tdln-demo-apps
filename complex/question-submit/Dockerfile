FROM haskell:8

RUN apt-get update && \
  apt-get install -y --no-install-recommends libpq-dev && \ 
  rm -rf /var/lib/apt/lists/*

WORKDIR /opt/server

COPY ./question-submit.cabal /opt/server/question-submit.cabal

RUN cabal update 

COPY . /opt/server

RUN cabal install
CMD ["question-submit"]
