Module.register("MMM-ELMPrayerTime",{
	// Default module config.
	defaults: {
		apiVersion: '1.0',
    timeFormat: config.timeFormat || 24,
    playAdzan: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
    notDisplayed: ['midnight', 'sunset'],
    useUpdateInterval: true,
    updateInterval: 86400 * 1000, // How often do you want to fetch new praying time? (milliseconds)
    animationSpeed: 2.5 * 1000, // Speed of the update animation. (milliseconds)
    colored: true,
    alertTimer: 15000
	},

	getScripts: function() {
	    return ["moment.js"];
	},

	getStyles: function() {
		return ["MMM-PrayerTime.css"];
	},

  // Define required translations.
	getTranslations: function() {
    return {
      'en': 'translations/en.json',
      'id': 'translations/id.json',
      'ar': 'translations/ar.json'
    };
	},

  getCommands: function(commander) {
    commander.add({
      command: 'prayertime',
      description: this.translate("TXT_PRAYERTIME_DESC"),
      callback: 'cmd_prayertime'
    })
  },

  cmd_prayertime: function(command, handler) {
    var text = "";
    text += "*" + this.translate("TXT_PRAYERTIME") + "*\n";
    text += "*" + this.translate("TODAY") + "*\n";
    for (var t in this.arrTodaySchedule) {
      text += "*" + this.translate(this.arrTodaySchedule[t][0].toUpperCase()) + ":* `" + (this.config.timeFormat == 12 ? moment(this.arrTodaySchedule[t][1], ["HH:mm"]).format("h:mm A") : this.arrTodaySchedule[t][1]) + "`\n";
    }
    handler.reply("TEXT", text, {parse_mode:'Markdown'});
  },


	/* processSchedule
	 * process downloaded scheduled.
	 */
  processSchedule: function() {
    var self = this;

    function sortSchedule(a, b) {
      if (a[1] < b[1]) {
        return -1;
      }
      if (a[1] > b[1]) {
        return 1;
      }

      // names must be equal
      return 0;
    }

    // sort today schedule
    this.arrTodaySchedule = [];
    this.arrAdzanTime = [];
    for(var x in this.todaySchedule){
      if (!self.config.notDisplayed.includes(x.toLowerCase()))
        this.arrTodaySchedule.push([x, this.todaySchedule[x]]);
      if (self.config.playAdzan.includes(x.toLowerCase()))
        this.arrAdzanTime.push(this.todaySchedule[x]);
    }

    this.loaded = true;
		this.updateDom(this.config.animationSpeed);
  },

  updateSchedule: function(delay) {
    var self = this;
    Log.log(self.name + ': updateSchedule');
    var urlBase = "http://api.aladhan.com/timings/";
    var curUnixTime = moment().unix();
    var urlToday = "https://script.googleusercontent.com/macros/echo?user_content_key=JBB9t6iBCA-rgsPQFeJqfn4MEQKpdZwsr_VE3iGWbL4ySXn4dW8E4PRYBxjxxbWdFiFW6xwFlvzi_-wd1m8cqnEv5tCitG1zm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnK__4VCI9cUfislTBEwE9483B0TZ_HJEksaW92hDCPez_yZEOM1K-ZWz7rJarf50_NsAUXIaJqQ5&lib=MnbyLqsdFHGdCo2Zr5NhOSJA7VlBhJiiH"
    // var urlNextday = urlBase + this.getParams(curUnixTime + 86400);
    var resultToday = {};
    var resultNextday = {};
    var nbReq = 1;
    var nbRes = 0;

var mm_now = new Date();
var mm_start = new Date(mm_now.getFullYear(), 0, 0);
var mm_diff = mm_now - mm_start;
var mm_oneDay = 1000 * 60 * 60 * 24;
var mm_day = Math.floor(mm_diff / mm_oneDay)-1;

    var todayRequest = new XMLHttpRequest();
		todayRequest.open("GET", urlToday, true);
		todayRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
          resultToday = JSON.parse(this.responseText);
          self.todaySchedule={}
          // self.todaySchedule = resultToday.data.timings;
          // debug/testing only
          self.todaySchedule = {
              "Fajr":resultToday["data"][mm_day].fajrbegins.toString(), "Dhuhr":resultToday["data"][mm_day].zuhrbegins.toString(), "Asr":resultToday["data"][mm_day].asrmithl1.toString(), "Maghrib":resultToday["data"][mm_day].maghribbegins.toString(), "Isha":resultToday["data"][mm_day].ishābegins.toString(),
              "Imsak":"04:20"
          };

          // self.todaySchedule = {"Fajr":"04:30", "Dhuhr":"12:00", "Asr":"16:14", "Maghrib":"18:00", "Isha":"20:50", "Imsak":"04:20"};

          nbRes++;
          if (nbRes == nbReq)
            self.processSchedule();
				} else {
					Log.error(self.name + ": got HTTP status-" + this.status);
          retry = true;
				}
			}
		};
		todayRequest.send();

    // var nextdayRequest = new XMLHttpRequest();
	// 	nextdayRequest.open("GET", urlNextday, true);
	// 	nextdayRequest.onreadystatechange = function() {
	// 		if (this.readyState === 4) {
	// 			if (this.status === 200) {
    //       resultNextday = JSON.parse(this.responseText);
    //       self.nextdaySchedule = resultNextday.data.timings;
    //       nbRes++;
    //       if (nbRes == nbReq)
    //         self.processSchedule();
	// 			} else {
	// 				Log.error(self.name + ": got HTTP status-" + this.status);
    //       retry = true;
	// 			}
	// 		}
	// 	};
	// 	nextdayRequest.send();
  },

  isAdzanNow: function() {
    var curTime = moment().format("HH:mm:ss");
    var indexAdzan = -1;
    //console.log(this.arrTodaySchedule);
    if (this.arrTodaySchedule.length > 0)
    {
      function isAdzan(el, idx, arr) {
        return (el[1] + ':00') == curTime;
      }
      indexAdzan = this.arrTodaySchedule.findIndex(isAdzan);
      //console.log("indexAdzan-"+indexAdzan);

      if (indexAdzan > -1) {
        //console.log(this.config.playAdzan);
        //console.log("this.arrTodaySchedule[indexAdzan][0]).toLowerCase()-"+(this.arrTodaySchedule[indexAdzan][0]).toLowerCase());
        //console.log("this.config.playAdzan.findIndex((this.arrTodaySchedule[indexAdzan][0]).toLowerCase())-"+this.config.playAdzan.findIndex((this.arrTodaySchedule[indexAdzan][0]).toLowerCase()));
        if (this.config.playAdzan.includes((this.arrTodaySchedule[indexAdzan][0]).toLowerCase())) {
          //console.log("this.arrTodaySchedule[indexAdzan][0]).toUpperCase()-"+(this.arrTodaySchedule[indexAdzan][0]).toUpperCase());
          this.sendSocketNotification("PLAY_ADZAN", {occasion: (this.arrTodaySchedule[indexAdzan][0]).toUpperCase()});
        }
      }
    }
  },

	start: function() {
		Log.info("Starting module: " + this.name);
		var self = this;

    // Set locale.
		moment.locale("en");

    this.todaySchedule = {};
    this.nextdaySchedule = {};
    this.arrTodaySchedule = [];
    this.arrNextdaySchedule = [];
    this.arrAdzanTime = [];

    this.loaded = false;
    var self = this;

    // first update
    self.updateSchedule(0);
    // periodic update if defined
    if (self.config.useUpdateInterval) {
      Log.log(self.name + ': using periodic update is activated');
      setInterval(function() {
        self.updateSchedule(0);
      }, self.config.updateInterval);
    }
    // adzan-checker
    self.isAdzanNow();
    setInterval(function() {
      self.isAdzanNow();
    }, 1000);
	},

	// Override dom generator.
	getDom: function() {
		Log.log("Updating MMM-ELMPrayerTime DOM.");
    var self = this;
    var wrapper = document.createElement("div");

    if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
		}
    else {
      var table = document.createElement("table");
		  table.className = "small";

      var row = document.createElement("tr");
      if (this.config.colored) {
        row.className = "colored";
      }
      table.appendChild(row);

      var occasionName = document.createElement("td");
      occasionName.className = "occasion-name bright light";
      occasionName.innerHTML = '&nbsp;';
      row.appendChild(occasionName);

      // today
      var occasionTime = document.createElement("td");
      occasionTime.className = "occasion-time bright light";
      // occasionTime.innerHTML = this.translate('TODAY');
      row.appendChild(occasionTime);

      for (t in this.arrTodaySchedule)
      {
        row = document.createElement("tr");
        if (this.config.colored) {
          row.className = "colored";
        }
        table.appendChild(row);

        var occasionName = document.createElement("td");
        occasionName.className = "occasion-name bright light";
        //occasionName.innerHTML = this.translate(t);
        occasionName.innerHTML = this.translate(this.arrTodaySchedule[t][0].toUpperCase());
        row.appendChild(occasionName);

        // today
        var occasionTime = document.createElement("td");
        occasionTime.className = "occasion-time bright light";
        //occasionTime.innerHTML = this.todaySchedule[t];
        occasionTime.innerHTML = (this.config.timeFormat == 12 ? moment(this.arrTodaySchedule[t][1], ["HH:mm"]).format("h:mm A") : this.arrTodaySchedule[t][1]);
        row.appendChild(occasionTime);
      }

      wrapper.appendChild(table);
    }

		return wrapper;
  },

	notificationReceived: function(notification, payload, sender) {
		Log.log(this.name + ": received notification : " + notification);
		if (notification == "PRAYER_TIME") {
      if (payload.type == "PLAY_ADZAN") {
        this.sendSocketNotification("PLAY_ADZAN", {occasion: 'ASR'});
      }
      if (payload.type == "UPDATE_PRAYINGTIME") {
        this.updateSchedule(0);
      }
		}
	}
});
