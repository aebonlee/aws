import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProgressProvider } from './contexts/ProgressContext'
import PublicLayout from './layouts/PublicLayout'

const Home = lazy(() => import('./pages/Home'))
const AiMlBasics = lazy(() => import('./pages/AiMlBasics'))
const MlDevelopment = lazy(() => import('./pages/MlDevelopment'))
const SageMaker = lazy(() => import('./pages/SageMaker'))
const GenAiBasics = lazy(() => import('./pages/GenAiBasics'))
const PromptEngineering = lazy(() => import('./pages/PromptEngineering'))
const FmEvaluation = lazy(() => import('./pages/FmEvaluation'))
const ResponsibleAi = lazy(() => import('./pages/ResponsibleAi'))
const SecurityGovernance = lazy(() => import('./pages/SecurityGovernance'))
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
            <Route path="/ai-ml-basics" element={<AiMlBasics />} />
            <Route path="/ml-development" element={<MlDevelopment />} />
            <Route path="/sagemaker" element={<SageMaker />} />
            <Route path="/gen-ai-basics" element={<GenAiBasics />} />
            <Route path="/prompt-engineering" element={<PromptEngineering />} />
            <Route path="/fm-evaluation" element={<FmEvaluation />} />
            <Route path="/responsible-ai" element={<ResponsibleAi />} />
            <Route path="/security-governance" element={<SecurityGovernance />} />
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
