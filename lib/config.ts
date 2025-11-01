export const config = {
  app: {
    name: "TaskFlow",
    description: "Modern TODO list platform",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    endpoints: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        logout: "/api/auth/logout",
        verifyEmail: "/api/auth/verify-email",
        forgotPassword: "/api/auth/forgot-password",
        resetPassword: "/api/auth/reset-password",
        me: "/api/auth/me",
      },
      lists: {
        base: "/api/lists",
        byId: (id: string) => `/api/lists/${id}`,
      },
      tasks: {
        base: "/api/tasks",
        byId: (id: string) => `/api/tasks/${id}`,
      },
    },
  },
  routes: {
    home: "/",
    login: "/login",
    register: "/register",
    verifyEmail: "/verify-email",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    lists: "/lists",
    listDetail: (id: string) => `/lists/${id}`,
  },
} as const
