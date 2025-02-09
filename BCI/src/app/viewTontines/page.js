"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * ViewTontine is a functional React component that provides a detailed view of a selected Tontine.
 * It allows users to see the Tontine's wallet details, including XRP and RLUSD balances, and manage trustlines for external users.
 * The component fetches Tontine details and wallet balances dynamically and provides error handling for network or API issues.
 *
 * @return {JSX.Element} A JSX element rendering the tontine details, wallet balances, and a trustline management form.
 */
export default function ViewTontine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tontineId = searchParams.get("id");
  const [tontineDetails, setTontineDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState({
    xrp: "...",
    rlusd: "...",
  });
  const [error, setError] = useState("");
  const [trustline, setTrustline] = useState(null);
  const [trustlineMessage, setTrustlineMessage] = useState("");
  const [loadingTrustline, setLoadingTrustline] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    if (!tontineId) {
      setError(
        "Tontine ID is missing. Please return to the dashboard and select a valid tontine.",
      );
    } else {
      fetchTontineDetails(tontineId);
    }
  }, [tontineId]);

  const fetchTontineDetails = async (id) => {
    try {
      const response = await fetch(`/api/tontines/details?id=${id}`);
      const data = await response.json();

      if (response.ok) {
        setTontineDetails(data);
        fetchWalletBalance(data.wallet.address);
      } else {
        setError(data.error || "Unable to fetch tontine details.");
      }
    } catch (err) {
      setError("Network error occurred while fetching tontine details.");
    }
  };

  const fetchWalletBalance = async (walletAddress) => {
    console.log(`🔍 Getting balances for : ${walletAddress}`);

    if (!walletAddress.startsWith("r")) {
      console.error("❌ Invalid XRP address :", walletAddress);
      setWalletBalance({ xrp: "Error", rlusd: "Error" });
      return;
    }

    try {
      const response = await fetch(`/api/wallet/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });

      const data = await response.json();
      console.log("📊 Balance API response :", data);

      if (response.ok) {
        setWalletBalance({
          xrp: data.xrpBalance || "0.00",
          rlusd: data.rlusdBalance || "0.00",
        });
      } else {
        console.error("❌ Balance API error :", data.error);
        setWalletBalance({ xrp: "Erreur", rlusd: "Erreur" });
      }
    } catch (err) {
      console.error("❌ Network Error :", err);
      setWalletBalance({ xrp: "Error", rlusd: "Error" });
    }
  };

  const handleAddTrustline = async (e) => {
    e.preventDefault();
    if (!recipientAddress) {
      setTrustlineMessage("❌  Please enter an XRPL address");
      return;
    }

    setLoadingTrustline(true);
    setTrustlineMessage("⏳ Creation of the trustline in progress...");

    try {
      const res = await fetch("/api/trustline/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tontineWalletAddress: tontineDetails.wallet.address,
          tontineSecret: tontineDetails.wallet.secret,
          recipientAddress: recipientAddress,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTrustlineMessage(data.message);
        if (data.trustline) {
          setTrustline(data.trustline);
        }
      } else {
        setTrustlineMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setTrustlineMessage("❌ An error occurred");
    } finally {
      setLoadingTrustline(false);
    }
  };

  return (
    <div className="view-tontine-container">
      <header>
        <h1 className="tontine-title">{tontineDetails?.tontineName}</h1>
        <button className="btn btn-back" onClick={() => router.push("/")}>
          Back to Home
        </button>
      </header>

      <section className="details-section">
        <p>
          <strong>Wallet of the Tontine:</strong>{" "}
          {tontineDetails?.wallet.address}
        </p>
        <p>
          <strong>XRP Balance:</strong> {walletBalance.xrp}
        </p>
        <p>
          <strong>RLUSD Balance:</strong> {walletBalance.rlusd}
        </p>
      </section>

      <section className="trustline-section">
        <h2>Create an additional Trustline for an external user</h2>
        <form onSubmit={handleAddTrustline} className="trustline-form">
          <input
            type="text"
            placeholder="Recipient’s XRPL address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loadingTrustline}
          >
            {loadingTrustline ? "Adding..." : "Create Trustline"}
          </button>
        </form>
        {trustlineMessage && (
          <p className="trustline-message">{trustlineMessage}</p>
        )}
      </section>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

        :global(html, body) {
          margin: 0;
          padding: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          background: linear-gradient(135deg, #13151a 0%, #1f2937 100%);
          color: #f3f4f6;
          line-height: 1.6;
        }

        .view-tontine-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: rgba(30, 30, 40, 0.9);
          color: #f3f4f6;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .tontine-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .btn-back {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: #fff;
        }

        .btn-back:hover {
          transform: scale(1.05);
        }

        .details-section {
          padding: 1.5rem;
          background: rgba(40, 40, 50, 0.95);
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .trustline-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
        }

        .trustline-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .trustline-form input {
          padding: 0.75rem;
          width: 100%;
          max-width: 500px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(40, 40, 50, 0.95);
          color: #fff;
        }

        .trustline-message {
          margin-top: 1rem;
          font-size: 1rem;
          color: #ff6b6b;
        }
      `}</style>
    </div>
  );
}
