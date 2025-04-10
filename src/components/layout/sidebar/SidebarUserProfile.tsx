
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile } from '@/types';

interface SidebarUserProfileProps {
  profile: UserProfile | null;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ profile }) => {
  // Get the initials of the user's name
  const getInitials = () => {
    if (!profile) return 'U';
    
    const firstInitial = profile.first_name?.charAt(0) || '';
    const lastInitial = profile.last_name?.charAt(0) || '';
    
    return firstInitial + lastInitial || profile.email?.charAt(0).toUpperCase() || 'U';
  };

  // Full name display
  const fullName = () => {
    if (!profile) return 'Usuario';
    
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    
    return profile.email || 'Usuario';
  };

  return (
    <div className="px-4 py-6 flex items-center">
      <Avatar className="h-9 w-9 mr-2">
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center overflow-hidden">
        <p className="text-sm font-medium truncate">
          {fullName()}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {profile?.email || 'usuario@ejemplo.com'}
        </p>
      </div>
    </div>
  );
};
