import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileActivity } from "@/components/profile/profile-activity";
import { getProfile } from "@/lib/actions/profile";

interface ProfilePageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfile(params.userId);

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileHeader profile={profile} />
      <ProfileTabs
        className="mt-6"
        profile={profile}
        defaultTab="activity"
      />
      <ProfileActivity userId={params.userId} />
    </div>
  );
}
