import { Link } from "react-router-dom"
import Logo from "../../Assets/LogoWithoutBg.svg"
export default function LeftSideBar() {
  return (
    <>
      <div className="h-screen col-span-1 sm:grid sm:grid-rows-3 border-r border-gray-200 bg-white hidden">
        <div className=" grid place-content-center">
          <img src={Logo} alt="logo" className="w-4/6 h-auto mx-auto rounded-[20%] shadow-lg shadow-gray-400" />
          <h1 className="mt-6 mb-2 mx-auto font-bold text-center text-2xl text-slate-700">Ha Bac Team</h1>
          <p className="text-sm mx-auto text-center text-slate-500">News &amp; Entertainment</p>
        </div>
        <div className="flex flex-col">
          <div className="w-4/5 border-b border-slate-300 text-center mx-auto"></div>
          <div className="flex flex-col mx-auto my-6">
            <Link to="/" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <i className="fa-regular fa-house fa-lg"></i> <span className="ml-2">Trang chủ</span>
            </Link>
            <Link to="/hmc" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <i className="fa-regular fa-photo-film-music fa-lg"></i> <span className="ml-2">HMC</span>
            </Link>
            <Link to="/hr" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <i className="fa-regular fa-radio fa-lg"></i> <span className="ml-2">HR</span>
            </Link>
            <Link to="/g/cfsbox" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <i className="fa-regular fa-messages fa-lg"></i>  <span className="ml-2">Confession Box</span>
            </Link>
          </div>
          <div className="w-4/5 border-b border-slate-300 text-center mx-auto"></div>
        </div>
        {/* <div className="fixed bottom-0">
          <p className="mx-auto text-center text-slate-500">@2022 Ha Bac Media Club</p>
          <p className="mx-auto text-[12px] text-center mb-4 text-slate-500">https//habacteam.web.app</p>
        </div> */}
      </div>
    </>
  )
}