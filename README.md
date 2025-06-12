
# Authentication System

A simple authentication system using Node.js, Express, PostgreSQL, and Google reCAPTCHA.

## How to Run the Project Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnkushRehal18/AuthenticationSystem.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your configuration (example below):

   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret
   DB_CONNECTION_STRING=your_db_string
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. Open your browser and visit  
   👉 `http://localhost:3000`

---

## 🌐 Hosted Version

The application is live at: [https://authenticationsystem-evv2.onrender.com](https://authenticationsystem-evv2.onrender.com)
