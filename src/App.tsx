import axios from 'axios';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Logo from "./Assets/LogoWithoutBg.svg";
import { auth, db } from './fireConfig';

import HMC from './components/LandingPage/HMC';
import HR from './components/LandingPage/HR';
import LandingPage from './components/LandingPage/LandingPage';
import NoPage from './components/NoPage/NoPage';
// import Register from './components/Register/Register';
import ConfessionBox from './components/ConfessionBox/ConfessionBox';
import EditConfession from './components/ConfessionBox/EditConfession';
import ListConfession from './components/ConfessionBox/ListConfession';
import ManageConfession from './components/ConfessionBox/ManageConfession';
import CfsBoxRule from './components/Infomation/CfsBox';
import Departments from './components/Infomation/Departments';
import ListAnswer from './components/Register/ListAnswer';

import LeftSideBar from './components/SideBar/LeftSideBar';
import RightSideBar from './components/SideBar/RightSideBar';

function App() {
  //type
  type FeedType = {
    data: Array<{
      attachments?: object,
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
  type UserData = {
    cfs_per_day: number;
    cfs_status: boolean;
    role: string;
    last_cf_time?: string;
  }
  //end type

  //state --------------------------------------------
  const [user, setUser] = useState<User>({} as User);
  const [userdata, setUserData] = useState<UserData>({} as UserData);
  const [hmc_about, setHmcAbout] = useState("");
  const [hmc_fan_count, setHmcFan_count] = useState(0);
  const [hmc_feed, setHmcFeed] = useState({} as FeedType);
  const [hr_fan_count, setHrFan_count] = useState(0);
  const [hr_feed, setHrFeed] = useState({} as FeedType);
  const [weather, setWeather] = useState({} as WeatherType);
  const [isopen, setIsopen] = useState(false);


  //end_state --------------------------------------------

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (user.uid) {
      const unsub = onSnapshot(doc(db, "users", user.uid || "a"), (doc) => {
        setUserData(doc.data() as UserData);
      });
      return () => {
        unsub();
      }
    }
  }, [user]);

  const provider = new GoogleAuthProvider();

  async function handleSign(isSignIn: boolean) {
    async function handleSignIn() {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const docRef = doc(db, "users", result.user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            setDoc(doc(db, "users", result.user.uid), {
              cfs_per_day: 0,
              cfs_status: true,
              role: "guest",
            } as UserData);
          }
        })
    }
    async function handleSignOut() {
      signOut(auth).then(() => {
        setUser({} as User);
      })
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

  //get facebook data from firebase --------------------------------------------
  useEffect(() => {
    async function getFacebookDataFromFirebase() {
      const docRef = doc(db, "facebook", "hmc");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHmcAbout(docSnap.data().about)
        setHmcFan_count(docSnap.data().fan_count)
        setHmcFeed(docSnap.data().feed)
      }
    }
    getFacebookDataFromFirebase();
  }, []);
  //end_get facebook data from firebase --------------------------------------------

  //get facebook data from firebase --------------------------------------------
  useEffect(() => {
    async function getFacebookDataFromFirebase() {
      const docRef = doc(db, "facebook", "hr");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHrFan_count(docSnap.data().fan_count)
        setHrFeed(docSnap.data().feed)
      }
    }
    getFacebookDataFromFirebase();
  }, []);
  //end_get facebook data from firebase --------------------------------------------

  //get data of weather --------------------------------------------
  useEffect(() => {
    async function getWeather() {
      const ip_addr = await axios.get("https://api.ipify.org?format=json")
      if (ip_addr.data.ip !== localStorage.getItem("ip_addr") || localStorage.getItem("lat") === null || localStorage.getItem("lon") === null || localStorage.getItem("region") === null) {
        localStorage.setItem("ip_addr", ip_addr.data.ip)
        const loc = await axios.get(`https://ipinfo.io/${ip_addr.data.ip}?token=d01df29be7f3b2`)
        const [lat, lon] = loc.data.loc.split(",")
        localStorage.setItem("lat", lat)
        localStorage.setItem("lon", lon)
        localStorage.setItem("region", loc.data.region)
      }
      const lat = localStorage.getItem("lat")
      const lon = localStorage.getItem("lon")
      const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=ccf21d971fb90f3441fc5f067d765217`)
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/u/">
              <Route path="register" element={
                <div className="w-full h-screen grid content-center text-center px-4 bg-white">
                  Xin lỗi, đã hết đợt đăng ký. Vui lòng quay lại sau.
                </div>
              } />
              <Route path="total" element={<ListAnswer />} />
              <Route path="cfsbox" element={<ManageConfession user={user} userdata={userdata} isSignIn={
                (value: boolean) => {
                  handleSign(value)
                }
              } />} />
              <Route path="editcfs/:id" element={<EditConfession user={user} userdata={userdata} isSignIn={
                (value: boolean) => {
                  handleSign(value)
                }
              } />} />
            </Route>
            <Route path='/g/'>

              <Route path="i/">
                <Route path="departments" element={<Departments />} />
                <Route path="cfsbox" element={<CfsBoxRule />} />
              </Route>
              <Route path="hmc" element={<HMC feed={hmc_feed} />} />
              <Route path="hr" element={<HR feed={hr_feed} />} />
              <Route path="cfsbox" element={<ConfessionBox user={user} userdata={userdata} isSignIn={
                (value: boolean) => {
                  handleSign(value)
                }
              } />} />
            </Route>
            <Route path='/a/'>
              <Route path="cfsbox" element={<ListConfession user={user} userdata={userdata} isSignIn={
                (value: boolean) => {
                  handleSign(value)
                }
              } />} />
            </Route>
            <Route path='*' element={<NoPage />} />
          </Routes>

        </div>
        <RightSideBar weather={weather} about={hmc_about} fan_count={{ hmc_fan_count, hr_fan_count }} isopen={isopen} />
        <div className="fixed inset-x-0 bottom-0 z-10 bg-white shadow-2xl shadow-slate-500 block sm:hidden rounded-lg">
          <div className="px-4 sm:p-6 grid grid-cols-5">
            <Link to="/" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <i className="fa-regular fa-house fa-lg"></i>
              <p className="text-[12px] font-normal">Trang chủ</p>
            </Link>
            <Link to="/g/hmc" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <i className="fa-regular fa-photo-film-music"></i>
              <p className="text-[12px] font-normal">Hmc</p>
            </Link>
            <Link to="/g/hr" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <i className="fa-regular fa-radio fa-lg"></i>
              <p className="text-[12px] font-normal">Hr</p>
            </Link>
            <Link to="/g/cfsbox" onClick={
              () => {
                setIsopen(false)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <i className="fa-regular fa-messages fa-lg"></i>
              <p className="text-[12px] font-normal">Cfs Box</p>
            </Link>
            <button onClick={
              () => {
                setIsopen(!isopen)
              }
            } className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold text-center">
              <i className="fa-regular fa-grid-2 fa-lg"></i>
              <p className="text-[12px] font-normal">Khác</p>
            </button>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
