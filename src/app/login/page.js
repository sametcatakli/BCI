"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The `Login` function component renders a login form allowing users to sign in using their wallet address.
 * It manages client-side state for wallet address, error messages, and ensures the component is client-side rendered.
 * Upon successful login, the user data is saved to local storage and the user is redirected to the homepage.
 *
 * @return {JSX.Element|null} The rendered login component, or null if the component is not being rendered on the client.
 */
export default function Login() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("LocalStorage content on load:", user);

    if (user) {
      console.log("User found in LocalStorage, redirecting...");
      router.push("/");
    }
  }, [router]);

  if (!isClient) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!walletAddress) {
      setError("Veuillez entrer une adresse de wallet.");
      return;
    }

    try {
      console.log("Attempting login with walletAddress:", walletAddress);

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful, received data:", data);
        const userData = {
          userId: data.userId,
          walletAddress: data.walletAddress,
          sessionToken: data.sessionToken,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User saved to LocalStorage:", userData);

        router.push("/");
      } else {
        console.error("Login error from server:", data.error);
        setError(data.error || "Erreur lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la connexion:", error);
      setError("Une erreur réseau s'est produite.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Sign In</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Wallet address (ex: raXc5eF...)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: linear-gradient(to bottom right, #0d0d0d, #1a1a2e);
          color: #e0e0e0;
          overflow: hidden;
        }

        
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
          background: linear-gradient(to bottom right, #0d0d0d, #1a1a2e);
        }

        .login-content {
          background: rgba(33, 33, 33, 0.95);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          text-align: center;
          max-width: 420px;
          width: 100%;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .login-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, #b5179e, #7209b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .login-form input {
          padding: 0.85rem;
          border: none;
          border-radius: 10px;
          background: rgba(50, 50, 60, 0.85);
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition:
            border-color 0.3s ease,
            background 0.3s ease;
          border: 2px solid transparent;
        }

        .login-form input:focus {
          border-color: #b5179e;
          background: rgba(70, 70, 90, 0.95);
          box-shadow: 0 0 12px rgba(181, 23, 158, 0.5);
        }

        .btn-primary {
          padding: 0.85rem 1.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #b5179e, #7209b7);
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(181, 23, 158, 0.3);
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(181, 23, 158, 0.5);
        }

        .error-message {
          color: #ff6b6b;
          font-weight: bold;
          margin-top: 1rem;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}
