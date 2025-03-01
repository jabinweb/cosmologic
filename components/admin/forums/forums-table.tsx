'use client';

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Edit, Trash } from "lucide-react";
import { deleteForum, updateForum } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditForumForm } from "./edit-forum-form";

export function ForumsTable({ forums }: { forums: any[] }) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const handleDelete = async (forumId: string) => {
    if (!confirm("Are you sure you want to delete this forum?")) return;

    try {
      await deleteForum(forumId);
      toast({
        title: "Forum deleted",
        description: "The forum has been deleted successfully.",
      });
      // Refresh the page or update the list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete forum.",
        variant: "destructive",
      });
    }
  };

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(search.toLowerCase()) ||
    forum.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forums..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Total Posts</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForums.map((forum) => {
              const totalPosts = forum.topics.reduce((acc: number, topic: any) => 
                acc + topic.posts.length, 0
              );
              
              return (
                <TableRow key={forum.id}>
                  <TableCell className="font-medium">{forum.name}</TableCell>
                  <TableCell>{forum.slug}</TableCell>
                  <TableCell>{forum._count.topics}</TableCell>
                  <TableCell>{totalPosts}</TableCell>
                  <TableCell>{new Date(forum.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Forum
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Forum</DialogTitle>
                            </DialogHeader>
                            <EditForumForm forum={forum} />
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onSelect={() => handleDelete(forum.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Forum
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
