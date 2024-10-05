// /src/interfaces/dtos/IUserDTO.ts

import { Types,Document } from 'mongoose';

// Interface for creating a user (Request DTO)
export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


// Interface for blocking/unblocking user (Response DTO)
export interface BlockUnblockResponse {
  success: boolean;
  message: string;
}

// Interface for adding or removing a course from the cart (Response DTO)
export interface CourseInCartResponse {
    message: string;
    success: boolean;
    inCart: boolean;
}

// Interface for adding a course to the purchase list (Response DTO)
export interface AddToPurchaseListResponse {
  success: boolean;
  message: string;
}

// Interface for items in the cart (Request and Response DTO)
export interface CartItem {
    courseId: Types.ObjectId;
    quantity: number;
  }


export interface UserCart extends Document {
    _id: Types.ObjectId;
    cart: CartItem[];
  }

// Add more request and response types as needed
