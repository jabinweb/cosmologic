'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "./users-table";

interface UsersTableWrapperProps {
  initialUsers: {
    students: any[];
    instructors: any[];
    parents: any[];
    admins: any[];
  };
}

export function UsersTableWrapper({ initialUsers }: UsersTableWrapperProps) {
  const { students, instructors, parents, admins } = initialUsers;
  const allUsers = [...students, ...instructors, ...parents, ...admins];

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Users</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="instructors">Instructors</TabsTrigger>
        <TabsTrigger value="parents">Parents</TabsTrigger>
        <TabsTrigger value="admins">Admins</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <UsersTable users={allUsers} />
      </TabsContent>
      <TabsContent value="students">
        <UsersTable users={students} />
      </TabsContent>
      <TabsContent value="instructors">
        <UsersTable users={instructors} />
      </TabsContent>
      <TabsContent value="parents">
        <UsersTable users={parents} />
      </TabsContent>
      <TabsContent value="admins">
        <UsersTable users={admins} />
      </TabsContent>
    </Tabs>
  );
}
