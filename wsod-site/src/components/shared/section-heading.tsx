type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <span className="section-heading-eyebrow">{eyebrow}</span> : null}
      <h2 className="section-heading-title">{title}</h2>
      {description ? <p className="section-heading-description">{description}</p> : null}
    </div>
  );
}
