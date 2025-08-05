☕ Get Me A Chai - Crowdfunding Platform
A full-stack crowdfunding platform that allows creators to receive support from their audience — one chai at a time. Built using Node.js, Express.js, MongoDB, and PayPal, with robust session-based authentication for a secure and seamless experience.

📌 Features
🔐 Secure user authentication using sessions (express-session + MongoDB store)

📣 Create and manage personalized support campaigns

💳 Real-time PayPal payment integration

🧾 Transaction logging with fraud detection and validation

📱 Mobile-responsive user interface (ReactJS frontend)

🧩 Modular code architecture with scalable MongoDB schemas

🧑‍💻 Tech Stack
Layer	Technology
Frontend	React.js
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Authentication	express-session, MongoDB session store
Payment	PayPal REST API
Tools/DevOps	Postman, GitHub, VS Code

⚙️ Setup & Installation
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/aartthh/get-me-a-chai-crowdfunding.git
cd get-me-a-chai-crowdfunding
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env file in the root directory and add:

ini
Copy
Edit
MONGO_URI=<your-mongodb-uri>
SESSION_SECRET=<your-session-secret>
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>
4. Run the application
bash
Copy
Edit
npm run dev
The app will be running at: http://localhost:3000

✨ Highlights
Built secure backend routes using Express and middleware for auth-protection

Designed scalable MongoDB schemas to support high-performance querying

Integrated PayPal to capture payments and return real-time confirmation

Implemented logging for each transaction to track contributions

Followed MVC architecture for clean code separation

🔒 Authentication
Users can sign up and log in using email/password credentials

Sessions are maintained using cookies and stored in MongoDB

Protected routes prevent unauthorized access

🧾 Payments with PayPal
Used PayPal’s RESTful Checkout API for handling donations

Supporters can donate any amount

Secure redirection and confirmation ensure a reliable user experience

📜 License
This project is licensed under the MIT License. Feel free to fork and contribute.
