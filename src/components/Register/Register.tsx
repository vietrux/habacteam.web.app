import { detectIncognito } from "detect-incognito";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { list_question } from "../../Assets/list_question";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
import AnswerElement from "./AnswerElement";

import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../fireConfig";

export default function Register() {

  type FormDataObject = {
    time: string;
    name: string;
    yob: number;
    class: string;
    freetime: string;
    departments: string;
    more: string;
    contactMethod: string;
    contactInfo: string;
  }
  const listkey = ["name", "yob", "class", "freetime", "departments", "more", "contactMethod", "contactInfo"];
  const [formData, setFormData] = useState<FormDataObject>({
    time: new Date().toLocaleString(),
    name: "",
    yob: 0,
    class: "10A",
    freetime: "",
    departments: "",
    more: "",
    contactMethod: "",
    contactInfo: "",
  });
  const [isInognito, setIsInognito] = useState(true);
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const list_question_new = [
    ...list_question,
    {
      type: "text",
      question: "Bạn hãy nhập " + formData.contactMethod + " của bạn",
      placeholder: "Nhập " + formData.contactMethod,
    }
  ]
  const [ques_id, setQues_id] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const res_id = localStorage.getItem("res_register_form_id")
  useDocumentTitle("Đăng ký");
  useEffect(() => {
    async function checkincognito() {
      const result = await detectIncognito();
      if (!result.isPrivate) {
        setIsInognito(false)
      }
    }
    checkincognito();
  }, []);

  async function handleSubmit() {
    if (!res_id) {
      formData.time = new Date().toLocaleString();
      const docRef = await addDoc(collection(db, "res-register-form"), formData);
      localStorage.setItem("res_register_form_id", docRef.id);
      setSuccess("Đăng ký thành công")
    } else {
      await setDoc(doc(db, "res-register-form", res_id || "a"), formData);
      setSuccess("Cập nhật thành công")
    }
  }

  useEffect(() => {
    async function getData() {
      const docRef = doc(db, "res-register-form", res_id || "a");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as FormDataObject);
      }
    }
    getData();
  }, [res_id])

  return (
    <>
      {isInognito ?
        <div className="w-full h-screen grid content-center text-center px-4 bg-white">
          Xin lỗi bạn không thể thực hiện đăng kí trong chế độ ẩn danh
        </div>
        :
        <div className="w-full h-full grid content-center">
          <h1 className="text-2xl sm:text-4xl font-bold w-3/5 mx-auto">{localStorage.getItem("res_register_form_id") ? "Cập nhật" : "Đăng ký"}</h1>
          <div className="w-3/5 mx-auto">
            <div className="py-8">
              <p>{(ques_id + 1) + "/" + listkey.length}</p><h1 className="text-2xl font-medium">{list_question_new[ques_id].question}</h1>
            </div>
            <div className="flex flex-col">
              <AnswerElement
                type={list_question_new[ques_id].type}
                placeholder={list_question_new[ques_id].placeholder}
                options={list_question_new[ques_id].options}
                quesid={ques_id}
                value={formData[listkey[ques_id] as keyof FormDataObject]}
                function={(value: any) => {
                  setFormData({ ...formData, [listkey[ques_id]]: value });
                }}
              />
            </div>
            <div className="flex flex-rơw mt-4">
              {
                ques_id > 0 ? (<button className="py-2 px-6 mr-4 font-medium text-lg text-white bg-blue-600 rounded-[4px] hover:bg-blue-500"
                  onClick={() => {
                    setQues_id(ques_id - 1);
                    setError("");
                    setSuccess("");
                  }
                  }>Quay lại</button>)
                  : (<></>)
              }
              {
                ques_id <= listkey.length ? (<button className="py-2 px-6 font-medium text-lg text-white bg-blue-600 rounded-[4px] hover:bg-blue-500"
                  onClick={() => {
                    if (ques_id < listkey.length - 1) {
                      if (ques_id === 6 && formData[listkey[6] as keyof FormDataObject] === "") {
                        setError("Vui lòng chọn một phương thức liên hệ");
                      } else {
                        setQues_id(ques_id + 1);
                        setError("");
                        setSuccess("")
                      }
                    } else {
                      console.log('done');
                      if (formData.name && formData.yob && formData.class && formData.departments && formData.freetime && formData.more && formData.contactMethod && formData.contactInfo) {
                        console.log('done');
                        handleSubmit();
                        setShowModal(true)
                      } else {
                        setError("Vui lòng điền đầy đủ thông tin")
                      }
                    }
                  }
                  }>{
                    ques_id === listkey.length - 1 ?
                      localStorage.getItem("res_register_form_id") ? "Cập nhật" : "Đăng ký"
                      : "Tiếp theo"
                  }</button>)
                  : (<></>)
              }
            </div>
            {showModal ? (
              <>
                <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                          Thông báo
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
                      <div className="relative p-6 flex-auto">
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          {localStorage.getItem("res_register_form_id") ? "Cập nhật thành công" : "Đơn đăng ký của bạn đã được gửi thành công. Chúng tớ sẽ liên lạc với bạn trong thời gian sớm nhất. Hiện tại bạn vẫn có thể chỉnh sửa và cập nhật đơn trước khi chúng tớ tiến hành kiểm duyệt."}
                        </p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
            <div className="mt-4">
              <p className="text-[red]">{error}</p>
              <p className="text-pink-800">{success}</p>
            </div>
            <div className="pt-4">
              <Link to="/g/i/departments" className="text-[blue] hover:text-blue-500">&gt;Tìm hiểu về các ban trong CLB</Link>
            </div>
          </div>
        </div>
      }
    </>
  );
}