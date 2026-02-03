import { useState } from "react";
import { addTransaction } from "../services/api";

const TransactionModal = ({ close, refresh }) => {
  const [type, setType] = useState("income");
  const [form, setForm] = useState({
    amount: "",
    category: "",
    division: "personal",
    description: "",
    dateTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await addTransaction({
      ...form,
      type,
      amount: Number(form.amount),
    });

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Add {type === "income" ? "Income" : "Expense"}
        </h2>

        {/* Tabs */}
        <div className="flex mb-4">
          {["income", "expense"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 ${
                type === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-3">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category (Food, Fuel, etc)"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <select
            name="division"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="personal">Personal</option>
            <option value="office">Office</option>
          </select>

          <input
            type="datetime-local"
            name="dateTime"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
