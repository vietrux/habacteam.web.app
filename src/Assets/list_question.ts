type list_question_object = {
  type: string;
  question: string;
  placeholder?: string;
  options?: Array<string>;
}

export const list_question:Array<list_question_object> = [
  {
    type: "text",
    question: "Tên bạn là gì?",
    placeholder: "Nhập tên của bạn",
  },
  {
    type: "text",
    question: "Bạn sinh năm bao nhiêu?",
    placeholder: "Nhập năm sinh của bạn",
  },
  {
    type: "select",
    question: "Bạn học lớp nào?",
    options: ["10A", "10B", "10C", "10D", "10E", "10G", "10H",
              "11A", "11B", "11C", "11D", "11E", "11G", "11H",
              "12A", "12B", "12C", "12D", "12E", "12G", "12H"],
  },
  {
    type: "radio",
    question: "Bạn có nhiều thời gian rảnh trong tuần không?",
    options: ["Có", "Đôi khi", "Không"],
  },
  {
    type: "radio",
    question: "Bạn có muốn tham gia ban nào?",
    options: [
      "Ban tình nguyện",
      "Ban nội dung",
      "Ban kỹ thuật",
      "Ban sáng tạo"
    ],
  },
  {
    type:"text",
    question: "Bạn có thể kể về một số ưu điểm của mình được không?",
    placeholder: "Tích cực, giao tiếp tốt,...",
  },
  {
    type: "radio",
    question: "Chúng tớ có thể liên hệ với bạn bằng cách nào?",
    options: [
      "link Facebook",
      "Zalo/SĐT",
    ],
  }

]