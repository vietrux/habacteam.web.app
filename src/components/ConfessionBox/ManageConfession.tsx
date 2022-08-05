import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../fireConfig";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import useDocumentTitle from "../OtherFunc/useDocumentTitle";

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
  isPending:boolean;
}

function Modal(props: ModalProps) {

  const [showModal, setShowModal] = useState(false);
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
          className="text-sm italic m-2 "
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
                  {
                    props.data.status ?
                      null : <button 
                        onClick={
                          () => {
                            props.function(props.data.id);
                          }
                        }
                      className="text-xl font-semibold">Xóa</button>
                  }
                </div>
                {/*body*/}
                <div className="relative p-3 flex-auto">
                  <p style={{ whiteSpace: "pre-line" }} className="h-36 my-1 text-slate-700 text-lg leading-relaxed overflow-y-auto scrollbar">
                    {props.data.content}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                  {props.data.status ?
                    <a href={`https://facebook.com/${props.data.postid}`} className="text-blue-500">Xem bài viết trên Facebook</a>
                    :
                    <>Không có bài viết trên Facebook</>
                  }
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
      ) : null}
    </>
  );
}

export default function ManageConfession() {
  useDocumentTitle("Quản lý Confession");
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
  type ConfessionBoxUser = {
    cfs_per_day: number;
    status: boolean;
  }
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState<User>({} as User);
  const [cfsboxuser, setCfsboxuser] = useState<ConfessionBoxUser>({} as ConfessionBoxUser);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        window.location.href = "/g/cfsbox";
      }
    });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "cfs-box-users", user.uid || "a"), (doc) => {
      setCfsboxuser(doc.data() as ConfessionBoxUser);
  });
  return () => {
    unsub();
  }
  }, [user.uid]);

  const [confessionlist, setConfessionlist] = useState<Array<Confession>>([]);

  useEffect(() => {
    const q = query(collection(db, "cfs-box"), where("uid", "==", user.uid || ""));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const confessions = [] as Array<Confession>;
      querySnapshot.forEach((doc) => {
        confessions.push(doc.data() as Confession);
      });
      setConfessionlist(confessions);
    });
    return () => {
      unsubscribe();
    }
  }, [user]);


  async function handleDelete(id: string) {
    setPending(true);
    //delete from firestore
    await updateDoc(doc(db, "cfs-box-users", user.uid), {
      cfs_per_day: cfsboxuser.cfs_per_day - 1,
      status: cfsboxuser.cfs_per_day < 6  ? true : false,
    });
    const item = doc(db, "cfs-box", id);
    await deleteDoc(item);
    setPending(false);
  }

  async function handleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        //user signed in
      }).catch((error) => {
        console.log(error.code, error.message);
      });
  }
  async function handleSignOut() {
    signOut(auth).then(() => {
      setUser({} as User);
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
                  handleSignIn()
                }
              } className="inline-flex bg-red-600 text-white p-2 rounded-md items-center">
                <svg className="h-6 w-auto mr-2 mb-[-2px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </button>}
          </div>
        </div>
        <div className="flex w-full">
          <Link to="/g/cfsbox" className="w-[31%] mx-auto py-2 bg-yellow-300 text-black text-center rounded-lg shadow-lg shadow-slate-300">
            Quay về
          </Link>
          <Link to="/g/i/cfsbox" className="w-[31%] mx-auto py-2 bg-yellow-300 text-black text-center rounded-lg shadow-lg shadow-slate-300">
            Nội quy
          </Link>
          {
            cfsboxuser.status ?
              <Link to="/u/editcfs/new" className="w-[31%] mx-auto py-2 bg-yellow-300 text-black text-center rounded-lg shadow-lg shadow-slate-300">
                Thêm mới
              </Link>
              : null
          }
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-6 mb-16">
          {confessionlist.map((confession) => {
            return (
              <Modal key={confession.id} data={confession}
                function={
                  (id:string) => {
                    handleDelete(id);
                  }
                }
                isPending={pending}
              />
            );
          })}
        </div>
      </div>

    </>
  )
}