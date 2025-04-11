
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail } from 'lucide-react';
import { UserProfile } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarUserProfileProps {
  profile: UserProfile | null;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  profile
}) => {
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
    <div className="relative px-4 py-4 flex items-center group overflow-hidden rounded-xl bg-gradient-to-r from-electric/10 to-aqua/5 backdrop-blur-sm border-b border-white/10">
      {/* Animated highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric/0 via-aqua/10 to-electric/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shine"></div>
      
      <Avatar className="h-10 w-10 mr-3 ring-2 ring-aqua/30 bg-gradient-to-br from-electric to-aqua/80">
        <AvatarFallback className="text-white font-medium bg-gradient-to-br from-electric to-aqua/80">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col justify-center overflow-hidden flex-1">
        <p className="text-sm font-medium truncate text-white group-hover:text-aqua transition-colors duration-300">
          {fullName()}
        </p>
        <div className="flex items-center text-xs text-white/70 group-hover:text-aqua/70 transition-colors duration-300">
          <Mail className="h-3 w-3 mr-1 inline-block" />
          <span className="truncate">
            {profile?.email || 'usuario@ejemplo.com'}
          </span>
        </div>
      </div>
      
      <div className="h-8 w-1 bg-gradient-to-b from-aqua via-electric/80 to-aqua/30 rounded-full absolute right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"></div>
    </div>
  );
};
