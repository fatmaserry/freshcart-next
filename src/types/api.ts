export interface PaginationMeta {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface Paginated<T> {
  results: number;
  metadata: PaginationMeta;
  data: T[];
}

export interface Single<T> {
  data: T;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  images: string[];
  sold: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: Category;
  subcategory: SubCategory[];
  brand: Brand;
  createdAt: string;
  updatedAt: string;
}

export type ProductSort =
  "price" | "-price" | "-sold" | "-ratingsAverage" | "title" | "-createdAt";

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: ProductSort;
  brand?: string;
  category?: string;
  subcategory?: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPayload {
  review: string;
  rating: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  name: string;
  rePassword: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface UpdateMePayload {
  name: string;
  email: string;
  phone: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export type AddressPayload = Omit<Address, "_id">;

export interface AddressListResponse {
  status: string;
  results: number;
  data: Address[];
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId: string;
  data: Cart;
}

export interface CartView {
  numOfCartItems: number;
  // Absent for guests, whose cart exists only in the browser and can't be ordered.
  cartId?: string;
  data: { products: CartItem[]; totalCartPrice: number };
}

export interface WishlistView {
  count: number;
  data: Product[];
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface WishlistMutationResponse {
  status: string;
  message: string;
  data: string[];
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  _id: string;
  id: number;
  shippingAddress?: ShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  user: { _id: string; name: string; email: string; phone: string };
  cartItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResponse {
  status: string;
  session: { url: string; success_url: string; cancel_url: string };
}

export interface ApiMessage {
  status?: string;
  statusMsg?: string;
  message: string;
}
