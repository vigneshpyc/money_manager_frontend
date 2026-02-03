import { useState } from "react";
import Dashboard from "../components/Dashboard";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <Dashboard refresh={refresh} />
      <TransactionList refresh={refresh} />

      {/* Floating Add Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full text-3xl shadow-lg"
      >
        +
      </button>

      {open && (
        <TransactionModal
          close={() => setOpen(false)}
          refresh={() => setRefresh(!refresh)}
        />
      )}
    </div>
  );
};

export default Home;
