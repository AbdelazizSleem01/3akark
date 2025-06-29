"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Home,
  Landmark,
  MapPin,
  Ruler,
  DollarSign,
  Image as ImageIcon,
  Text,
  Trash2,
  FileEditIcon,
  UploadCloudIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RichTextEditor from "@/app/components/RichTextEditor";

const MySwal = withReactContent(Swal);

export default function CreatePropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [description, setDescription] = useState(
    "<p>أدخل وصف العقار هنا...</p>"
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    images: [],
    type: "",
    area: "",
    location: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setSelectedImages(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });

    const newPreviews = [...selectedImages];
    newPreviews.splice(index, 1);
    setSelectedImages(newPreviews);
  };

  const removeExistingImage = (index) => {
    const newImages = [...existingImages];
    newImages.splice(index, 1);
    setExistingImages(newImages);
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get("/api/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      type: p.type,
      area: p.area,
      location: p.location,
      price: p.price,
      images: [],
    });
    setDescription(p.description || "<p>أدخل وصف العقار هنا...</p>");
    setExistingImages(p.images || []);
    setSelectedImages([]);
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكن التراجع بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/properties/${id}`);
        await fetchProperties();
        await MySwal.fire({
          title: "تم الحذف!",
          text: "تم حذف العقار بنجاح",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting property:", err);
        await MySwal.fire({
          title: "خطأ!",
          text: err.response?.data?.message || "حدث خطأ أثناء الحذف",
          icon: "error",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    for (const key in form) {
      if (key === "images") {
        form.images.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, form[key]);
      }
    }

    // إضافة الصور الموجودة سابقاً إذا كانت في وضع التعديل
    if (editingId && existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    formData.append("description", description);

    try {
      if (editingId) {
        await axios.put(`/api/properties/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post("/api/properties", formData);
      }
      await fetchProperties();
      setForm({
        title: "",
        images: [],
        type: "",
        area: "",
        location: "",
        price: "",
      });
      setDescription("<p>أدخل وصف العقار هنا...</p>");
      setSelectedImages([]);
      setExistingImages([]);

      await MySwal.fire({
        title: "تم بنجاح!",
        text: editingId ? "تم تعديل العقار" : "تم إضافة العقار",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      await MySwal.fire({
        title: "خطأ!",
        text: err.response?.data?.message || "حدث خطأ أثناء الإرسال",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <Home className="w-6 h-6" />
          {editingId ? "تعديل العقار" : "إضافة عقار جديد"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-primary">
                <Text className="w-4 h-4" />
                اسم العقار
              </span>
            </label>
            <input
              name="title"
              value={form.title}
              placeholder="أدخل اسم العقار"
              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-primary">
                <Landmark className="w-4 h-4" />
                نوع العقار
              </span>
            </label>
            <input
              name="type"
              value={form.type}
              placeholder="شقة/فيلا/أرض"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-primary">
                  <Ruler className="w-4 h-4" />
                  المساحة (م²)
                </span>
              </label>
              <input
                name="area"
                type="number"
                value={form.area}
                placeholder="المساحة بالمتر المربع"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-primary">
                  <DollarSign className="w-4 h-4" />
                  السعر (ج.م)
                </span>
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                placeholder="السعر بالجنيه المصري"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                الموقع
              </span>
            </label>
            <input
              name="location"
              value={form.location}
              placeholder="أدخل عنوان العقار"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />
          </div>

          {/* حقل وصف العقار */}
          <div className="form-control">
            <label className="label my-1">
              <span className="label-text flex items-center gap-2 text-primary">
                <FileEditIcon className="w-4 h-4" />
                وصف العقار
              </span>
            </label>
            <RichTextEditor content={description} onChange={setDescription} />
          </div>

          {/* حقل الصور */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-primary">
                <ImageIcon className="w-4 h-4" />
                صور العقار
              </span>
            </label>

            {/* مربع سحب وإفلات للصور */}
            <div
              className="border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-base-200 transition-colors"
              onClick={() => document.getElementById("file-upload").click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("bg-base-200");
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("bg-base-200");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("bg-base-200");
                handleImages({ target: { files: e.dataTransfer.files } });
              }}
            >
              <input
                id="file-upload"
                type="file"
                name="images"
                multiple
                className="hidden"
                onChange={handleImages}
                required={
                  !editingId ||
                  (existingImages.length === 0 && selectedImages.length === 0)
                }
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloudIcon className="w-8 h-8 text-primary" />
                <p className="font-medium">
                  اسحب وأفلت الصور هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-gray-500">يمكنك رفع أكثر من صورة</p>
              </div>
            </div>

            {/* عرض الصور المختارة */}
            {(selectedImages.length > 0 || existingImages.length > 0) && (
              <div className="mt-4 space-y-4">
                {selectedImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      الصور المختارة:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImages.map((img, index) => (
                        <div
                          key={`selected-${index}`}
                          className="relative group"
                        >
                          <img
                            src={img}
                            alt={`صورة ${index + 1}`}
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">الصور الحالية:</h4>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group"
                        >
                          <img
                            src={img}
                            alt={`صورة ${index + 1}`}
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExistingImage(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : editingId ? (
                "حفظ التعديل"
              ) : (
                "إضافة العقار"
              )}
            </button>
          </div>
        </form>
      </div>

      {properties.length === 0 ? (
        <div className="text-center mt-8 border p-6 rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">لا توجد عقارات حالياً</h2>
          <p className="text-gray-600">
            يمكنك إضافة عقار جديد من خلال النموذج أعلاه.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4">العقارات الحالية</h2>
          <div className="space-y-4">
            {properties.map((p) => (
              <div
                key={p._id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-gray-600">
                    {p.location} - {p.price} ج.م
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(p)}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleDelete(p._id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
