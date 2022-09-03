import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function LandingPage() {
  useDocumentTitle("Trang chu");
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen ">
        <div className="flex h-[50px] ">
          <i className="fa-duotone fa-photo-film-music fa-2x mx-4"
          ></i>
          <i className="fa-duotone fa-radio fa-2x mx-4"></i>
          <i className="fa-duotone fa-messages fa-2x mx-4"></i>
        </div>
        <h1 className="font-bold text-[48px] sm:text-[62px] mb-4 font-['Cubano'] text-transparent bg-clip-text bg-gradient-to-r from-[#a12ea6] to-[#f2b062]">Ha Bac Team</h1>
        <p className="text-sm mx-4 px-2 text-center">The solely legal media team is allowed to operate in the Ha Bac high school.</p>
      </div>
    </>
  )
}