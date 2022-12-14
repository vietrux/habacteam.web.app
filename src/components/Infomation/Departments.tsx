import { Link } from "react-router-dom";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function Departments() {
  useDocumentTitle("Các ban trong HMC");
  return (
    <>
      <div className=" overflow-auto h-screen">
        <div className=" text-center py-4 mt-32 sm:mt-0">
          <h1 className="text-2xl">Các ban trong HMC</h1>
        </div>
        <div className=" px-16 py-8 sm:px-16 mb-2">
          <p className="text-lg font-semibold text-center pb-2 pt-4">1.Ban tình nguyện:</p>
          <p>- <span className="font-semibold">Yêu cầu</span>: Là người hướng ngoại, tích cực trong các hoạt động tình nguyện, giao lưu, giao tiếp với mọi người.</p>
          <p>- <span className="font-semibold">Công việc chính</span>: Thực hiện các hoạt động tình nguyện.</p>

          <p className="text-lg font-semibold text-center pb-2 pt-4">2.Ban kỹ thuật:</p>
          <p>- <span className="font-semibold">Yêu cầu</span>: Là người có đam mê, có khả năng chụp ảnh, sử dụng photoshop hoặc các công cụ tương tự, biết thiết kế và có khả năng sáng tạo.</p>
          <p>- <span className="font-semibold">Công việc chính</span>: Thực hiện những việc như tạo dựng và chỉnh sửa, video, chụp ảnh và chỉnh sửa hình ảnh, thiết kế logo, banner,...</p>

          <p className="text-lg font-semibold text-center pb-2 pt-4">3.Ban nội dung:</p>
          <p>- <span className="font-semibold">Yêu cầu</span>: Là người có khả năng sáng tạo nội dung, biết cách hành văn.</p>
          <p>- <span className="font-semibold">Công việc chính</span>: Thực hiện nhiệm vụ viết bài, những công việc liên quan đến viết nội dung.</p>

          <p className="text-lg font-semibold text-center pb-2 pt-4">4.Ban sáng tạo:</p>
          <p>- <span className="font-semibold">Yêu cầu</span>: hiểu biết, luôn biết cách tìm tòi, khả năng đọc hiểu và chắt lọc cao, nhất là khả năng google. Ngoài ra nên biết 1 chút về chỉnh sửa ảnh và video để tiện thiết kế</p>
          <p>- <span className="font-semibold">Công việc chính</span>: Thực hiện nhiệm vụ đăng bài hàng tuần, ví dụ: meme, 1 số kiến thức trong cuộc sống về nhiều lĩnh vực</p>

        </div>
        <Link to="/u/register" className="block text-center py-2 px-4 bg-red-500 hover:bg-red-700 text-white mx-auto rounded-lg mb-20">
          Quay lại
        </Link>
      </div>
    </>
  )
}