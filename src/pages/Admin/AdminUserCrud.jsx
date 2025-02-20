import { useState, useEffect } from "react";
import UserCrud from "../../components/UserCreation/UserCrud";
import Loading from "../../components/loading/Loading"; 

export default function AdminUserCrud() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate an API request delay (replace this with actual API call if needed)
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <UserCrud />
    </div>
  );
}
