import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      id: "item-1",
      question: "UniConnect là gì?",
      answer: "UniConnect là nền tảng cộng đồng dành riêng cho sinh viên, nơi bạn có thể chia sẻ kiến thức, tài liệu học tập, đặt câu hỏi và tìm nhóm học cùng tiến bộ."
    },
    {
      id: "item-2",
      question: "Làm thế nào để tăng điểm uy tín (Reputation)?",
      answer: "Bạn sẽ nhận được điểm khi đóng góp cho cộng đồng: +10 điểm khi viết bài Blog, +5 điểm khi chia sẻ Tài liệu, +2 điểm khi có Câu trả lời được chấp nhận."
    },
    {
      id: "item-3",
      question: "Tôi có thể xóa bài viết của mình không?",
      answer: "Có. Bạn có toàn quyền chỉnh sửa hoặc xóa bài viết, tài liệu do chính mình đăng tải. Tuy nhiên, hành động này sẽ không bị trừ lại số điểm uy tín đã nhận."
    },
    {
      id: "item-4",
      question: "Làm sao để báo cáo nội dung xấu?",
      answer: "Tại mỗi bài viết hoặc bình luận, bạn sẽ thấy nút có biểu tượng 'Tam giác cảnh báo'. Hãy bấm vào đó và chọn lý do, Admin sẽ xem xét và xử lý."
    },
    {
      id: "item-5",
      question: "Tài liệu trên này có miễn phí không?",
      answer: "Hoàn toàn miễn phí! UniConnect hoạt động phi lợi nhuận với mục tiêu hỗ trợ sinh viên."
    },
    {
      id: "item-6",
      question: "Tôi muốn tìm nhóm học môn Giải tích, phải làm sao?",
      answer: "Bạn hãy truy cập mục 'Nhóm học tập', tìm các nhóm có tag #GiaiTich hoặc tự tạo một nhóm mới và dán link Google Meet/Zoom vào để mời mọi người."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center justify-center gap-3">
          <HelpCircle className="h-8 w-8 text-indigo-600" />
          Câu hỏi thường gặp
        </h1>
        <p className="text-slate-500">Giải đáp mọi thắc mắc về cách sử dụng UniConnect</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b-slate-100">
              <AccordionTrigger className="text-slate-800 font-semibold hover:text-indigo-600 hover:no-underline py-4 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <p className="text-indigo-900 font-medium">Vẫn còn thắc mắc?</p>
        <p className="text-indigo-600 text-sm mt-1">Liên hệ đội ngũ hỗ trợ qua email: support@uniconnect.edu.vn</p>
      </div>
    </div>
  );
}
