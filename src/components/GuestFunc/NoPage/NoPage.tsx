import useDocumentTitle from "../../OtherFunc/useDocumentTitle"
export default function NoPage() {
  useDocumentTitle("404");
  return (
  <> 
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[72px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">404</h1>
      <p className="text-lg">Không tìm thấy trang</p>
    </div>
  </>
  )
}