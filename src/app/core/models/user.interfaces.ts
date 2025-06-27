export interface User {
  name: string,
  username: string,
  email: string | null,
  password: string,
  role: 'admin' | 'supply' | 'user',
  id?: number,
}
