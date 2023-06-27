import type { AuthBindings } from "@refinedev/core";
import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
//   // Retrieve the token from local storage
//   const token = JSON.parse(localStorage.getItem("auth"));
//   // Check if the header property exists
//   if (request.headers) {
//     // Set the Authorization header if it exists
//     request.headers["Authorization"] = `Bearer ${token}`;
//   } else {
//     // Create the headers property if it does not exist
//     request.headers = {
//         Authorization: `Bearer ${token}`,
//     };
//   }

//   return request;
// });

// // Function that will be called to refresh authorization
// const refreshAuthLogic = (failedRequest) =>
//   axiosInstance
//     .post(`${API_URL}/auth/token/refresh`)
//     .then((tokenRefreshResponse) => {
//       localStorage.setItem("token", tokenRefreshResponse.data.token);

//       failedRequest.response.config.headers["Authorization"] =
//         "Bearer " + tokenRefreshResponse.data.token;

//       return Promise.resolve();
//     });

// // Instantiate the interceptor
// createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

const mockUsers = [
  { email: "tony@mail.com", roles: ["admin"], token: "123" }, 
  { email: "kiki@mail.com", roles: ["editor"], token: "321" }
];

const authProvider: AuthBindings = {
    login: async ({ email, password }) => {
      const user = mockUsers.find((item) => item.email === email);

      if (user) {
        localStorage.setItem("auth", JSON.stringify(user));

        // This sets the authorization headers on Axios instance
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${user.token}`,
        };

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Login Error",
          name: "Invalid email or password"
        },
      };
    },
    check: async () => {
      const user = localStorage.getItem("auth");
      if (user) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
        error: {
          message: "Check Failed",
          name: "Unauthorized"
        },
      };
    },
    logout: async () => {
      localStorage.removeItem("auth");
      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      if (error.status === 401 || error.status === 403) {
        return {
          logout: true,
          redirectTo: "/login",
          error,
        };
      }

      return {};
    },
    getPermissions: () => {
      const user = localStorage.getItem("auth");
      if (user) {
        const { roles } = JSON.parse(user);

        return roles
      }

      return null
    },
    getIdentity: async () => {
      const user = localStorage.getItem("auth");
      if (user) {
        const { email, roles } = JSON.parse(user);

        return { 
          email, 
          roles,
          name: "John Doe",
          avatar: "https://i.pravatar.cc/300",
        };
      }

      return null;
    },
    register: async ({ email }) => {
      const user = mockUsers.find((user) => user.email === email);

      if (user) {
        return {
          success: false,
          error: {
            name: "Register Error",
            message: "User already exists"
          },
        };
      }

      mockUsers.push({ email, roles: ["editor"], token: "321" });

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    forgotPassword: async ({ email }) => {
      // send password reset link to the user's email address here

      // if request is successful
      return {
        success: true,
        redirectTo: "/login",
      };

      // if request is unsuccessful
      // return {
      //   success: false,
      //   error: {
      //     name: "Forgot Password Error",
      //     message: "Email address does not exist",
      //   },
      // };
    },
    updatePassword: async ({ password }) => {
      // update the user's password here

      // if request is successful
      return {
        success: true,
        redirectTo: "/login",
      };

      // if request is not successful
      // return {
      //   success: false,
      //   error: {
      //     name: "Forgot Password Error",
      //     message: "Email address does not exist",
      //   },
      // };
  },
};

export default authProvider;
