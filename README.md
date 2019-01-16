# Coffee monitor web interface for SIK
Our guildroom had a IoT-enhanced coffeemaker that allows you to know how much coffee there is left and when it was brewed. Underneith the coffee pot is a scale that monitors the weight of the pot. This weight is published as MQTT message to a MQTT broker.
The original web frontend had a few problems so I made my own.

## Technical stuff
This repo includes backend and frontend packaged into containers. Backend is NodeJs based MQTT-subscriber that creates an API endpoint for the frontend.

### Links
[Working demo](https://coffee.eero.tech/)
[The Guild of Electrical Engineering - SIK](https://sik.ayy.fi/en/)
