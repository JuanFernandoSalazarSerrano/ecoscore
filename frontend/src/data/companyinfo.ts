export const testUsers = [
  {
    company: {
      name: "Mackensy Hedge Fund",
      industry: "Financial Services",
      location: "New York, NY",
      website: "mackensyfund.com",
      verified: true,
    },
    scores: {
      overall: 72,
      carbon: 68,
      water: 85,
      energy: 74,
      waste: 65,
    },
    categories: [
      { label: "Carbon", score: 68 },
      { label: "Water", score: 85 },
      { label: "Energy", score: 74 },
      { label: "Waste", score: 65 },
    ],
    stats: [
      { label: "Employees", value: "342", trend: "+12%" },
      { label: "ESG Allocation", value: "45%", trend: "+8%" },
      { label: "Green Projects", value: "12", trend: "+3" },
    ],
  },
];
