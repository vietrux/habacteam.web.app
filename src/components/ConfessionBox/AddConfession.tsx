import { useState } from "react";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../fireConfig";
import { Link } from "react-router-dom";
export default function AddConfession() {
  const [content, setContent] = useState("");
  const [doc_id, setDoc_id] = useState("");
  const [signal, setSignal] = useState("");
  const [error, setError] = useState("");
  async function handleAdd() {
    // Add a new document with a generated id.
    if (content.length > 0) {
      const docRef = await addDoc(collection(db, "cfs-box"), {
        id: "",
        content,
        time: new Date().toLocaleString(),
        uid: localStorage.getItem("user_uid"),
        status: false,
        errormessage: "",
      });
      setDoc_id(docRef.id);
      const item = doc(db, "cfs-box", docRef.id);
      console.log(docRef.id);
      await updateDoc(item, {
        id: docRef.id,
      });
      setSignal("Đã thêm mới");
    } else {
      setError("Bạn chưa nhập nội dung");
    }
  }
  async function handleUpdate() {
    if (content.length > 0) {
      const item = doc(db, "cfs-box", doc_id)
      await updateDoc(item, {
        content: content,
      });
      setSignal("Đã cập nhật");
    } else {
      setError("Bạn chưa nhập nội dung");
    }
  }
  return (
    <div className="w-full h-full grid grid-cols-1 place-content-center">
      <div className="px-8 sm:px-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-bold">Thêm mới</h1>
          <Link to="/u/cfsbox" className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg">
            Quay lại
          </Link>
        </div>
        <form className="my-4">
          <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 ">
            <div className="py-2 bg-white rounded-b-lg ">
              <textarea
                onClick={() => {
                  setSignal("")
                  setError("")
                }}
                onChange={(e) => setContent(e.target.value)}
                rows={8} className="block px-2 w-full text-sm text-gray-800 bg-white border-0 focus:outline-none" placeholder="Viết gì đó..." required></textarea>
            </div>
          </div>
          <button
            onClick={
              doc_id ? handleUpdate : handleAdd
            }
            type="button" className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg  hover:bg-blue-800">
            {doc_id ? "Cập nhật" : "Thêm mới"}
          </button>
          <p className="text-blue-500 mt-4">{signal}</p>
          <p className="text-red-500 mt-4">{error}</p>
        </form>
      </div>
    </div>
  )
}