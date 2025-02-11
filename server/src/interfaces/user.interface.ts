export interface UserLogin {
  user_id: number;
  username: string;
  email: string;
  role?: String;
  password?: String;
  img_src?: String | null;
  reference_code?: String | null;
  applied_reference_code?: String | null;
  created_at?: Date;
  updated_at?: Date | null;
}
