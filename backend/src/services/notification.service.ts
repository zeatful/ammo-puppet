import {bind, BindingScope} from '@loopback/core';

import {Ammo} from '../models';
import axios from 'axios';
import currency from 'currency.js';

// Should align with the ammo.caliber field stored in the database
const CALIBER_9 = '9mm';
const CALIBER_223 = '.223';
const CALIBER_556 = '5.56';
const CALIBER_762 = '7.62';
const CALIBER_380 = '308 auto';
const CALIBER_40 = '40 S&W';
const CALIBER_45 = '45 ACP';
const CALIBER_303= '.303 British';

// list of ammo to check against quickly
var SUBSCRIBED_AMMO = [CALIBER_223, CALIBER_556, CALIBER_762, CALIBER_380, CALIBER_9, CALIBER_40, CALIBER_45];

@bind({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(/* Add @inject to inject parameters */) {}

  notify(ammo: Ammo) {
    console.log(ammo.id + '=> NOW AVAILABLE!');

    // only notify of specific ammo
    if(SUBSCRIBED_AMMO.includes(ammo.caliber)) {
      this.notifySlack(ammo);
    }
  }

  notifySlack(ammo: Ammo) {
    // calculate cost per round / cent per round
    let cpr = currency(ammo.price).divide(ammo.count).format();

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
            "text": `*Caliber:*\t\t\t\t\t${ammo.caliber}\n*Quantity:*\t\t\t\t${ammo.count}\n*Cost:*\t\t\t\t\t\t${ammo.price}\n*Cost Per Round:*\t${cpr}`
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
    };
    
    axios.post(`${process.env.SLACK_URL}`, messageBody);
  }
}