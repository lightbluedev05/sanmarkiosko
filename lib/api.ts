import { Category, Listing } from "./data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Obtiene el token JWT del almacenamiento local
 */
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sanmarkiosko_token");
  }
  return null;
};

/**
 * Encabezados HTTP por defecto, incluyendo autorización si el token existe
 */
const getHeaders = (contentType: string = "application/json") => {
  const headers: HeadersInit = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Wrapper genérico para las peticiones HTTP
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(
        options.body instanceof FormData ? "" : "application/json"
      ),
      ...(options.headers || {}),
    } as any,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al comunicarse con el servidor.");
  }

  return data;
}

export interface User {
  id: string;
  name: string;
  email: string;
  faculty?: string;
  career?: string;
  year?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  is_pro: boolean;
  rating: number;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserStats {
  activeListings: number;
  totalSales: number;
  rating: number;
}

export const api = {
  // --- AUTENTICACIÓN ---
  auth: {
    login: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
      return fetchAPI<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
    register: async (userData: {
      name: string;
      email: string;
      password?: string;
      faculty?: string;
      career?: string;
      year?: string;
      bio?: string;
    }): Promise<AuthResponse> => {
      return fetchAPI<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    me: async (): Promise<{ success: boolean; data: { user: User } }> => {
      return fetchAPI<{ success: boolean; data: { user: User } }>("/auth/me");
    },
  },

  // --- ANUNCIOS ---
  listings: {
    getAll: async (filters: { q?: string; category?: string; sellerId?: string } = {}): Promise<{ success: boolean; data: Listing[] }> => {
      const params = new URLSearchParams();
      if (filters.q) params.append("q", filters.q);
      if (filters.category) params.append("category", filters.category);
      if (filters.sellerId) params.append("sellerId", filters.sellerId);

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      return fetchAPI<{ success: boolean; data: Listing[] }>(`/listings${queryStr}`);
    },
    getById: async (id: string): Promise<{ success: boolean; data: Listing & { sellerEmail: string; sellerFaculty: string; sellerRating: number } }> => {
      return fetchAPI<{ success: boolean; data: Listing & { sellerEmail: string; sellerFaculty: string; sellerRating: number } }>(`/listings/${id}`);
    },
    create: async (listing: { 
      title: string; 
      description: string; 
      price: number; 
      category: string; 
      imageUrl?: string;
      type?: "Producto" | "Servicio";
      stock?: number;
    }): Promise<{ success: boolean; data: Listing }> => {
      return fetchAPI<{ success: boolean; data: Listing }>("/listings", {
        method: "POST",
        body: JSON.stringify(listing),
      });
    },
    update: async (id: string, listing: Partial<Listing>): Promise<{ success: boolean; data: Listing }> => {
      return fetchAPI<{ success: boolean; data: Listing }>(`/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(listing),
      });
    },
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return fetchAPI<{ success: boolean; message: string }>(`/listings/${id}`, {
        method: "DELETE",
      });
    },
    boost: async (id: string): Promise<{ success: boolean; data: Listing }> => {
      return fetchAPI<{ success: boolean; data: Listing }>(`/listings/${id}/boost`, {
        method: "POST",
      });
    },
  },

  // --- USUARIOS ---
  users: {
    getProfile: async (id: string): Promise<{ success: boolean; data: { profile: User; listings: Listing[] } }> => {
      return fetchAPI<{ success: boolean; data: { profile: User; listings: Listing[] } }>(`/users/${id}`);
    },
    updateProfile: async (profileData: Partial<User>): Promise<{ success: boolean; data: User }> => {
      return fetchAPI<{ success: boolean; data: User }>("/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });
    },
    getStats: async (): Promise<{ success: boolean; data: UserStats }> => {
      return fetchAPI<{ success: boolean; data: UserStats }>("/users/stats");
    },
    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      return fetchAPI<{ success: boolean; message: string }>("/users/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
  },

  // --- ACTIVIDAD ---
  activity: {
    getSales: async (): Promise<{ success: boolean; data: Listing[] }> => {
      return fetchAPI<{ success: boolean; data: Listing[] }>("/activity/sales");
    },
    getPurchases: async (): Promise<{
      success: boolean;
      data: Array<{
        transactionId: string;
        price: string;
        status: string;
        date: string;
        listingId: string;
        title: string;
        category: string;
        imageUrl: string;
        sellerName: string;
      }>;
    }> => {
      return fetchAPI<{
        success: boolean;
        data: Array<{
          transactionId: string;
          price: string;
          status: string;
          date: string;
          listingId: string;
          title: string;
          category: string;
          imageUrl: string;
          sellerName: string;
        }>;
      }>("/activity/purchases");
    },
    buy: async (listingId: string): Promise<{ success: boolean; data: any }> => {
      return fetchAPI<{ success: boolean; data: any }>("/activity/buy", {
        method: "POST",
        body: JSON.stringify({ listingId }),
      });
    },
    getListingReservations: async (listingId: string): Promise<{
      success: boolean;
      data: Array<{
        transactionId: string;
        price: number;
        status: string;
        date: string;
        buyerId: string;
        buyerName: string;
        buyerEmail: string;
        buyerFaculty: string;
        buyerCareer: string;
        buyerYear: string;
      }>;
    }> => {
      return fetchAPI<{
        success: boolean;
        data: any[];
      }>(`/activity/sales/${listingId}/reservations`);
    },
  },

  // --- FAVORITOS ---
  favorites: {
    getAll: async (): Promise<{ success: boolean; data: Listing[] }> => {
      return fetchAPI<{ success: boolean; data: Listing[] }>("/favorites");
    },
    toggle: async (listingId: string): Promise<{ success: boolean; favorited: boolean; message: string }> => {
      return fetchAPI<{ success: boolean; favorited: boolean; message: string }>("/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({ listingId }),
      });
    },
  },
};
