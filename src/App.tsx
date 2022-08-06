import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './fireConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import Logo from "./Assets/LogoWithoutBg.svg"

import Landingpage from './components/LandingPage/LandingPage';
import NoPage from './components/NoPage/NoPage';
import Register from './components/Register/Register';
import Departments from './components/Infomation/Departments';
import ListAnswer from './components/Register/ListAnswer';
import ConfessionBox from './components/ConfessionBox/ConfessionBox';
import ManageConfession from './components/ConfessionBox/ManageConfession';
import CfsBoxRule from './components/Infomation/CfsBox';
import EditConfession from './components/ConfessionBox/EditConfession';
import ListConfession from './components/ConfessionBox/ListConfession';

import LeftSideBar from './components/SideBar/LeftSideBar';
import RightSideBar from './components/SideBar/RightSideBar';

function App() {
  //type
  type FeedType = {
    data: Array<{
      message: string;
      permalink: string;
      full_picture: string;
      created_time: string;
      reactions: {
        data: Array<any>;
        paging: {
          cursor: {
            before: string;
            after: string;
          };
          next: string;
        }
        summary: {
          total_count: number;
        }
      }
      id: string;
    }>
    paging: {
      cursor: {
        before: string;
        after: string;
      };
      next?: string;
    }
  }
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
  type ConfessionBoxUser = {
    cfs_per_day: number;
    status: boolean;
  }
  //end type

  //state --------------------------------------------
  const [user, setUser] = useState<User>({} as User);
  const [about, setAbout] = useState("");
  const [fan_count, setFan_count] = useState(0);
  const [feed, setFeed] = useState({} as FeedType);
  const [weather, setWeather] = useState({} as WeatherType);
  const [isopen, setIsopen] = useState(false);

  //end_state --------------------------------------------

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        //
      }
    });
  }, []);

  const provider = new GoogleAuthProvider();

  async function handleSign(isSignIn: boolean) {
    async function handleSignIn() {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const docRef = doc(db, "cfs-box-users", result.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // User already exists
          } else {
            setDoc(doc(db, "cfs-box-users", result.user.uid), {
              cfs_per_day: 0,
              status: true,
            } as ConfessionBoxUser);
          }
        }).catch((error) => {
          console.log(error.code, error.message);
        });
    }
    async function handleSignOut() {
      signOut(auth).then(() => {
        setUser({} as User);
      }).catch((error) => {
        console.log(error);
      });
    }
    switch (isSignIn) {
      case true:
        handleSignIn()
        break;
      case false:
        handleSignOut()
        break;
    }
  }

  useEffect(() => {
    async function getFacebookDataFromFirebase() {

      const docRef = doc(db, "facebook", "data");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAbout(docSnap.data().about)
        setFan_count(docSnap.data().fan_count)
        setFeed(docSnap.data().feed)
        //console.log("get data from firebase")
      } else {
        //console.log("No such document!");
      }
    }
    getFacebookDataFromFirebase();
  }, []);

  //get data of weather --------------------------------------------
  useEffect(() => {
    async function getWeather() {
      const ip_addr = await axios.get("https://api.ipify.org?format=json")

      //check if ip_addr is same as last ip_addr
      if (ip_addr.data.ip !== localStorage.getItem("ip_addr") || localStorage.getItem("lat") === null || localStorage.getItem("lon") === null) {
        localStorage.setItem("ip_addr", ip_addr.data.ip)
        const loc = await axios.get(`https://ipinfo.io/${ip_addr.data.ip}?token=d01df29be7f3b2`)
        const [lat, lon] = loc.data.loc.split(",")
        localStorage.setItem("lat", lat)
        localStorage.setItem("lon", lon)
      }
      const lat = localStorage.getItem("lat")
      const lon = localStorage.getItem("lon")
      const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=62841c9fd78f4f0c1a6cc542345b7c5d`)
      setWeather(weather.data)
    }
    getWeather()
  }, []);
  //end get data of weather --------------------------------------------

  return (
    <BrowserRouter>
      <div className="grid grid-cols-1 sm:grid-cols-[17%_auto_25%] place-items-between w-screen h-screen">
        <LeftSideBar />

        <div className='bg-white sm:rounded-r-[4%] sm:shadow-[20px_0_20px_5px_#d7d7d7]'>
          <div className='mx-auto text-center w-full sm:hidden bg-white rounded-2xl shadow-xl shadow-gray-200 p-4 fixed top-0'>
            <img src={Logo} alt="logo" className="w-1/6 h-auto mx-auto " />
          </div>
          <Routes>
            <Route path="/" element={<Landingpage feed={feed} />} />
            <Route path="/u/">
              <Route path="register" element={<Register />} />
              <Route path="total" element={<ListAnswer />} />
              <Route path="cfsbox" element={<ManageConfession user={user} isSignIn={
                (value:boolean) => {
                  handleSign(value)
                }
              }/>} />
              <Route path="editcfs/:id" element={<EditConfession user={user} isSignIn={
                (value:boolean) => {
                  handleSign(value)
                }
              }/>} />
            </Route>
            <Route path='/g/'>
              <Route path="i/">
                <Route path="departments" element={<Departments />} />
                <Route path="cfsbox" element={<CfsBoxRule />} />
              </Route>
              <Route path="cfsbox" element={<ConfessionBox user={user} isSignIn={
                (value:boolean) => {
                  handleSign(value)
                }
              }/>} />
            </Route>
            <Route path='/a/'>
              <Route path="cfsbox" element={<ListConfession user={user} isSignIn={
                (value:boolean) => {
                  handleSign(value)
                }
              }/>} />
            </Route>
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
        <RightSideBar weather={weather} about={about} fan_count={fan_count} isopen={isopen} />
        <div className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl shadow-slate-500 block sm:hidden rounded-lg">
          <div className="px-4 sm:p-6 flex justify-around">
            <Link to="/" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <FontAwesomeIcon icon={regular('compass')} size="lg" />
              <p className="text-[12px] font-normal">Trang chủ</p>
            </Link>
            <Link to="/u/register" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <FontAwesomeIcon icon={regular('address-card')} size="lg" />
              <p className="text-[12px] font-normal">Đăng ký</p>
            </Link>
            <Link to="/g/cfsbox" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <FontAwesomeIcon icon={regular('comments')} size="lg" />
              <p className="text-[12px] font-normal">Confession Box</p>
            </Link>
            <button onClick={
              () => {
                setIsopen(!isopen)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={"20px"} className="mx-auto fill-slate-600"><path d="M0 80C0 53.49 21.49 32 48 32H144C170.5 32 192 53.49 192 80V176C192 202.5 170.5 224 144 224H48C21.49 224 0 202.5 0 176V80zM48 176H144V80H48V176zM0 336C0 309.5 21.49 288 48 288H144C170.5 288 192 309.5 192 336V432C192 458.5 170.5 480 144 480H48C21.49 480 0 458.5 0 432V336zM48 432H144V336H48V432zM400 32C426.5 32 448 53.49 448 80V176C448 202.5 426.5 224 400 224H304C277.5 224 256 202.5 256 176V80C256 53.49 277.5 32 304 32H400zM400 80H304V176H400V80zM256 336C256 309.5 277.5 288 304 288H400C426.5 288 448 309.5 448 336V432C448 458.5 426.5 480 400 480H304C277.5 480 256 458.5 256 432V336zM304 432H400V336H304V432z" /></svg>
              <p className="text-[12px] font-normal">Khác</p>
            </button>
          </div>
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App;
