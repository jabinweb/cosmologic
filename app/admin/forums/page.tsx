import { Suspense } from "react";
import { ForumsTable } from "@/components/admin/forums/forums-table";
import { CreateForumDialog } from "@/components/admin/forums/create-forum-dialog";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Add these exports to make the page dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ForumsManagementPage() {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    redirect('/');
  }

  try {
    const forums = await prisma.forum.findMany({
      include: {
        _count: {
          select: { topics: true }
        }
      }
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Forums Management</h1>
          <CreateForumDialog />
        </div>

        <Suspense fallback={<div>Loading forums...</div>}>
          <ForumsTable forums={forums} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Forums Management</h1>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Error loading forums. Please try again.</p>
        </div>
      </div>
    );
  }
}
