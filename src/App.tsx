import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

function getParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

type Page = "home" | "register" | "dashboard" | "referral";

interface User {
  telegram_id: string;
  wallet_address: string;
  referral_code: string;
  paid: boolean;
  tokens_total: number;
  tokens_unlocked: number;
  tokens_locked: number;
  unlock_date: string | null;
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bnbPrice, setBnbPrice] = useState("0.012");
  const [projectWallet, setProjectWallet] = useState("");
  const [stats, setStats] = useState({ paid_users: 0, total_raised_usd: 0 });

  const telegramId = getParam("tid") || "demo123";
  const referralCode = getParam("ref");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const priceRes = await axios.get(`${API_URL}/price`);
      setBnbPrice(priceRes.data.bnb);
      setProjectWallet(priceRes.data.project_wallet);

      const statsRes = await axios.get(`${API_URL}/stats`);
      setStats(statsRes.data);

      try {
        const userRes = await axios.get(`${API_URL}/user/${telegramId}`);
        if (userRes.data.user) {
          setUser(userRes.data.user);
          setPage("dashboard");
        }
      } catch (e) {}
    } catch (err) {
      console.log("API not connected yet");
    }
  }

  async function handleRegister() {
    setError("");
    if (!wallet || !wallet.startsWith("0x") || wallet.length !== 42) {
      setError("Please enter a valid BSC wallet address");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        telegram_id: telegramId,
        wallet_address: wallet,
        referral_code: referralCode,
      });
      setUser(res.data.user);
      setPage("dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  }

  async function handleVerifyPayment() {
    setError("");
    if (!txHash) {
      setError("Please enter your transaction hash");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-payment`, {
        telegram_id: telegramId,
        tx_hash: txHash,
      });
      setUser(res.data.user);
      setSuccess("Payment verified! 700 FOLIUM tokens sent!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed");
    }
    setLoading(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setSuccess("Copied!");
    setTimeout(() => setSuccess(""), 2000);
  }

  const s: Record<string, React.CSSProperties> = {
    app: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 100%)", padding: "20px", paddingBottom: "40px" },
    header: { textAlign: "center", marginBottom: "24px" },
    logo: { fontSize: "48px", marginBottom: "8px" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#4ade80", marginBottom: "4px" },
    subtitle: { fontSize: "14px", color: "#6b7280" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "16px" },
    input: { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", marginBottom: "8px" },
    btnGreen: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "12px", background: "linear-gradient(135deg, #16a34a, #4ade80)", color: "black" },
    btnGray: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "12px", background: "rgba(255,255,255,0.1)", color: "white" },
    btnOutline: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #4ade80", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "12px", background: "transparent", color: "#4ade80" },
    error: { background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: "8px", padding: "12px", color: "#fca5a5", marginBottom: "12px", fontSize: "14px" },
    success: { background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.5)", borderRadius: "8px", padding: "12px", color: "#4ade80", marginBottom: "12px", fontSize: "14px" },
    row: { display: "flex", gap: "12px", marginBottom: "16px" },
    statCard: { flex: 1, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "12px", textAlign: "center" as const },
    label: { fontSize: "12px", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase" as const },
    green: { color: "#4ade80", fontWeight: "bold" },
    gray: { color: "#9ca3af" },
    white: { color: "white" },
    copyBtn: { background: "rgba(74,222,128,0.2)", border: "none", color: "#4ade80", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginTop: "8px", fontSize: "12px" },
    link: { color: "#4ade80", wordBreak: "break-all" as const, fontSize: "13px" },
  };

  if (page === "home") return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.logo}>🌿</div>
        <div style={s.title}>FOLIUM</div>
        <div style={s.subtitle}>Community Meme Coin on BSC</div>
      </div>

      <div style={s.row}>
        <div style={s.statCard}>
          <div style={{ fontSize: "20px", ...s.green }}>{stats.paid_users.toLocaleString()}</div>
          <div style={{ fontSize: "11px", ...s.gray }}>Registered</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: "20px", ...s.green }}>${stats.total_raised_usd.toLocaleString()}</div>
          <div style={{ fontSize: "11px", ...s.gray }}>Raised</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={{ ...s.label, marginBottom: "16px" }}>🎁 Public Sale Details</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={s.gray}>Price</span>
          <span style={{ ...s.white, fontWeight: "bold" }}>$7 ({bnbPrice} BNB)</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={s.gray}>You receive</span>
          <span style={s.green}>1,000 FOLIUM</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={s.gray}>Unlocked now</span>
          <span style={s.white}>700 tokens (70%)</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={s.gray}>Locked 1 month</span>
          <span style={s.white}>300 tokens (30%)</span>
        </div>
      </div>

      <div style={s.card}>
        <div style={{ ...s.label, marginBottom: "8px" }}>👥 Referral Rewards</div>
        <div style={s.white}>Earn <span style={s.green}>$2</span> for every friend you refer!</div>
      </div>

      <button style={s.btnGreen} onClick={() => setPage("register")}>
        🚀 Join Presale Now
      </button>

      <div style={s.row}>
        <a href="https://t.me/foliumcoin" style={{ flex: 1, textAlign: "center", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>📢 Telegram</a>
        <a href="https://twitter.com/foliumcoin" style={{ flex: 1, textAlign: "center", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>🐦 Twitter</a>
      </div>
    </div>
  );

  if (page === "register") return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.logo}>🌿</div>
        <div style={s.title}>Register</div>
        <div style={s.subtitle}>Connect your BSC wallet to join</div>
      </div>

      {error && <div style={s.error}>{error}</div>}

      <div style={s.card}>
        <div style={s.label}>Your BSC Wallet Address</div>
        <input style={s.input} placeholder="0x..." value={wallet} onChange={(e) => setWallet(e.target.value)} />
        <div style={{ fontSize: "12px", ...s.gray }}>Enter your MetaMask or Trust Wallet BSC address</div>
      </div>

      {referralCode && (
        <div style={s.card}>
          <div style={s.label}>Referral Code</div>
          <div style={s.green}>✅ {referralCode}</div>
        </div>
      )}

      <button style={{ ...s.btnGreen, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register Wallet"}
      </button>
      <button style={s.btnGray} onClick={() => setPage("home")}>← Back</button>
    </div>
  );

  if (page === "dashboard" && user) return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.logo}>🌿</div>
        <div style={s.title}>Dashboard</div>
      </div>

      {error && <div style={s.error}>{error}</div>}
      {success && <div style={s.success}>{success}</div>}

      <div style={s.card}>
        <div style={s.label}>Wallet</div>
        <div style={{ ...s.white, fontSize: "13px", wordBreak: "break-all" }}>{user.wallet_address}</div>
      </div>

      {!user.paid ? (
        <div style={s.card}>
          <div style={{ color: "#fbbf24", fontWeight: "bold", marginBottom: "12px" }}>⏳ Payment Pending</div>
          <div style={{ fontSize: "13px", ...s.gray, marginBottom: "12px" }}>
            Send exactly <span style={s.green}>{bnbPrice} BNB ($7)</span> to:
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
            <div style={s.link}>{projectWallet}</div>
            <button style={s.copyBtn} onClick={() => copyToClipboard(projectWallet)}>📋 Copy Address</button>
          </div>
          <div style={s.label}>Paste your transaction hash:</div>
          <input style={s.input} placeholder="0x transaction hash..." value={txHash} onChange={(e) => setTxHash(e.target.value)} />
          <button style={{ ...s.btnGreen, opacity: loading ? 0.7 : 1 }} onClick={handleVerifyPayment} disabled={loading}>
            {loading ? "Verifying..." : "✅ Verify Payment"}
          </button>
        </div>
      ) : (
        <div style={s.card}>
          <div style={{ ...s.green, fontWeight: "bold", marginBottom: "12px" }}>✅ Payment Confirmed!</div>
          <div style={s.row}>
            <div style={s.statCard}>
              <div style={{ fontSize: "22px", ...s.green }}>{user.tokens_unlocked}</div>
              <div style={{ fontSize: "11px", ...s.gray }}>Unlocked</div>
            </div>
            <div style={s.statCard}>
              <div style={{ fontSize: "22px", color: "#fbbf24", fontWeight: "bold" }}>{user.tokens_locked}</div>
              <div style={{ fontSize: "11px", ...s.gray }}>Locked</div>
            </div>
          </div>
          {user.unlock_date && (
            <div style={{ fontSize: "13px", ...s.gray, textAlign: "center", marginTop: "8px" }}>
              🔓 Unlocks on {new Date(user.unlock_date).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      <button style={s.btnOutline} onClick={() => setPage("referral")}>👥 View Referral Link</button>
    </div>
  );

  if (page === "referral" && user) {
    const referralLink = `https://t.me/FoliumBot?start=${user.referral_code}`;
    return (
      <div style={s.app}>
        <div style={s.header}>
          <div style={s.logo}>👥</div>
          <div style={s.title}>Referral</div>
          <div style={s.subtitle}>Earn $2 for every friend you refer</div>
        </div>

        {success && <div style={s.success}>{success}</div>}

        <div style={s.card}>
          <div style={s.label}>Your Referral Code</div>
          <div style={{ fontSize: "20px", ...s.green }}>{user.referral_code}</div>
        </div>

        <div style={s.card}>
          <div style={s.label}>Your Referral Link</div>
          <div style={s.link}>{referralLink}</div>
          <button style={s.copyBtn} onClick={() => copyToClipboard(referralLink)}>📋 Copy Link</button>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: "13px", ...s.gray, marginBottom: "8px" }}>💰 How it works</div>
          <div style={{ fontSize: "13px", ...s.white, lineHeight: "1.8" }}>
            1. Share your referral link<br />
            2. Friend registers and pays $7<br />
            3. You earn <span style={s.green}>$2 in BNB</span> automatically!
          </div>
        </div>

        <button style={s.btnGreen} onClick={() => copyToClipboard(referralLink)}>📤 Copy & Share Link</button>
        <button style={s.btnGray} onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
      </div>
    );
  }

  return null;
}

export default App;
