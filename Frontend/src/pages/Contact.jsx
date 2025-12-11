export default function Contact(){
return (
<section className="page contact-page">
  <h2 className="contact-title">Contact Us</h2>
  <div className="contact-row">
    <div className="contact-card">
      <h3>Get in touch</h3>
      <div className="contact-meta">
        <span>Email: devendra8jaiswal@gmail.com</span>
        <span>Phone: +91 (6266925739) </span>
        <span>Hours: 10:00 — 23:00</span>
      </div>
    </div>
    <div className="contact-card">
      <h3>Send a message</h3>
      <form className="contact-form" onSubmit={(e)=>{ e.preventDefault(); alert('Message sent (demo)'); }}>
        <input placeholder="Your name" required />
        <input placeholder="Email" type="email" required />
        <textarea placeholder="Message" rows={5} required />
        <button type="submit" className="primary">Send</button>
      </form>
    </div>
  </div>
</section>
);
}