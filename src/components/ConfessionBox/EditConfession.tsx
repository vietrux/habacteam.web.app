import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bad_words } from "../../Assets/bad_words";
import { db } from "../../fireConfig";
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
  last_cf_time?: string,
}
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
export default function EditConfession(props: EditConfessionProps) {
  useDocumentTitle("Thêm cfs");
  const [content, setContent] = useState<string>("");
  const [doc_id, setDoc_id] = useState<string>("");
  const [last_cf_time, setLast_cf_time] = useState<string>("");
  const [signal, setSignal] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  //get id from url params
  const id = useParams().id;
  useEffect(() => {
    async function getData(doc_id: string) {
      try {
        const docRef = doc(db, "cfs-box", doc_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data().content);
        }
        if (props.user.uid) {
          if (!props.userdata.cfs_status && !doc_id) {
            navigate("/u/cfsbox")
          }
          setLoading(false);
        } else {
          navigate("/g/cfsbox");
        }
      } catch (error) {
        navigate("/g/cfsbox");
      }
    }

    if (id && id !== "new") {
      getData(id as string);
      setDoc_id(id as string);
    }

    if (id === "new") {
      if (props.user.uid) {
        if (!props.userdata.cfs_status) {
          navigate("/u/cfsbox")
        }
        setLoading(false);
      } else {
        navigate("/g/cfsbox");
      }
    }
  }, [props.user.uid, navigate, doc_id]);

  useEffect(() => {
    const q = query(collection(db, "cfs-box"), where("uid", "==", props.user.uid || ""), orderBy("time", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list_confession_time = [] as string[];
      querySnapshot.forEach((doc) => list_confession_time.push(doc.data().time));
      setLast_cf_time(list_confession_time[0].split(",")[0].trim());
    });
    return () => {
      unsubscribe();
    }
  }, []);

  async function handleAdd() {
    setPending(true);
    function splitMulti(str: string, tokens: string[]) {
      var tempChar = tokens[0];

      for (var i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
      }
      var sstr = str.split(tempChar);
      return sstr;
    }
    const content2 = content;
    const contents = splitMulti(content2, [" ", ".", ",", "?", "!", ":", ";", "\"", "'", "\\", "/", "|", "~", "`", "^", "(", ")", "{", "}", "[", "]", "<", ">", "&", "%", "$", "#", "@", "*", "+", "=", "-", "_", " ", ".", ",", "?", "!", ":", ";", "\"", "'", "\\", "/", "|", "~", "`", "^", "(", ")", "{", "}", "[", "]", "<", ">", "&", "%", "$", "#", "@", "*", "+", "=", "-", "_"]);
    for (let i = 0; i < bad_words.length; i++) {
      if (bad_words[i].includes("_") && content.includes(bad_words[i])) {
        setPending(false);
        return setError(`Có vẻ như bạn đang nhập các từ cấm: ${bad_words[i]}`);
      }
      if (!bad_words[i].includes("_") && contents.includes(bad_words[i])) {
        setPending(false);
        return setError(`Có vẻ như bạn đang nhập các từ cấm: ${bad_words[i]}`);
      }
    }
    const docRef = await addDoc(collection(db, "cfs-box"), {
      id: "",
      content,
      time: new Date().toLocaleString("en-US", {
        hour12: false,
      }),
      uid: props.user.uid,
      status: false,
      errormessage: "",
      errorcode: 0,
      link: "",
      postid: "",
    } as Confession);

    const item = doc(db, "cfs-box", docRef.id);
    await updateDoc(item, {
      id: docRef.id,
    } as Confession);
    await updateDoc(doc(db, "users", props.user.uid), {
      cfs_per_day: props.userdata.cfs_per_day + 1,
      cfs_status: props.userdata.cfs_per_day + 1 < 3 ? true : false,
      last_cf_time: new Date().toLocaleString("en-US", {
        hour12: false,
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }),
    } as UserData);
    setSignal("Đã thêm mới");
    setPending(false);
    setDoc_id(docRef.id);
  }
  async function handleUpdate() {
    setPending(true);
    function splitMulti(str: string, tokens: string[]) {
      var tempChar = tokens[0];

      for (var i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
      }
      var sstr = str.split(tempChar);
      return sstr;
    }
    const content2 = content;
    const contents = splitMulti(content2, [" ", ".", ",", "?", "!", ":", ";", "\"", "'", "\\", "/", "|", "~", "`", "^", "(", ")", "{", "}", "[", "]", "<", ">", "&", "%", "$", "#", "@", "*", "+", "=", "-", "_", " ", ".", ",", "?", "!", ":", ";", "\"", "'", "\\", "/", "|", "~", "`", "^", "(", ")", "{", "}", "[", "]", "<", ">", "&", "%", "$", "#", "@", "*", "+", "=", "-", "_"]);
    for (let i = 0; i < bad_words.length; i++) {
      if (bad_words[i].includes("_") && content.includes(bad_words[i])) {
        setPending(false);
        return setError(`Có vẻ như bạn đang nhập các từ cấm: ${bad_words[i]}`);
      }
      if (!bad_words[i].includes("_") && contents.includes(bad_words[i])) {
        setPending(false);
        return setError(`Có vẻ như bạn đang nhập các từ cấm: ${bad_words[i]}`);
      }
    }
    if (content.length > 0) {
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
      cfs_per_day: props.userdata.cfs_per_day > 0 ? props.userdata.cfs_per_day - 1 : 0,
      cfs_status: props.userdata.cfs_per_day - 1 < 3 ? true : false,
      last_cf_time: last_cf_time,
    } as UserData);
    setPending(false);
    setSignal("Đã xóa");
    navigate("/u/cfsbox");
  }
  return (
    loading ?
      <div className="w-full h-screen grid content-center text-center px-4 bg-white">
        Loading...
      </div>
      :
      <div className="w-full h-screen grid grid-cols-1 place-content-center">
        <div className="px-8 sm:px-16">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-4xl font-bold">{doc_id ? "Chỉnh sửa " : "Thêm mới"}</h1>
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
                  type="button" className="mx-2 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {doc_id ? "Lưu" : "Thêm mới"}
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
                {
                  content.length > 0 ?
                    <button onClick={
                      doc_id ? handleUpdate : handleAdd
                    }
                      type="button" className="inline-flex mx-2 items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150">
                      {doc_id ? "Lưu" : "Thêm mới"}
                    </button>
                    :
                    <button onClick={
                      doc_id ? handleUpdate : handleAdd
                    }
                      type="button" className="inline-flex mx-2 items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 disabled:bg-indigo-300 cursor-not-allowed" disabled>
                      {doc_id ? "Lưu" : "Thêm mới"}
                    </button>
                }
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
            <p className="text-blue-500 mt-4 mb-2">{signal}</p>
            <p className="text-red-500 mt-4 mb-2">{error}</p>
          </form>
        </div>
      </div>
  )
}