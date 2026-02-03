import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = ({ refresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [range, setRange] = useState("monthly");

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [expenseByCategory, setExpenseByCategory] = useState({});
  const [incomeByCategory, setIncomeByCategory] = useState({});

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



  const barChartData = {
  labels: ["Income", "Expense"],
  datasets: [
    {
      label: "Amount",
      data: [income, expense],
      backgroundColor: ["#16a34a", "#dc2626"],
    },
  ],
};

const pieChartData = {
  labels: Object.keys(expenseByCategory),
  datasets: [
    {
      data: Object.values(expenseByCategory),
      backgroundColor: [
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#3b82f6",
        "#8b5cf6",
      ],
    },
  ],
};
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [refresh]);

  useEffect(() => {
  const now = new Date();

  const filtered = transactions.filter((t) => {
    const tDate = new Date(t.dateTime);

    if (range === "weekly") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return tDate >= startOfWeek;
    }

    if (range === "monthly") {
      return (
        tDate.getMonth() === selectedMonth  &&
        tDate.getFullYear() === selectedYear
      );
    }

    if (range === "yearly") {
      return tDate.getFullYear() ===  selectedYear;
    }

    return true;
  });

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  setIncome(totalIncome);
  setExpense(totalExpense);
  
  const expenseMap = {};
  const incomeMap = {};

  filtered.forEach((t) => {
    if (t.type === "expense") {
      expenseMap[t.category] =
        (expenseMap[t.category] || 0) + t.amount;
    } else {
      incomeMap[t.category] =
        (incomeMap[t.category] || 0) + t.amount;
    }
  });

  setExpenseByCategory(expenseMap);
  setIncomeByCategory(incomeMap);
}, [transactions, range, selectedMonth, selectedYear]);

  return (
    <>
    <h1 style={{fontSize:'30px', color:'#4169E1'}}><b>Self Money Manager</b></h1>
    <div className="mb-6 p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>

        <div className="flex gap-2">
          {/* Range Selector */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* Month Picker – ONLY for Monthly */}
          {range === "monthly" && (
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(Number(e.target.value))
              }
              className="border p-2 rounded"
            >
              {months.map((m, index) => (
                <option key={m} value={index}>
                  {m}
                </option>
              ))}
            </select>
          )}

          {/* Year Picker – Monthly & Yearly */}
          {(range === "monthly" || range === "yearly") && (
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
              className="border p-2 rounded"
            >
              //Testin purpose defined years in future change this as dynamic future
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>


      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm text-gray-600">Income</p>
          <p className="text-xl font-bold text-green-700">
            ₹{income}
          </p>
        </div>

        <div className="p-4 bg-red-100 rounded">
          <p className="text-sm text-gray-600">Expense</p>
          <p className="text-xl font-bold text-red-700">
            ₹{expense}
          </p>
        </div>

        <div className="p-4 bg-blue-100 rounded">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-xl font-bold text-blue-700">
            ₹{income - expense}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Expense by Category
        </h3>

        {Object.keys(expenseByCategory).length === 0 ? (
          <p className="text-gray-500">No expense data</p>
        ) : (
          <ul className="space-y-1">
            {Object.entries(expenseByCategory).map(
              ([category, amount]) => (
                <li
                  key={category}
                  className="flex justify-between bg-red-50 p-2 rounded"
                >
                  <span>{category}</span>
                  <span className="font-medium text-red-700">
                    ₹{amount}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Income by Category
        </h3>

        {Object.keys(incomeByCategory).length === 0 ? (
          <p className="text-gray-500">No income data</p>
        ) : (
          <ul className="space-y-1">
            {Object.entries(incomeByCategory).map(
              ([category, amount]) => (
                <li
                  key={category}
                  className="flex justify-between bg-green-50 p-2 rounded"
                >
                  <span>{category}</span>
                  <span className="font-medium text-green-700">
                    ₹{amount}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Income vs Expense
        </h3>
        <Bar data={barChartData} />
      </div>
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Expense Distribution
        </h3>

        {Object.keys(expenseByCategory).length === 0 ? (
          <p className="text-gray-500">No expense data</p>
        ) : (
          <Pie data={pieChartData} />
        )}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
