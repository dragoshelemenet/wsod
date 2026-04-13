type CategoryHeroProps = {
  title: string;
  description: string;
};

export function CategoryHero({ title, description }: CategoryHeroProps) {
  return (
    <header className="category-hero">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
