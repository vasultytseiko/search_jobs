import { User } from 'src/user/models/user.model';

export interface SearchCandidatesModel extends User {
  total_count: number;
}
