# Authentication System Documentation

## Overview

This admin dashboard includes a complete authentication system with login, signup, and protected routes. The authentication is implemented using dummy data stored in localStorage for demonstration purposes.

## Features

- **Login & Signup Pages**: Modern SaaS-style UI with validation
- **Protected Routes**: All dashboard pages require authentication
- **Session Management**: User sessions persist across page refreshes
- **Auto Redirect**: Unauthenticated users are redirected to login
- **Logout Functionality**: Accessible from the user menu in the navbar
- **Theme Support**: Both light and dark modes fully supported

## Demo Credentials

### Default Admin Account
- **Email**: `admin@dashboard.com`
- **Password**: `admin123`

### Creating New Accounts
Users can sign up with any email and password. New accounts are automatically logged in after registration.

## File Structure

```
contexts/
  AuthContext.tsx          # Authentication state management
components/
  auth/
    ProtectedRoute.tsx     # HOC for protecting routes
app/
  login/
    page.tsx              # Login page
  signup/
    page.tsx              # Signup page
  dashboard/
    page.tsx              # Protected dashboard
  [other-pages]/
    page.tsx              # All wrapped with ProtectedRoute
```

## How It Works

### 1. Authentication Context (`AuthContext.tsx`)

Manages global authentication state including:
- Current user information
- Login/logout functions
- Signup functionality
- Session persistence via localStorage

```typescript
const { user, isAuthenticated, login, signup, logout } = useAuth()
```

### 2. Protected Routes (`ProtectedRoute.tsx`)

Wraps pages that require authentication:

```typescript
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Your content */}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
```

### 3. Login Flow

1. User enters credentials on `/login`
2. Credentials are validated against localStorage
3. On success, user object is stored in state and localStorage
4. User is redirected to `/dashboard`
5. Session persists across page refreshes

### 4. Signup Flow

1. User fills registration form on `/signup`
2. Email uniqueness is validated
3. Password confirmation is checked
4. New user is registered and auto-logged in
5. User is redirected to `/dashboard`

## Validation Rules

### Login
- Email and password are required
- Email must be valid format
- Credentials must match registered user

### Signup
- All fields are required (Name, Email, Password, Confirm Password)
- Email must be valid format
- Password must be at least 6 characters
- Passwords must match
- Email must not already be registered

## localStorage Keys

- `auth_user` - Current logged-in user
- `registered_users` - Array of all registered users

## Customization

### Adding More User Fields

1. Update the `User` interface in `AuthContext.tsx`:
```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  // Add your fields here
  department?: string
  phone?: string
}
```

2. Update signup form in `app/signup/page.tsx`
3. Update signup function in `AuthContext.tsx`

### Changing Redirect Routes

Edit the redirect logic in:
- `app/page.tsx` - Initial landing page
- `app/login/page.tsx` - After login success
- `app/signup/page.tsx` - After signup success
- `components/auth/ProtectedRoute.tsx` - When not authenticated

### Styling the Auth Pages

Auth pages use the premium design system with:
- Glassmorphism effects
- Animated background gradients
- Smooth transitions
- Responsive layout
- Theme toggle

Customize colors in `app/globals.css` or modify the pages directly.

## Converting to Real Backend

To integrate with a real API:

### 1. Update AuthContext

Replace localStorage logic with API calls:

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (response.ok) {
    const user = await response.json()
    setUser(user)
    return { success: true }
  }
  
  return { success: false, error: 'Invalid credentials' }
}
```

### 2. Add Token Management

Store JWT tokens in httpOnly cookies or secure storage:

```typescript
// After successful login
localStorage.setItem('accessToken', data.accessToken)
```

### 3. Add API Interceptors

Create axios/fetch interceptors to attach auth tokens to requests.

### 4. Implement Refresh Token Logic

Add token refresh mechanism before expiration.

## Security Notes

⚠️ **Current Implementation**
- This is a frontend-only demo using localStorage
- Passwords are stored in plain text (demo only)
- No encryption or hashing
- Not suitable for production use

✅ **Production Requirements**
- Use HTTPS only
- Implement proper password hashing (bcrypt, argon2)
- Use httpOnly cookies for tokens
- Add CSRF protection
- Implement rate limiting
- Add proper session management
- Use secure backend authentication

## Troubleshooting

### Issue: Stuck in login loop
**Solution**: Clear localStorage and refresh:
```javascript
localStorage.clear()
location.reload()
```

### Issue: User logged out unexpectedly
**Solution**: Check if localStorage is being cleared by another script or browser extension.

### Issue: Signup email already exists error
**Solution**: Either login with existing credentials or clear `registered_users` from localStorage.

## Testing

1. **Test Login**: Use `admin@dashboard.com` / `admin123`
2. **Test Signup**: Create a new account with unique email
3. **Test Protected Routes**: Try accessing `/dashboard` without login
4. **Test Logout**: Click logout from user menu
5. **Test Session Persistence**: Refresh page while logged in

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Remember me functionality
- [ ] Session timeout
- [ ] Login history
- [ ] User profile editing

---

For more information or support, please refer to the main project documentation.
