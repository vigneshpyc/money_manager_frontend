import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";

const TransactionList = ({refresh}) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [refresh]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Transaction History
      </h2>
      {transactions.length === 0 ? (
      <p className="text-gray-500 text-center">
        No transactions added yet
      </p>) : (
        transactions.map((t) => (
        <div
          key={t._id}
          className="flex justify-between py-2 border-b"
        >
          <div>
            <p className="font-medium">{t.description}</p>
            <p className="text-sm text-gray-500">
              {t.category} | {t.division}
            </p>
          </div>

          <p
            className={
              t.type === "income"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            ₹{t.amount}
          </p>
          
        </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
