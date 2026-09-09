export type ArtifactSkin =
  | "boarding-pass"
  | "baggage-tag"
  | "retro-crt"
  | "garment-tag"
  | "spiral-notebook";

export type ProjectSection = "currently-cooking" | "recently-made" | "other-work";

export type ProjectStatus = "Active" | "Shipped" | "Open Source" | "In Progress";

export interface ProjectTradeoff {
  tension: string;
  resolution: string;
}

export interface StrategicCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: "Enterprise AI & Systems" | "Applied ML & Vision" | "NLP & Cloud Architecture" | string;
  role: string;
  organization?: string;
  period: string;
  accentColor: string;
  metricBadge: {
    value: string;
    label: string;
  };
  context: string;
  execution: {
    architecture: string[];
    techStack: string[];
    diagramSnippet?: string;
  };
  tradeoffs: {
    tension: string;
    resolution: string;
  }[];
  learntThat: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface SideQuest {
  id: string;
  title: string;
  oneLiner: string;
  category: "Edge AI" | "IoT Hardware" | "Computer Vision" | "Systems" | string;
  stack: string[];
  latencyOrMetric?: string;
  githubUrl: string;
  demoUrl?: string;
  status: "Active" | "Shipped" | "Open Source" | string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  role?: string;
  organization?: string;
  period?: string;
  accentColor: string;
  metricValue?: string;
  metricLabel?: string;
  summary: string;
  context?: string;
  learntThat?: string;
  architecture: string[];
  techStack: string[];
  tradeoffs?: ProjectTradeoff[];
  artifactSkin: ArtifactSkin;
  artifactMetadata?: {
    barcode?: string;
    seatOrGate?: string;
    flightNo?: string;
    stampText?: string;
    stampColor?: string;
    terminalText?: string;
    careIcons?: string[];
    wireCount?: number;
    wipNote?: string;
    tagNumber?: string;
    eyeletColor?: string;
    [key: string]: any;
  };
  section: ProjectSection;
  status: ProjectStatus;
  displayOrder: number;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

// Initial rich dataset fallback
export const initialProjects: ProjectItem[] = [
  {
    id: "proj-media-chronicle",
    slug: "media-chronicle",
    title: "Media Chronicle: On-Device GenAI Memory",
    subtitle: "Native Desktop Photo Memory Intelligence with Local YOLOv8 & Zero External Cloud Dependencies",
    category: "Applied ML & Vision",
    role: "Product Architect & Lead Developer",
    period: "2024 — Present",
    accentColor: "#f43f5e",
    metricValue: "Sub-100ms",
    metricLabel: "Local Neural Retraining & Inference",
    summary:
      "Native desktop photo memory intelligence running localized YOLOv8 and zero cloud subscriptions. Users can retrain and cluster personal facial embeddings completely on-device.",
    context:
      "Personal media archives span terabytes of unorganized photos. Existing commercial cloud solutions charge recurring monthly subscriptions and surrender sensitive photos to third-party corporate servers.",
    architecture: [
      "Multi-platform desktop client utilizing Flutter Dart for GPU-accelerated backdrop glassmorphism UI.",
      "Embedded Python worker daemon running localized YOLOv8 neural network inference for real-time face detection.",
      "On-device incremental retraining pipelines enabling users to train custom person classifiers without sending a single byte to the internet.",
      "Indexed embeddings into a zero-cloud local vector database for instant sub-second multi-modal search.",
    ],
    techStack: ["Flutter (Dart)", "Python", "YOLOv8", "PyTorch", "Desktop IPC", "uv"],
    tradeoffs: [
      {
        tension: "Zero Cloud Dependencies vs. Consumer CPU/GPU Hardware Constraints",
        resolution:
          "Engineered a decoupled async IPC bridge between Flutter and Python, utilizing quantized ONNX weights to deliver fluid 60fps UI performance even on modest laptop hardware.",
      },
      {
        tension: "Local Storage Footprint vs. Embedding Resolution",
        resolution:
          "Implemented hierarchical clustering: low-resolution thumbnail pyramids for real-time visual browsing paired with compact 256-dim face vectors.",
      },
    ],
    learntThat:
      "Users enthusiastically choose privacy and zero subscription fees over cloud sync when local latency is fast enough. Designing local-first systems requires treating hardware variability as a first-class product constraint.",
    artifactSkin: "retro-crt",
    artifactMetadata: {
      terminalText: "LOCAL INFERENCE // ACTIVE [YOLOv8.0n]",
      stampText: "ZERO-CLOUD VERIFIED",
      stampColor: "#10b981",
      wipNote: "Currently refining int8 ONNX quantization & testing v0.4 release on macOS/Linux.",
    },
    section: "currently-cooking",
    status: "In Progress",
    displayOrder: 1,
    featured: true,
    githubUrl: "https://github.com/akshatdhaundiyal/media_chronicle",
  },
  {
    id: "proj-actuarial-glm",
    slug: "frequency-severity-pricing-model",
    title: "Actuarial Pricing & GLM Triage Engine",
    subtitle: "Decomposing Enterprise Policy Risk into a Two-Stage Statistical Triage Matrix",
    category: "Enterprise AI & Systems",
    role: "Lead Analytics Architect (Data Scientist)",
    organization: "EXL Service",
    period: "2023 — 2024",
    accentColor: "#6366f1",
    metricValue: "+$12M",
    metricLabel: "Annual Audit Premium Recovery",
    summary:
      "Decomposed commercial insurance policy audits into a two-stage statistical triage matrix (Binomial GLM frequency × Gamma GLM severity), prioritizing field dispatches and automating zero-variance accounts.",
    context:
      "Commercial insurance accounts operate on estimated exposures with year-end reconciliation audits. Sending field auditors out blindly on millions in policy volume burned operational budget on zero-variance accounts, while massive under-reported liabilities slipped past blunt heuristic rules.",
    architecture: [
      "Decomposed classification problem into two distinct statistical targets: a Binomial GLM (logit link) predicting adjustment probability, and a Gamma GLM (log link) estimating recoverable dollar severity.",
      "Engineered an automated Expected Audit Value (EAV = P(Adjustment) × E[Severity]) prioritization matrix.",
      "Built schema contracts and idempotent feature validation pipelines in Python to guarantee production reproducibility across multi-million row quarterly policy dumps.",
    ],
    techStack: ["Python", "Statsmodels", "Actuarial GLMs", "XGBoost", "PostgreSQL", "SQL"],
    tradeoffs: [
      {
        tension: "Black-Box Gradient Boosting vs. Interpretable Actuarial GLMs",
        resolution:
          "Underwriters refused black-box deep learning scores for regulatory compliance. By calibrating robust Poisson/Gamma GLMs, we maintained mathematical transparency while matching 98% of the boosted tree's ranking power.",
      },
      {
        tension: "Field Audit Dispatch Cost vs. False Positive Rates",
        resolution:
          "Calibrated cost-sensitive threshold curves: tier-1 high EAV accounts received physical audits, moderate EAV went to remote phone desk audits, and low variance accounts were automated via self-serve portals.",
      },
    ],
    learntThat:
      "In enterprise AI, stakeholder adoption is governed by explainability and unit economics, not raw test-set F1. Giving underwriting executives verifiable mathematical coefficients enabled them to trust model recommendations across $100M+ risk portfolios.",
    artifactSkin: "boarding-pass",
    artifactMetadata: {
      barcode: "GLM-4921-99210-EXL",
      seatOrGate: "GATE 04 • ZONE A",
      flightNo: "AUDIT-2024",
      stampText: "EXECUTIVE AUDIT // VERIFIED +$12M",
      stampColor: "#d94e34",
    },
    section: "recently-made",
    status: "Shipped",
    displayOrder: 2,
    featured: true,
    githubUrl: "https://github.com/akshatdhaundiyal",
  },
  {
    id: "proj-claims-vertex",
    slug: "claims-text-analytics-vertex-ai",
    title: "Claims NLP Triage on Google Vertex AI",
    subtitle: "Sub-100ms Inference Pipeline Extracting Subrogation & Litigation Threats from Unstructured Notes",
    category: "NLP & Cloud Architecture",
    role: "ML Engineer & Systems Architect",
    organization: "EXL Service",
    period: "2023 — 2024",
    accentColor: "#06b6d4",
    metricValue: "70%",
    metricLabel: "Reduction in Triage Latency",
    summary:
      "Sub-100ms text ingestion and transformer inference pipeline extracting subrogation and litigation threat signals from unstructured insurance adjuster clinical notes on Google Vertex AI.",
    context:
      "Insurance adjusters generate tens of thousands of freeform clinical and accident notes every day. Hidden inside these unstructured text blocks were critical indicators: impending attorney involvement and third-party recovery opportunities that expired if not acted upon rapidly.",
    architecture: [
      "Constructed a high-throughput text ingestion pipeline using spaCy for custom named-entity recognition and automated PII scrubbing (SSNs, policy IDs, medical codes).",
      "Fine-tuned transformer models and sentence embeddings to classify litigation risk and subrogation recovery flags.",
      "Packaged weights in an asynchronous FastAPI inference container deployed onto Google Vertex AI custom prediction endpoints with auto-scaling.",
    ],
    techStack: ["Google Vertex AI", "Hugging Face BERT", "spaCy", "Sentence Transformers", "FastAPI", "Docker"],
    tradeoffs: [
      {
        tension: "Transformer Model Size vs. Production SLA Latency",
        resolution:
          "Applied post-training int8 quantization and torchscript compilation, cutting container memory footprint by 60% and dropping p95 inference latency below 85ms.",
      },
      {
        tension: "Cold Start Latency vs. Cloud Compute Idle Cost",
        resolution:
          "Configured minimal warm replica triggers with custom health probes, eliminating 10-second cold start spikes on morning batch processing runs.",
      },
    ],
    learntThat:
      "Model accuracy on static validation sets is meaningless if cold starts breach SLA. Int8 quantization and container warmup hooks proved 5x more impactful to user adoption than squeezing another 0.5% F1 score in offline experiments.",
    artifactSkin: "baggage-tag",
    artifactMetadata: {
      tagNumber: "VTX-77402-NLP",
      stampText: "SLA VERIFIED (<85MS)",
      stampColor: "#10b981",
      eyeletColor: "#cbd5e1",
    },
    section: "recently-made",
    status: "Shipped",
    displayOrder: 3,
    featured: true,
    githubUrl: "https://github.com/akshatdhaundiyal",
  },
  {
    id: "proj-washqueue",
    slug: "washqueue",
    title: "WashQueue Smart Appliance",
    subtitle: "Hostel Laundry Telemetry with Tuya Smart Plugs, 2-Min Soak Debounce, and Native WebSockets",
    category: "IoT Hardware | 2024",
    accentColor: "#10b981",
    metricValue: "<1s",
    metricLabel: "Live WebSocket State Broadcast",
    summary:
      "Hostel laundry telemetry appliance using local Tuya smart plugs, a 2-min soak debounce algorithm, and native WebSockets broadcasting real-time cycle status.",
    architecture: [
      "Sub-second power draw monitoring via TinyTuya local protocol",
      "State-machine debounce isolating machine pauses from full wash completion",
      "Full duplex WebSocket broadcast to mobile PWA",
    ],
    techStack: ["FastAPI", "WebSockets (/ws)", "TinyTuya", "SQLite", "Next.js"],
    artifactSkin: "spiral-notebook",
    artifactMetadata: {
      wireCount: 8,
      stampText: "CAMPUS IOT // SHIPPED",
    },
    section: "other-work",
    status: "Shipped",
    displayOrder: 4,
    featured: false,
    githubUrl: "https://github.com/akshatdhaundiyal/washqueue",
  },
  {
    id: "proj-rooftop-analysis",
    slug: "rooftop-analysis",
    title: "Rooftop Solar & Hazard CV",
    subtitle: "Deep Learning Semantic Segmentation Isolating Degradation & Usable Solar Area",
    category: "Computer Vision | 2024",
    accentColor: "#f59e0b",
    metricValue: "~85%",
    metricLabel: "Risk Segmentation Precision",
    summary:
      "Deep learning semantic segmentation isolating rooftop degradation, structural risk markers, and usable solar area from high-resolution satellite imagery.",
    architecture: [
      "U-Net / Mask R-CNN multi-class segmentation pipeline",
      "Automated orthomosaic preprocessing and tile normalization",
      "GeoJSON polygon hazard export for underwriting risk scoring",
    ],
    techStack: ["PyTorch", "OpenCV", "FastAPI", "Satellite Imagery"],
    artifactSkin: "garment-tag",
    artifactMetadata: {
      careIcons: ["clean", "safe", "verified", "solar"],
      stampText: "CV SEGMENTATION",
    },
    section: "other-work",
    status: "Shipped",
    displayOrder: 5,
    featured: false,
    githubUrl: "https://github.com/akshatdhaundiyal/rooftop_analysis",
  },
  {
    id: "proj-marketplace",
    slug: "dropshipping-marketplace",
    title: "Decentralized Marketplace Broker",
    subtitle: "Multi-Vendor Inventory Synchronization & Automated Order Routing Engine",
    category: "Systems | 2023",
    accentColor: "#8b5cf6",
    metricValue: "100%",
    metricLabel: "Multi-Supplier Stock Synchronization",
    summary:
      "Multi-vendor inventory synchronization and automated order fulfillment routing engine handling split-order supplier dispatch and automated webhook retries.",
    architecture: [
      "Idempotent webhook intake queues with exponential backoff",
      "Real-time atomic stock decrement across split supplier warehouses",
      "Dockerized microservice cluster with PostgreSQL transaction locks",
    ],
    techStack: ["Python", "PostgreSQL", "Docker", "REST Webhooks"],
    artifactSkin: "spiral-notebook",
    artifactMetadata: {
      wireCount: 8,
      stampText: "OPEN SOURCE",
    },
    section: "other-work",
    status: "Open Source",
    displayOrder: 6,
    featured: false,
    githubUrl: "https://github.com/Prodman-MU/dropshipping-marketplace",
  },
  {
    id: "proj-portfolio-platform",
    slug: "portfolio-platform-fullstack",
    title: "Next.js Full-Stack Portfolio Platform",
    subtitle: "Containerized Developer Showcase with Physical Artifacts & Medium Syndication",
    category: "Systems | 2026",
    accentColor: "#d94e34",
    metricValue: "150MB",
    metricLabel: "Standalone Google Cloud Run Container",
    summary:
      "Clean Next.js 15 App Router portfolio engine with authentic physical artifact aesthetic, dynamic Super Admin blog studio, and 1-click Medium cross-posting.",
    architecture: [
      "Next.js 15 standalone output packaged into multi-stage Docker container",
      "Dual database/in-memory fallback ensuring zero downtime if PostgreSQL is unreachable",
      "Medium REST v1 syndication with canonical URL SEO attribution",
    ],
    techStack: ["Next.js 15", "React 19", "Prisma ORM", "Tailwind CSS", "Docker"],
    artifactSkin: "spiral-notebook",
    artifactMetadata: {
      wireCount: 8,
      stampText: "PRODUCTION READY",
    },
    section: "other-work",
    status: "Active",
    displayOrder: 7,
    featured: false,
    githubUrl: "https://github.com/akshatdhaundiyal/portfolio_platform",
  },
];

// Backwards compatibility aliases
export const strategicCaseStudies: StrategicCaseStudy[] = initialProjects
  .filter((p) => p.section === "recently-made" || p.section === "currently-cooking")
  .map((p) => ({
    id: p.slug,
    title: p.title,
    subtitle: p.subtitle || "",
    category: p.category,
    role: p.role || "",
    organization: p.organization,
    period: p.period || "",
    accentColor: p.accentColor,
    metricBadge: {
      value: p.metricValue || "",
      label: p.metricLabel || "",
    },
    context: p.context || p.summary,
    execution: {
      architecture: p.architecture,
      techStack: p.techStack,
    },
    tradeoffs: p.tradeoffs || [],
    learntThat: p.learntThat || "",
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
  }));

export const sideQuests: SideQuest[] = initialProjects
  .filter((p) => p.section === "other-work")
  .map((p) => ({
    id: p.slug,
    title: p.title,
    oneLiner: p.summary || p.subtitle || "",
    category: p.category,
    stack: p.techStack,
    latencyOrMetric: p.metricValue,
    githubUrl: p.githubUrl || "",
    demoUrl: p.liveUrl,
    status: p.status,
  }));
