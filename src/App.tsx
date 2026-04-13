import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { CouponProvider } from './contexts/CouponContext'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import FreeTrialGuard from './components/FreeTrialGuard'

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
const AifC01 = lazy(() => import('./pages/AifC01'))
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
const Library = lazy(() => import('./pages/Library'))
const AdminCoupons = lazy(() => import('./pages/AdminCoupons'))
const Notices = lazy(() => import('./pages/community/Notices'))
const NoticeDetail = lazy(() => import('./pages/community/NoticeDetail'))
const Board = lazy(() => import('./pages/community/Board'))
const BoardDetail = lazy(() => import('./pages/community/BoardDetail'))
const SuccessStories = lazy(() => import('./pages/community/SuccessStories'))
const SuccessStoryDetail = lazy(() => import('./pages/community/SuccessStoryDetail'))
const Tips = lazy(() => import('./pages/community/Tips'))
const TipDetail = lazy(() => import('./pages/community/TipDetail'))
const Inquiry = lazy(() => import('./pages/community/Inquiry'))
const InquiryDetail = lazy(() => import('./pages/community/InquiryDetail'))
const Login = lazy(() => import('./pages/Login'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <AuthProvider>
    <CouponProvider>
    <ThemeProvider>
    <LanguageProvider>
      <ProgressProvider>
      <PublicLayout>
        <Suspense fallback={<div className="loading-spinner">로딩 중...</div>}>
          <Routes>
            {/* Public - always accessible */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Free trial - login + 5 page limit */}
            <Route path="/ai-ml-basics" element={<FreeTrialGuard><AiMlBasics /></FreeTrialGuard>} />
            <Route path="/ml-development" element={<FreeTrialGuard><MlDevelopment /></FreeTrialGuard>} />
            <Route path="/sagemaker" element={<FreeTrialGuard><SageMaker /></FreeTrialGuard>} />
            <Route path="/gen-ai-basics" element={<FreeTrialGuard><GenAiBasics /></FreeTrialGuard>} />
            <Route path="/prompt-engineering" element={<FreeTrialGuard><PromptEngineering /></FreeTrialGuard>} />
            <Route path="/fm-evaluation" element={<FreeTrialGuard><FmEvaluation /></FreeTrialGuard>} />
            <Route path="/responsible-ai" element={<FreeTrialGuard><ResponsibleAi /></FreeTrialGuard>} />
            <Route path="/security-governance" element={<FreeTrialGuard><SecurityGovernance /></FreeTrialGuard>} />
            <Route path="/aif-c01" element={<FreeTrialGuard><AifC01 /></FreeTrialGuard>} />
            <Route path="/clf-c02" element={<FreeTrialGuard><ClfC02 /></FreeTrialGuard>} />
            <Route path="/saa-c03" element={<FreeTrialGuard><SaaC03 /></FreeTrialGuard>} />
            <Route path="/dva-c02" element={<FreeTrialGuard><DvaC02 /></FreeTrialGuard>} />
            <Route path="/soa-c02" element={<FreeTrialGuard><SoaC02 /></FreeTrialGuard>} />
            <Route path="/dea-c01" element={<FreeTrialGuard><DeaC01 /></FreeTrialGuard>} />
            <Route path="/mla-c01" element={<FreeTrialGuard><MlaC01 /></FreeTrialGuard>} />
            <Route path="/sap-c02" element={<FreeTrialGuard><SapC02 /></FreeTrialGuard>} />
            <Route path="/dop-c02" element={<FreeTrialGuard><DopC02 /></FreeTrialGuard>} />
            <Route path="/scs-c02" element={<FreeTrialGuard><ScsC02 /></FreeTrialGuard>} />
            <Route path="/ans-c01" element={<FreeTrialGuard><AnsC01 /></FreeTrialGuard>} />
            <Route path="/stamp" element={<FreeTrialGuard><StampBreaking /></FreeTrialGuard>} />
            <Route path="/practice" element={<FreeTrialGuard><Practice /></FreeTrialGuard>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/coupons" element={<ProtectedRoute><AdminCoupons /></ProtectedRoute>} />
            <Route path="/community/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
            <Route path="/community/notices/:id" element={<ProtectedRoute><NoticeDetail /></ProtectedRoute>} />
            <Route path="/community/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route path="/community/board/:id" element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />
            <Route path="/community/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
            <Route path="/community/success-stories/:id" element={<ProtectedRoute><SuccessStoryDetail /></ProtectedRoute>} />
            <Route path="/community/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} />
            <Route path="/community/tips/:id" element={<ProtectedRoute><TipDetail /></ProtectedRoute>} />
            <Route path="/community/inquiry" element={<ProtectedRoute><Inquiry /></ProtectedRoute>} />
            <Route path="/community/inquiry/:id" element={<ProtectedRoute><InquiryDetail /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PublicLayout>
      </ProgressProvider>
    </LanguageProvider>
    </ThemeProvider>
    </CouponProvider>
    </AuthProvider>
  )
}

export default App
