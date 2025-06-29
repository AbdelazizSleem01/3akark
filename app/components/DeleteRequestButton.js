'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function DeleteRequestButton({ requestId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة هذا الطلب!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/requests/${requestId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire(
            'تم الحذف!',
            'تم حذف الطلب بنجاح.',
            'success'
          );
          router.refresh();
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        Swal.fire(
          'خطأ!',
          'حدث خطأ أثناء محاولة حذف الطلب.',
          'error'
        );
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="btn btn-sm btn-outline btn-error"
    >
      <Trash2 className="w-4 h-4" />
      حذف
    </button>
  );
}