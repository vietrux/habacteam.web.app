import useDocumentTitle from "../OtherFunc/useDocumentTitle"
import { Link } from "react-router-dom";
export default function CfsBoxRule() {
  useDocumentTitle("Nội quy của Confession Box");
  return (
    <>
      <div className=" overflow-auto h-screen">
        <div className=" text-center py-4 mt-32 sm:mt-0">
          <h1 className="text-2xl">Nội quy của Confession Box</h1>
        </div>
        <div className=" px-16 py-8 sm:px-16 mb-2">
          <p className="text-lg font-semibold text-center pb-2 pt-4">Đang cập nhật...</p>

        </div>
        <Link to="/u/cfsbox" className="block text-center py-2 px-4 bg-red-500 hover:bg-red-700 text-white mx-auto rounded-lg mb-20">
          Quay lại
        </Link>
      </div>
    </>
  )
}