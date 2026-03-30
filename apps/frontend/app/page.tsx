import Image from "next/image";
import Navbar from './../components/Navbar'
import Footer from './../components/Footer'
import Button from './../components/Button'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  
  const projects = [
  {
    id: 1,
    name: "AI Resume Analyzer",
    description: "A web app that analyzes resumes using AI and gives suggestions to improve ATS score and job match probability.",
    owner: "Rahul Sharma",
    submissions: ["Amit Verma", "Sneha Reddy", "Karan Patel"],
  },
  {
    id: 1,
    name: "Smart Expense Tracker",
    description: "Track daily expenses with smart categorization, charts, and AI-based spending insights for better financial planning.",
    owner: "Priya Mehta",
    submissions: ["Rohit Gupta", "Anjali Singh"],
  },
  {
    id: 1,
    name: "Real-Time Chat App",
    description: "A WhatsApp-like real-time chat application with typing indicators, read receipts, and media sharing.",
    owner: "Arjun Nair",
    submissions: ["Vikram Joshi", "Neha Kapoor", "Aditya Jain", "Pooja Das"],
  },
  {
    id: 1,
    name: "Freelancer Marketplace",
    description: "Platform where clients can post projects and freelancers can bid, similar to Fiverr/Upwork but simplified.",
    owner: "Kavya Iyer",
    submissions: ["Manish Kumar", "Siddharth Roy"],
  },
  {
    id: 1,
    name: "AI Code Reviewer",
    description: "Tool that reviews code using AI, suggests improvements, detects bugs, and enforces best practices.",
    owner: "Sandeep Yadav",
    submissions: ["Ritika Sharma", "Deepak Verma", "Harsh Agarwal"],
  },
  {
    id: 1,
    name: "Online Learning Platform",
    description: "A platform for hosting courses with video streaming, quizzes, progress tracking, and certifications.",
    owner: "Meera Joshi",
    submissions: ["Nikhil Bansal"],
  },
  {
    id: 1,
    name: "Health Appointment System",
    description: "Book doctor appointments, manage schedules, and get reminders with a simple and intuitive interface.",
    owner: "Ankit Verma",
    submissions: ["Divya Reddy", "Rahul Das", "Kunal Shah"],
  },
];

  return (
    <div>
      <div className=" inset-0 -z-10 [background:radial-gradient(120%_120%_at_50%_-20%,#000_40%,#63e_100%)]" >
        <Navbar />
        <div className="h-[90vh] flex flex-col justify-center items-center text-white">
          <div className="text-6xl">Where Ideas Meet Builders</div>
          <div className="flex flex-wrap text-gray-400 p-4 pb-8 gap-2 text-lg">
          <div>Build what people actually need&nbsp;</div>
          <div>&nbsp;•&nbsp;&nbsp;&nbsp;Turn Ideas Into Reality — Without Writing Code&nbsp;</div>
          <div>&nbsp;•&nbsp;&nbsp;&nbsp;Where Ideas Meet Developers</div>
          </div>
          <div><Button/></div>
        </div>
        <div className="border-gray-300 border-t my-4" />
        <div className="py-20 pb-40">
          <div className="text-white text-5xl p-4  text-center font-semibold">Demo Projects</div>
          <div className="text-white w-[85vw] mx-auto rounded-4xl border  border-white/30 bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_30px_rgba(70,80,90,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent text-xl">
                  <TableHead className="text-white">Name of Project</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                  <TableHead className="text-white">Owner</TableHead>
                  <TableHead className="text-white">Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-transparent text-base">
                    <TableCell className="p-4">{project.name}</TableCell>
                    <TableCell className="p-4">{project.description}</TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell>{project.submissions.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="border-gray-300 border-t" />
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}





