import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProgressProvider } from './contexts/ProgressContext'
import PublicLayout from './layouts/PublicLayout'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const AiMlBasics = lazy(() => import('./pages/AiMlBasics'))
const MlDevelopment = lazy(() => import('./pages/MlDevelopment'))
const SageMaker = lazy(() => import('./pages/SageMaker'))
const GenAiBasics = lazy(() => import('./pages/GenAiBasics'))
const PromptEngineering = lazy(() => import('./pages/PromptEngineering'))
const FmEvaluation = lazy(() => import('./pages/FmEvaluation'))
const ResponsibleAi = lazy(() => import('./pages/ResponsibleAi'))
const SecurityGovernance = lazy(() => import('./pages/SecurityGovernance'))
const ClfC02 = lazy(() => import('./pages/ClfC02'))
const SaaC03 = lazy(() => import('./pages/SaaC03'))
const DvaC02 = lazy(() => import('./pages/DvaC02'))
const SoaC02 = lazy(() => import('./pages/SoaC02'))
const DeaC01 = lazy(() => import('./pages/DeaC01'))
const MlaC01 = lazy(() => import('./pages/MlaC01'))
const SapC02 = lazy(() => import('./pages/SapC02'))
const DopC02 = lazy(() => import('./pages/DopC02'))
const ScsC02 = lazy(() => import('./pages/ScsC02'))
const AnsC01 = lazy(() => import('./pages/AnsC01'))
const StampBreaking = lazy(() => import('./pages/StampBreaking'))
const Practice = lazy(() => import('./pages/Practice'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
      <PublicLayout>
        <Suspense fallback={<div className="loading-spinner">로딩 중...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-ml-basics" element={<AiMlBasics />} />
            <Route path="/ml-development" element={<MlDevelopment />} />
            <Route path="/sagemaker" element={<SageMaker />} />
            <Route path="/gen-ai-basics" element={<GenAiBasics />} />
            <Route path="/prompt-engineering" element={<PromptEngineering />} />
            <Route path="/fm-evaluation" element={<FmEvaluation />} />
            <Route path="/responsible-ai" element={<ResponsibleAi />} />
            <Route path="/security-governance" element={<SecurityGovernance />} />
            <Route path="/clf-c02" element={<ClfC02 />} />
            <Route path="/saa-c03" element={<SaaC03 />} />
            <Route path="/dva-c02" element={<DvaC02 />} />
            <Route path="/soa-c02" element={<SoaC02 />} />
            <Route path="/dea-c01" element={<DeaC01 />} />
            <Route path="/mla-c01" element={<MlaC01 />} />
            <Route path="/sap-c02" element={<SapC02 />} />
            <Route path="/dop-c02" element={<DopC02 />} />
            <Route path="/scs-c02" element={<ScsC02 />} />
            <Route path="/ans-c01" element={<AnsC01 />} />
            <Route path="/stamp" element={<StampBreaking />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PublicLayout>
      </ProgressProvider>
    </ThemeProvider>
  )
}

export default App
