'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map;
let mapEvent;
let workouts = [];
// classes
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration, type){
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.type = type;
  }
} 

class Running extends Workout {
  constructor(coords, distance, duration, type, cadence) {
    super(coords, distance, duration, type);
    this.cadence = cadence
    this.calcPace();
    this.setDescription();
  }
  calcPace() {
    this.pace = Number((this.duration / this.distance).toFixed(2));
  }
  setDescription() {
    this.description = `${this.type} on ${this.date.toDateString()}`
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, type, elevationGain) {
    super(coords, distance, duration, type);
    this.elevationGain = elevationGain;
    this.calcPace();
    this.setDescription();
  }
  calcPace() {
    this.pace = Number((this.distance / this.duration).toFixed(2));
  }
  setDescription() {
    this.description = `${this.type} on ${this.date.toDateString()}`
  }
}
//const run1 = new Running([39, -12], 5.2, 24, 178);
//const cycle1 = new Cycling([39, -12], 27, 95, 523);
//console.log(run1, cycle1);
navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const coords = [latitude, longitude]
      //console.log(`https://www.google.com/maps/@${latitude},${longitude},13z`);
      map = L.map('map').setView(coords, 13);
      //console.log(map);
      map.on("click", function(mapE){
        mapEvent = mapE
        form.classList.remove("hidden");
        inputDistance.focus();
        console.log(mapEvent);
        
        
      })
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      L.marker(coords).addTo(map)
          .bindPopup('A pretty CSS popup.<br> Easily customizable.')
          .openPopup();
    const data = JSON.parse(localStorage.getItem("workouts"))
if (data) {
  workouts = data
  console.log(data)
}

let html;
for (let workout of workouts) {
  let lat = workout.coords[0];
  let lng = workout.coords[1];
  if (workout.type === "Running") {
    html = `<li class="workout workout--running" data-id="${workout.id}">
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🏃‍♂️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.pace}</span>
  <span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">🦶🏼</span>
  <span class="workout__value">${workout.cadence}</span>
  <span class="workout__unit">spm</span>
</div>
</li>`
  } else if (workout.type === Cycling) {
    html = `<li class="workout workout--cycling" data-id="${workout.id}">
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🚴‍♀️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.pace}</span>
  <span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⛰</span>
  <span class="workout__value">${workout.elevationGain}</span>
  <span class="workout__unit">m</span>
</div>
</li> -->`
  }
  form.insertAdjacentHTML("afterend", html);

  L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({
      maxWidth:250,
      minWidth:100,
      autoClose:false,
      closeOnClick:false,
      className:'running-popup',
    }))
    .setPopupContent('Workout')
    .openPopup();            

  }

    },
    function () {
      alert("Could not get position.");
    }
  )


form.addEventListener("submit", function(e){
  e.preventDefault();
  if (typeof distance === "number" && typeof duration === "number"){
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const lat = mapEvent.latlng.lat;
    const lng = mapEvent.latlng.lng;
    const coords = [lat, lng];
    let workout;
    let html
  }

  if (type === "Running") {
    const cadence = Number(inputCadence.value);
    workout = new Running(coords, distance, duration, type, cadence);
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    html = `<li class="workout workout--running" data-id="${workout.id}">
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🏃‍♂️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.pace}</span>
  <span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">🦶🏼</span>
  <span class="workout__value">${workout.cadence}</span>
  <span class="workout__unit">spm</span>
</div>
</li>`
  }

  if (type === "Cycling") {
    const elevation = +inputElevation.value;
    workout = new Cycling(coords, distance, duration, type, elevation);
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    html = `<li class="workout workout--cycling" data-id="${workout.id}">
<h2 class="workout__title">${workout.description}</h2>
<div class="workout__details">
  <span class="workout__icon">🚴‍♀️</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${workout.pace}</span>
  <span class="workout__unit">km/h</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⛰</span>
  <span class="workout__value">${workout.elevationGain}</span>
  <span class="workout__unit">m</span>
</div>
</li> -->`
  }

  L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({
      maxWidth:250,
      minWidth:100,
      autoClose:false,
      closeOnClick:false,
      className:"running-popup",
    }))
    .setPopupContent("Workout")
    .openPopup();
form.reset();
form.classList.add("hidden")



form.insertAdjacentHTML("afterend", html);
})
inputType.addEventListener("change", function() {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
})

containerWorkouts.addEventListener("click", function(e) {
  const workoutEl = e.target.closest(".workout");
  if (!workoutEl) return;

  const workout = workouts.find((work) => work.id === workoutEl.dataset.id);
  map.setView(workout.coords, 13, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
  

})