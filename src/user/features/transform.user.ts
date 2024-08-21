import { User } from '../models/user.model';

export const transformUserData = (user: User) => {
  if (user.role.role === 'candidate') {
    delete user.recruiter_data;
    delete user.billing;

    user.candidate_data.skills = user.skills.map((skill) => skill.id);
    delete user.skills;
  }

  if (user.role.role === 'recruiter') {
    delete user.candidate_data;
    delete user.skills;
  }

  return user;
};
