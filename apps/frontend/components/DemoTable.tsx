
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DemoTable = () => {
      const projects = [
  {
    id: 1,
    name: "AI Resume Analyzer",
    description: "A web app that analyzes resumes using AI and gives suggestions to improve ATS score and job match probability.",
    owner: "Rahul Sharma",
    submissions: ["Amit Verma", "Sneha Reddy", "Karan Patel"],
  },
  {
    id: 2,
    name: "Smart Expense Tracker",
    description: "Track daily expenses with smart categorization, charts, and AI-based spending insights for better financial planning.",
    owner: "Priya Mehta",
    submissions: ["Rohit Gupta", "Anjali Singh"],
  },
  {
    id: 3,
    name: "Real-Time Chat App",
    description: "A WhatsApp-like real-time chat application with typing indicators, read receipts, and media sharing.",
    owner: "Arjun Nair",
    submissions: ["Vikram Joshi", "Neha Kapoor", "Aditya Jain", "Pooja Das"],
  },
  {
    id: 4,
    name: "Freelancer Marketplace",
    description: "Platform where clients can post projects and freelancers can bid, similar to Fiverr/Upwork but simplified.",
    owner: "Kavya Iyer",
    submissions: ["Manish Kumar", "Siddharth Roy"],
  },
  {
    id: 5,
    name: "AI Code Reviewer",
    description: "Tool that reviews code using AI, suggests improvements, detects bugs, and enforces best practices.",
    owner: "Sandeep Yadav",
    submissions: ["Ritika Sharma", "Deepak Verma", "Harsh Agarwal"],
  },
  {
    id: 6,
    name: "Online Learning Platform",
    description: "A platform for hosting courses with video streaming, quizzes, progress tracking, and certifications.",
    owner: "Meera Joshi",
    submissions: ["Nikhil Bansal"],
  },
  {
    id: 7,
    name: "Health Appointment System",
    description: "Book doctor appointments, manage schedules, and get reminders with a simple and intuitive interface.",
    owner: "Ankit Verma",
    submissions: ["Divya Reddy", "Rahul Das", "Kunal Shah"],
  },
];

  return (
    <div>
      <div className="py-20 pb-40">
          <div className="text-white text-3xl lg:text-5xl p-4  text-center font-semibold">Demo Projects</div>
          <div className="text-white lg:w-[85vw] w-[92vw] mx-auto rounded-4xl border  border-white/30 bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_30px_rgba(70,80,90,0.2)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent lg:text-xl text-xs lg:w-full w-[90vw]">
                  <TableHead className="text-white lg:w-[19%] w-[13%] ">Project</TableHead>
                  <TableHead className="text-white lg:w-[45%] w-[35%]">Description</TableHead>
                  <TableHead className="text-white lg:w-[16%] w-[10%] lg:hidden table-cell ">Owner</TableHead>
                  <TableHead className="text-white lg:w-[16%] w-[10%] hidden lg:table-cell">Idea Creator</TableHead>
                  <TableHead className="text-white lg:w-[20%] w-[18%]">Submissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-transparent lg:text-base text-[8px]">
                    <TableCell className="lg:p-4">{project.name}</TableCell>
                    <TableCell className="lg:p-4 ">{project.description}</TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell className="">{project.submissions.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
    </div>
  )
}

export default DemoTable
