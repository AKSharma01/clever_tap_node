'use strict';

const Slack = require("slack")
const axios = require('axios');
const qs = require('qs');


const slack = new Slack(process.env.SLACK_TOKEN)

const sendMessage = (channelId, message) => {

    return new Promise((resolve, reject) => {
        console.log("channelId: ", channelId, " message: ", message)
        let options = {
            token: process.env.SLACK_TOKEN,
            channel: channelId,
            text: message,
            as_user: process.env.SLACK_USER_ID,
            pretty: 1
        };
        // console.log("slack: ", slack.api.test())
        slack.chat.postMessage(options).then((success) => {
            resolve(success)
        }).catch((error) => {
            console.log("error: ",error)
            reject(error)
        })

    })

};


module.exports = {
    sendMessage
}