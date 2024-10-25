import "./../styles/footer.css";

const Footer = () => {
  return (
    <>
    <footer>
      <div className="social-links">
        <a href="https://facebook.com/yourcompany" target="_blank" rel="noopener noreferrer">
          <em className="fab fa-facebook-f"></em>
        </a>
        <a href="https://twitter.com/yourcompany" target="_blank" rel="noopener noreferrer">
          <em className="fab fa-twitter"></em>
        </a>
        <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer">
          <em className="fab fa-linkedin-in"></em>
        </a>
      </div>
      <p> &copy; 2024 LocalGoods. All Rights Reserved.</p>
    </footer>
    </>
  );
};

export default Footer;

