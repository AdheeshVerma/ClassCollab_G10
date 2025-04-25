
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Plus,
  Search
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data
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
];

const Dashboard = () => {
  const { user } = useAuth();
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
            <h1 className="text-3xl font-bold text-cc-gray-900">Dashboard</h1>
            <p className="text-cc-gray-600 mt-1">
              Welcome back, {user?.username || "Student"}!
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
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cc-gray-500">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-cc-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockGroups.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cc-gray-500">Upcoming Deadlines</CardTitle>
              <Calendar className="h-4 w-4 text-cc-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cc-gray-500">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-cc-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cc-gray-500">Tasks Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-cc-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Groups Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cc-gray-900">Your Groups</h2>
            <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cc-gray-500" />
              <Input
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredGroups.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-cc-gray-500">No groups found matching your search.</p>
              </Card>
            ) : (
              filteredGroups.map(group => (
                <Link key={group.id} to={`/groups/${group.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-cc-gray-900">{group.name}</h3>
                          <p className="text-cc-gray-500 text-sm mt-1">{group.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="cc-badge cc-badge-blue">{group.subject}</span>
                            <span className="mx-2 text-cc-gray-300">•</span>
                            <span className="text-sm text-cc-gray-500">{group.semester}</span>
                          </div>
                        </div>
                        
                        <div className="md:text-right mt-4 md:mt-0">
                          <div className="flex items-center justify-start md:justify-end mb-2">
                            <Users className="h-4 w-4 text-cc-gray-500 mr-2" />
                            <span className="text-sm text-cc-gray-500">{group.members} members</span>
                          </div>
                          <div className="flex items-center justify-start md:justify-end mb-2">
                            <CheckCircle2 className="h-4 w-4 text-cc-green-500 mr-2" />
                            <span className="text-sm text-cc-gray-500">
                              {group.tasksCompleted}/{group.tasks} tasks completed
                            </span>
                          </div>
                          <div className="flex items-center justify-start md:justify-end">
                            <Clock className="h-4 w-4 text-cc-gray-500 mr-2" />
                            <span className="text-sm text-cc-gray-500">
                              Last activity: {group.recentActivity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
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
            <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
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
            <Button type="submit" onClick={() => setIsJoinDialogOpen(false)}>
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
