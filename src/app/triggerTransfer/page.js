"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Component that triggers the transfer of expired tontines. This component displays the current status of the operation
 * and lists details of completed transfers. If no transfers are required, it informs the user accordingly. In production
 * environments, this operation might be automated via a cron job.
 *
 * @return {JSX.Element} The rendered component for triggering tontine transfers, including status messages,
 * transfer results, and navigation back to the dashboard.
 */
export default function TriggerTransfer() {
  const router = useRouter();
  const [message, setMessage] = useState("Initialisation...");
  const [transferResults, setTransferResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleTriggerTransfer();
  }, []);

  const handleTriggerTransfer = async () => {
    setMessage("Verification of tontines to be transferred...");
    setLoading(true);
    try {
      const res = await fetch("/api/triggerTransfer");
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Transfers completed successfully.");
        setTransferResults(data.results || []);
      } else {
        setMessage(data.error || "Error when initiating transfers.");
      }
    } catch (err) {
      console.error("Network Error :", err);
      setMessage("Error when initiating transfers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trigger-transfer-container">
      <header>
        <h1>Trigger Tontine Transfers</h1>
        <h2>
          Page that executes transactions of expired tontines (In production
          this will be automated with a crontab)
        </h2>
      </header>

      <main>
        <p className="status-message">{message}</p>

        {loading && <p>Loading...</p>}

        {!loading && transferResults.length > 0 && (
          <div className="results-section">
            <h2>Transfer Results</h2>
            <ul>
              {transferResults.map((result, index) => (
                <li key={index} className="result-card">
                  <p>
                    <strong>Tontine ID:</strong> {result.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {result.status}
                  </p>
                  <p>
                    <strong>Transaction:</strong>{" "}
                    {JSON.stringify(result.txResult)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && transferResults.length === 0 && (
          <p>No transfers made. All tontines are up to date.</p>
        )}

        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Back to Dashboard
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

        .trigger-transfer-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: #1a1a2e;
          color: #f3f4f6;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        header h1 {
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(to right, #34d399, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        .status-message {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .results-section {
          margin-top: 2rem;
        }

        .results-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #a3bffa;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .result-card {
          background: rgba(40, 40, 50, 0.95);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          text-align: left;
        }

        .result-card p {
          margin: 0.5rem 0;
        }

        .result-card strong {
          color: #34d399;
        }

        p {
          margin: 1rem 0;
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

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          color: #fff;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
