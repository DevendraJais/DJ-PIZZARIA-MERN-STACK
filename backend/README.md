# DJ-Pizzaria Backend API

Complete MERN backend for DJ-Pizzaria Food Ordering Application with JWT authentication.

## Features

✅ User Registration with validation
✅ User Login with JWT tokens
✅ Password hashing with bcryptjs
✅ Protected routes with middleware
✅ MongoDB database integration
✅ Email validation
✅ Phone number validation (10-digit)
✅ Profile update functionality
✅ Change password functionality
✅ CORS enabled
✅ Error handling

## Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Request handlers
│   └── authController.js
├── middleware/          # Custom middleware
│   └── auth.js
├── models/              # Database models
│   └── User.js
├── routes/              # API routes
│   ├── authRoutes.js
│   └── userRoutes.js
├── .env.example         # Environment variables example
├── .gitignore
├── package.json
├── server.js            # Main server file
└── README.md
```

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dj-pizzaria
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Setup MongoDB

Make sure MongoDB is running locally:

```bash
# For Windows
mongod

# For macOS
brew services start mongodb-community

# For Linux
sudo service mongod start
```

Or use MongoDB Atlas (Cloud):
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Replace MONGODB_URI in .env
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dj-pizzaria
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📍 API: http://localhost:5000
🌐 Frontend: http://localhost:5173
```

## API Endpoints

### Public Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Secure123!",
  "confirmPassword": "Secure123!"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secure123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": "...",
    "iat": 1701830400,
    "exp": 1702435200
  }
}
```

### Protected Routes (Require JWT Token)

Add header: `Authorization: Bearer <your_token>`

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "",
    "city": "",
    "zipCode": ""
  }
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543211",
  "address": "123 Main St",
  "city": "New York",
  "zipCode": "10001"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Secure123!",
  "newPassword": "NewSecure456!",
  "confirmPassword": "NewSecure456!"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### User Routes

#### Get All Users (Admin)
```
GET /api/users
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

#### Get User By ID
```
GET /api/users/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { ... }
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

Common Status Codes:
- 200 - OK
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 404 - Not Found
- 500 - Internal Server Error

## Database Schema

### User Model

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, valid email),
  phone: String (required, 10 digits),
  password: String (required, min 8 chars, hashed),
  address: String,
  city: String,
  zipCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

✅ Password Hashing with bcryptjs (10 salt rounds)
✅ JWT Token Authentication
✅ Input Validation (express-validator)
✅ Email Format Validation
✅ Phone Format Validation
✅ Password Confirmation Check
✅ CORS Protection
✅ Protected Routes
✅ Secure Password Comparison
✅ Token Expiration (7 days)

## Testing with Postman

1. Open Postman
2. Create new Collection "DJ-Pizzaria"
3. Add requests for each endpoint
4. Use environments to store base_url and token
5. Test all scenarios

Environment variables in Postman:
```
base_url: http://localhost:5000
token: (paste token from login/register response)
```

## Frontend Integration

See the updated React components in `src/pages/Login.jsx` and `src/pages/Register.jsx` for:
- API endpoint URLs
- Request/response handling
- Token storage
- Error handling

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in .env
- Check network firewall

### Token Not Working
- Ensure `Authorization: Bearer <token>` header format
- Check token expiration
- Verify JWT_SECRET matches in .env

### CORS Error
- Check FRONTEND_URL in .env
- Verify frontend URL matches

### Port Already in Use
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

## Development Tips

- Use Postman or VS Code REST Client for testing
- Monitor server logs in terminal
- Use `npm run dev` for development (auto-reload with nodemon)
- Check .env is not tracked in git (.gitignore included)

## Next Steps

1. Test all endpoints with Postman
2. Connect frontend to backend
3. Store JWT token in localStorage
4. Add refresh token functionality
5. Implement more features (orders, etc.)
6. Deploy to production

## Support

For issues or questions, check:
1. Backend console logs
2. MongoDB connection status
3. Environment variables (.env)
4. Frontend network requests (DevTools)

---

**Status**: ✅ Ready to Use
**Version**: 1.0
**Last Updated**: December 6, 2025
