import { Suspense } from "react";
import { ForumsTable } from "@/components/admin/forums/forums-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAllForums } from "@/lib/actions/admin";
import { CreateForumDialog } from "@/components/admin/forums/create-forum-dialog";

export default async function ForumsManagementPage() {
  const forums = await getAllForums();

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
}
