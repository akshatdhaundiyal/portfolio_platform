export interface ClientItem {
  id: string;
  company: string;
  contactName: string;
  email: string;
  role: string;
  status: "Active" | "Archived";
  assignedProjects: string[];
  totalBilled: string;
  notes?: string;
  createdAt: string;
}

export const initialClients: ClientItem[] = [
  {
    id: "client-1",
    company: "EXL Service",
    contactName: "VP Analytics Architecture",
    email: "enterprise-analytics@exlservice.com",
    role: "Lead Analytics Architect",
    status: "Active",
    assignedProjects: ["actuarial-pricing-glm-triage", "claims-nlp-vertex-ai"],
    totalBilled: "$12,450,000",
    notes: "Enterprise Poisson-Gamma loss modeling and Vertex AI claims triage pipeline.",
    createdAt: "2024-01-15",
  },
  {
    id: "client-2",
    company: "FinTech Core Capital",
    contactName: "Managing Director, Quantitative Systems",
    email: "quant-lead@corecapital.io",
    role: "Principal Quantitative Engineer",
    status: "Active",
    assignedProjects: ["regulatory-capital-stresstesting"],
    totalBilled: "$4,200,000",
    notes: "Basel III / Dodd-Frank stochastic risk simulation engine with sub-second recalculation.",
    createdAt: "2024-04-10",
  },
  {
    id: "client-3",
    company: "HealthVision Diagnostics",
    contactName: "Chief Medical Information Officer",
    email: "systems@healthvision.ai",
    role: "Applied Computer Vision Lead",
    status: "Active",
    assignedProjects: ["media-chronicle-genai-memory"],
    totalBilled: "$2,850,000",
    notes: "Local on-device neural retraining with YOLOv8 and zero cloud data egress.",
    createdAt: "2024-07-22",
  },
];
