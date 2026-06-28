# 🌿 Folium - Presale Mini App

A complete Telegram Mini App for the Folium meme coin presale on BSC.

## Features
- ✅ Wallet registration (BSC)
- ✅ $7 payment with BNB
- ✅ Auto token distribution (700 unlocked, 300 locked 1 month)
- ✅ Referral system ($2 per referral)
- ✅ Revenue split ($5 to project, $2 to referrer)
- ✅ Beautiful Telegram Mini App UI
- ✅ Dashboard with token status

## Project Structure
```
folium/
  frontend/     ← React Mini App
  backend/      ← Node.js API + Telegram Bot
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env file
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL to your backend URL
npm start
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|---|---|
| TELEGRAM_BOT_TOKEN | From @BotFather |
| BSC_RPC_URL | BSC RPC endpoint |
| DISTRIBUTOR_PRIVATE_KEY | Wallet that sends tokens |
| TOKEN_CONTRACT_ADDRESS | Folium token address |
| PROJECT_WALLET | Where $5 BNB goes |
| ADMIN_TELEGRAM_IDS | Your Telegram ID |

### Frontend (.env)
| Variable | Description |
|---|---|
| REACT_APP_API_URL | Backend API URL |

## Deployment
1. Deploy backend to Railway/Render/VPS
2. Deploy frontend to Vercel/Netlify
3. Set frontend URL in BotFather as Mini App URL
4. Update FRONTEND_URL in backend .env

## Bot Commands
- /start - Open Mini App
- /status - Check registration & tokens
- /referral - Get referral link
