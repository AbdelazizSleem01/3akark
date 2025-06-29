"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichTextEditor({ content, onChange }) {
  const editorRef = useRef(null);

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      <Editor
        apiKey="5ov9i22lpac3q4axpu4g5f4ruo7x7q5x80e10faz809rd6qr"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={content}
        onEditorChange={onChange}
        init={{
          language: "ar",
          directionality: "rtl",
          height: 500,
          menubar: false,
          plugins:
            "advlist autolink link image lists charmap preview anchor searchreplace code table help wordcount",
          toolbar: [
            "undo redo | styleselect | fontsizeselect",
            "bold italic underline | forecolor backcolor | alignright aligncenter alignleft alignjustify",
            "bullist numlist | link image | table",
            "removeformat | help",
          ].join(" | "),
          fontsize_formats:
            "8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px",
          content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              direction: rtl;
              text-align: right;
              line-height: 1.6;
            }
            body * {
              font-size: inherit !important;
            }
            h1, h2, h3, h4, h5, h6 {
              text-align: right;
            }
          `,
          style_formats: [
            {
              title: "عناوين",
              items: [
                { title: "عنوان 1", format: "h1" },
                { title: "عنوان 2", format: "h2" },
                { title: "عنوان 3", format: "h3" },
              ],
            },
            {
              title: "نصوص",
              items: [
                { title: "فقرة", format: "p" },
                { title: "اقتباس", format: "blockquote" },
                { title: "كود", format: "code" },
              ],
            },
            {
              title: "محاذاة",
              items: [
                { title: "يمين", format: "alignright" },
                { title: "وسط", format: "aligncenter" },
                { title: "يسار", format: "alignleft" },
              ],
            },
          ],
          image_advtab: true,
          link_title: false,
        }}
      />
    </div>
  );
}
