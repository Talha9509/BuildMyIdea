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
      rewardType: "Bounty",
      reward: "₹15,000",
    },
    {
      id: 2,
      name: "Smart Expense Tracker",
      description: "Track daily expenses with smart categorization, charts, and AI-based spending insights for better financial planning.",
      owner: "Priya Mehta",
      submissions: ["Rohit Gupta", "Anjali Singh"],
      rewardType: "Equity",
      reward: "5%",
    },
    {
      id: 3,
      name: "Real-Time Chat App",
      description: "A WhatsApp-like real-time chat application with typing indicators, read receipts, and media sharing.",
      owner: "Arjun Nair",
      submissions: ["Vikram Joshi", "Neha Kapoor", "Aditya Jain", "Pooja Das"],
      rewardType: "Bounty",
      reward: "₹25,000",
    },
    {
      id: 4,
      name: "Freelancer Marketplace",
      description: "Platform where clients can post projects and freelancers can bid, similar to Fiverr/Upwork but simplified.",
      owner: "Kavya Iyer",
      submissions: ["Manish Kumar", "Siddharth Roy"],
      rewardType: "Equity",
      reward: "8%",
    },
    {
      id: 5,
      name: "AI Code Reviewer",
      description: "Tool that reviews code using AI, suggests improvements, detects bugs, and enforces best practices.",
      owner: "Sandeep Yadav",
      submissions: ["Ritika Sharma", "Deepak Verma", "Harsh Agarwal"],
      rewardType: "Bounty",
      reward: "₹20,000",
    },
    {
      id: 6,
      name: "Online Learning Platform",
      description: "A platform for hosting courses with video streaming, quizzes, progress tracking, and certifications.",
      owner: "Meera Joshi",
      submissions: ["Nikhil Bansal"],
      rewardType: "Equity",
      reward: "6%",
    },
    {
      id: 7,
      name: "Health Appointment System",
      description: "Book doctor appointments, manage schedules, and get reminders with a simple and intuitive interface.",
      owner: "Ankit Verma",
      submissions: ["Divya Reddy", "Rahul Das", "Kunal Shah"],
      rewardType: "Bounty",
      reward: "₹12,000",
    },
  ];

  return (
    <div className="py-24 px-4">
      {/* Section heading */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-4">
          LIVE PREVIEW
        </div>
        <h2 className="text-white text-3xl lg:text-5xl font-bold mb-4">
          See What&apos;s Being Built
        </h2>
        <p className="text-gray-400 text-base lg:text-lg max-w-xl mx-auto">
          Real startup ideas, real developers, real submissions. Here&apos;s a glimpse of what&apos;s happening on the platform.
        </p>
      </div>

      {/* Table container */}
      <div className="text-white lg:w-[85vw] w-[95vw] mx-auto rounded-2xl border border-white/10 bg-[#0D0D14] overflow-hidden shadow-2xl shadow-violet-900/10">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-white/10 bg-violet-950/30">
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs lg:w-[18%] w-[20%] lg:py-4 py-3">
                Project
              </TableHead>
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs lg:w-[35%] w-[30%]">
                Description
              </TableHead>
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs lg:w-[14%] w-[12%] hidden lg:table-cell">
                Idea Creator
              </TableHead>
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs lg:w-[14%] w-[12%] lg:hidden table-cell">
                Owner
              </TableHead>
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs hidden lg:table-cell">
                Submissions
              </TableHead>
              <TableHead className="text-violet-300 font-semibold lg:text-sm text-xs lg:w-[14%] w-[22%]">
                Reward
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
                className={`border-b border-white/5 hover:bg-white/[0.025] transition-colors lg:text-sm text-[10px] ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                }`}
              >
                <TableCell className="lg:p-4 p-2 font-medium text-gray-100">
                  {project.name}
                </TableCell>
                <TableCell className="lg:p-4 p-2 text-gray-400 leading-relaxed">
                  {project.description}
                </TableCell>
                <TableCell className="text-gray-300">
                  {project.owner}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-400 text-xs">
                  {project.submissions.join(", ")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      project.rewardType === 'Bounty'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-violet-500/15 text-violet-400 border border-violet-500/25'
                    }`}
                  >
                    {project.rewardType === 'Bounty' ? '💰' : '📈'} {project.rewardType}: {project.reward}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DemoTable
