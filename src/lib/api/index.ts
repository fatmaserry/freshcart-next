import { HttpClient } from "./HttpClient";
import {
  BrowserTokenProvider,
  type ITokenProvider,
} from "@/lib/auth/TokenProvider";
import { AuthService } from "./services/AuthService";
import { UserService } from "./services/UserService";
import { ProductService } from "./services/ProductService";
import { CategoryService } from "./services/CategoryService";
import { SubCategoryService } from "./services/SubCategoryService";
import { BrandService } from "./services/BrandService";
import { ReviewService } from "./services/ReviewService";
import { CartService } from "./services/CartService";
import { WishlistService } from "./services/WishlistService";
import { AddressService } from "./services/AddressService";
import { OrderService } from "./services/OrderService";
import { LocationService } from "@/lib/locations/LocationService";
import { SessionDataService } from "./services/SessionDataService";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ecommerce.routemisr.com/api/v1";

// Route offers applying a coupon only on v2.
const API_V2_URL = API_BASE_URL.replace(/\/v1$/, "/v2");

export class ApiFacade {
  readonly auth: AuthService;
  readonly users: UserService;
  readonly products: ProductService;
  readonly categories: CategoryService;
  readonly subcategories: SubCategoryService;
  readonly brands: BrandService;
  readonly reviews: ReviewService;
  readonly cart: CartService;
  readonly wishlist: WishlistService;
  readonly addresses: AddressService;
  readonly orders: OrderService;
  readonly locations: LocationService;
  readonly session: SessionDataService;

  constructor(http: HttpClient, httpV2: HttpClient, appHttp: HttpClient) {
    this.auth = new AuthService(http);
    this.users = new UserService(http);
    this.products = new ProductService(http);
    this.categories = new CategoryService(http);
    this.subcategories = new SubCategoryService(http);
    this.brands = new BrandService(http);
    this.reviews = new ReviewService(http);
    this.cart = new CartService(http, httpV2);
    this.wishlist = new WishlistService(http);
    this.addresses = new AddressService(http);
    this.orders = new OrderService(http);
    this.locations = new LocationService(appHttp);
    this.session = new SessionDataService(appHttp);
  }
}

export const createApi = (tokens: ITokenProvider) =>
  new ApiFacade(
    new HttpClient(API_BASE_URL, tokens),
    new HttpClient(API_V2_URL, tokens),
    new HttpClient("/api", tokens),
  );

// The browser has no token, so authenticated calls go through server actions or our /api routes.
export const api = createApi(new BrowserTokenProvider());
export { ApiError } from "./HttpClient";
