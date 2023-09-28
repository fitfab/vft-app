export interface ContactProps {
  name?: string;
  email?: string;
  phone?: string;
}

export function Contact(props: ContactProps) {
  const {
    name = "Andrew Pollino",
    email = "pollino146@gmail.com",
    phone = "203-957-2779",
  } = props;
  return (
    <div className="card transition">
      <h2>{name}</h2>
      {email && <p>{email}</p>}
      {phone && (
        <a className="button transition" href={phone}>
          {phone}
        </a>
      )}
    </div>
  );
}
