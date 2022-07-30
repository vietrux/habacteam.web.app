
import Logo from "../../../Assets/LogoWithoutBg.svg"
import { Link } from "react-router-dom"
import useDocumentTitle from "../../OtherFunc/useDocumentTitle";
export default function DraftLandingpage() {
  useDocumentTitle("Trang chủ");
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-1 w-screen h-screen box-border place-content-center place-items-center bg-[url(https://cdn-zeta-ecru.vercel.app/img/clouds-twilight-times.jpg)] bg-cover">
        <div className="w-3/4 h-3/4  backdrop-blur-[7px] shadow-2xl shadow-slate-900 bg-pink-500 bg-opacity-40">
          <img src={Logo} alt="logo" className="w-36 sm:w-48 m-auto grayscale brightness-[10] rounded-2xl drop-shadow-2xl shadow-black" />
          <div className="w-full text-center mt-4">
            <h1 className="text-white text-[36px] sm:text-[48px] drop-shadow-2xl shadow-black font-bold text-center">Ha Bac Media Club</h1>
          </div>
          <div className="w-full text-center mt-2">
            <p className="text-white text-[12px] sm:text-[16px] drop-shadow-2xl shadow-black text-center">
              -Câu lạc bộ truyền thông trường THPT Hà Bắc-
            </p>
          </div>
          {/* <Link to="/u/register" className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white hover:font-semibold py-3 px-8  rounded-2xl">
              Đăng ký
            </Link> */}
          <div className="mt-8 w-full text-center">
            <Link to="/u/register" className="px-8 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white rounded">
              Đăng ký
            </Link>
          </div>
          <div className="absolute bottom-0 mb-2 w-full">
            <p className="text-xs text-white text-center">
              -HaBacTeam-
            </p>
            <p className="text-xs text-white text-center">
              <a href="https://www.facebook.com/habacmediaclub/" target="_blank" rel="noopener noreferrer" className="mx-2">
                Facebook
              </a>
              <a href="mailto:habacmediaclub@gmail.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                Gmail
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}