import { useEffect, useMemo, useState } from "react";
type WeatherType = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
type RightSideBarProps = {
  weather: WeatherType;
  about: string;
  fan_count: {
    hmc_fan_count: number;
    hr_fan_count: number;
  };
  isopen: boolean;
}
export default function RightSideBar(props: RightSideBarProps) {
  const [time, setTime] = useState("");
  const [icon_url, setIcon_url] = useState("");
  //create clock
  const createClock = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const time = `${hours}:${minutes}:${seconds}`;
    return time;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(createClock());
    }, 1000);
    return () => clearInterval(interval);
  }
    , [])
  var date = new Date()
  var date_time = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  const weather = useMemo(() => {
    return props.weather;
  }
    , [props.weather])

  useEffect(() => {
    function getWeatherIcon() {
      if (weather.weather) {
        return `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/` + weather?.weather[0]?.icon + `.svg`;
      }
      return "";
    }
    setIcon_url(getWeatherIcon());
  }, [weather])
  return (
    <>
      <div className={
        props.isopen ? "flex flex-col p-8 absolute top-0 left-0 bg-white sm:static w-screen sm:w-auto" : "sm:flex flex-col p-8 hidden"
      }>
        <div className="p-8 pb-0 bg-red-300 text-lg h-full rounded-2xl shadow-2xl shadow-slate-400 my-4 hidden 2xl:block">
          <h1 className="text-xl font-bold mb-2">Mô tả:</h1>
          <p>{props.about}</p>
          <p className="text-right mt-2 italic">- HaBacTeam -</p>
        </div>
        {/* <a href="https://www.facebook.com/habacmediaclub" className="p-8 bg-purple-800 text-lg rounded-2xl shadow-2xl shadow-slate-400 my-4 text-center">
          <div className="w-4 inline-block mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg>
          </div>
          <span className="text-white font-bold">Hà Bắc Media Club</span>
        </a> */}
        <div className=" flex bg-yellow-400 rounded-2xl shadow-2xl shadow-slate-400 p-4 py-8 text-center">
          <img src={icon_url} alt="" className="mx-auto w-16 " />
          <div>
            <h1 className="text-2xl font-bold mb-2 text-black">{weather?.name}</h1>
            <p className="text-lg font-bold text-black">{weather?.main?.temp} ℃</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-2 my-4 text-white ">
          <a href="https://www.facebook.com/habacmediaclub" className="bg-blue-600 rounded-2xl shadow-2xl shadow-slate-400 p-4 py-8">
            <p className="text-center text-lg">Số lượt thích trang</p>
            <p className="text-center text-[48px] font-bold ">{props.fan_count.hmc_fan_count}</p>
            <p className="text-center text-sm">HaBacMedia</p>
          </a>
          <a href="https://www.facebook.com/habac.radio" className="bg-purple-900 rounded-2xl shadow-2xl shadow-slate-400 p-4 py-8">
            <p className="text-center text-lg">Số lượt thích trang</p>
            <p className="text-center text-[48px] font-bold ">{props.fan_count.hr_fan_count}</p>
            <p className="text-center text-sm">HaBacRadio</p>
          </a>

        </div>
        <div className="bg-rose-900 rounded-2xl shadow-2xl shadow-slate-400 p-4 text-center text-white py-8 my-4 mb-24 sm:mb-0">
          <h1 className="">{date_time}</h1>
          <p className="text-[32px] font-bold">{time}</p>
        </div>
      </div>
    </>
  )
}