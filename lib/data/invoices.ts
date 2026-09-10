export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientCompany: string;
  clientEmail: string;
  projectSlug: string;
  projectTitle: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
  lineItems: InvoiceLineItem[];
  paymentMethod?: string;
  paidAt?: string;
}

export const initialInvoices: InvoiceItem[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    clientCompany: "EXL Service",
    clientEmail: "enterprise-analytics@exlservice.com",
    projectSlug: "actuarial-pricing-glm-triage",
    projectTitle: "Actuarial Pricing & GLM Triage Engine",
    issueDate: "2024-02-01",
    dueDate: "2024-03-01",
    totalAmount: 185000,
    status: "paid",
    description: "Milestone 1: Stochastic Poisson-Gamma Loss Modeling & Optimization Engine",
    paidAt: "2024-02-24",
    paymentMethod: "ACH Corporate Transfer",
    lineItems: [
      {
        id: "item-1",
        description: "Two-Stage GLM Architectural Design & Mathematical Proofs",
        quantity: 120,
        rate: 650,
        amount: 78000,
      },
      {
        id: "item-2",
        description: "Python/Polars Distributed Optimization Core Implementation",
        quantity: 110,
        rate: 650,
        amount: 71500,
      },
      {
        id: "item-3",
        description: "Historical Portfolio Backtesting & Audit Calibration",
        quantity: 55,
        rate: 650,
        amount: 35500,
      },
    ],
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-002",
    clientCompany: "EXL Service",
    clientEmail: "enterprise-analytics@exlservice.com",
    projectSlug: "claims-nlp-vertex-ai",
    projectTitle: "Claims NLP Triage on Google Vertex AI",
    issueDate: "2024-06-15",
    dueDate: "2024-07-15",
    totalAmount: 142000,
    status: "paid",
    description: "Milestone 2: Productionizing BERT Triage on Vertex AI Pipelines",
    paidAt: "2024-07-08",
    paymentMethod: "ACH Corporate Transfer",
    lineItems: [
      {
        id: "item-4",
        description: "BERT Classification Pipeline Containerization & Triton Tuning",
        quantity: 130,
        rate: 650,
        amount: 84500,
      },
      {
        id: "item-5",
        description: "Sub-100ms Inference Pipeline & Litigation Extractor",
        quantity: 88,
        rate: 650,
        amount: 57500,
      },
    ],
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-003",
    clientCompany: "FinTech Core Capital",
    clientEmail: "quant-lead@corecapital.io",
    projectSlug: "regulatory-capital-stresstesting",
    projectTitle: "Regulatory Capital & Stress Testing Engine",
    issueDate: "2024-08-01",
    dueDate: "2024-09-01",
    totalAmount: 95000,
    status: "pending",
    description: "Milestone 1: Basel III Stress Testing Simulation Suite",
    lineItems: [
      {
        id: "item-6",
        description: "Stochastic Monte Carlo Risk Pipeline Architecture",
        quantity: 90,
        rate: 700,
        amount: 63000,
      },
      {
        id: "item-7",
        description: "Sub-second Capital Ratio Recalculation Core",
        quantity: 45,
        rate: 711.11,
        amount: 32000,
      },
    ],
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-004",
    clientCompany: "HealthVision Diagnostics",
    clientEmail: "systems@healthvision.ai",
    projectSlug: "media-chronicle-genai-memory",
    projectTitle: "Media Chronicle: On-Device GenAI Memory",
    issueDate: "2024-09-01",
    dueDate: "2024-09-15",
    totalAmount: 64000,
    status: "pending",
    description: "Milestone 1: Local YOLOv8 Retraining & Vector Memory Pipeline",
    lineItems: [
      {
        id: "item-8",
        description: "Flutter + Python On-Device Architecture Setup",
        quantity: 80,
        rate: 550,
        amount: 44000,
      },
      {
        id: "item-9",
        description: "Zero Cloud Data Egress Hardening & Benchmark Testing",
        quantity: 36,
        rate: 555.55,
        amount: 20000,
      },
    ],
  },
];
