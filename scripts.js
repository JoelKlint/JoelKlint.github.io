// TODO: Load in locale
moment.locale('sv')
var MEET_TIME_ZONE = 'Europe/Stockholm'

var MEETUP_TIME

function prepend(val) {
  var copy_val = ''+val
  while(copy_val.length < 2) {
    copy_val = '0' + copy_val
  }
  return copy_val
}

function set_times() {
  var current_time = moment()

  var remaining_time = moment.duration(MEETUP_TIME.diff(current_time))

  var days = remaining_time.days()
  var hours = remaining_time.hours()
  var minutes = remaining_time.minutes()
  var seconds = remaining_time.seconds()

  document.getElementById("days").innerText = prepend(days)
  document.getElementById("hours").innerText = prepend(hours)
  document.getElementById("minutes").innerText = prepend(minutes)
  document.getElementById("seconds").innerText = prepend(seconds)
}

function fire_entry_animation() {
  var wrapper = document.getElementById("joelin-img")
  wrapper.style.transform = 'scale(1.0)'
  wrapper.style.opacity = '1'

  wrapper = document.getElementById("countdown")
  wrapper.style.transform = 'translate(0px, 0px)'
  wrapper.style.opacity = '1'
}

window.onload = function () {
  format = 'DD-MM-YYYY HH:mm:ss'
  MEETUP_TIME = moment.tz('22-08-2018 12:20:00', format, MEET_TIME_ZONE)

  fire_entry_animation()

  set_times()
  setInterval(set_times, 1000)

  document.getElementById('joelin-img').ondragstart = function() { return false; };

}
