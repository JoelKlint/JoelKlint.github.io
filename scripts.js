// TODO: Load in locale
moment.locale('sv')
var TRAVEL_TIME_ZONE = 'Asia/Ho_Chi_Minh'

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
  console.log(image_object)
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
  date_tag.style = 'font-size: 30px; padding-left: 10px; padding-right: 10px;'
  date_tag.innerText = local_time.format("dddd D MMMM")
  div_tag.appendChild(date_tag)

  if (image_object.carousel_media) {
    /**
     * Carousel with all images
    */

    var carousel_tag = document.createElement('div')
    carousel_tag.id = image_object.id
    carousel_tag.className = 'carousel slide'
    carousel_tag.setAttribute('data-ride', 'carousel')

    var indicators_tag = document.createElement('ol')
    indicators_tag.className = 'carousel-indicators'
    carousel_tag.appendChild(indicators_tag)

    var inner_tag = document.createElement('div')
    inner_tag.className = 'carousel-inner'
    carousel_tag.appendChild(inner_tag)

    var click_link = image_object.link
    var FIRST_IN_CAROUSEL = true
    var CAROUSEL_INDEX = 0
    image_object.carousel_media.map(img_object => {

      /**
       * The control
       */
      var li_tag = document.createElement('li')
      li_tag.setAttribute('data-target', '#' + image_object.id)
      li_tag.setAttribute('data-slide-to', CAROUSEL_INDEX++)
      if (FIRST_IN_CAROUSEL) {
        li_tag.className = 'active'
      }
      indicators_tag.appendChild(li_tag)


      /**
       * The slide
       */
      var item_tag = document.createElement('div')
      item_tag.className = 'carousel-item'
      if (FIRST_IN_CAROUSEL) {
        item_tag.className += ' active'
      }

      var a_tag = document.createElement('a')
      a_tag.setAttribute('href', click_link)
      item_tag.appendChild(a_tag)

      var img_url = img_object.images.standard_resolution.url
      var img_tag = document.createElement('img')
      img_tag.className = 'd-block w-100'
      img_tag.setAttribute('src', img_url)
      a_tag.appendChild(img_tag)

      inner_tag.appendChild(item_tag)

      FIRST_IN_CAROUSEL = false
    })
    /**
     * Previous button
     */
    var prev_tag = document.createElement('a')
    prev_tag.className = 'carousel-control-prev'
    prev_tag.setAttribute('href', '#' + image_object.id)
    prev_tag.setAttribute('role', 'button')
    prev_tag.setAttribute('data-slide', 'prev')

    var prev_child_tag = document.createElement('span')
    prev_child_tag.className = 'carousel-control-prev-icon'
    prev_child_tag.setAttribute('aria-hidden', 'true')
    prev_tag.appendChild(prev_child_tag)

    prev_child_tag = document.createElement('span')
    prev_child_tag.className = 'sr-only'
    prev_child_tag.innerText = 'Previous'
    prev_tag.appendChild(prev_child_tag)

    carousel_tag.appendChild(prev_tag)

    /**
     * Next button
     */
    var next_tag = document.createElement('a')
    next_tag.className = 'carousel-control-next'
    next_tag.setAttribute('href', '#' + image_object.id)
    next_tag.setAttribute('role', 'button')
    next_tag.setAttribute('data-slide', 'next')

    var next_child_tag = document.createElement('span')
    next_child_tag.className = 'carousel-control-next-icon'
    next_child_tag.setAttribute('aria-hidden', 'true')
    next_tag.appendChild(next_child_tag)

    next_child_tag = document.createElement('span')
    next_child_tag.className = 'sr-only'
    next_child_tag.innerText = 'Next'
    next_tag.appendChild(next_child_tag)

    carousel_tag.appendChild(next_tag)

    div_tag.appendChild(carousel_tag)
  }
  else {
    /**
     * Only main image
     */
    // clickable link
    var click_link = image_object.link
    var a_tag = document.createElement("a");
    a_tag.setAttribute('href', click_link)
    div_tag.appendChild(a_tag)

    // image
    var img_object = image_object.images.standard_resolution
    var img_tag = document.createElement("img")
    img_tag.setAttribute('src', img_object.url)
    img_tag.style = 'width: 100%;'
    a_tag.appendChild(img_tag)
  }

  // caption
  var caption_tag = document.createElement("div")
  caption_tag.innerText = image_object.caption.text
  caption_tag.style = 'padding-left: 10px; padding-right: 10px; margin-top: 10px;'
  div_tag.appendChild(caption_tag)

  // Figure out if there is video
  var has_video = false
  if(image_object.carousel_media) {
    has_video = image_object.carousel_media.some(i => i.type === 'video')
  }
  else {
    has_video = image_object.type = 'video'
  }
  if(has_video) {
    var has_video_tag = document.createElement('div')
    has_video_tag.innerText = 'Innehåller video, klicka på bilden för att se'
    has_video_tag.style = 'padding-left: 10px; padding-right: 10px; font-style: italic; margin-top: 10px;'
    div_tag.appendChild(has_video_tag)
  }

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
  var sv_tag = document.getElementById("swedish-time")
  sv_tag.innerText = current_time.tz('Europe/Stockholm').format("dddd HH:mm")

  // Set travel time
  var travel_tag = document.getElementById("travel-time")
  travel_tag.innerText = current_time.tz(TRAVEL_TIME_ZONE).format("dddd HH:mm")
}

function set_doing_text() {
  // Set up all activities
  var activities_for_hour = {
    '0': ['sover vi'],
    '1': ['sover vi'],
    '2': ['sover vi'],
    '3': ['sover vi'],
    '4': ['sover vi'],
    '5': ['sover vi'],
    '6': ['sover vi'],
    '7': ['sover vi'],
    '8': ['sover vi'],
    '9': ['äter vi frukost', 'planerar vi dagen'],
    '10': ['äter vi frukost', 'planerar vi dagen'],
    '11': ['äter vi frukost', 'planerar vi dagen', 'är vi på utflykt'],
    '12': ['är vi på utflykt', 'badar vi'],
    '13': ['äter vi lunch'],
    '14': ['äter vi lunch'],
    '15': ['är vi på utflykt', 'badar vi', 'upptäcker vi något'],
    '16': ['är vi på utflykt', 'badar vi', 'upptäcker vi något'],
    '17': ['är vi på utflykt', 'badar vi', 'upptäcker vi något'],
    '18': ['upptäcker vi något', 'kollar vi på solgången'],
    '19': ['äter vi middag', 'upptäcker vi något'],
    '20': ['äter vi middag', 'upptäcker vi något'],
    '21': ['spelar vi spel', 'dricker vi öl', 'hänger vi med andra backpackers'],
    '22': ['spelar vi spel', 'dricker vi öl', 'hänger vi med andra backpackers'],
    '23': ['spelar vi spel', 'dricker vi öl', 'hänger vi med andra backpackers'],
  }

  // Pick the ones relevant for this hour
  var activities = activities_for_hour[moment().tz(TRAVEL_TIME_ZONE).hour()]

  // Get one activity
  var activity = activities[Math.floor(Math.random() * activities.length)]

  var text = "Just nu " + activity + ' förmodligen'
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
