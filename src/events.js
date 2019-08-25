'use strict';

const fs = require("fs");
const CleverTap = require("./cleverTap");
const slackMessanger = require(rootDir+"/utils/slackMessanger");


class Events extends CleverTap{
	constructor() {
		super()
		this.url = `/events.json`

	}

	async event(eventName, from, to) {
		try{
			this.initilize(eventName, from, to)
			// console.log("this object for api call: ", this.url, this.body)
			let url = `${this.url}?batch_size=${this.BATCH_SIZE}`,
				method = 'post';
			let response = await this.apiCall(url, this.body, method)
			console.log("reponse: ", response)

			if('cursor' in response){
				this.cursor = response.cursor
				this.iterate()
			}else{
				throw({
					message: `cursor not found for event_name: ${eventName}`
				})
			}
		}catch(error) {
			// console.log("error (event): ", error)
			await this.logger(error)
		}
	}

	async iterate(){
		try{
			let url = `${this.url}?cursor=${this.cursor}`,
				method = 'post';
			// console.log("console.lasdfasdfh: ", this.on)
			let response = await this.apiCall(url, this.body, method)
			console.log("response: ", response)
			
			this.records = response.records||[]
			await this.jsonDump()
			if('next_cursor' in response){
				this.cursor = response.next_cursor
				console.log(String(this.count),"calling through next cursor")
				this.count++;
				this.iterate()
			}else
				throw({
					message: "cursor not found"
				})
		}catch(error){
			console.log("error (iterate): ", error)
			await this.logger(error)
			this.emitter.emit('complete', {})
		}
	}


	async jsonDump(){
		try{
			for(let record of this.records){
				try{
					record = JSON.stringify(record, null, 4)
					// console.log("record: ", record)
					if(!fs.existsSync(this.subfolder))
						fs.mkdirSync(this.subfolder);
					this.filename = `${this.subfolder}/${this.body.event_name}-part-${Math.floor(this.count/10)}.json`
					if(!fs.existsSync(this.filename)){
						fs.writeFileSync(this.filename, record)
						// this.filewritten = true
					}
					else{
						record = ","+record
						fs.appendFileSync(this.filename, record)
					}
				}catch(error) {
					console.log("error(jsonDump): ", error)
					throw(error)
				}
			}
			return Promise.resolve()
		}catch(error){
			await this.logger(error)
			return Promise.reject(error)
		}
	}

	async logger(errorStack){
		errorStack.errorIdentifier = this.body.event_name
		return slackMessanger.sendMessage('', errorStack).then((response) => {
			console.log("response: ", response)
			return response
		}).catch((error) => {
			console.log("error: ", error)
			return error
		})
	}

}

module.exports = Events