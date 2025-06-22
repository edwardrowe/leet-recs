import React from 'react';
import Image from 'next/image';

type UserProfileProps = {
  name: string;
  avatarUrl: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ name, avatarUrl }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-full overflow-hidden">
        <Image
          src={avatarUrl}
          alt={`Avatar for ${name}`}
          fill
          className="object-cover"
        />
      </div>
      <span className="font-semibold text-lg">{name}</span>
    </div>
  );
};

export default UserProfile; 