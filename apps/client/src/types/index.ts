export type SignUpDto = {
  username: string;
  email: string;
  password: string;
  role: Role;
};

export enum Role {
  REGULAR = "REGULAR",
  ADMIN = "ADMIN",
}

export type LoginDto = {
  email: string;
  password: string;
};

export type CreateItemDto = {
  name: string;
  description: string;
  price: number;
  image: File;
  expiresAt: Date;
};

export type UpdateItemDto = Partial<CreateItemDto> & { isActive?: boolean };

export type User = {
  username: string;
  email: string;
  role: Role;
  _id: string;
};

export type ServerError = {
  message: string;
  statusCode: number;
  error: string;
};

export enum AuthForm {
  SIGNUP = "SIGNUP",
  LOGIN = "LOGIN",
}

export type ServerAuthSuccessResponse = { token: string; user: User };

export type ServerAuthResponse = ServerAuthSuccessResponse | ServerError;

export type AuthorItemResponse =
  | { message: string; statusCode: number }
  | ServerError;

export type AuctionItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  expiresAt: Date;
  isActive: boolean;
  winner: User;
  awardedFor: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ItemServerResponse = {
  items: AuctionItem[];
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
};
