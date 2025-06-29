'use client';

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatCard = ({ title, value, icon, change, changeType }) => (
  <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
    <div className="card-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="card-title text-lg">{title}</h2>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === "positive" ? "text-green-500" : "text-red-500"
              }`}
            >
              {changeType === "positive" ? "↑" : "↓"} {change} عن الشهر الماضي
            </p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  </div>
);

export default function DashboardClient() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/stats?range=${timeRange}`);
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  const chartData = stats
    ? [
        { name: "العقارات", value: stats.propertyCount },
        { name: "الطلبات", value: stats.requestCount },
        { name: "المستخدمين", value: stats.userCount },
      ]
    : [];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            لوحة التحكم والإحصائيات
          </h1>
          <p className="text-gray-600 mt-2">
            نظرة شاملة على أداء نظام إدارة العقارات
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            className="select select-bordered select-sm md:select-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            disabled={loading}
          >
            <option value="all">كل الفترات</option>
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="year">آخر سنة</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-base-100">
          <progress className="progress progress-primary w-56"></progress>
          <p className="text-lg font-medium text-primary animate-pulse">
            جاري التحميل، الرجاء الانتظار...
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>خطأ في تحميل البيانات: {error}</span>
          </div>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="عدد العقارات"
              value={stats.propertyCount}
              icon="🏠"
              change={stats.propertyChange}
              changeType={stats.propertyChange >= 0 ? "positive" : "negative"}
            />
            <StatCard
              title="عدد الطلبات"
              value={stats.requestCount}
              icon="📋"
              change={stats.requestChange}
              changeType={stats.requestChange >= 0 ? "positive" : "negative"}
            />
            <StatCard
              title="عدد المستخدمين"
              value={stats.userCount}
              icon="👥"
              change={stats.userChange}
              changeType={stats.userChange >= 0 ? "positive" : "negative"}
            />
          </div>

          <section aria-labelledby="data-distribution-heading">
            <h2 id="data-distribution-heading" className="sr-only">
              توزيع البيانات
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-100 shadow-md p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-700">
                  توزيع البيانات
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [value, "العدد"]}
                        labelFormatter={(label) => `نوع: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#1d4ed8" name="العدد" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-700">
                  نسبة التوزيع
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#1d4ed8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, "العدد"]}
                        labelFormatter={(label) => `نوع: ${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
