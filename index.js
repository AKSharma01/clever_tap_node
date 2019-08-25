'use strict';

global.rootDir = __dirname
const fs = require("fs")
require("dotenv").config();
const CleverTapEvent = require("./src/events") 
const eventJson = require("./eventnamelist.json");

const ctevent = new CleverTapEvent()
let index = 0;

// function callEvent() {
// 	eventJson.events.forEach(async(eventObject) => {
// 		try{
// 			let from = 20180701
// 			let to = 20190824
// 			await ctevent.event(eventObject, from, to)
// 		}catch(error){
// 			console.log("error(callEvent): ", error)
// 			ctevent.logger(error)
// 		}
// 	})
// }


const callEvent = async (eventname) => {
	try{
		let from = 20180701
		let to = 20190824
		await ctevent.event(eventname.trim(), from, to)
	}catch(error){
		console.log("error(callEvent): ", error)
		ctevent.logger(error)
	}
}


let eventlist = eventJson.events
ctevent.on('complete', () => {
	console.log(`complete event called --> sequence: ${index+1}, event: ${eventlist[index]}`)
	callEvent(eventlist[index++])
})


callEvent(eventlist[index++])