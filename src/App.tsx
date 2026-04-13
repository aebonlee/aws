import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProgressProvider } from './contexts/ProgressContext'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'

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
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Notices = lazy(() => import('./pages/community/Notices'))
const Board = lazy(() => import('./pages/community/Board'))
const SuccessStories = lazy(() => import('./pages/community/SuccessStories'))
const Tips = lazy(() => import('./pages/community/Tips'))
const Login = lazy(() => import('./pages/Login'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <ProgressProvider>
      <PublicLayout>
        <Suspense fallback={<div className="loading-spinner">로딩 중...</div>}>
          <Routes>
            {/* Public - AIF-C01 core content */}
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
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected - requires login */}
            <Route path="/clf-c02" element={<ProtectedRoute><ClfC02 /></ProtectedRoute>} />
            <Route path="/saa-c03" element={<ProtectedRoute><SaaC03 /></ProtectedRoute>} />
            <Route path="/dva-c02" element={<ProtectedRoute><DvaC02 /></ProtectedRoute>} />
            <Route path="/soa-c02" element={<ProtectedRoute><SoaC02 /></ProtectedRoute>} />
            <Route path="/dea-c01" element={<ProtectedRoute><DeaC01 /></ProtectedRoute>} />
            <Route path="/mla-c01" element={<ProtectedRoute><MlaC01 /></ProtectedRoute>} />
            <Route path="/sap-c02" element={<ProtectedRoute><SapC02 /></ProtectedRoute>} />
            <Route path="/dop-c02" element={<ProtectedRoute><DopC02 /></ProtectedRoute>} />
            <Route path="/scs-c02" element={<ProtectedRoute><ScsC02 /></ProtectedRoute>} />
            <Route path="/ans-c01" element={<ProtectedRoute><AnsC01 /></ProtectedRoute>} />
            <Route path="/stamp" element={<ProtectedRoute><StampBreaking /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/community/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
            <Route path="/community/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route path="/community/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
            <Route path="/community/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PublicLayout>
      </ProgressProvider>
    </ThemeProvider>
    </AuthProvider>
  )
}

export default App
