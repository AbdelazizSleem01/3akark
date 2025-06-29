// components/Footer.js
"use client";

import {
  Home,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copyright,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="">
      <div className="container bg-gray-100  text-gray-500">
        <div className="border-t border-gray-200 dark:border-gray-700 mx-auto px-4 py-6 flex items-center justify-center gap-1 text-sm">
          <Copyright className="w-4 h-4" />
          <span>جميع الحقوق محفوظة © 2025 عقارك</span>
        </div>
        <span className="flex items-center justify-center pb-5">
          <Link className="mx-2 underline hover:text-primary" href={"https://as-portfolio-ten.vercel.app/"}>
            Abdelaziz Sleem
          </Link>
          Powerd By
        </span>
      </div>
    </footer>
  );
}
