import { useState, useEffect } from "react";
import { list_question } from "../../../Assets/list_question";
import AnswerElement from "./AnswerElement";
import { Link } from "react-router-dom";
import { detectIncognito } from "detect-incognito";
import useDocumentTitle from "../../OtherFunc/useDocumentTitle";

import Logo from "../../../Assets/LogoWithoutBg.svg"
import Img from "../../../Assets/default-firstframe.jpg"

import { db } from "../../../fireConfig";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";

export default function Register() {

  type FormDataObject = {
    time: number;
    name: string;
    yob: number;
    class: string;
    freetime: string;
    more: string;
    departments: string;
    contactMethod: string;
    contactInfo: string;
  }
  const listkey = ["name", "yob", "class", "departments", "freetime", "more", "contactMethod", "contactInfo"];
  const [formData, setFormData] = useState<FormDataObject>({
    time: 0,
    name: "",
    yob: 0,
    class: "10A",
    freetime: "",
    more: "",
    departments: "",
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
  const res_id = localStorage.getItem("res_register_form_id")
  useDocumentTitle("Đăng ký");
  useEffect(() => {
    async function checkincognito() {
      const result = await detectIncognito();
      if (!result.isPrivate){
        setIsInognito(false)
      }
    }
    checkincognito();
  }, []);
  async function handleSubmit() {
    if (!res_id) {
      formData.time = Date.now();
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
      } else {
        console.log("Welcome");
      }
      console.log("docSnap");
    }
    getData();
  }, [res_id])

  return (
    <>
      { isInognito ? <div className="w-screen h-screen absolute grid content-center text-center px-4 bg-white">Xin lỗi bạn không thể thực hiện đăng kí trong chế độ ẩn danh</div> :
      <div className="flex flex-row">
        <div className="w-full h-screen sm:w-3/5 sm:h-screen grid content-center">
          <div className="pl-16 px-8 sm:px-28">
            <div className="flex flex-row items-center">
              <img src={Logo} className="w-[48px] h-[48px]" alt="hmc-logo" />
              <p className="font-bold text-lg text-slate-400 ml-2"> HaBacMediaClub</p>
            </div>

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
                      } else {
                        setError("Vui lòng điền đầy đủ thông tin")
                      }
                    }
                  }
                  }>{
                    ques_id === listkey.length - 1 ? "Gửi đơn" : "Tiếp theo"
                  }</button>)
                  : (<></>)
              }

            </div>
            <div className="mt-4">
              <p className="text-[red]">{error}</p>
              <p className="text-[blue]">{success}</p>
            </div>
            <div className="pt-4">
              <Link to="/g/i/departments" className="text-[blue] hover:text-blue-500">&gt;Tìm hiểu về các ban trong CLB</Link>
            </div>
          </div>
        </div>
        <div className="sm:w-2/5 sm:h-screen hidden sm:block">
          <img src={Img} className="w-full h-full" alt="hmc-side-img" />
        </div>
      </div> }
    </>
  );
}