const API_KEY = "54863d221db85b9338b326f57a78298f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

async function fetchWeather(city) {
  const url = buildURL(city);
  const response = await fetch(url);
  const data = await response.json();
  const weather = await data;
  return processData(weather);
}

function buildURL(query) {
  const searchParams = new URLSearchParams({
    q: query,
    appid: API_KEY,
    units: "metric",
  });

  return BASE_URL + "?" + searchParams.toString();
}

function processData(data) {
  const list = data.list;
  const obj = {};
  const currentKey = moment().format("YYYY-MM-DD");

  //   date key - list of entries for the date
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const date = item.dt_txt.split(" ")[0];
    if (obj[date] === undefined) {
      obj[date] = [];
    }
    obj[date].push(item);
  }

  //   for each date select the nearest time greater than current time
  const perDay = {};

  Object.keys(obj).forEach((key) => {
    // if today then select the nearest time greater than current time
    if (key === currentKey) {
      perDay[key] = obj[key][0];
      for (let i = 1; i < obj[key].length; i++) {
        const item = obj[key][i];

        // compare and set by absolute difference
        if (
          Math.abs(moment().diff(moment(item.dt_txt))) <
          Math.abs(moment().diff(moment(perDay[key].dt_txt)))
        ) {
          perDay[key] = item;
        }
      }

      return;
    }
    // else select entry at or after 9:00:00

    for (let i = 0; i < obj[key].length; i++) {
      const item = obj[key][i];
      const time = item.dt_txt.split(" ")[1];
      if (time >= "09:00:00") {
        perDay[key] = item;
        return;
      }
    }

    perDay[key] = obj[key][obj[key].length - 1];
  });

  const summary = {};

  //   for each select min, max, current temp, weather, icon
  Object.keys(perDay).forEach((key) => {
    // reduce for min and mx temperature

    const minmax = obj[key].reduce(
      (acc, item) => {
        if (item.main.temp_min < acc.min) {
          acc.min = item.main.temp_min;
        }

        if (item.main.temp_max > acc.max) {
          acc.max = item.main.temp_max;
        }

        return acc;
      },
      { min: Infinity, max: -Infinity }
    );

    summary[key] = {
      min: minmax.min,
      max: minmax.max,
      current: perDay[key].main.temp,
      weather: perDay[key].weather[0].main,
      icon: `https://openweathermap.org/img/wn/${perDay[key].weather[0].icon}@2x.png`,
      wind: perDay[key].wind.speed,
      date: moment(perDay[key].dt_txt).format("dddd"),
      dt_txt: perDay[key].dt_txt,
    };
  });

  return { today: perDay[currentKey], summary };
}

async function handleLocation(val) {
  const { today, summary } = await fetchWeather(val);

  const daysContainer = document.getElementById("days");

  let content = "";
  Object.values(summary).forEach((val, i) => {
    if (i == 0) return;
    content += `
        <div class="weather text-center p-3 grow bg-blue-300 bg-opacity-10 rounded-md">
          <h2 class="text-lg font-bold">${val.date}</h2>
          <img
            src="${val.icon}"
            class="aspect-square w-12 mx-auto"
            alt=""
          />
          <div class="space-y-1">
            <h1 class="">${val.weather}</h1>
            <div class="space-x-1 text-sm text-gray-600">
              <span>${val.min}°</span> - <span>${val.max}°</span>
            </div>
          </div>
        </div>
        `;
  });

  const todayContainer = document.getElementById("detail");

  todayContainer.innerHTML = `
  <div class="mx-auto w-fit flex items-center">
    <img
        src="${`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}"
        alt=""
        class="inline aspect-square h-20"
    />
    <span class="text-2xl font-bold text-primary"> ${today.main.temp}° C </span>
  </div>
        <div class="flex flex-wrap justify-center items-center gap-5">
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
            <span class="text-lg font-semibold text-gray-900"> ${
              today.wind.speed
            } km/hr </span> <br />
            <span class="text-md text-gray-700">Wind Speed</span>
        </div>
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.feels_like
        } ° C</span> <br />
        <span class="text-md text-gray-700">Feels like</span>
        </div>
        
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.humidity
        } g.m-3</span> <br />
        <span class="text-md text-gray-700">Humidity</span>
        </div>
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.pressure
        } hPa</span> <br />
        <span class="text-md text-gray-700">Pressure</span>
        </div>
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.temp_min
        } ° C</span> <br />
        <span class="text-md text-gray-700">Maximum</span>
        </div>
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.temp_max
        } ° C</span> <br />
        <span class="text-md text-gray-700">Minimum</span>
        </div>
        <div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.sea_level
        } m</span> <br />
        <span class="text-md text-gray-700">Sea Level</span>
        </div><div class="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[120px] h-[80px]">
        <span class="text-lg font-semibold text-gray-900"> ${
          today.main.grnd_level
        } m</span> <br />
        <span class="text-md text-gray-700">Ground Level</span>
        </div>
        </div>`;

  daysContainer.innerHTML = content;
}

document
  .getElementById("input")
  .addEventListener("change", (e) => handleLocation(e.target.value));

handleLocation("chennai");
