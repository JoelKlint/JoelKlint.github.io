// TODO: Load in locale
moment.locale('sv')

// Instagram data holder
var INSTAGRAM_DATA = []

var feed_1_complete = false
var feed_2_complete = false

var feed_1 = new Instafeed({
  accessToken: '175263329.1ba3392.5cdc418e79ef4f05afb372bc4f303899',
  get: 'user',
  userId: '175263329',
  mock: true,
  filter: function (image) {
    return false
  },
  success: function (data) {
    INSTAGRAM_DATA = INSTAGRAM_DATA.concat(data.data)
    console.info("Instagram fetch 1 complete")
    feed_1_complete = true
  },
  error: function (err) {
    feed_1_complete = true
  }
});

var feed_2 = new Instafeed({
  accessToken: '195347414.1ba3392.5f4f51c323634a37948d72d79816c053',
  get: 'user',
  userId: '195347414',
  mock: true,
  filter: function (image) {
    return false
  },
  success: function (data) {
    INSTAGRAM_DATA = INSTAGRAM_DATA.concat(data.data)
    console.info("Instagram fetch 2 complete")
    feed_2_complete = true
  },
  error: function (err) {
    feed_2_complete = true
  }
});

function render_one_image(image_object) {
  // Container
  var container_tag = document.createElement("div")
  container_tag.className = 'row justify-content-md-center'

  // Base
  var div_tag = document.createElement("div")
  div_tag.className = 'col-12 col-lg-8 col-xl-7 insta-entry'
  container_tag.appendChild(div_tag)

  // date
  var date_tag = document.createElement("div")
  var local_time = moment.unix(image_object.created_time)
  date_tag.style = 'font-size: 30px;'
  date_tag.innerText = local_time.format("dddd D MMMM")
  div_tag.appendChild(date_tag)

  // clickable link
  var a_tag = document.createElement("a");
  a_tag.setAttribute('href', image_object.link)
  div_tag.appendChild(a_tag)

  // image
  var img_object = image_object.images.standard_resolution
  var img_tag = document.createElement("img")
  img_tag.setAttribute('src', img_object.url)
  // img_tag.className = 'img-fluid'
  img_tag.style = 'width: 100%;'
  a_tag.appendChild(img_tag)

  // caption
  var caption_tag = document.createElement("div")
  caption_tag.innerText = image_object.caption.text
  div_tag.appendChild(caption_tag)

  // Add everything to DOM
  var baseDiv = document.getElementById("instafeed")
  baseDiv.appendChild(container_tag)
}

function render_all_images() {
  var renderer = setInterval(() => {
    if (feed_1_complete === true && feed_2_complete === true) {
      // Clear interval so it will not render several times
      clearInterval(renderer)

      // Filter away photos older than start of travel date
      INSTAGRAM_DATA = INSTAGRAM_DATA.filter(img => moment.unix(img.created_time).isAfter('2018-01-05'))

      // Sort data in time order
      INSTAGRAM_DATA.sort((a, b) => a.created_time < b.created_time)

      // Clear base div
      var baseDiv = document.getElementById("instafeed")
      while (baseDiv.firstChild) {
        baseDiv.removeChild(baseDiv.firstChild)
      }

      // Render all objects
      INSTAGRAM_DATA.map((data_point) => render_one_image(data_point))
    }
    else {
      console.info("Instagram fetch not complete")
    }
  }, 100)
}

function set_times() {
  var current_time = moment()

  // Set swedish time
  var sv_tag =  document.getElementById("swedish-time")
  sv_tag.innerText = current_time.tz('Europe/Stockholm').format("dddd HH:mm")

  // Set travel time
  var travel_tag = document.getElementById("travel-time")
  travel_tag.innerText = current_time.tz('Asia/Ho_Chi_Minh').format("dddd HH:mm")
}

function set_doing_text() {
  // Set up all activities
  var activities_for_hour = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    '10': [],
    '11': [],
    '12': [],
    '13': [],
    '14': [],
    '15': [],
    '16': [],
    '17': [],
    '18': [],
    '19': ['äter', 'vilar'],
    '20': [],
    '21': [],
    '22': [],
    '23': []
  }

  // Pick the ones relevant for this hour
  var activities = activities_for_hour[moment().hour()]

  // Get one activity
  var activity = activities[Math.floor(Math.random()*activities.length)]

  var text = "Just nu " + activity + ' vi kanske'
  document.getElementById("doing_now").innerText = text
}

window.onload = function () {

  set_times()

  set_doing_text()

  // Start instagram getters
  feed_1.run();
  feed_2.run();

  render_all_images()

}
