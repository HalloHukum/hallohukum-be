import { Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express'; // Renaming to avoid conflict
import { IUser } from '../interfaces/user.interface';

// Define AuthenticatedRequest interface
export interface AuthenticatedRequest extends ExpressRequest {
  user?: IUser; // IUser should have _id and role
}

export function authorizeRoles(allowedRoles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.role) {
        // Explicitly return to stop further execution in this path
        return next({
          name: "Unauthorized",
          message: "User not authenticated or role missing",
        });
      }

      const userRole = req.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        // Explicitly return to stop further execution in this path
        return next({
          name: "Forbidden",
          message: "You do not have permission to access this resource",
        });
      }
    } catch (err) {
      next(err);
    }
  };
}
