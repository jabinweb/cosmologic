import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Twitter, Linkedin } from "lucide-react";

interface ProfileHeaderProps {
  profile: any; // Replace with proper type
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const socialLinks = profile.socialLinks as { github?: string; twitter?: string; linkedin?: string } || {};

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.user.avatar} alt={profile.user.name} />
          <AvatarFallback>{profile.user.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <p className="text-muted-foreground">{profile.user.role}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>

          {profile.bio && (
            <p className="mt-4 text-sm">{profile.bio}</p>
          )}

          {profile.skills?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {profile.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          {Object.keys(socialLinks).length > 0 && (
            <div className="flex gap-4 mt-4">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
