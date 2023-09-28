export interface CardProps {
  title: string;
  imgSrc?: string;
  caption?: string;
  ctaCopy?: string;
  ctaUrl?: string;
}

export function Card(props: CardProps) {
  const { title = "card image", imgSrc, caption, ctaCopy, ctaUrl } = props;
  return (
    <div className="card transition">
      {imgSrc && <img src={imgSrc} alt={title} />}
      <h3>{title}</h3>
      {caption && <p>{caption}</p>}
      {ctaCopy && (
        <a className="button transition" href={ctaUrl}>
          {ctaCopy}
        </a>
      )}
    </div>
  );
}
