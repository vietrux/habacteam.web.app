import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { collection, doc, query, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../../fireConfig";
import { useState } from "react";

type Value = {
  id: string;
  status: boolean;
  errormessage: string;
}

type ModalProps = {
  data: {
    id: string;
    content: string;
    time: string;
    uid: string;
    status: boolean;
    errormessage: string;
  }
  function: Function;
  value: Value;
}

function Modal(props: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState("");
  const listoption = [
    {
      id: props.value.id,
      status: false,
      errormessage: null
    },
    {
      id: props.value.id,
      status: true,
      errormessage: null
    },
    {
      id: props.value.id,
      status: false,
      errormessage: "Vi phạm"
    }
  ]
  return (
    <>
      <div className="rounded-lg shadow-2xl shadow-slate-400">
        <div className={`text-sm text-black p-2 rounded-t-lg flex justify-between bg-slate-100`}>
          <p>{props.data.time}</p>
          <p>{props.data.errormessage ? "Vi phạm" : props.data.status ? "Đã xác nhận" : "Chưa xác nhận"}</p>
        </div>
        <img src="https://picsum.photos/300/150" className="w-full h-auto" alt="lorem picsum" />
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
          className={`text-white p-2 rounded-b-lg w-full bg-orange-800`}
        >Xem chi tiết</button>
      </div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative my-6 mx-auto w-[90%] sm:w-[65%]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-300 rounded-t">
                  <h3 className="text-xl font-semibold">
                    {props.data.errormessage ? "Vi phạm" : props.data.status ? "Đã xác nhận" : "Chưa xác nhận"}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-3 flex-auto">
                  <p style={{whiteSpace: "pre-line"}} className="h-36 my-1 text-slate-500 text-lg leading-relaxed overflow-y-auto scrollbar">
                    {props.data.content}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <select 
                  className="mr-4 p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
                  value={index} onChange={(e) => {
                    setIndex(e.target.value);
                    props.function(listoption[parseInt(e.target.value) as number]);
                  }
                  }>
                    <option disabled>Chọn trạng thái</option>
                    <option value="0">Ẩn cfs</option>
                    <option value="1">Duyệt cfs</option>
                    <option value="2">Đánh dấu vi phạm</option>
                  </select>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default function ConfessionBox() {
  type Confession = {
    id: string;
    content: string;
    time: string;
    uid: string;
    status: boolean;
    errormessage: string;
  }

  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<User>({} as User);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      localStorage.setItem("user_uid", user.uid);
      //console.log(user);
    } else {
      // User is signed out
    }
  });

  const [confessionlist, setConfessionlist] = useState<Array<Confession>>([]);


  const q = query(collection(db, "cfs-box"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const confessions = [] as Array<Confession>;
    querySnapshot.forEach((doc) => {
      confessions.push(doc.data() as Confession);
    });
    setConfessionlist(confessions);
  });

  async function handleUpdateStatus(value: Value) {
    const item = doc(db, "cfs-box", value.id);
    await updateDoc(item, {
      status: value.status,
      errormessage: value.errormessage,
    });
  }

  async function handleSubmit() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user.uid);
      }).catch((error) => {
        console.log(error.code, error.message);
      });
  }
  async function handleSignOut() {
    signOut(auth).then(() => {
      setUser({} as User);
      localStorage.removeItem("user_uid");
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <>
      <div className="w-full h-screen overflow-y-auto">
        <div className="flex items-center justify-around w-full mt-32 sm:mt-8 mb-8">
          <div className="text-2xl sm:text-4xl font-bold self-center">Confession Box</div>
          <div className="self-center flex items-center">
            {auth.currentUser ?
              <div className="inline-flex">
                <div className="flex items-center space-x-4">
                  <img className="w-10 h-10 rounded-full" src={user?.photoURL || ""} alt="" />
                  <div className="font-medium ">
                    <div>{user.displayName}</div>
                    <button
                      onClick={
                        () => {
                          handleSignOut()
                        }
                      }
                      className="text-sm text-gray-500 ">Đăng xuất</button>
                  </div>
                </div>
              </div>
              :
              <button type="button" onClick={
                () => {
                  handleSubmit()
                }
              } className="inline-flex bg-red-600 text-white p-2 rounded-md items-center">
                <svg className="h-6 w-auto mr-2 mb-[-2px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </button>}
          </div>
        </div>

        {
          user.uid !== "w5fukh4LVlQOxGUMUpjNdDE1ymf2" ?
            <p className=" mx-auto py-2 text-center">Bạn phải đăng nhập với tài khoản Admin để sử dụng chức năng này</p> :
            null
        }

        {user.uid === "w5fukh4LVlQOxGUMUpjNdDE1ymf2" ?
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-6 ">
            {confessionlist.map((confession) => {
              return (
                <Modal key={confession.id} data={confession} function={
                  (valuee: Value) => {
                    handleUpdateStatus(valuee)
                  }}
                  value={{
                    id: confession.id,
                    status: confession.status,
                    errormessage: confession.errormessage,
                  } as Value}
                />
              );
            })}
          </div> : null}
      </div>
    </>
  )
}