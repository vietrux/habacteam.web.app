import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, addDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../fireConfig";
import { Link, useParams } from "react-router-dom";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";

export default function EditConfession() {
  type ConfessionBoxUser = {
    cfs_per_day: number;
    status: boolean;
  }
  useDocumentTitle("Thêm cfs");
  const [user, setUser] = useState<User>({} as User);
  const [cfsboxuser, setCfsboxuser] = useState<ConfessionBoxUser>({} as ConfessionBoxUser);
  const [content, setContent] = useState("");
  const [doc_id, setDoc_id] = useState("");
  const [signal, setSignal] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        //get user's data from firestore
        const docRef = doc(db, "cfs-box-users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCfsboxuser(docSnap.data() as ConfessionBoxUser);
          if (!docSnap.data().status ) {
            window.location.href = "/u/cfsbox";
          }
        } else {
          //console.log("Welcome");
        }
      } else {
        window.location.href = "/g/cfsbox";
      }
    });
  }, []);

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
        uid: user.uid,
        status: false,
        errormessage: "",
        errorcode: 0,
        link: "",
      });
      
      const item = doc(db, "cfs-box", docRef.id);
      console.log(docRef.id);
      await updateDoc(item, {
        id: docRef.id,
      });
      await updateDoc(doc(db, "cfs-box-users", user.uid), {
        cfs_per_day: cfsboxuser.cfs_per_day + 1,
        status: cfsboxuser.cfs_per_day < 5 ? true : false,
      });
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
      });
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
    await updateDoc(doc(db, "cfs-box-users", user.uid), {
      cfs_per_day: cfsboxuser.cfs_per_day - 1,
      status: cfsboxuser.cfs_per_day < 6 ? true : false,
    });
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