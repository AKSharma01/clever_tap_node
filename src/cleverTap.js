'use strict';

const axios = require('axios');
const events = require('events');



class CleverTap{
	constructor() {
		this.ACCOUNT_ID = process.env.CLEVERTAP_ACCOUNT_ID
		this.ACCOUNT_PASSCODE = process.env.CLEVERTAP_ACCOUNT_PASSCODE
		this.BASE_URL = process.env.CLEVERTAP_BASE_URL
		this.ACCOUNT_REGION = process.env.CLEVERTAP_ACCOUNT_REGION
		this.BATCH_SIZE = process.env.CLEVERTAP_BATCH_SIZE
		this.basefolder = `${rootDir}/${process.env.FOLDER}`
		this.subfolder = ''
		this.filename = ''
		this.count = 0
		this.cursor = ''
		this.record = []
		this.body = null
		this.axios = null
		this.filewritten = false
		this.emitter = new events.EventEmitter();
	}

	headers(){
		return {
			'X-CleverTap-Account-Id': this.ACCOUNT_ID,
			'X-CleverTap-Passcode': this.ACCOUNT_PASSCODE,
			'Content-Type': 'application/json'
		};
	}

	data(eventName, from, to){
		return {
			event_name: eventName,
			from: from,
			to: to
		}
	}

	initilize(eventName, from, to){
		this.count = 0
		this.filewritten = false
		this.subfolder = `${this.basefolder}/${eventName}`
		// this.filename = `${this.subfolder}/${eventName}-part-${this.count}.json`
		this.body = this.data(eventName, from, to)
		this.axios = axios.create({
			baseURL: this.BASE_URL,
			headers: this.headers()
		})
	}


	apiCall(url, data, method, headers) {

		return this.axios({
			method: method,
			url: url,
			data: data
		}).then((response) => {
			// console.log("response(apiCall): ", response)
			return response.data
		}).catch((error) => {
			throw(error)
		})
	}

	on(){
		return this.emitter.on.apply(this.emitter, arguments)
	}

}



module.exports = CleverTap
