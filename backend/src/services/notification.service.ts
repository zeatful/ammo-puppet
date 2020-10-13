import {bind, BindingScope} from '@loopback/core'

import {Ammo, Primer} from '../models'
import axios from 'axios'
import currency from 'currency.js'

// Should align with the ammo.caliber field stored in the database
const CALIBER_9 = '9mm'
const CALIBER_223 = '.223'
const CALIBER_556 = '5.56'
const CALIBER_762 = '7.62'
const CALIBER_380 = '308 auto'
const CALIBER_40 = '40 S&W'
const CALIBER_45 = '45 ACP'

// list of ammo to check against quickly
var SUBSCRIBED_AMMO = [CALIBER_223, CALIBER_556, CALIBER_762, CALIBER_380, CALIBER_9, CALIBER_40, CALIBER_45]

@bind({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(/* Add @inject to inject parameters */) {}

  notifyAmmo(ammo: Ammo) {
    console.log(ammo.id + '=> NOW AVAILABLE!')

    // only notify of specific ammo
    if(SUBSCRIBED_AMMO.includes(ammo.caliber)) {
      this.notifySlackAmmo(ammo)
    }
  }

  notifyPrimer(primer: Primer) {
    console.log(primer.id + '=> NOW AVAILABLE!')
    this.notifyPrimer(primer)
  }

  notifySlackAmmo(ammo: Ammo) {
    // calculate cost per round / cent per round
    let cpr = currency(ammo.price).divide(ammo.count).format()

    let messageBody = {
      "username": "AmmoPuppet", // This will appear as user name who posts the message
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ammo: ${ammo.caliber} in stock!`
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Caliber:* \`${ammo.caliber}\`\n *Quantity:* \`${ammo.count}\`\n *Cost:* \`${ammo.price}\`\n *Cost Per Round:* \`${cpr}\``
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Check it out!",
                "emoji": true
              },
              "url": `${ammo.url}`
            }
          ]
        }
      ]
    }
    
    // send Slack message
    axios.post(`${process.env.AMMO_SLACK_URL}`, messageBody)
    .catch(err => {
      console.error(err)
    })
  }

  notifySlackPrimer(primer: Primer){
    console.log(`crafting Slack notification for ${primer.id}!`)

    // calculate cost per primer / cent per primer
    let cpp = currency(primer.price).divide(primer.count).format()

    let messageBody = {
      "username": "PrimerPuppet", // This will appear as user name who posts the message
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ammo: ${primer.id} in stock!`
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Description:* \`${primer.description}\`\n *Quantity:* \`${primer.count}\`\n *Cost:* \`${primer.price}\`\n *Cost Per Primer:* \`${cpp}\``
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Check it out!",
                "emoji": true
              },
              "url": `${primer.url}`
            }
          ]
        }
      ]
    }
    
    // send Slack message
    axios.post(`${process.env.RELOADING_SLACK_URL}`, messageBody)
    .catch(err => {
      console.error(err)
    })
    console.log(`NOTIFY SLACK ==> ${primer.description}`)
  }
}