import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { collection, doc, addDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../fireConfig";
import { Link, useParams, useNavigate } from "react-router-dom";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";

type EditConfessionProps = {
  user: User,
  isSignIn: Function,
  userdata: UserData,
}
type UserData = {
  cfs_per_day: number,
  cfs_status: boolean,
  role: string,
}
export default function EditConfession(props: EditConfessionProps) {

  type Confession = {
    id: string;
    content: string;
    time: string;
    uid: string;
    status: boolean;
    errormessage: string;
    errorcode: number;
    postid: string;
  }
  useDocumentTitle("Thêm cfs");
  const [content, setContent] = useState("");
  const [doc_id, setDoc_id] = useState("");
  const [signal, setSignal] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user.uid) {
      if (!props.userdata.cfs_status){
        navigate("u/cfsbox")
      }
    } else {
      navigate("/g/cfsbox");
    }
  }, [props.user.uid, navigate, props.userdata.cfs_status]);

  //get id from url params
  const id = useParams().id;
  useEffect(() => {
    async function getData(doc_id: string) {
      const docRef = doc(db, "cfs-box", doc_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().content);
      } else {
        //console.log("Welcome");
      }
    }
    if (id && id !== "new") {
      getData(id);
      setDoc_id(id);
    }
  }, [id]);



  async function handleAdd() {
    if (content.length > 0) {
      setPending(true);
      const docRef = await addDoc(collection(db, "cfs-box"), {
        id: "",
        content,
        time: new Date().toLocaleString(),
        uid: props.user.uid,
        status: false,
        errormessage: "",
        errorcode: 0,
        link: "",
        postid: "",
      } as Confession);

      const item = doc(db, "cfs-box", docRef.id);
      console.log(docRef.id);
      await updateDoc(item, {
        id: docRef.id,
      } as Confession);
      await updateDoc(doc(db, "users", props.user.uid), {
        cfs_per_day: props.userdata.cfs_per_day + 1,
        cfs_status: props.userdata.cfs_per_day < 5 ? true : false,
      } as UserData);
      setSignal("Đã thêm mới");
      setPending(false);
      setDoc_id(docRef.id);
    } else {
      setError("Bạn chưa nhập nội dung");
    }
  }
  async function handleUpdate() {
    if (content.length > 0) {
      setPending(true);
      const item = doc(db, "cfs-box", doc_id)
      await updateDoc(item, {
        content: content,
      } as Confession);
      setSignal("Đã cập nhật");
      setPending(false);
    } else {
      setError("Bạn chưa nhập nội dung");
    }
  }
  async function handleDelete() {
    setPending(true);
    //delete from firestore
    const item = doc(db, "cfs-box", doc_id);
    await deleteDoc(item);
    await updateDoc(doc(db, "users", props.user.uid), {
      cfs_per_day: props.userdata.cfs_per_day - 1,
      cfs_status: props.userdata.cfs_per_day < 5 ? true : false,
    } as UserData);
    setPending(false);
    setSignal("Đã xóa");
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
                value={content}
                rows={8} className="block px-2 w-full text-sm text-gray-800 bg-white border-0 focus:outline-none" placeholder="Viết gì đó..." required></textarea>
            </div>
          </div>
          {pending ?
            <>
              <button onClick={
                doc_id ? handleUpdate : handleAdd
              }
                type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {doc_id ? "Cập nhật" : "Thêm mới"}
              </button>
              {
                doc_id ?
                  <button onClick={
                    handleDelete
                  }
                    type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-red-500 hover:bg-red-400 transition ease-in-out duration-150 cursor-not-allowed disabled:bg-red-300" disabled >
                    Xóa
                  </button>
                  :
                  null
              }
            </>
            :
            <>
              <button onClick={
                doc_id ? handleUpdate : handleAdd
              }
                type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150">
                {doc_id ? "Cập nhật" : "Thêm mới"}
              </button>
              {
                doc_id ?
                  <button onClick={
                    handleDelete
                  }
                    type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-red-500 hover:bg-red-400 transition ease-in-out duration-150" >
                    Xóa
                  </button>
                  :
                  null
              }
            </>
          }


          <p className="text-blue-500 mt-4">{signal}</p>
          <p className="text-red-500 mt-4">{error}</p>
        </form>
      </div>
    </div>
  )
}