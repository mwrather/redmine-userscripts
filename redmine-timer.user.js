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

	var timerDiv = document.createElement('div'),
		body = document.getElementsByTagName('body')[0],
		startTime = new Date(),
		updateTimer = function updateTimer() {
			var timer = document.getElementById('wrcr-task-timer'),
				currentTime = new Date(),
				elapsedTime = (currentTime.getTime() - startTime.getTime()) / 1000,
				hours = Math.floor(elapsedTime / 3600),
				minutes = Math.floor((elapsedTime / 60) % 60),
				seconds = Math.floor(elapsedTime % 60),
				timeString = '';

			timeString += hours ? hours + ':' : '';
			timeString += ((hours && minutes < 10) ? '0' : '') + minutes + ':';
			timeString += ((seconds < 10) ? '0' : '') + seconds;

			timer.innerHTML = timeString;
			setTimeout(updateTimer, 1000);
		};

	timerDiv.id = 'wrcr-task-timer';
	timerDiv.setAttribute('style', 'position: fixed; bottom: 0; right: 0; padding: 16px 32px; z-index: 9999; background-color: #333; background-color: rgba(0,0,0,0.6); color: #CCC; font: normal normal bold 72px/72px inconsolata, consolas, monospace;');
	timerDiv.innerHTML = '0:00';
	body.appendChild(timerDiv);

	setTimeout(updateTimer, 1000);

})();
