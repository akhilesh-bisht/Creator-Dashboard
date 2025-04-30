# Creator-Dashboard

Creator Dashboard

A full-stack web application for managing and viewing content. This dashboard allows creators and admin users to register, log in, view feeds from multiple sources (like Reddit and Twitter), save feeds locally, report inappropriate content, and manage user credits. Admin users can view analytics, manage users, and review reported feeds.

## Features

- **User Authentication**
  - Register and log in using JWT-based authentication.
  - Secure login and protected routes accessible only to authenticated users.
- **Feed Aggregation**

  - Fetch feeds from multiple sources (e.g., Reddit and Twitter).
  - View combined feeds sorted by timestamp.
  - Filter feeds by source ("all", "reddit", "twitter").

- **Feed Interactions**

  - **Share Feed:** Share a feed via a URL (link is copied to clipboard).
  - **Report Feed:** Report a feed for inappropriate or spam content.
  - (Optional) **Save Feed:** Save a feed for later reference (localStorage-based).

- **Admin Panel**

  - View overall dashboard statistics (total users, reported feeds, total credits issued).
  - Manage users, review reports, and manage user credits.
  - Role-based access control with admin-only routes.

- **Real-Time Notifications**

  - Toast notifications for actions such as saving a feed, sharing, or reporting.

- **Responsive UI**
  - Built with React, Vite, and Tailwind CSS for a responsive, modern user interface.

## Running Locally

### Prerequisites

- **Node.js** (version 14 or above)
- **npm** or **yarn**
- A backend server (or API) running on `http://localhost:4500` for authentication, feed data, and admin endpoints.  
  _(Make sure the backend is configured for CORS, and update the proxy settings in `vite.config.js` if necessary.)_

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/creator-dashboard.git
   cd creator-dashboard
   Install dependencies:
   ```

bash
Copy
Edit
npm install

# or

yarn install
Configure environment variables (if needed):
Create a .env file in the project root (if required) and add any necessary environment variables, such as:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:4500/api
Run the development server:

bash
Copy
Edit
npm run dev

# or

yarn dev
Access the application:
Open your browser and navigate to http://localhost:5174 (or the port configured by Vite).

Backend Setup
If your project includes the backend:

Navigate to the backend directory:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:
Create a .env file in the backend folder with entries such as:

env
Copy
Edit
PORT=4500
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
CORS_ALLOWED_ORIGINS=http://localhost:5174
Run the backend server:

bash
Copy
Edit
npm run dev

# or using nodemon:

nodemon server.js
Deployment Steps
Frontend Deployment
Build the project:

bash
Copy
Edit
npm run build

# or

yarn build
Preview the build locally:

bash
Copy
Edit
npm run preview

# or

yarn preview
Deploy to a hosting provider:

Vercel/Netlify:
Import your repository and set the build command (npm run build) and output directory (typically dist).

Render/Surge:
Follow the hosting provider’s deployment instructions for Vite applications.

Update API endpoints (if necessary): If your backend is deployed separately, update the baseURL in your API service (api.js) or use environment variables.

Backend Deployment
Choose a Cloud Provider:
Examples: Render, Heroku, DigitalOcean, AWS.

Set up the environment:

Provide environment variables for PORT, JWT_SECRET, MONGODB_URI, and CORS_ALLOWED_ORIGINS.

Configure the package.json with a start script if deploying on Heroku or similar.

Deploy the application:
Push your changes to a repository connected to your hosting provider, or use the provider’s CLI.

CORS Configuration:
Ensure that your backend CORS configuration allows requests from your deployed frontend domain.

Test the deployed API:
Verify the endpoints are working via tools like Postman or your browser.

Additional Notes
Proxy Setup:
The Vite configuration includes a proxy to forward API requests during development. Ensure that the proxy settings are updated when deploying if needed.

SSL & Security:
For production deployments, configure SSL (HTTPS) on both frontend and backend, and secure your JWT secret and other sensitive environment variables.

Error Reporting:
In production, consider setting up error logging (using Sentry, LogRocket, or similar tools) to monitor issues.

Contributing
Contributions are welcome! Please submit a pull request or open an issue if you encounter bugs or have improvements.

License
MIT

yaml
Copy
Edit

---

Save this as `README.md` in your project’s root directory.  
Feel free to modify any sections or add more details according to your project’s specifics!
