"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Renders the CreateTontine component, which allows a user to create a new Tontine by inputting relevant details such as the Tontine name, destination address, and scheduled time.
 * The form validates input fields, retrieves the userId from localStorage, and sends a request to create a depository wallet on submission.
 * Displays appropriate messages indicating the progress and outcome of the creation process.
 *
 * @return {JSX.Element} A React element containing the Tontine creation form and user interface for managing Tontines.
 */
export default function CreateTontine() {
  const router = useRouter();

  const [tontineName, setTontineName] = useState("");
  const [destination, setDestination] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      console.error("❌ User not found in localStorage!");
      setMessage("⚠ Please log in again.");
      return;
    }
    setUserId(user.userId);
  }, []);

  const handleCreateWallet = async (e) => {
    e.preventDefault();

    if (!tontineName || !destination || !scheduledTime || !userId) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("⏳ Creation of the depositary wallet in progress...");

    try {
      const res = await fetch("/api/createWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tontineName,
          destination,
          scheduledTime,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ Erreur: ${data.error}`);
      } else {
        setMessage(
          "✅ Wallet depository and Trustline created successfully! REDIRECTION ...",
        );

        setTimeout(() => {
          router.push(`/viewTontines?id=${data.tontineId}`);
        }, 2000);
      }
    } catch (err) {
      setMessage("❌ Error during the creation of the wallet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content">
        <header className="header">
          <h1 className="title">Create a Tontine</h1>
          <button
            onClick={() => router.push("/")}
            className="btn btn-secondary"
          >
            Back to Home
          </button>
        </header>

        <main className="main-content">
          <section className="create-section">
            <h2 className="section-title">Create a New Tontine</h2>
            <motion.div
              className="create-card"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form className="create-form" onSubmit={handleCreateWallet}>
                <input
                  type="text"
                  placeholder="Name of the Tontine"
                  value={tontineName}
                  onChange={(e) => setTontineName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creation..." : "Create a depository wallet"}
                </button>
              </form>
            </motion.div>
          </section>
        </main>

        {message && (
          <div className="message">
            <p>{message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: "Poppins", sans-serif;
          background: #121212;
          color: #e0e0e0;
          transition:
            background 0.3s ease,
            color 0.3s ease;
        }

        :global(*),
        :global(*::before),
        :global(*::after) {
          box-sizing: border-box;
        }

        .page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(to bottom right, #212121, #121212);
        }

        .content {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
          background: rgba(33, 33, 33, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #b5179e, #7209b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.3s ease,
            transform 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(90deg, #b5179e, #7209b7);
          color: #fff;
        }

        .btn-secondary {
          background: linear-gradient(90deg, #3a0ca3, #4361ee);
          color: #fff;
        }

        .main-content {
          margin-top: 1rem;
        }

        .create-section {
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .create-card {
          background: rgba(48, 48, 48, 0.85);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .create-form input {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(54, 54, 54, 0.85);
          color: #e0e0e0;
          font-size: 1rem;
          outline: none;
          transition: border 0.3s ease;
        }

        .create-form input:focus {
          border-color: #7209b7;
        }

        .message {
          margin-top: 1rem;
          color: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
