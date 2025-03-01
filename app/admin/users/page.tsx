import { Suspense } from 'react';
import { UsersTableWrapper } from "@/components/admin/users-table-wrapper";
import { getUsersByRole } from "@/lib/actions/admin";

// Make the page dynamic to prevent build-time database calls
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage() {
  const [students, instructors, parents, admins] = await Promise.all([
    getUsersByRole('STUDENT'),
    getUsersByRole('INSTRUCTOR'),
    getUsersByRole('PARENT'),
    getUsersByRole('ADMIN')
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTableWrapper 
          initialUsers={{
            students,
            instructors,
            parents,
            admins
          }}
        />
      </Suspense>
    </div>
  );
}
