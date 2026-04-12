export default function Login() {
  return (
    <section className="community-page">
      <div className="container">
        <div className="login-box">
          <h1>로그인</h1>
          <p>로그인 기능이 곧 추가될 예정입니다.</p>
          <div className="login-placeholder-form">
            <div className="login-field">
              <label>이메일</label>
              <input type="email" placeholder="example@email.com" disabled />
            </div>
            <div className="login-field">
              <label>비밀번호</label>
              <input type="password" placeholder="••••••••" disabled />
            </div>
            <button className="login-submit" disabled>로그인</button>
          </div>
        </div>
      </div>
    </section>
  )
}
