import { db } from "../../fireConfig";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
export default function ListAnswer() {

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
  const [list_res, setList_res] = useState<FormDataObject[]>([]);
  useDocumentTitle("Danh sách đăng ký");

  useEffect(() => {
    const q = query(collection(db, "res-register-form"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list_res_temp = [] as FormDataObject[];
      querySnapshot.forEach((doc) => {
        list_res_temp.push(doc.data() as FormDataObject);
      });
      setList_res(list_res_temp);
    });
    return () => {
      unsubscribe();
    }
  }
    , []);

    //list_res to csv file
    function list_res_to_csv() {
      var csv = "";
      // header
      csv += "Thời gian,Họ và tên,Năm sinh,Lớp,Thời gian rảnh,Ban,Khác,Phương thức liên hệ,Thông tin liên hệ\n";
      for (var i = 0; i < list_res.length; i++) {
        csv += list_res[i].time.replaceAll(",", " ") + "," + list_res[i].name.replaceAll(",", " ") + "," + list_res[i].yob + "," + list_res[i].class + "," + list_res[i].freetime + "," + list_res[i].departments + "," + list_res[i].more.replaceAll(",", " ") + "," + list_res[i].contactMethod.replaceAll(",", " ") + "," + list_res[i].contactInfo.replaceAll(",", " ") + "\n";
        console.log(list_res[i].more.replaceAll(",", " "));
      }
      return csv;
    }
    list_res_to_csv();
    function download_csv() {
      var csv = list_res_to_csv();
      var universalBOM = "\uFEFF";
      var link = document.createElement("a");
      link.href = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csv)
      link.download = "list_res.csv";
      link.click();
    }
    return (
      <>
        <div className="absolute top-0 left-0 w-screen h-screen  bg-white">
          <div className="py-4 flex flex-col sm:flex-row justify-between w-full">
            <h1 className="text-2xl sm:text-4xl h-[48px] font-bold">Danh sách đăng ký</h1>
            <p className="sm:hidden my-2">Không thể hiển thị danh sách trên thiết bị di động <br /> Vui lòng tải file</p>
            <button className="text-center py-2 px-4 bg-red-500 hover:bg-red-700 text-white rounded-lg w-2/3 mx-auto sm:hidden" onClick={download_csv}>Download Danh sách</button>
            <button className="text-center py-2 px-4 bg-red-500 hover:bg-red-700 text-white rounded-lg w-1/2 mx-auto hidden sm:block" onClick={download_csv}>Xuất file</button>
          </div>
          <div className="overflow-auto pb-16 sm:mb-auto">
            <table className="text-sm text-left text-gray-500 w-[1366px] sm:w-screen ">
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
                    <td className="px-4 py-4">{typeof (res.time) === "string" ? res.time : "unknown"}</td>
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
        </div>
      </>
    )
  }