import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Users, Calendar, MessageSquare, ListChecks, BarChart2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="cc-container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Collaborate Smarter with</span>
              <span className="block bg-gradient-to-r from-cc-blue-500 to-cc-blue-700 bg-clip-text text-transparent">
                ClassCollab
              </span>
            </h1>
            <p className="mt-6 text-xl text-cc-gray-600 max-w-2xl mx-auto">
              The all-in-one platform designed for student group projects. 
              Organize tasks, communicate in real-time, and create amazing projects together.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="rounded-full px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                      Log In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-20 bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="relative h-80 bg-cc-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cc-blue-400 to-cc-blue-600 opacity-90"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-white text-center">
                  <h2 className="text-3xl font-bold">Student Project Management</h2>
                  <p className="mt-4 max-w-lg">
                    A mockup of the task board interface would appear in a real app.
                    This will be implemented in subsequent updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="cc-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-cc-gray-900">
              Everything You Need for Successful Group Projects
            </h2>
            <p className="mt-4 text-xl text-cc-gray-600 max-w-2xl mx-auto">
              ClassCollab provides all the tools your team needs to succeed in your academic projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 text-cc-blue-500" />,
                title: "Group Management",
                description: "Create project groups, invite members, and manage roles all in one place.",
              },
              {
                icon: <ListChecks className="h-10 w-10 text-cc-blue-500" />,
                title: "Task Boards",
                description: "Organize tasks with customizable Kanban boards for efficient workflow management.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-cc-blue-500" />,
                title: "Real-time Chat",
                description: "Communicate with team members instantly with group and direct messaging.",
              },
              {
                icon: <Calendar className="h-10 w-10 text-cc-blue-500" />,
                title: "Deadline Tracking",
                description: "Set and track assignment due dates to ensure projects stay on schedule.",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-cc-blue-500" />,
                title: "Polls & Voting",
                description: "Make group decisions quickly with built-in polling and voting features.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-cc-blue-500" />,
                title: "Progress Tracking",
                description: "Monitor project progress and individual contributions with visual analytics.",
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="cc-card p-6 flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-cc-gray-900 mb-2">{feature.title}</h3>
                <p className="text-cc-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cc-blue-50 py-20">
        <div className="cc-container">
          <div className="bg-white rounded-xl shadow-md p-8 lg:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-cc-gray-900 mb-4">
              Ready to Ace Your Group Projects?
            </h2>
            <p className="text-xl text-cc-gray-600 mb-8">
              Join thousands of students using ClassCollab to collaborate more effectively.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8">
                  Sign Up for Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="cc-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="font-bold text-xl bg-gradient-to-r from-cc-blue-500 to-cc-blue-700 bg-clip-text text-transparent">
                  ClassCollab
                </span>
              </div>
              <p className="text-cc-gray-500 mt-2">
                Simplifying student collaboration since 2023
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-cc-gray-600 hover:text-cc-gray-900">About</Link>
              <Link to="/contact" className="text-cc-gray-600 hover:text-cc-gray-900">Contact</Link>
              <Link to="/privacy" className="text-cc-gray-600 hover:text-cc-gray-900">Privacy</Link>
              <Link to="/terms" className="text-cc-gray-600 hover:text-cc-gray-900">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-cc-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ClassCollab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
