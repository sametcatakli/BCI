"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * TontineCard is a functional React component used to display information about a tontine.
 * It shows the tontine's name, status, and the scheduled date and time of its execution.
 * Clicking on the card navigates to a detailed view of the tontine.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.tontineName - The name of the tontine.
 * @param {string} props.scheduledTime - The scheduled time of the tontine (in a format that can be parsed by Date).
 * @param {string} props.status - The current status of the tontine.
 * @param {string} props.id - A unique identifier for the tontine.
 *
 * @returns {React.Element} - A motion-enabled clickable card displaying the tontine's details.
 */
const TontineCard = ({ tontineName, scheduledTime, status, id }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    if (!id) {
      console.error("Tontine ID is missing for this card.");
      return;
    }
    router.push(`/viewTontines?id=${id}`);
  };

  return (
    <motion.div
      className="tontine-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleViewDetails}
      style={{ cursor: "pointer" }}
    >
      <h3 className="tontine-title">{tontineName}</h3>
      <p className="tontine-status">Status: {status}</p>
      <p className="tontine-scheduled">
        Scheduled: {new Date(scheduledTime).toLocaleString()}
      </p>
    </motion.div>
  );
};

/**
 * Dashboard component that provides an overview of the user's wallet balance, tontines,
 * and actions to join or create new tontines. Redirects to login if the user is not authenticated.
 *
 * This component handles:
 * - User authentication validation and redirection.
 * - Fetching and displaying user's wallet balance and tontine details.
 * - Logout functionality to remove user details and redirect to login.
 *
 * @return {JSX.Element|null} The rendered Dashboard component, or null if not yet mounted.
 */
export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [walletBalance, setWalletBalance] = useState({
    xrp: "...",
    rlusd: "...",
  });
  const [tontines, setTontines] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
    fetchWalletBalance(storedUser.walletAddress);
    fetchUserTontines(storedUser.userId);

    setMounted(true);
  }, [router]);

  const fetchUserTontines = async (userId) => {
    try {
      const response = await fetch(`/api/tontines/list?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setTontines(data.tontines);
      } else {
        console.error(
          "Problem encountered during the collection of tontines  :",
          data.error,
        );
      }
    } catch (error) {
      console.error("Network error while retrieving tontines :", error);
    }
  };

  const fetchWalletBalance = async (walletAddress) => {
    if (!walletAddress || !walletAddress.startsWith("r")) {
      console.error("❌ Invalid XRP address  :", walletAddress);
      setWalletBalance({ xrp: "Error", rlusd: "Error" });
      return;
    }

    try {
      const response = await fetch("/api/wallet/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });

      const data = await response.json();
      if (response.ok) {
        setWalletBalance({
          xrp: data.xrpBalance || "0.00",
          rlusd: data.rlusdBalance || "0.00",
        });
      } else {
        console.error("❌ Error while getting balance :", data.error);
        setWalletBalance({ xrp: "Error", rlusd: "Error" });
      }
    } catch (error) {
      console.error("❌ Network Error :", error);
      setWalletBalance({ xrp: "Error", rlusd: "Error" });
    }
  };

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <p>
            Logged in as: <strong>{user ? user.walletAddress : "..."}</strong>
          </p>
        </div>
        <h1 className="dashboard-title">Tontine Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-light-mode">Light Mode</button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="overview-section">
          <h2 className="section-heading">Overview</h2>
          <div className="overview-cards">
            <div className="card wallet-card">
              <h3>Your Wallet Balance</h3>
              <p className="wallet-amount">XRP: {walletBalance.xrp}</p>
              <p className="wallet-amount">RLUSD: {walletBalance.rlusd}</p>
            </div>
            <div className="card tontines-card">
              <h3>Your Tontines</h3>
              {tontines.length === 0 ? (
                <p>No tontines available</p>
              ) : (
                tontines.map((tontine) => (
                  <TontineCard
                    key={tontine.id}
                    id={tontine.id}
                    tontineName={tontine.tontineName}
                    scheduledTime={tontine.scheduledTime}
                    status={tontine.status}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="join-tontine-section">
          <h2 className="section-heading">Want to Join a Tontine?</h2>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/join")}
          >
            Join a Tontine
          </button>
        </section>

        <button
          className="btn btn-highlight"
          onClick={() => router.push("/create-tontine")}
        >
          Create a Tontine
        </button>
      </main>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap");

        
        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: linear-gradient(135deg, #13151a 0%, #1f2937 100%);
          color: #f3f4f6;
          line-height: 1.6;
        }

        
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2.5rem;
        }

        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .user-info {
          position: absolute;
          left: 0;
          top: -40px;
          font-size: 1rem;
          color: #a3bffa;
        }

        .dashboard-title {
          font-family: "Space Grotesk", sans-serif;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.03em;
        }

        .dashboard-actions {
          display: flex;
          gap: 1.25rem;
        }

        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap");

        
        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: linear-gradient(135deg, #13151a 0%, #1f2937 100%);
          color: #f3f4f6;
          line-height: 1.6;
        }

        
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2.5rem;
        }

        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .dashboard-title {
          font-family: "Space Grotesk", sans-serif;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.03em;
        }

        .dashboard-actions {
          display: flex;
          gap: 1.25rem;
        }

        
        .btn {
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn:hover::before {
          opacity: 1;
        }

        .btn-light-mode {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          color: #fff;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }

        .btn-highlight {
          margin-top: 1.25rem;
          padding: 1.25rem 2.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f472b6, #db2777);
          color: #fff;
          box-shadow: 0 6px 20px rgba(244, 114, 182, 0.3);
          border-radius: 16px;
        }

        .btn-highlight:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(244, 114, 182, 0.4);
        }

        
        .dashboard-main {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        
        .overview-section {
          background: rgba(255, 255, 255, 0.03);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-heading {
          font-family: "Space Grotesk", sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .overview-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .card {
          background: rgba(30, 30, 40, 0.8);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card h3 {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .wallet-amount {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(to right, #34d399, #10b981);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        
        .participation-section {
          background: rgba(255, 255, 255, 0.03);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .participation-content {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .input-field {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(30, 30, 40, 0.9);
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .input-field::placeholder {
          color: #9ca3af;
        }

        
        .tontine-card {
          background: rgba(40, 40, 50, 0.9);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tontine-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .tontine-title {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .tontine-cycle {
          font-size: 1.125rem;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1.5rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .dashboard-title {
            font-size: 2.5rem;
          }

          .overview-cards {
            grid-template-columns: 1fr;
          }

          .participation-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
