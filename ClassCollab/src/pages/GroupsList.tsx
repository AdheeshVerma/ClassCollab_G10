
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Search, Plus, BarChart2, ClipboardList } from "lucide-react";

// Mock data - same as Dashboard
const mockGroups = [
  {
    id: "group-1",
    name: "CS 301 Final Project",
    description: "Development of an e-commerce platform",
    subject: "Computer Science",
    semester: "Fall 2023",
    members: 5,
    tasks: 12,
    tasksCompleted: 5,
    recentActivity: "2 hours ago",
  },
  {
    id: "group-2",
    name: "Biology Research Paper",
    description: "Research on climate change effects on marine life",
    subject: "Biology",
    semester: "Fall 2023",
    members: 4,
    tasks: 8,
    tasksCompleted: 3,
    recentActivity: "1 day ago",
  },
  {
    id: "group-3",
    name: "Marketing Campaign",
    description: "Developing marketing strategies for a local business",
    subject: "Marketing",
    semester: "Fall 2023",
    members: 6,
    tasks: 15,
    tasksCompleted: 10,
    recentActivity: "3 hours ago",
  },
  {
    id: "group-4",
    name: "Psychology Study Group",
    description: "Preparing for final exams and research proposals",
    subject: "Psychology",
    semester: "Fall 2023",
    members: 8,
    tasks: 20,
    tasksCompleted: 12,
    recentActivity: "5 hours ago",
  },
];

const GroupsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter groups based on search
  const filteredGroups = mockGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="cc-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cc-gray-900">My Groups</h1>
            <p className="text-cc-gray-600 mt-1">
              Manage and view all your project groups
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Create Group
            </Button>
            <Button onClick={() => setIsJoinDialogOpen(true)} variant="outline" className="flex items-center gap-2">
              <Users size={16} />
              Join Group
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cc-gray-500" />
              <Input
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Groups
              </Button>
              <Button variant="ghost" size="sm">
                Active
              </Button>
              <Button variant="ghost" size="sm">
                Archived
              </Button>
            </div>
          </div>
        </div>
        
        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-cc-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-cc-gray-900 mb-2">No groups found</h3>
              <p className="text-cc-gray-500 mb-6">
                {searchQuery ? "Try a different search term" : "You haven't joined any groups yet"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create a Group</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <Link key={group.id} to={`/groups/${group.id}`} className="h-full">
                <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-2">
                      <span className="cc-badge cc-badge-blue">{group.subject}</span>
                      <span className="text-sm text-cc-gray-500 ml-2">{group.semester}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-cc-gray-900 mb-2">{group.name}</h3>
                    <p className="text-cc-gray-500 text-sm mb-4 flex-grow">{group.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-cc-gray-500 mr-2" />
                        <span className="text-sm text-cc-gray-500">{group.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <ClipboardList className="h-4 w-4 text-cc-gray-500 mr-2" />
                        <span className="text-sm text-cc-gray-500">
                          {group.tasksCompleted}/{group.tasks} tasks
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-cc-gray-500">
                          Activity: {group.recentActivity}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <div>View</div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new project group to collaborate with your classmates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input id="group-name" placeholder="CS 301 Final Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Brief description of your project" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Computer Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" placeholder="Fall 2023" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {
              setIsCreateDialogOpen(false);
              toast.success("Group created successfully!");
            }}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Group Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join a Group</DialogTitle>
            <DialogDescription>
              Enter the invite code shared with you to join an existing group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invite Code</Label>
              <Input id="invite-code" placeholder="Enter 8-digit code" />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsJoinDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {
              setIsJoinDialogOpen(false);
              toast.success("Successfully joined group!");
            }}>
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupsList;
