
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Users,
  ClipboardList,
  BarChart2,
  Info,
  Plus,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data
const mockTasks = {
  todo: [
    { id: "task1", title: "Research paper topics", description: "Find 5 potential topics for our research paper", assignee: "Alice Johnson", dueDate: "2023-11-30" },
    { id: "task2", title: "Create project outline", description: "Draft a detailed outline with main sections", assignee: "John Smith", dueDate: "2023-12-01" },
    { id: "task3", title: "Find reference materials", description: "Gather at least 10 academic sources", assignee: "Emma Davis", dueDate: "2023-12-02" },
  ],
  inProgress: [
    { id: "task4", title: "Write introduction", description: "Draft the introduction section (2 pages)", assignee: "John Smith", dueDate: "2023-12-05" },
    { id: "task5", title: "Create data visualizations", description: "Create charts and graphs for results section", assignee: "Michael Brown", dueDate: "2023-12-07" },
  ],
  completed: [
    { id: "task6", title: "Schedule team meeting", description: "Set up weekly meeting time", assignee: "Alice Johnson", dueDate: "2023-11-25" },
    { id: "task7", title: "Create shared document", description: "Set up Google Doc for collaboration", assignee: "Emma Davis", dueDate: "2023-11-26" },
  ]
};

const mockGroup = {
  id: "group-1",
  name: "CS 301 Final Project",
  description: "Development of an e-commerce platform with React frontend and Node.js backend",
  subject: "Computer Science",
  semester: "Fall 2023",
  createdAt: "2023-11-10",
  inviteCode: "CS301-XYZ",
  members: [
    { id: "user1", name: "John Smith", email: "john@example.com", role: "Admin", avatar: "" },
    { id: "user2", name: "Alice Johnson", email: "alice@example.com", role: "Developer", avatar: "" },
    { id: "user3", name: "Emma Davis", email: "emma@example.com", role: "Designer", avatar: "" },
    { id: "user4", name: "Michael Brown", email: "michael@example.com", role: "Developer", avatar: "" },
    { id: "user5", name: "Sophia Wilson", email: "sophia@example.com", role: "Researcher", avatar: "" },
  ]
};

const mockMessages = [
  { id: "msg1", sender: "John Smith", text: "Hey everyone, I've created the project repository.", timestamp: "2023-11-20T10:30:00" },
  { id: "msg2", sender: "Alice Johnson", text: "Great! I'll start working on the frontend components.", timestamp: "2023-11-20T10:32:00" },
  { id: "msg3", sender: "Emma Davis", text: "I've created some initial wireframes for the UI. Will share them today.", timestamp: "2023-11-20T10:45:00" },
  { id: "msg4", sender: "John Smith", text: "Perfect. Let's have a quick meeting tomorrow to discuss progress.", timestamp: "2023-11-20T11:00:00" },
  { id: "msg5", sender: "Michael Brown", text: "Works for me. What time?", timestamp: "2023-11-20T11:05:00" },
  { id: "msg6", sender: "John Smith", text: "How about 3pm?", timestamp: "2023-11-20T11:10:00" },
  { id: "msg7", sender: "Sophia Wilson", text: "3pm works for me!", timestamp: "2023-11-20T11:15:00" },
  { id: "msg8", sender: "Alice Johnson", text: "Me too!", timestamp: "2023-11-20T11:20:00" },
  { id: "msg9", sender: "Emma Davis", text: "I'll be there.", timestamp: "2023-11-20T11:25:00" }
];

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [tasks, setTasks] = useState(mockTasks);
  const [activeTab, setActiveTab] = useState("tasks");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedTask, setDraggedTask] = useState<any>(null);
  
  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: ""
  });

  // Handle drag start
  const handleDragStart = (task: any, status: string) => {
    setDraggedTask({ ...task, status });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (status: "todo" | "inProgress" | "completed") => {
    if (!draggedTask) return;
    
    const updatedTasks = { ...tasks };
    
    // Remove from original status column
    if (draggedTask.status === "todo") {
      updatedTasks.todo = updatedTasks.todo.filter(task => task.id !== draggedTask.id);
    } else if (draggedTask.status === "inProgress") {
      updatedTasks.inProgress = updatedTasks.inProgress.filter(task => task.id !== draggedTask.id);
    } else if (draggedTask.status === "completed") {
      updatedTasks.completed = updatedTasks.completed.filter(task => task.id !== draggedTask.id);
    }
    
    // Add to new status column
    updatedTasks[status] = [...updatedTasks[status], { ...draggedTask }];
    
    setTasks(updatedTasks);
    toast.success(`Task moved to ${status.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
  };

  // Handle add task
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    const newTaskObj = {
      id: `task${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee || "Unassigned",
      dueDate: newTask.dueDate || "No due date"
    };
    
    setTasks({
      ...tasks,
      todo: [...tasks.todo, newTaskObj]
    });
    
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      dueDate: ""
    });
    
    setIsAddTaskDialogOpen(false);
    toast.success("Task added successfully");
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would use WebSockets to broadcast to all members
    // For now, we'll just log it
    console.log("Sending message:", message);
    setMessage("");
    toast.success("Message sent");
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="cc-container py-8">
        {/* Group Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-cc-gray-900">{mockGroup.name}</h1>
                <span className="ml-3 cc-badge cc-badge-blue">{mockGroup.subject}</span>
              </div>
              <p className="text-cc-gray-600 mt-1">{mockGroup.description}</p>
              <div className="flex items-center mt-2 text-sm text-cc-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created on {formatDate(mockGroup.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{mockGroup.semester}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="flex -space-x-2 mr-2">
                {mockGroup.members.slice(0, 4).map((member, i) => (
                  <Avatar key={i} className="border-2 border-white h-8 w-8">
                    <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800 text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {mockGroup.members.length > 4 && (
                  <div className="h-8 w-8 rounded-full bg-cc-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                    +{mockGroup.members.length - 4}
                  </div>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                    <DialogDescription>
                      Share this invite code with your classmates to let them join this group.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                    <span className="text-xl font-mono font-medium">{mockGroup.inviteCode}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => {
                      navigator.clipboard.writeText(mockGroup.inviteCode);
                      toast.success("Invite code copied to clipboard");
                    }}>
                      Copy Code
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Group Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit Group Info</DropdownMenuItem>
                  <DropdownMenuItem>Group Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Leave Group</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Group Content Tabs */}
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks" className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="polls" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              Polls
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
          </TabsList>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-cc-gray-900">Task Board</h2>
              <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task for your group project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input 
                        id="title" 
                        placeholder="What needs to be done?" 
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Add more details..." 
                        rows={3}
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Input 
                          id="assignee" 
                          placeholder="Who's responsible?" 
                          value={newTask.assignee}
                          onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input 
                          id="dueDate" 
                          type="date" 
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAddTaskDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do */}
              <div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('todo')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-cc-gray-700">To Do</h3>
                  <div className="bg-cc-gray-100 text-cc-gray-700 px-2 py-1 text-xs font-medium rounded">
                    {tasks.todo.length}
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.todo.map(task => (
                    <Card 
                      key={task.id}
                      className="cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(task, 'todo')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium text-cc-gray-900">{task.title}</h4>
                        <p className="text-sm text-cc-gray-500 mt-1">{task.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800 text-xs">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-cc-gray-500">{task.assignee}</span>
                          </div>
                          <span className="text-xs text-cc-gray-500">Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* In Progress */}
              <div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('inProgress')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-cc-gray-700">In Progress</h3>
                  <div className="bg-cc-yellow-100 text-cc-yellow-800 px-2 py-1 text-xs font-medium rounded">
                    {tasks.inProgress.length}
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.inProgress.map(task => (
                    <Card 
                      key={task.id}
                      className="cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(task, 'inProgress')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium text-cc-gray-900">{task.title}</h4>
                        <p className="text-sm text-cc-gray-500 mt-1">{task.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800 text-xs">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-cc-gray-500">{task.assignee}</span>
                          </div>
                          <span className="text-xs text-cc-gray-500">Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Completed */}
              <div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop('completed')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-cc-gray-700">Completed</h3>
                  <div className="bg-cc-green-100 text-cc-green-800 px-2 py-1 text-xs font-medium rounded">
                    {tasks.completed.length}
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.completed.map(task => (
                    <Card 
                      key={task.id}
                      className="cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(task, 'completed')}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium text-cc-gray-900">{task.title}</h4>
                        <p className="text-sm text-cc-gray-500 mt-1">{task.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800 text-xs">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-cc-gray-500">{task.assignee}</span>
                          </div>
                          <span className="text-xs text-cc-gray-500">Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[600px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {mockMessages.map((message, index) => (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800 text-xs">
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-baseline">
                          <span className="font-medium text-cc-gray-900">{message.sender}</span>
                          <span className="ml-2 text-xs text-cc-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-cc-gray-700 mt-1">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-end">
                  <Input
                    className="flex-1 mr-2"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Members Tab */}
          <TabsContent value="members" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-cc-gray-900 mb-6">Group Members</h2>
                <div className="space-y-4">
                  {mockGroup.members.map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-cc-blue-100 text-cc-blue-800">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-cc-gray-900">{member.name}</h3>
                          <p className="text-sm text-cc-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full 
                          ${member.role === 'Admin' ? 'bg-cc-blue-100 text-cc-blue-800' : 
                            member.role === 'Developer' ? 'bg-cc-green-100 text-cc-green-800' :
                            member.role === 'Designer' ? 'bg-cc-yellow-100 text-cc-yellow-800' :
                            'bg-cc-gray-100 text-cc-gray-800'}
                        `}>
                          {member.role}
                        </span>
                        
                        {member.role === 'Admin' && (
                          <Button variant="ghost" size="sm" className="ml-2">
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Polls Tab */}
          <TabsContent value="polls" className="mt-0">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-cc-gray-900 mb-6">Group Polls</h2>
                <div className="text-center py-8">
                  <p className="text-cc-gray-500 mb-4">No active polls at the moment.</p>
                  <Button>Create New Poll</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Info Tab */}
          <TabsContent value="info" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-cc-gray-900 mb-6">Group Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-cc-gray-500">Group Name</h3>
                    <p className="mt-1">{mockGroup.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cc-gray-500">Description</h3>
                    <p className="mt-1">{mockGroup.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-cc-gray-500">Subject</h3>
                      <p className="mt-1">{mockGroup.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-cc-gray-500">Semester</h3>
                      <p className="mt-1">{mockGroup.semester}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cc-gray-500">Created On</h3>
                    <p className="mt-1">{formatDate(mockGroup.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cc-gray-500">Invite Code</h3>
                    <div className="flex items-center mt-1">
                      <code className="bg-gray-100 px-3 py-1 rounded">{mockGroup.inviteCode}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(mockGroup.inviteCode);
                          toast.success("Invite code copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetail;
