# MMM-ELMPrayerTime [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/slametps/MMM-PrayerTime/master/LICENSE)
This an extension for the [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror). It will display prayer time from the East London Mosque website timetable. Your mirror will be your helpful assistant to do sholat on time.

## Screenshot
![Screenshot](https://raw.githubusercontent.com/slametps/MMM-PrayerTime/master/screenshot.png)

## Installation
1. Navigate into your MagicMirror's `modules` folder
2. execute `git clone https://github.com/moinahmed001/MMM-ELMPrayerTime`
3. if this module does not run correctly, try `npm install async`

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-ELMPrayerTime',
		position: 'top_left',	// This can be any of the regions. Best result is in the top_left/top_right.
		config: {
			apiVersion: '1.0', // please, leave unchanged. reserved for future use.
			timeFormat: 24,
			notDisplayed: ['midnight', 'sunset'],
			useUpdateInterval: true,
			updateInterval: 86400 * 1000, // How often do you want to fetch new praying time? (milliseconds)
			animationSpeed: 2.5 * 1000, // Speed of the update animation. (milliseconds)
			alertTimer: 15000
		}
	}
]
````

## Dependencies
- Access to the internet to download praying time from http://moinahmed.ddns.net:5000/prayer_timetable

The MIT License (MIT)
=====================

Copyright © 2016-2017 Slamet PS

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
