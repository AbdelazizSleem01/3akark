import Notification from "@/models/Notification";
import { connectDB } from "@/lib/mongodb";

export async function notifyAdmin({ action, entity, entityId, performedBy, message }) {
  await connectDB();

  if (!message) {
    switch (action) {
      case 'create':
        if (entity === 'user') message = 'تم تسجيل مستخدم جديد في النظام';
        else if (entity === 'property') message = 'تم إضافة عقار جديد';
        else if (entity === 'request') message = 'تم إنشاء طلب جديد';
        else message = `تم إنشاء ${entity}`;
        break;

      case 'update':
        if (entity === 'user') message = 'تم تعديل بيانات مستخدم';
        else if (entity === 'property') message = 'تم تعديل بيانات عقار';
        else if (entity === 'request') message = 'تم تعديل طلب';
        else message = `تم تعديل ${entity}`;
        break;

      case 'delete':
        if (entity === 'user') message = 'تم حذف مستخدم من النظام';
        else if (entity === 'property') message = 'تم حذف عقار';
        else if (entity === 'request') message = 'تم حذف طلب';
        else message = `تم حذف ${entity}`;
        break;

      default:
        message = `تم تنفيذ عملية ${action} على ${entity}`;
        break;
    }
  }

  const newNotification = new Notification({
    action,
    entity,
    entityId,
    performedBy,
    message
  });

  await newNotification.save();
}
