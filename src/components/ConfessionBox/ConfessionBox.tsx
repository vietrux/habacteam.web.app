import { User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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
  }
}
type ConfessionBoxProps = {
  user: User,
  isSignIn: Function,
  userdata: UserData,
}
type UserData = {
  cfs_per_day: number,
  cfs_status: boolean,
  role: string,
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

function Modal(props: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="rounded-lg shadow-2xl shadow-slate-400">
        <div className={`text-sm text-black p-2 rounded-t-lg flex justify-between bg-slate-100`}>
          <p>{props.data.time}</p>
          <p>CfsBox</p>
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
          className={`p-2 rounded-b-lg w-full bg-[#FEC89A] `}
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
                    CfsBox
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
                <div className="relative p-3 ">
                  <p style={{ whiteSpace: "pre-line" }} className="h-36 my-1 text-slate-900 text-lg leading-relaxed overflow-y-auto scrollbar">
                    {props.data.content}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                  <a href={`https://facebook.com/${props.data.postid}`} className="text-blue-500">Xem bài viết trên Facebook</a>
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

export default function ConfessionBox(props: ConfessionBoxProps) {
  useDocumentTitle("Confession Box");
  const [confessionlist, setConfessionlist] = useState<Array<Confession>>([]);
  const [animal, setAnimal] = useState<string>("");
  const [color, setColor] = useState<string>("");
  useEffect(() => {
    const q = query(collection(db, "cfs-box"), where("status", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const confessions = [] as Array<Confession>;
      querySnapshot.forEach((doc) => {
        confessions.push(doc.data() as Confession);
      });
      setConfessionlist(confessions as Array<Confession>);
    });
    return () => {
      unsubscribe();
    }
  }, []);
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
          <div className="text-2xl sm:text-4xl font-bold self-center text-center">Confession Box</div>
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
                  props.isSignIn(true);
                }
              } className="inline-flex bg-red-600 text-white p-2 rounded-md items-center">
                <svg className="h-6 w-auto mr-2 mb-[-2px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Sign in with Google
              </button>}
          </div>
        </div>
        <div className="flex">
          {
            props.user.uid ?
              <Link to="/u/cfsbox" className="w-1/3 block mx-auto py-2 bg-[#bc6cc0] text-white text-center rounded-lg shadow-lg shadow-slate-300">
                CfsBox của bạn
              </Link>
              :
              <Link to="/g/i/cfsbox" className="w-1/3 mx-auto py-2 bg-[#bc6cc0] text-white text-center rounded-lg shadow-lg shadow-slate-300">
                Quy định
              </Link>
          }
          {
            props.user.uid && props.userdata.role === "admin" ?
              <Link to="/a/cfsbox" className="w-1/3 block mx-auto py-2 bg-[#bc6cc0] text-white text-center rounded-lg shadow-lg shadow-slate-300">
                Quản lý (Admin)
              </Link>
              : null
          }
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto p-6 mb-16">
          {confessionlist.map((confession) => {
            return (
              <Modal key={confession.id} data={confession} />
            );
          })}
        </div>
      </div>
    </>
  )
}