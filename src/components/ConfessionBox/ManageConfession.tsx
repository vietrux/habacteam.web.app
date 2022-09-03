import { User } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { animal_list, color_list } from "../../Assets/zoo";
import { auth, db } from "../../fireConfig";
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
  };
}
type ManageConfessionProps = {
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
  last_cf_time?: string;
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
          className={`text-white p-2 rounded-b-lg w-full bg-[#606c38]`}
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
                      null :
                      <Link to={`/u/editcfs/${props.data.id}`}
                        className="text-xl font-semibold">Chỉnh sửa</Link>
                  }
                </div>
                {/*body*/}
                <div className="relative p-3 flex-auto">
                  <p style={{ whiteSpace: "pre-line" }} className="h-36 my-1 text-slate-900 text-lg leading-relaxed overflow-y-auto scrollbar">
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
                  <button onClick={() => setShowModal(false)} type="button" className="inline-flex items-center px-8 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 ">
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

export default function ManageConfession(props: ManageConfessionProps) {
  useDocumentTitle("Quản lý Confession");
  const [animal, setAnimal] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.user.uid) {
      navigate("/g/cfsbox");
    }
  }, [props.user.uid, navigate]);

  const [confessionlist, setConfessionlist] = useState<Array<Confession>>([]);

  useEffect(() => {
    async function update_cfs_per_day(){
      await updateDoc(doc(db, "users", props.user.uid), {
        cfs_per_day: 0,
        cfs_status: true,
      } as UserData);
    }
    const datenow = new Date().toLocaleString("en-US", {
      hour12: false,
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    if (props.userdata.last_cf_time !== datenow) {
      update_cfs_per_day();
      console.log("vcl update");
      console.log(props.userdata.last_cf_time);
      console.log(datenow);
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "cfs-box"), where("uid", "==", props.user.uid || ""), orderBy("time", "desc"));
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
  }, [props.user]);

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
          <div className="text-2xl sm:text-4xl font-bold self-center">Confession Box</div>
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
        <div className="flex w-full">
          <Link to="/g/cfsbox" className="w-[31%] mx-auto bg-[#bc6cc0] text-white py-2 px-4 rounded-lg text-center shadow-lg shadow-slate-300">
            Quay về
          </Link>
          <Link to="/g/i/cfsbox" className="w-[31%] mx-auto py-2 bg-[#bc6cc0] text-white text-center rounded-lg shadow-lg shadow-slate-300">
            Quy định
          </Link>
          {
            props.userdata.cfs_status ?
              <Link to="/u/editcfs/new" className="w-[31%] mx-auto py-2 bg-[#bc6cc0] text-white text-center rounded-lg shadow-lg shadow-slate-300">
                Thêm mới
              </Link>
              :
              <button className="w-[31%] mx-auto py-2 bg-yellow-300 text-black text-center rounded-lg shadow-lg shadow-slate-300 cursor-not-allowed disabled:bg-yellow-200 disabled:text-slate-500" disabled>
                Thêm mới
              </button>
          }
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-6 mb-16">
          {
            props.userdata.cfs_status ?
              <div className="grid grid-cols-1 grid-row-3 place-content-center w-full h-full rounded-lg shadow-2xl shadow-slate-400 p-4">
                <p className="text-center">Bạn còn lại:</p>
                <p className="text-2xl font-bold text-center">{3 - props.userdata.cfs_per_day}</p>
                <p className="text-center">Lượt thêm mới</p>
              </div> :
              <div className="grid grid-cols-1 grid-row-3 place-content-center w-full h-full rounded-lg shadow-2xl shadow-slate-400 p-4">
                <p className="text-center">Bạn đã hết lượt thêm mới</p>
                <p className="text-2xl font-bold text-center"></p>
                <p className="text-center">trong hôm nay</p>
              </div>
          }

          {confessionlist.map((confession) => {
            return (
              <Modal key={confession.id} data={confession}
              />
            );
          })}
        </div>
      </div>

    </>
  )
}