function Footer() {
  return (
    <footer className="bg-secondary text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-2">
          Contact Us:{" "}
          <a
            href="mailto:support@blogapp.com"
            className="text-white text-decoration-underline"
            style={{ textUnderlineOffset: '4px' }}
          >
            support@blogapp.com
          </a>{" "}
          | Phone: +1-800-123-4567
        </p>
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Blog App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
