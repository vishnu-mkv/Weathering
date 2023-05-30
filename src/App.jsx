import { useEffect, useState } from "react";
import { fetchWeather } from "./utils";
import moment from "moment";

function Detail({ data: today }) {
  return (
    <div id="detail">
      <div className="mx-auto w-fit flex items-center">
        <img
          src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
          alt=""
          className="inline aspect-square h-20"
        />
        <span className="text-2xl font-bold"> {today.main.temp}° C </span>
      </div>
      <div class="flex flex-wrap justify-center items-center gap-5">
        <WeatherInfo title="Wind Speed" value={`${today.wind.speed} km/hr`} />
        <WeatherInfo
          title="Feels like"
          value={`${today.main.feels_like} ° C`}
        />
        <WeatherInfo title="Humidity" value={`${today.main.humidity} g.m-3`} />
        <WeatherInfo title="Pressure" value={`${today.main.pressure} hPa`} />
        <WeatherInfo title="Maximum" value={`${today.main.temp_min} ° C`} />
        <WeatherInfo title="Minimum" value={`${today.main.temp_max} ° C`} />
        <WeatherInfo title="Sea Level" value={`${today.main.sea_level} m`} />
        <WeatherInfo
          title="Ground Level"
          value={`${today.main.grnd_level} m`}
        />
      </div>
    </div>
  );
}

function WeatherInfo({ title, value }) {
  return (
    <div className="p-3 text-center rounded-md bg-slate-200 bg-opacity-20 grow w-[140px] h-[80px]">
      <span className="text-lg font-semibold text-gray-900">{value}</span>
      <br />
      <span className="text-base text-gray-700">{title}</span>
    </div>
  );
}

function Forecasts({ data }) {
  const content = Object.values(data).map((val, i) => {
    if (i === 0) return null;
    return (
      <div
        key={val.date}
        className="weather text-center p-3 grow bg-blue-300 bg-opacity-10 rounded-md"
      >
        <h2 className="text-lg font-bold">{val.date}</h2>
        <img src={val.icon} className="aspect-square w-12 mx-auto" alt="" />
        <div className="space-y-1">
          <h1>{val.weather}</h1>
          <div className="space-x-1 text-sm text-gray-600">
            <span>{val.min}°</span> - <span>{val.max}°</span> <br />
            {/* <span className="text-xs">
              Around {moment(val.dt_txt).format("HH:mm A")}
            </span> */}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <h2 className="mt-14 my-5 font-semibold text-center p-3 bg-slate-700 rounded text-gray-200">
        5-Day Forecasts
      </h2>
      <div
        id="days"
        className="flex gap-3 flex-wrap items-center justify-between"
      >
        {content}
      </div>
    </div>
  );
}

function TimeDisplay() {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-sm text-gray-600">
      {time.format("dddd, MMMM Do YYYY")} {time.format("h:mm:ss A")}
    </span>
  );
}

function App() {
  const [city, setCity] = useState("chennai");
  const [data, setData] = useState(null);

  useEffect(() => {
    // use fetchWeather
    fetchWeather(city).then((data) => setData(data));
  }, [city]);

  if (!data) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen grid items-center"
      style={{
        backgroundImage: `url(https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?cs=srgb&dl=pexels-pixabay-209831.jpg&fm=jpg)`,
      }}
    >
      <div className="bg-white bg-opacity-40 backdrop-blur-md drop-shadow-lg mx-auto p-3 sm:p-5 rounded-md space-y-5 max-w-[750px] md:my-3">
        <div className="text-xl my-3">
          <span>Currently in </span>
          <select
            name=""
            id="input"
            className="bg-transparent outline-none font-bold"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="chennai">Chennai</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="kolkata">Kolkata</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="ahmedabad">Ahmedabad</option>
            <option value="pune">Pune</option>
          </select>
        </div>
        <TimeDisplay />
        <Detail data={data.today} />
        <Forecasts data={data.summary} />
      </div>
    </div>
  );
}

export default App;
