# Ammo Puppet

An ammo and reloading components web scrapper using Puppeteer in headless mode running through Docker, using Loopback for backend storage and messaging to a Slack channel for newly in-stock items and an Angular website to view current ammo availability.

## Services / Layout
---

### Puppeteer

- Puppeteer script and dependencies to perform webscrapping.  Files can be created for new items out side of ammo such as projectiles, propellants, brass and primers.  Then each can be manually configured to reuse the same Docker image and pass the cooresponding script file as index.js in the docker-compose configuration.  Any needed libraries are configured during the creation of the base Docker image

### Backstage

- Strongloop provides a strong rest api in nodejs with a Mongodb database to store any data for longterm reference.  The notification service also acts to intercept when any item changes from unavailable to available to provide realtime updates at the moment an item becomes available.  The notification service sends messages to Slack for newly available items and also provides any message formatting or calculations such a cost per round.  The backend can also be modified to help identify history and trends if that information is releveant.

### Threatre

- Angular front-end to expose data currently available through the Strongloop backend api instead of relying strictly of realtime notifications.

## Getting Started
---

### Requirements
- Docker - this is all that is needed to get started
- `.env` - create this file in the root directory and populate it with `SLACK_URL='YOUR_WEBHOOK_URL_HERE'`

### Commands
- From the root folder, run `docker-compose up -d` to get started