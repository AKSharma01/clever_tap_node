'use strict';

global.rootDir = __dirname
const fs = require("fs")
require("dotenv").config();
const CleverTapEvent = require("./src/events") 
const eventJson = require("./eventnamelist.json");

const ctevent = new CleverTapEvent()

function callEvent() {
	eventJson.events.forEach(async(eventObject) => {
		let from = 20180701
		let to = 20190824
		await ctevent.event(eventObject, from, to)
	})
}

callEvent()