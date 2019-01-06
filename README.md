paas-tdln-demo-apps
===================

[![Build Status](https://cloud.drone.io/api/badges/richardTowers/paas-tdln-demo-apps/status.svg)](https://cloud.drone.io/richardTowers/paas-tdln-demo-apps)

This repository contains some demo apps for the presentation GOV.UK PaaS are
doing at the technology and digital leaders' network meeting in January 2019.

There are two demo applications:

* `trivial` is just a single static HTML page (with some assets)
* `complex` is a cluster of microservices that are continuously deployed using drone.io

Running the applications locally
--------------------------------

For `trivial` you can use any webserver, e.g. `cd trivial && python -m HTTPServer`.

For `complex` you can use `cd complex && docker-compose up`.

Pushing the applications to cloud foundry
-----------------------------------------

`cd` into either directory and run `cf push`.

The plan
--------

Idea for `complex`:

A leave your questions application that lets people comment in real time.

Composed of the following services:

* Frontend (react on the client, node + express on the backend)
* Architecture diagram as part of the application - "If you're bored of
  listening to me speak and would rather look at some code, tuck in"
* QR code generator (F#)
* List questions (golang with server-sent-events to the frontend)
* Submit a question (haskell in docker)
* Postgres database as a datastore (realtime using triggers)

People can use this during the presentation to submit questions, which we'll
answer at the end. If we know anyone that's coming we can prime them to ask a
question.

QR code / link is always on the screen so people can see it during the presentation.

Maybe show billing here too?

Don't go into too much depth explaining this application, just explain that
it's reasonably complicated and let people do their own digging.

Should have some calls to action in the app as well - maybe after users submit a question?

Build the frontend first with stubbed out services.

Drone pipeline - run tests for each app, test the apps together, if all looks
good do a zero-downtime deploy to PaaS.

Make a simple change, deploy it.

"Let's say this service ended up getting really popular, and things started to
fall over. What would we do?" Scale up a service and see what happens :)


Checklist for each microservice
-------------------------------

### Frontend

* [x] Has at least one test, which passes
* [ ] Binds to port 8080 / the PORT environment variable
* [x] Runs in docker-compose
* [ ] Runs in cloud foundry
* [ ] Can be deployed by drone
* [x] Has sensible error handling

### QR Code

* [ ] Has at least one test, which passes
* [ ] Binds to port 8080
* [x] Runs in docker-compose
* [ ] Runs in cloud foundry
* [ ] Can be deployed by drone

### Question submit

* [ ] Has at least one test, which passes
* [ ] Binds to port 8080
* [x] Runs in docker-compose
* [ ] Runs in cloud foundry
* [ ] Can be deployed by drone

### Question list

* [ ] Has at least one test, which passes
* [ ] Binds to port 8080
* [x] Runs in docker-compose
* [ ] Runs in cloud foundry
* [ ] Can be deployed by drone
