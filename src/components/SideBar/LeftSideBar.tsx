import { Link } from "react-router-dom"
import Logo from "../../Assets/LogoWithBg.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
export default function LeftSideBar() {
  return (
    <>
      <div className="h-screen col-span-1 sm:grid sm:grid-rows-3 border-r border-gray-200 bg-white hidden">
        <div className=" grid place-content-center">
          <img src={Logo} alt="logo" className="w-2/5 h-auto mx-auto rounded-full shadow-lg shadow-gray-400" />
          <h1 className="mt-6 mb-2 mx-auto font-bold text-center text-2xl text-slate-700">Ha Bac Media Club</h1>
          <p className="text-sm mx-auto text-center text-slate-500">News &amp; Media</p>
        </div>
        <div className="flex flex-col">
          <div className="w-4/5 border-b border-slate-300 text-center mx-auto"></div>
          {/* <h1 className="h-auto mt-4 mx-auto text-center font-bold text-lg"></h1> */}
          <div className="flex flex-col mx-auto my-6">
            <Link to="/" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <FontAwesomeIcon icon={regular('compass')} size="lg" /> <span className="ml-2">Trang chủ</span>
            </Link>
            <Link to="/u/register" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <FontAwesomeIcon icon={regular('address-card')} size="lg" /> <span className="ml-2">Đăng ký</span>
            </Link>
            <Link to="/g/cfsbox" className="my-2 p-2 text-slate-600 hover:text-green-900 font-semibold">
              <FontAwesomeIcon icon={regular('comments')} size="lg" />  <span className="ml-2">Confession Box</span>
            </Link>
          </div>
          <div className="w-4/5 border-b border-slate-300 text-center mx-auto"></div>
        </div>
        <div className="grid content-end">
          <p className="mx-auto text-center text-slate-500">@2022 Ha Bac Media Club</p>
          <p className="mx-auto text-[12px] text-center mb-4 text-slate-500">https//habacteam.web.app</p>
        </div>
      </div>
    </>
  )
}