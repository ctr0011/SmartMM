/* Magic Mirror
   * Node Helper: MMM-PrayerTime
 *
 * By Slamet PS/slametps@gmail.com
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var async = require('async');
var exec = require('child_process').exec;
const mariadb = require("mariadb/callback");

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting node_helper.js for MMM-PrayerTime.");
	},
	
	prayerdb : function(){
	console.log("Called database function");
	const today = new Date().toISOString().slice(0,10);
	console.log(today)
         let conn;
        try {
      // Establish Connection
      conn = mariadb.createConnection({
	user :"iftikhar",
        password :"blackbook",
        host :"127.0.0.1",
        database :"myfirstdb"
      });
      conn.query(
         "SELECT * from  prayerdummy WHERE date = ?",[today],
         (err,res) => {
            if (err) {
               console.log("Error querying data: ", err);
            } else {
               console.log(res);
	       self.sendSocketNotification('PRAYER_RESULT', res);
            }
         }
      );
   } catch (err) {
      console.log("Error connecting to the database and querying data: ", err);
   } finally {
      if (conn){ conn.end;
	console.log('connection ended')}
      (err => {
         if(err) {
            console.log("SQL error in closing connection: ", err);
         }
      })}
      
   },

	socketNotificationReceived: function(notification, payload) {
    console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
    if (notification == "GET_PRAYTIME"){
      		this.prayerdb();

      }
    if (notification == "PLAY_ADZAN") {
      var adzanSound = 'adzan.mp3';
      if (payload.occasion) {
        if (payload.occasion=="FAJR") {
          adzanSound = 'adzan-fajr.mp3';
        }
        else if (payload.occasion=="IMSAK") {
          adzanSound = 'imsak.mp3';
        }
      }
      var adzanCmd = '/usr/bin/omxplayer -o both modules/MMM-PrayerTime/res/' + adzanSound + ' &';
      async.parallel([
        async.apply(exec, adzanCmd)
      ],
      function (err, res) {
      });
    }
	else if (notification == "TELEGRAM_ALERT") {
		var chat_ids = payload.telegramAlert_params[0];
		chat_ids.forEach(function(chat_id) {
			var telegramCmd = "curl -s --max-time 10 -d 'chat_id=" + chat_id + "&disable_web_page_preview=1&text=" + encodeURI(payload.telegramTxt).replace(/'/g, '%27') + "' https://api.telegram.org/bot" + payload.telegramAlert_params[1] + "/sendMessage";
			async.parallel([
				async.apply(exec, telegramCmd)
			],
			function (err, res) {
			});
		});
	}
  }
});
