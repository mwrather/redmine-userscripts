// ==UserScript==
// @name          Redmine Timer
// @namespace     http://wrathercreative.com
// @author        Matthew Wrather
// @description   Add a small timer to redmine pages to help with your time tracking.
// @include       http://redmine.*
// @include       https://redmine.*
// @match         http://redmine.*
// @match         https://redmine.*
// ==/UserScript==

(function() {

	var timer = document.createElement('div'),
		body = document.getElementsByTagName('body')[0],

		// timer variables
		startTime,
		elapsedTime,
		isRunning,

		// your billing increment, in minutes
		billingIncrement = 5,

		// css variables
		pausedCss = 'position: fixed; bottom: 0; right: 0; padding: 16px 32px; z-index: 9999; background-color: #333; background-color: rgba(255,0,0,0.6); color: #CCC; font: normal normal bold 72px/72px inconsolata, consolas, monospace;',
		runningCss = 'position: fixed; bottom: 0; right: 0; padding: 16px 32px; z-index: 9999; background-color: #333; background-color: rgba(0,0,0,0.6); color: #CCC; font: normal normal bold 72px/72px inconsolata, consolas, monospace;',

		/**
		 * Returns a time string in the format HH:MM:SS
		 * 
		 * @param  {number} elapsedTime Number of seconds to format
		 * @return {string}             Formatted Time String
		 */
		formatTime = function(elapsedTime) {
			var hours = Math.floor(elapsedTime / 3600),
				minutes = Math.floor((elapsedTime / 60) % 60),
				seconds = Math.floor(elapsedTime % 60),
				timeString = '';

			timeString += hours ? hours + ':' : '';
			timeString += ((hours && minutes < 10) ? '0' : '') + minutes + ':';
			timeString += ((seconds < 10) ? '0' : '') + seconds;

			return timeString;
		},

		/**
		 * Update elapsed time variable and print a formatted result to the timer. 
		 */
		updateTimer = function() {
			elapsedTime = (Date.now() - startTime);
			timer.innerHTML = formatTime(elapsedTime / 1000);
		},

		/**
		 * Set the title of the timer div based on current state.
		 */
		setTimerTitle = function() {
			timer.title = 'Click to ' + (isRunning ? 'stop' : 'start') + ' timer.' + ( elapsedTime >= 0 ? ' Double click to log time.' : '');
		},

		/**
		 * Start or pause the timer when clicked.
		 */
		timerClick = function() {

			if (isRunning) {

				// stop the timer
				window.clearTimeout(isRunning);
				isRunning = false;

				// set the timer appearance
				timer.setAttribute('style', pausedCss);
				setTimerTitle();
			} else {

				// figure out how much time has accrued already
				elapsedTime = elapsedTime || 0;

				// start the timer, accounting for any time
				// that has already accrued
				startTime = Date.now() - elapsedTime;
				isRunning = window.setInterval(updateTimer, 1000);

				// set the timer appearance
				timer.setAttribute('style', runningCss);
				setTimerTitle();
			}

			return false;
		},

		/**
		 * Fill in input#time_entry_hours when double clicked.
		 * 
		 * Stops the timer if it's running (cause you're about to submit a form).
		 * Rounds up to the next highest billingIncrement minutes.
		 */
		timerDblclick = function() {
			var timeEntry = document.getElementById('time_entry_hours'),
				elapsedMinutes = Math.ceil(elapsedTime/60000);

			// stop the timer if it's running
			if (isRunning) timerClick();

			// We bill in increments of billingIncrement
			while (elapsedHours % billingIncrement !== 0) elapsedHours++;

			timeEntry.value = elapsedHours / 60.0;
		};

	timer.id = 'wrcr-task-timer'; // so other scripts can target the timer
	timer.setAttribute('style', pausedCss);
	timer.innerHTML = '0:00';
	setTimerTitle();
	timer.addEventListener('click', timerClick);
	timer.addEventListener('dblclick', timerDblclick);

	body.appendChild(timer);

})();
