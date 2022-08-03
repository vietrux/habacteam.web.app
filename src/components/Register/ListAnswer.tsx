import { db } from "../../fireConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function ListAnswer() {

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
  const [list_res, setList_res] = useState<FormDataObject[]>([]);
  useDocumentTitle("Danh sách đăng ký");
  useEffect(() => {
    async function getData() {
      var list_res_temp = [] as FormDataObject[];
      const querySnapshot = await getDocs(collection(db, "res-register-form"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        list_res_temp.push(doc.data() as FormDataObject);
      });
      setList_res(list_res_temp);

    }
    getData();
  }
    , []);
  console.log(list_res);
  return (
    <>
      <div className="p-4">
        <div className="py-4">
          <h1 className="text-xl">Danh sách đăng ký</h1>
        </div>
        <div className="overflow-x-auto relative"></div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col">T.gian</th>
              <th scope="col" className="py-3 px-6">Tên</th>
              <th scope="col" className="py-3 px-6">Ngày sinh</th>
              <th scope="col" className="py-3 px-6">Lớp</th>
              <th scope="col" className="py-3 px-6">T.gian rảnh</th>
              <th scope="col" className="py-3 px-6">Ưu điểm</th>
              <th scope="col" className="py-3 px-6">Ban</th>
              <th scope="col" className="py-3 px-6">Hình thức LH</th>
              <th scope="col" className="py-3 px-6">Thông tin LH</th>
            </tr>
          </thead>
          <tbody>
            {list_res.map((res) => (
              <tr className="bg-white border-b">
                <td className="px-4 py-4">{res.time}</td>
                <td className="py-4 px-6">{res.name}</td>
                <td className="py-4 px-6">{res.yob}</td>
                <td className="py-4 px-6">{res.class}</td>
                <td className="py-4 px-6">{res.freetime}</td>
                <td className="py-4 px-6">{res.more}</td>
                <td className="py-4 px-6">{res.departments}</td>
                <td className="py-4 px-6">{res.contactMethod}</td>
                <td className="py-4 px-6">{res.contactInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}