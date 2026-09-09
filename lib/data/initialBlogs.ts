export interface InitialBlog {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  readTime: string;
  accentColor: string;
  tags: string[];
  featured: boolean;
  content: string;
  coverImage?: string;
  status: "published" | "draft";
}

export const initialBlogs: InitialBlog[] = [
  {
    slug: "audit-recommender-glms-case-study",
    title: "Engineering a $12M Impact Audit Recommender with GLMs",
    subtitle: "A technical breakdown of using Poisson and Gamma GLMs to triage enterprise policyholders.",
    category: "Enterprise AI",
    readTime: "8 min read",
    accentColor: "#6366f1",
    tags: ["Actuarial GLMs", "Poisson & Gamma", "Optimization", "Python"],
    summary: "How we formulated commercial insurance audit selection as a multi-stage statistical optimization problem, yielding an estimated $12M increase in recovered audit premium.",
    featured: true,
    status: "published",
    content: `Commercial insurance policies are often issued on an estimated payroll or revenue basis. At the close of the policy year, an audit is performed to reconcile actual exposures against initial estimates.

However, physical and detailed audits are resource-intensive. Selecting accounts at random or via simplistic heuristic filters yields high false positives.

---

## 1. The Core Mathematical Formulation

Instead of a single black-box binary classifier (*"Will this policy have an audit adjustment: Yes/No?"*), we decomposed the problem into two distinct statistical targets:

1. **Probability of Non-Zero Exposure Delta ($P(Y > 0)$)**: Modeled via a **Binomial GLM** with logit link.
2. **Expected Recoverable Premium Magnitude ($E[D \\mid Y > 0]$)**: Modeled via a **Gamma GLM** with log link.

\`\`\`python
import statsmodels.api as sm
import statsmodels.formula.api as smf

# Step 1: Probability of Adjustment
logit_model = smf.glm(
    formula="adjustment_flag ~ revenue_growth + prior_audit_variance + industry_risk_idx",
    data=training_df,
    family=sm.families.Binomial()
).fit()

# Step 2: Severity of Adjustment (Conditioned on adjustment)
gamma_model = smf.glm(
    formula="recoverable_premium ~ log_payroll + employee_count_ratio + state_mod",
    data=training_df[training_df['adjustment_flag'] == 1],
    family=sm.families.Gamma(link=sm.families.links.Log())
).fit()
\`\`\`

---

## 2. Triage Decision Matrix

By multiplying $P(Y > 0) \\times E[D \\mid Y > 0]$, we obtain the **Expected Audit Value (EAV)**.

| Priority Tier | EAV Range | Recommended Action | Resource Allocation |
| :--- | :--- | :--- | :--- |
| **Tier 1 (High Impact)** | $> \\$15,000$ | Comprehensive Physical Field Audit | Senior Field Auditor |
| **Tier 2 (Moderate)** | $\\$3,000 - \\$15,000$ | Telephone / Remote Verified Audit | In-House Desk Auditor |
| **Tier 3 (Low Variance)** | $< \\$3,000$ | Automated Self-Service Digital Portal | Automated Email Dispatch |

---

## 3. Results & Operational Impact

- **Estimated $12 Million** annual increase in recovered premium.
- **$50,000+** direct reduction in unnecessary on-site audit expenses.
- Audit turnaround cycle shortened from 45 days to 14 days on low-variance policies.
`,
  },
  {
    slug: "form-follows-function-applied-ml",
    title: "Form Follows Function: Applied ML Lessons from Industrial Design",
    subtitle: "Why eliminating vanity complexity leads to high-leverage predictive systems in production.",
    category: "Applied ML",
    readTime: "6 min read",
    accentColor: "#06b6d4",
    tags: ["Machine Learning", "System Design", "MLOps", "Functional Design"],
    summary: "The founding principle of functional design is 'Form follows function.' In enterprise ML, complex models are frequently forced onto problems that needed clean data engineering and robust baseline statistics.",
    featured: true,
    status: "published",
    content: `In modern engineering, the foundational truth is simple: **systems should be stripped of superfluous ornamentation, with every component deriving directly from its core purpose.**

Over the years in production data science, teams frequently fall into the trap of architectural ornamentation:
- The inference latency exceeds their SLA by 400ms.
- Upstream table schemas drift weekly, poisoning embeddings silently.
- Business stakeholders don't trust predictions they cannot audit.

> "A well-calibrated Generalized Linear Model (GLM) with rock-solid feature validation running on time will outperform a flaky neural network that fails silently on Tuesday mornings."

---

## Three Principles for Production AI

### Rule I: Clarity Over Complexity
Start with interpretable baselines. When building enterprise risk models, starting with standard statistical distributions gives stakeholders immediate confidence before introducing gradient boosting.

### Rule II: The Pipeline is the Model
Your weights are only as resilient as the data pipelines feeding them. Investing in idempotent DAGs, schema contracts, and automated outlier detection provides 10x more leverage than hyperparameter grid search.

\`\`\`python
# Schema contract enforcement before inference
from pydantic import BaseModel, Field

class InsuranceClaimPayload(BaseModel):
    policy_id: str
    incurred_loss: float = Field(ge=0, description="Loss amount must be non-negative")
    claim_frequency: int = Field(ge=1, le=50)
    risk_score: float = Field(ge=0.0, le=1.0)
\`\`\`

### Rule III: Observable Feedback Loops
Every inference endpoint must log its inputs, predicted distribution, and downstream business outcome. Without automated feedback loops, machine learning systems degrade silently.
`,
  },
  {
    slug: "vertex-ai-nlp-production-pipeline",
    title: "From Text to Triage: Productionizing BERT on Google Vertex AI",
    subtitle: "Architecting scalable inference for unstructured insurance adjuster notes.",
    category: "NLP & Cloud",
    readTime: "7 min read",
    accentColor: "#f43f5e",
    tags: ["NLP", "BERT", "Google Vertex AI", "Hugging Face", "FastAPI"],
    summary: "Step-by-step walkthrough of building a low-latency text classification and summarization pipeline on Google Vertex AI using spaCy, Hugging Face, and FastAPI.",
    featured: true,
    status: "published",
    content: `Claims adjusters produce hundreds of thousands of unstructured text notes daily. Within these raw paragraphs lie vital indicators:
- Potential third-party liability (subrogation).
- Escalating medical litigation threats.
- Inconsistencies indicating suspicious loss claims.

---

## System Architecture

\`\`\`
[Adjuster Note Input]
        │
        ▼
[spaCy Tokenizer & Sanitizer]   --> (Masks PII: Names, SSNs, Policy #s)
        │
        ▼
[Sentence Transformers Embedding] --> (Extracts 768-dim semantic vectors)
        │
        ▼
[Fine-Tuned BERT Classifier]     --> (Predicts risk flags: Litigation / Subrogation)
        │
        ▼
[FastAPI Response JSON]          --> (< 85ms inference p95)
\`\`\`

---

## Lessons Learned in Production

1. **Quantization is essential**: Using ONNX runtime or int8 quantization reduced model memory footprint by 60% with negligible loss in F1 score.
2. **Handle Cold Starts Gracefully**: Configuring min-instances = 1 on Vertex AI prevented 10-second cold start spikes on morning batch runs.
`,
  },
  {
    slug: "neo-brutalist-design-for-developers",
    title: "Why High-Contrast & Tactile Design Make Developer Portfolios Unforgettable",
    subtitle: "Breaking out of generic template formulas with bold typography, high contrast, and tactile physical feedback.",
    category: "Design Systems",
    readTime: "5 min read",
    accentColor: "#10b981",
    tags: ["Design Systems", "CSS", "Tactile UI", "Next.js"],
    summary: "The modern web has suffered from aesthetic homogenization. Discover how high-contrast principles—hard shadows, thick borders, geometric type, and primary accents—create high-converting developer showcases.",
    featured: false,
    status: "published",
    content: `Look at twenty developer portfolio websites made this year. Chances are, eighteen of them have:
- A subtle dark gradient background.
- Translucent glassmorphic cards with rounded corners.
- Glowing blurred purple/cyan spheres in the background.

While sleek, this formula has led to total brand invisibility. When every site looks like a generic SaaS landing page, none of them stand out.

---

## Tactile Physical Presence

High-contrast design is born out of a desire to unite clarity and tactile utility:
- **Bold geometric hierarchy** over subtle blur effects.
- **High-contrast borders** that celebrate separation of elements.
- **Hard offset shadows** that create physical tactile presence.
- **Micro-interactions** that reward curiosity and engagement.
`,
  },
];
