'use strict';

global.rootDir = __dirname
const fs = require("fs")
require("dotenv").config();
const CleverTapEvent = require("./src/events") 
const eventJson = require("./eventnamelist.json");

const ctevent = new CleverTapEvent()

function callEvent() {
	eventJson.events.forEach(async(eventObject) => {
		let from = eventObject.from? eventObject.from: 20190301
		let to = eventObject.to? eventObject.to: 20190801
		await ctevent.event(eventObject.event, from, to)
	})
}

callEvent()