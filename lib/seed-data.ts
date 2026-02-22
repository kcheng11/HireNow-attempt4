import type { Laborer, Contractor, Project, HireRequest } from "./types"

export const seedLaborers: Laborer[] = [
  {
    id: "seed-laborer-1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    location: "Mumbai",
    canDrive: true,
    skills: [
      { name: "Plumbing", hourlyRate: 350 },
      { name: "General Labor", hourlyRate: 200 },
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    photoUrls: [],
    ratings: [
      { contractorId: "seed-contractor-1", contractorName: "Vikram Singh", stars: 5, comment: "Excellent plumber, very reliable.", date: "2026-01-15" },
      { contractorId: "seed-contractor-2", contractorName: "Anita Sharma", stars: 4, comment: "Good work, on time.", date: "2026-01-20" },
    ],
  },
  {
    id: "seed-laborer-2",
    name: "Suresh Patel",
    phone: "+91 87654 32109",
    location: "Delhi",
    canDrive: false,
    skills: [
      { name: "Electrical", hourlyRate: 400 },
      { name: "Wiring", hourlyRate: 350 },
    ],
    availability: ["monday", "tuesday", "wednesday", "friday", "saturday"],
    photoUrls: [],
    ratings: [
      { contractorId: "seed-contractor-1", contractorName: "Vikram Singh", stars: 4, comment: "Knows his electrical work.", date: "2026-02-01" },
    ],
  },
  {
    id: "seed-laborer-3",
    name: "Amit Sharma",
    phone: "+91 76543 21098",
    location: "Mumbai",
    canDrive: true,
    skills: [
      { name: "Carpentry", hourlyRate: 300 },
      { name: "Painting", hourlyRate: 250 },
    ],
    availability: ["monday", "wednesday", "thursday", "saturday"],
    photoUrls: [],
    ratings: [],
  },
  {
    id: "seed-laborer-4",
    name: "Deepak Yadav",
    phone: "+91 65432 10987",
    location: "Bangalore",
    canDrive: false,
    skills: [
      { name: "Masonry", hourlyRate: 350 },
      { name: "Tiling", hourlyRate: 400 },
    ],
    availability: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
    photoUrls: [],
    ratings: [
      { contractorId: "seed-contractor-2", contractorName: "Anita Sharma", stars: 5, comment: "Beautiful tile work.", date: "2026-01-25" },
    ],
  },
  {
    id: "seed-laborer-5",
    name: "Vikash Gupta",
    phone: "+91 54321 09876",
    location: "Delhi",
    canDrive: true,
    skills: [
      { name: "Welding", hourlyRate: 450 },
      { name: "General Labor", hourlyRate: 200 },
    ],
    availability: ["monday", "tuesday", "thursday", "friday"],
    photoUrls: [],
    ratings: [],
  },
  {
    id: "seed-laborer-6",
    name: "Manoj Tiwari",
    phone: "+91 43210 98765",
    location: "Bangalore",
    canDrive: false,
    skills: [
      { name: "Roofing", hourlyRate: 380 },
      { name: "Painting", hourlyRate: 250 },
    ],
    availability: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    photoUrls: [],
    ratings: [
      { contractorId: "seed-contractor-1", contractorName: "Vikram Singh", stars: 3, comment: "Decent work, could improve.", date: "2026-02-10" },
    ],
  },
]

export const seedContractors: Contractor[] = [
  {
    id: "seed-contractor-1",
    name: "Vikram Singh",
    phone: "+91 99887 76655",
    company: "Singh Constructions",
    location: "Mumbai",
  },
  {
    id: "seed-contractor-2",
    name: "Anita Sharma",
    phone: "+91 88776 65544",
    company: "Sharma Builders",
    location: "Delhi",
  },
]

export const seedProjects: Project[] = [
  {
    id: "seed-project-1",
    contractorId: "seed-contractor-1",
    title: "Office Renovation",
    description: "Complete renovation of 3rd floor office space.",
    location: "Mumbai, Andheri East",
    photoUrls: [],
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    status: "active",
  },
  {
    id: "seed-project-2",
    contractorId: "seed-contractor-1",
    title: "Warehouse Electrical",
    description: "Rewiring of entire warehouse electrical system.",
    location: "Mumbai, Powai",
    photoUrls: [],
    startDate: "2026-03-01",
    endDate: "2026-05-15",
    status: "active",
  },
  {
    id: "seed-project-3",
    contractorId: "seed-contractor-2",
    title: "Residential Complex",
    description: "New residential building construction with plumbing and tiling.",
    location: "Delhi, Dwarka",
    photoUrls: [],
    startDate: "2026-01-15",
    endDate: "2026-06-30",
    status: "active",
  },
]

export const seedHireRequests: HireRequest[] = [
  {
    id: "seed-request-1",
    projectId: "seed-project-1",
    laborerId: "seed-laborer-1",
    contractorId: "seed-contractor-1",
    date: "2026-03-10",
    status: "pending",
    pickupLocation: "Andheri Station East",
    dropoffLocation: "Office Site, Andheri East",
    offeredAmount: 2500,
    jobCompleted: false,
  },
  {
    id: "seed-request-2",
    projectId: "seed-project-3",
    laborerId: "seed-laborer-4",
    contractorId: "seed-contractor-2",
    date: "2026-03-12",
    status: "accepted",
    pickupLocation: "Dwarka Sector 10 Metro",
    dropoffLocation: "Building Site, Dwarka",
    offeredAmount: 3200,
    jobCompleted: false,
  },
]
