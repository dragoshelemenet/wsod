export const ADMIN_ROUTE = "/studio-login";
export const DASHBOARD_ROUTE = "/studio-dashboard";

export const mockAdminUser = {
  username: "admin",
  password: "wsod123",
};

export function validateMockLogin(username: string, password: string) {
  return (
    username.trim() === mockAdminUser.username &&
    password.trim() === mockAdminUser.password
  );
}