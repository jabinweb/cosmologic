'use client';

import { formatDistance } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock, Pin } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical, Unlock, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

interface TopicHeaderProps {
  topic: any; // Replace with proper type
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const isModeratorOrAuthor = user && (
    user.role === 'ADMIN' || 
    user.role === 'INSTRUCTOR' || 
    user.id === topic.author.id
  );

  const handleAction = async (action: 'pin' | 'lock' | 'delete') => {
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/forums/topics/${topic.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          router.push(`/forums/${topic.forum.slug}`);
          return;
        }
      } else {
        const res = await fetch(`/api/forums/topics/${topic.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isPinned: action === 'pin' ? !topic.isPinned : topic.isPinned,
            isLocked: action === 'lock' ? !topic.isLocked : topic.isLocked,
          }),
        });
        if (res.ok) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/forums/${topic.forumId}`} className="text-sm text-muted-foreground hover:underline">
          {topic.forum.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {topic.isPinned && <Pin className="w-4 h-4" />}
          {topic.isLocked && <Lock className="w-4 h-4" />}
          {topic.title}
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
            <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${topic.author.id}`} className="text-sm font-medium hover:underline">
              {topic.author.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistance(new Date(topic.createdAt), new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Share
          </Button>
          {!topic.isLocked && (
            <Button size="sm">
              Reply
            </Button>
          )}
          {isModeratorOrAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction('pin')}>
                  <Pin className="mr-2 h-4 w-4" />
                  {topic.isPinned ? 'Unpin Topic' : 'Pin Topic'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('lock')}>
                  {topic.isLocked ? (
                    <Unlock className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {topic.isLocked ? 'Unlock Topic' : 'Lock Topic'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Topic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topic
              and all its replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleAction('delete')}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
