# Portfolio Home & About Page Implementation Plan

I have successfully extracted your resume! I will now map your professional background into an interactive, visually stunning Nuxt portfolio.

## Changes Overview

### 1. `frontend/app/pages/index.vue` (Home / Hero Page)
- **Remove Redirect**: I will remove the auto-redirect to `/login`.
- **Hero Section**: 
  - Main Headline: **Akshat Dhaundiyal** (with a sleek CSS gradient effect).
  - Sub-Headline: **Data Scientist** with a focus on Machine Learning and Analytics.
  - Taglines: Highlight values ("adding value to business decisions using Machine Learning" and "developing novel approaches").
  - Actions: Buttons for "Explore My Work" (routing to `/user`) and "About Me" (routing to `/about`).
- **Tech Stack Marquee**: Small badge row listing: Python, Machine Learning, SQL, PowerBI, GCP (Vertex AI), Airflow.

### 2. `frontend/app/pages/about.vue` (Detailed CV Page)
- **Experience Timeline** (Vertical layout using Tailwind):
  - **Data Scientist @ EXL Service (Dec 2021 — Present)**: Highlight Frequency/Severity Models, NLP Claims Analytics (Vertex AI, Hugging Face, BERT), Looker/ThoughtSpot Property Assessments.
  - **Data Scientist @ Networth Corp (Sep 2019 — Nov 2020)**: Highlight FMCG inventory forecasting with gradient boosting algorithms and Python Dash dashboards.
- **Education Section**: A glassmorphic `UCard` for your B.Tech in Electronics & Communication at Manipal Institute of Technology (2015-2019).
- **Skills Grid**: Wrapping UI badges for Python, Machine Learning, SQL, PowerBI, Google Looker, Airflow, NLP, GLMs, spaCy.

## Verification Plan
1. Ensure the UI components dynamically switch gracefully between dark and light modes using Nuxt UI's defaults.
2. Verify that clicking "Explore My Work" seamlessly navigates clients to the portal.
3. Remove the temporary `cv.txt` generated during parsing to keep your workspace clean.

*Please review this plan. Once approved, I will immediately execute the code!*

---

# Execution Complete: Home & About Pages Created

I have fully implemented your modern glassmorphic profile pages mapping the data straight from your CV!

## 1. **The Hero Portfolio (`index.vue`)**
We have replaced the blank page and the strict `/login` redirect with a public-facing landing page.
- Created beautiful CSS-driven pulsing backdrops (`animate-blob`) that provide a glassmorphic aesthetic to the entire page. 
- Integrated your profile mapping: **Akshat Dhaundiyal - Data Scientist**, decorated with a flowing text gradient.
- Added a floating marquee of badges exhibiting your top expertise (`Python`, `Machine Learning`, `Google Looker`, etc.).

## 2. **The About Page (`about.vue`)**
Using the structure of your CV, I developed dedicated timeline components utilizing standard Tailwind CSS and Nuxt capabilities.
- **Experience Timeline**: Elegantly lays out your progression at EXL Service and Networth Corp. I included animated hover states for timeline nodes to invoke interactivity.
- **Education Section**: Extracted your Manipal Institute B.Tech details into a clean header card dynamically spaced.
- **Skill Repository**: Built a comprehensive badge grid reflecting your entire tool belt (`Vertex AI`, `GLMs`, `NLP`, `Airflow`, etc.).

You should now have a visually stunning public footprint for your portfolio web application! Have a look in your development browser.
