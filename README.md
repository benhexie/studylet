# Studylet

Studylet is a web application designed for creating, managing, and practicing assessments. It provides an intuitive interface for both administrators and users to interact with assessments, track progress, and analyze performance.

## Features

- User registration and authentication
- Admin dashboard for managing assessments and users
- Create and manage assessments
- Practice assessments with real-time scoring
- View statistics and performance metrics
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/studylet.git
   cd studylet
   ```

2. Navigate to the API directory and install dependencies:

   ```bash
   cd api
   npm install
   ```

3. Navigate to the web directory and install dependencies:

   ```bash
   cd ../web
   npm install
   ```

4. Create a `.env` file in the `api` directory and add your environment variables:

   ```plaintext
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   NODE_ENV=development
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd api
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd ../web
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

- **User Registration**: Users can register by providing their name, email, and password.
- **Admin Login**: Admins can log in to manage assessments and users.
- **Create Assessments**: Admins can create new assessments and set them as public or private.
- **Practice Assessments**: Users can take assessments and view their scores and statistics.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [MongoDB](https://www.mongodb.com/) - A document database with the scalability and flexibility that you want
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for creating custom designs