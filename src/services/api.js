const API_URL = "https://money-manager-backend-xdyn.onrender.com/api/transactions";

export const getTransactions = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addTransaction = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateTransaction = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
