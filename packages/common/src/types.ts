
import { email, z } from 'zod'

export const SignupSchema = z.object({
    email: z.string().regex(/@/, "Invalid Email"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    username: z.string().min(3, "Username Required")
})

export const SigninSchema = z.object({
    email: z.string().regex(/@/, "Invalid Email"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    username: z.string().optional()
})

export const ProjectSchema = z.object({
    name: z.string().min(3, "Give a Proper Name to the Project"),
    description: z.string().min(40, "Description must be 40-100 characters"),
    skillsreq: z.string().optional(),
    refrenceLink: z.string().optional(),
    mainFeature: z.string().min(3, "Give a Vaild Main Feature for the Project"),
    compensationType: z.enum(["bounty", "equity"]),
    bounty: z.coerce.number().optional(),
    equity: z.coerce.number().optional()
}).superRefine((data, ctx) => {
    if(data.compensationType == "bounty"){
        if(!data.bounty || data.bounty <= 0){
            ctx.addIssue({
                code: "custom",
                message: "Enter a valid bounty amount",
                path: ["bounty"]
            })
        }
    }
    if(data.compensationType == "equity"){
        if(!data.equity || data.equity <= 0 || data.equity > 100){
            ctx.addIssue({
                code: "custom",
                message: "Enter a valid percentage of Equity (1 - 100)",
                path: ["equity"]
            })
        }
    }
}
)

export const updateProjectSchema = z.object({
    name: z.optional(z.string().min(3, "Give a Proper Name to the Project")),
    description: z.optional(z.string().min(40, "Description must be 40-100 characters")),
    skillsreq: z.string().optional(),
    refrenceLink: z.string().optional(),
    mainFeature: z.optional(z.string().min(3, "Give a Vaild Main Feature for the Project"))
})

export const onboardDevSchema = z.object({
    contact_name: z.string(),
    email: z.email(),
    phone: z.number(),
    legal_business_name: z.string(),
    accountNumber: z.number()
})

export const updateUserSchema = z.object({
    name: z.string().min(2, "Name Required"),
    username: z.string().min(3, "Username Required"),
    job: z.string().optional(),
    role: z.enum(["DEV", "OWNER"]).optional(),
    phone: z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), "Phone number should be 10 digits"),
    email: z.optional(z.string().regex(/@/, "Invalid Email"))
})

const submitContributionSchema = z.object({
    username: z.string().min(3, "Username Required"),
    contribution: z.number().min(1, "Min 1%").max(100, "Max 100%"),
    contributionRole: z.enum(["Leader", "Member"])
})

export const submitSchema = z.object({
    repoLink: z.string().min(6, "Give a Proper Link"),
    liveLink: z.string().min(6, "Give a Proper Link"),
    NoofContributors: z.number().min(1).max(4).optional(),
    items: z.array(submitContributionSchema).optional()
}).superRefine((data, ctx) => {
  const expectedCount = data.NoofContributors ? data.NoofContributors : 1;
  
  if (expectedCount > 1) {
      if (!data.items || data.items.length !== expectedCount) {
        ctx.addIssue({
          code: "custom",
          message: `Expected ${expectedCount} contributors, but got ${data.items?.length || 0}.`,
          path: ["items"],
        });
        return; 
      }

      const totalContribution = data.items.reduce((sum, item) => sum + (item.contribution || 0), 0);
      if (totalContribution !== 100) {
        ctx.addIssue({
          code: "custom",
          message: `Total contribution must be exactly 100%. Currently at ${totalContribution}%.`,
          path: ["items"], 
        });
      }

      const hasLeader = data.items.some(item => item.contributionRole == "Leader")
      if(!hasLeader){
        ctx.addIssue({
            code: "custom",
            message: "There must be atleast 1 Leader in a Team",
            path: ["items"]
        })
      }
  }
});

export type SubmitFormValues = z.infer<typeof submitSchema>;

export const updateSubmitSchema = z.object({
    repoLink: z.optional(z.string().min(6, "Give a Proper Link")),
    liveLink: z.optional(z.string().min(6, "Give a Proper Link"))
})

export const searchQuerySchema = z.object({
    query: z.string().min(4)
})