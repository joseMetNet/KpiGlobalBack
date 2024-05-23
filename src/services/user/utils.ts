import { UserDto } from '../../interface';
import { User } from '../../repositories';

export function userToUserDto(user: User): UserDto {
  return {
    id: user.id,
    profileId: user.profileId,
    isRegistrationCompleted: user.isRegistrationCompleted
  };
}