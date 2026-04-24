# Graph Report - src  (2026-04-24)

## Corpus Check
- 42 files · ~16,794 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 104 nodes · 90 edges · 11 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `useLang()` - 15 edges
2. `useReport()` - 8 edges
3. `useAuth()` - 4 edges
4. `UploadStep()` - 3 edges
5. `OnboardingFlow()` - 3 edges
6. `AppLayout()` - 3 edges
7. `LoginPage()` - 3 edges
8. `mapApiStatus()` - 2 edges
9. `normaliseBiomarker()` - 2 edges
10. `DashboardView()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `DashboardView()` --calls--> `useLang()`  [INFERRED]
  components/DashboardView.jsx → i18n/LangContext.jsx
- `BiomarkerModal()` --calls--> `useLang()`  [INFERRED]
  components/BiomarkerModal.jsx → i18n/LangContext.jsx
- `AppShell()` --calls--> `useLang()`  [INFERRED]
  components/AppShell.jsx → i18n/LangContext.jsx
- `ProcessingScreen()` --calls--> `useLang()`  [INFERRED]
  components/onboarding/ProcessingScreen.jsx → i18n/LangContext.jsx
- `TrendsView()` --calls--> `useLang()`  [INFERRED]
  components/TrendsView.jsx → i18n/LangContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (8): AskView(), Badge(), LandingPage(), LanguageSwitcher(), useLang(), QuestionStep(), ReportsView(), TrendsView()

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (7): AskPage(), DashboardPage(), DetailPage(), useReport(), ReportsPage(), TrendsPage(), UploadPage()

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (4): AppLayout(), useAuth(), LoginPage(), ProtectedRoute()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (1): DashboardView()

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (2): OnboardingFlow(), ssRead()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (1): AppShell()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): mapApiStatus(), normaliseBiomarker()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): Icon(), toPascalCase()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (1): BiomarkerModal()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): fmtSize(), UploadStep()

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (1): ProcessingScreen()

## Knowledge Gaps
- **Thin community `Community 3`** (6 nodes): `DashboardView.jsx`, `BiomarkerActionCard()`, `DashboardView()`, `SummaryHeader()`, `TopConcerns()`, `WhatsAppSection()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (5 nodes): `OnboardingFlow.jsx`, `OnboardingFlow()`, `ssClear()`, `ssRead()`, `ssWrite()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (4 nodes): `AppShell()`, `SideNavItem()`, `UploadNavBtn()`, `AppShell.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (3 nodes): `utils.js`, `mapApiStatus()`, `normaliseBiomarker()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (3 nodes): `Icon.jsx`, `Icon()`, `toPascalCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (3 nodes): `BiomarkerModal()`, `SectionContent()`, `BiomarkerModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (3 nodes): `UploadStep.jsx`, `fmtSize()`, `UploadStep()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (3 nodes): `ProcessingScreen.jsx`, `classifyError()`, `ProcessingScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLang()` connect `Community 0` to `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 9`, `Community 10`, `Community 11`?**
  _High betweenness centrality (0.368) - this node is a cross-community bridge._
- **Why does `LoginPage()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `useLang()` (e.g. with `DashboardView()` and `TrendsView()`) actually correct?**
  _`useLang()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `useReport()` (e.g. with `TrendsPage()` and `AppLayout()`) actually correct?**
  _`useReport()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `useAuth()` (e.g. with `ProtectedRoute()` and `AppLayout()`) actually correct?**
  _`useAuth()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._