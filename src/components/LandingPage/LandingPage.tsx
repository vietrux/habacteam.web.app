import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function LandingPage() {
  useDocumentTitle("Trang chu");
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex h-[50px] ">
          <i className="fa-duotone fa-photo-film-music fa-lg animate-bounce mx-4"></i>
          <i className="fa-duotone fa-radio fa-lg animate-bounce mx-4"></i>
          <i className="fa-duotone fa-messages fa-lg animate-bounce mx-4"></i>
        </div>
        <h1 className="font-bold text-[48px] sm:text-[62px] mb-4">HaBacTeam</h1>
        <p className="text-sm mx-4 px-2 text-center">The only media team that is legally allowed to operate in the Ha Bac high school</p>
      </div>
    </>
  )
}