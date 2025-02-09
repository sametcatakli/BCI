"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * A React functional component that allows a user to join a tontine by providing a Tontine ID and User ID.
 * This component handles the state for user inputs, displays messages, and sends a POST request to add the user to the tontine.
 *
 * @return {JSX.Element} The rendered component that includes a form for joining a tontine and additional navigation options.
 */
export default function JoinTontine() {
  const router = useRouter();
  const [tontineId, setTontineId] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinTontine = async (e) => {
    e.preventDefault();

    if (!tontineId || !userId) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("⏳ Adding...");

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tontineId, userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          `✅ Success! You have joined the tontine. A Trustline has been created`,
        );
      } else {
        setMessage(`❌ Error : ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-tontine-container">
      <h1 className="title">Join a Tontine</h1>
      <form onSubmit={handleJoinTontine} className="join-form">
        <input
          type="text"
          placeholder="Name of Tontine"
          value={tontineId}
          onChange={(e) => setTontineId(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="User Id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Join"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}

      {}
      <button className="btn btn-secondary" onClick={() => router.push("/")}>
        Back to home
      </button>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap");

        
        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: linear-gradient(135deg, #121212, #1a1a2e);
          color: #f3f4f6;
          line-height: 1.6;
        }

        .join-tontine-container {
          max-width: 450px;
          margin: 3rem auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          text-align: center;
          transition: all 0.3s ease-in-out;
        }

        
        .title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        
        .join-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        
        .input-field {
          padding: 0.85rem 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease-in-out;
        }

        .input-field:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
        }

        .btn {
          padding: 0.9rem 1.8rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
          margin-top: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        
        .btn-secondary {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
        }

        .btn-secondary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        
        .message {
          margin-top: 1.2rem;
          font-size: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        
        @media (max-width: 600px) {
          .join-tontine-container {
            padding: 1.5rem;
            width: 90%;
          }

          .title {
            font-size: 1.75rem;
          }

          .btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
