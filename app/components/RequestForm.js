'use client';

import { useState } from 'react';
import { User, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function RequestForm({ propertyId }) {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showSuccessAlert = () => {
    return MySwal.fire({
      position: 'center',
      icon: 'success',
      title: 'تم إرسال طلبك بنجاح',
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        popup: '!font-sans !text-right',
        title: '!text-lg'
      },
      background: '#f8fafc',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/celebrate.gif")
        center top
        no-repeat
      `
    });
  };

  const showErrorAlert = (message) => {
    return MySwal.fire({
      icon: 'error',
      title: 'حدث خطأ',
      text: message || 'فشل في إرسال الطلب، يرجى المحاولة لاحقاً',
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#ef4444',
      customClass: {
        popup: '!font-sans !text-right'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, propertyId }),
      });

      const data = await res.json();
      
      if (data.success) {
        await showSuccessAlert();
        setForm({ name: '', whatsapp: '', email: '', message: '' });
      } else {
        await showErrorAlert(data.message);
      }
    } catch (err) {
      console.error(err);
      await showErrorAlert('حدث خطأ غير متوقع أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Send className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">تقديم طلب اهتمام</h2>
      </div>
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* حقل الاسم */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <User size={20} />
          </div>
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            className="input input-bordered w-full text-right text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* حقل الواتساب */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <Phone size={20} />
          </div>
          <input
            type="tel"
            name="whatsapp"
            placeholder="رقم الواتساب (مثال: 966501234567)"
            className="input input-bordered w-full text-right dir-ltr"
            value={form.whatsapp}
            onChange={handleChange}
            required
            pattern="[0-9]{10,15}"
            title="يجب أن يحتوي على أرقام فقط (10-15 رقم)"
          />
        </div>

        {/* حقل البريد الإلكتروني */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <Mail size={20} />
          </div>
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            className="input input-bordered w-full text-right dir-ltr"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* حقل الرسالة */}
        <div className="relative">
          <div className="absolute top-3 left-3 text-gray-500">
            <MessageSquare size={20} />
          </div>
          <textarea
            name="message"
            placeholder="رسالة إضافية (اختياري)"
            className="textarea textarea-bordered w-full min-h-[120px]  text-right"
            value={form.message}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-2 h-12 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send size={20} className="ml-2" />
              إرسال الطلب
            </>
          )}
        </button>
      </form>
    </div>
  );
}