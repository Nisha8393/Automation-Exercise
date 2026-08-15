// Path the setup project writes the authenticated session to.
// Kept in its own module so specs can import it without pulling in
// auth.setup.js - importing a file that declares a test would register that
// test again during collection and break discovery.
export const STORAGE_STATE = "playwright/.auth/user.json";
