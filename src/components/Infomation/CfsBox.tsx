import { Link } from "react-router-dom";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function CfsBoxRule() {
  useDocumentTitle("Nội quy của Confession Box");
  return (
    <>
      <div className=" overflow-auto h-screen">
        <div className=" text-center py-4 mt-32 sm:mt-0">
          <h1 className="text-2xl">Quy định của Confession Box</h1>
        </div>
        <div className=" px-16 py-8 sm:px-16 mb-2">
        <p className="text-lg font-semibold text-center pb-2 pt-4">1. Nhằm tránh tình trạng spam, Hà Bắc Cfs có một vài quy định như sau:</p>
          - Các bạn phải đăng nhập bằng tài khoản Google để có thể confess.<br />
          - Thông tin của các bạn được ẩn danh tuyệt đối (kể cả Ad cũng không biết bạn là ai).<br />
          - Mỗi bạn chỉ được confess 3 lần/ngày và không giới hạn số lần xóa đi viết lại.<br />
          - Chúng tớ sẽ duyệt bài vào 11h45-12h45 và 19h45-21h45<br />
          - Confession sẽ bị đánh dấu là vi phạm và bị xóa nếu Vi phạm những điều ở mục 2<br />

          <p className="text-lg font-semibold text-center pb-2 pt-4">2. Những nội dung sẽ KHÔNG ĐƯỢC ĐĂNG (Vi phạm):</p>
          - Dùng từ tục tĩu, nội dung không lành mạnh, teencode, viết tắt nhiều. (đọc không nổi) <span className="font-bold">(***)</span><br />
          - Nội dung liên quan đến chính trị, tôn giáo, khiêu dâm.<br />
          - Bịa đặt, tung tin đồn nhảm, sai sự thật, nội dung xúc phạm, chửi bới hoặc nói xấu người khác.<br />
          - Chứa nội dung quảng cáo, tiếp thị...<br />
          - Nội dung đã từng được đăng trước đó.<br />
          - Nội dung quá ngắn và không có ý nghĩa<br />

          <span className="italic font-bold">Mục (***). sẽ được hệ thống check trực tiếp khi các bạn thực hiện confess</span>

        </div>
        <Link to="/u/cfsbox" className="block text-center py-2 px-4 bg-red-500 hover:bg-red-700 text-white mx-auto rounded-lg mb-20">
          Quay lại
        </Link>
      </div>
    </>
  )
}