// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeaders = req.headers.Authorization || req.headers.authorization;
  
  // Check for token in headers first (Bearer token)
  if (authHeaders && authHeaders.startsWith('Bearer')) {
    token = authHeaders.split(' ')[1];
  } else if (req.cookies?.token) {
    // Fallback to cookies if no Bearer token
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized to access this route - No token provided' 
    });
  }

  try {
    // Verify token format first
    if (typeof token !== 'string' || token.trim() === '') {
      throw new Error('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      throw new Error('Token payload is invalid');
    }

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    let errorMessage = 'Not authorized, token failed';
    if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token format';
    } else if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired';
    } else if (err.name === 'NotBeforeError') {
      errorMessage = 'Token not active yet';
    }
    
    return res.status(401).json({ 
      success: false,
      error: errorMessage 
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized to access this route' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};