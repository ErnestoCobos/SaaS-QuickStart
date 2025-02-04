export interface Deal {
  id: string
  name: string
  contact: string
  email: string
  value: string
  source: string
}

export const deals: Deal[] = [
  {
    id: "01",
    name: "Acme",
    contact: "Tyra Dhillon",
    email: "tyradhillon@acme.com",
    value: "$3,912",
    source: "Social Networks",
  },
  {
    id: "02",
    name: "Academic Project",
    contact: "Brittni Lando",
    email: "lando@academicproject.com",
    value: "$2,345",
    source: "Outreach",
  },
  {
    id: "03",
    name: "Aimbus",
    contact: "Kevin Chen",
    email: "chen@aimbus.com",
    value: "$13,864",
    source: "Referrals",
  },
  {
    id: "04",
    name: "Big Bang Production",
    contact: "Josh Ryan",
    email: "joshryan@gmail.com",
    value: "$6,314",
    source: "Word-of-mouth",
  },
  {
    id: "05",
    name: "Book Launch",
    contact: "Chieko Chute",
    email: "chieko67@booklaunch.com",
    value: "$5,982",
    source: "Outreach",
  },
]
