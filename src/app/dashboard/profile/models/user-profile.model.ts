import { Genre } from './genre.model';

export interface UserProfile {
  id: number;
  username: string;
  created_at: string;
  genres: Genre[];
}
