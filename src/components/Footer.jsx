export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="brand">
            <span className="brand__logo">🎓</span>
            <span className="brand__name">EduPro</span>
          </div>
          <p>Empowering learners worldwide with cutting-edge online education and AI-powered learning experiences.</p>
          <div className="socials">
            <a href="#" aria-label="Facebook"></a>
            <a href="#" aria-label="Twitter"></a>
            <a href="#" aria-label="LinkedIn"></a>
            <a href="#" aria-label="YouTube"></a>
          </div>
        </div>
        <div>
          <div className="footer__title">Platform</div>
          <ul>
            <li><a href="#">Courses</a></li>
            <li><a href="#">For Teachers</a></li>
            <li><a href="#">For Students</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__title">Support</div>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__title">Company</div>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">© 2024 EduPro. All rights reserved. | Powered by Readdy</div>
    </footer>
  );
}
