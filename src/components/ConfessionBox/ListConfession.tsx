import axios from "axios";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animal_list, color_list } from "../../Assets/zoo";
import { auth, db } from "../../fireConfig";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";

type Value = {
  id: string;
  status: boolean;
  errormessage: string;
  errorcode: number;
}
type ModalProps = {
  data: {
    id: string;
    content: string;
    time: string;
    uid: string;
    status: boolean;
    errormessage: string;
    errorcode: number;
    postid: string;
  }
  function: Function;
  value: Value;
  isPending: boolean;
}
type ConfessionBoxProps = {
  user: User,
  isSignIn: Function,
  userdata: UserData,
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
type UserData = {
  cfs_per_day: number;
  cfs_status: boolean;
  role: string;
}

function Modal(props: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(props.value.errorcode);
  const [content, setContent] = useState(props.data.content);

  const listoption = [
    {
      id: props.value.id,
      status: false,
      errormessage: null,
      errorcode: 0,
    },
    {
      id: props.value.id,
      status: true,
      errormessage: null,
      errorcode: 1,
    },
    {
      id: props.value.id,
      status: false,
      errormessage: "Vi phạm",
      errorcode: 2,
    }
  ]
  useEffect(() => {
    async function CheckSpell(content: string) {
      const res = await axios.get("https://vietnamesespellchecker.vietrux.workers.dev/", {
        params: {
          content: content,
        }
      })
      const list_badword = res.data.result as string[];
      const content2 = props.data.content
      const contents = content2.toLowerCase().replaceAll("\n", " \n ").split(" ");
      var str = "";
      for (let i = 0; i < contents.length; i++) {
        if (list_badword.includes(contents[i])) {
          contents[i] = "<span style='background-color: yellow'>" + contents[i] + "</span>";
        }
        str += contents[i] + " ";
      }
      setContent(str);
    }
    if (showModal) {
      CheckSpell(props.data.content);
    }
  }, [showModal]);
  return (
    <>
      <div className="rounded-lg shadow-2xl shadow-slate-400">
        <div className={`text-sm text-black p-2 rounded-t-lg flex justify-between bg-slate-100`}>
          <p>{props.data.time}</p>
          <p>{props.data.errormessage ? "Vi phạm" : props.data.status ? "Đã xác nhận" : "Chưa xác nhận"}</p>
        </div>
        <p style={
          {
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3, /* number of lines to show */
            WebkitBoxOrient: "vertical",
            whiteSpace: "pre-line"
          }
        }
          className="text-sm italic m-2"
        >{props.data.content + "\n\n\n"}</p>

        <button onClick={
          () => {
            setShowModal(true);
          }
        }
          className={props.data.errormessage ? "bg-[#606c38] text-white p-2 rounded-b-lg w-full" : props.data.status ? "bg-[#FEC89A] p-2 rounded-b-lg w-full" : "bg-[#606c38] text-white p-2 rounded-b-lg w-full"}
        >Xem chi tiết</button>
    </div>
      {
    showModal ? (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative my-6 mx-auto w-[90%] sm:w-[65%]">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-300 rounded-t">
                <h3 className="text-xl font-semibold">
                  {props.data.errormessage ? "Vi phạm" : props.data.status ? "Đã xác nhận" : "Chưa xác nhận"}
                </h3>
                {
                  props.data.status ?
                    null : <button
                      onClick={
                        () => {
                          props.function(listoption[2]);
                        }
                      }
                      className="text-xl font-semibold">Xóa</button>
                }
              </div>
              {/*body*/}
              <div className="relative p-3 flex-auto">

                <div style={{ whiteSpace: "pre-line" }} className="h-36 my-1 text-slate-900 text-lg leading-relaxed overflow-y-auto scrollbar" dangerouslySetInnerHTML={{ __html: content }}></div>


              </div>
              {/*footer*/}
              <div className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                <select
                  className={
                    props.isPending ? "mr-4 p-2 bg-white border border-gray-300 rounded-lg shadow-sm opacity-50 cursor-not-allowed" : "mr-4 p-2 bg-white border border-gray-300 rounded-lg shadow-sm"

                  }
                  value={listoption[index].errorcode}
                  onChange={(e) => {
                    setIndex(parseInt(e.target.value) as number);
                    props.function(listoption[parseInt(e.target.value) as number]);
                  }
                  }>
                  <option disabled>Chọn trạng thái</option>
                  <option value="0">Ẩn cfs</option>
                  <option value="1">Duyệt cfs</option>
                </select>
                {
                  props.isPending ?
                    <button onClick={() => setShowModal(false)} type="button" className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </button>
                    :
                    <button onClick={() => setShowModal(false)} type="button" className="inline-flex items-center px-8 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 ">
                      Đóng
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null
  }
    </>
  );
}
export default function ListConfession(props: ConfessionBoxProps) {
  useDocumentTitle("Quản lý tình trạng của cộng đồng");
  const [pending, setPending] = useState(false);
  const [confessionlist, setConfessionlist] = useState<Array<Confession>>([]);
  const [animal, setAnimal] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [countCfs, setCountCfs] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user.uid) {
      navigate("/g/cfsbox");
    }
  }, [props.user.uid, navigate]);

  useEffect(() => {
    const q = query(collection(db, "cfs-box"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const confessions = [] as Array<Confession>;
      querySnapshot.forEach((doc) => {
        confessions.push(doc.data() as Confession);
      });      
      //sort by time to Date.valueOf()
      confessions.sort((a, b) => {
        return new Date(b.time).valueOf() - new Date(a.time).valueOf();
      });
      setConfessionlist(confessions);
      const count = confessions.filter((cfs) => cfs.status === true).length;
      setCountCfs(count);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  async function handleUpdateStatus(value: Value, content: string) {
    const item = doc(db, "cfs-box", value.id);
    const docRef = doc(db, "pri-data", "habacconfession");
    const itemSnap = await getDoc(item);
    const docSnap = await getDoc(docRef);
    switch (value.errorcode) {
      case 0:
        setPending(true);
        if (docSnap.exists()) {
          axios.delete(`https://graph.facebook.com/${itemSnap.data()?.postid}?access_token=${docSnap.data().access_token}`)
          updateDoc(item, {
            status: value.status,
            errormessage: value.errormessage,
            errorcode: value.errorcode,
          } as Confession);
        }
        setPending(false);
        break;
      case 1:
        setPending(true);
        if (docSnap.exists()) {
          const respost = await axios.post(`https://graph.facebook.com/100670066088031/feed?access_token=${docSnap.data().access_token}`, {
            message: `#habac_cfs_${countCfs + 1}\n${content}`,
          });
          updateDoc(item, {
            status: value.status,
            errormessage: value.errormessage,
            errorcode: value.errorcode,
            postid: respost.data.id
          } as Confession);
        }
        setPending(false);
        break;
      case 2:
        setPending(true);
        await deleteDoc(item);
        setPending(false);
        break;
    }
  }
  useEffect(() => {
    const random = Math.floor(Math.random() * animal_list.length);
    setAnimal(animal_list[random]);
  }, []);
  useEffect(() => {
    const random = Math.floor(Math.random() * color_list.length);
    setColor(color_list[random]);
  }, []);
  return (
    <>
      <div className="w-full h-screen overflow-y-auto">
        <div className="flex items-center justify-around w-full mt-32 sm:mt-8 mb-8">
          <div className="text-2xl sm:text-4xl font-bold self-center">Cfs Box Admin</div>
          <div className="self-center flex items-center">
            {auth.currentUser ?
              <div className="inline-flex">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full border-[2px] border-blue-500">
                    <img src={`https://ssl.gstatic.com/docs/common/profile/${animal}_lg.png`} alt="avatar" className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: color,
                        borderColor: "white",
                        borderWidth: "1px"
                      }}
                    />
                  </div>
                  <div className="font-medium ">
                    <div className="capitalize">{animal} ẩn danh</div>
                    <button
                      onClick={
                        () => {
                          props.isSignIn(false);
                        }
                      }
                      className="text-sm text-gray-500 ">Đăng xuất</button>
                  </div>
                </div>
              </div>
              :
              <button type="button" onClick={
                () => {
                  props.isSignIn(true)
                }
              } className="inline-flex bg-red-600 text-white p-2 rounded-md items-center">
                <svg className="h-6 w-auto mr-2 mb-[-2px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </button>}
          </div>
        </div>

        {
          props.userdata.role !== "admin" ?
            <p className=" mx-auto py-2 text-center">Bạn phải đăng nhập với tài khoản Admin để sử dụng chức năng này</p> :
            null
        }

        {
          props.userdata.role === "admin" ?
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-6 mb-16">
              {confessionlist.map((confession) => {
                return (
                  <Modal key={confession.id} data={confession} function={
                    (valuee: Value) => {
                      handleUpdateStatus(valuee, confession.content);
                    }}
                    value={{
                      id: confession.id,
                      status: confession.status,
                      errormessage: confession.errormessage,
                      errorcode: confession.errorcode,
                    } as Value}
                    isPending={pending}
                  />
                );
              })}
            </div> : null
        }
      </div>
    </>
  )
}