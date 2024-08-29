interface SectionProps {
  children: React.ReactNode;
}

export default function Section({children}: SectionProps) {
  return (
      <section className="pt-5 mt-16 bg-white">
        {children}
      </section>
  )
}