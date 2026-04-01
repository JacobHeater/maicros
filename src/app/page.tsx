export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold">N</div>
          <h2 className="text-xl font-semibold">Newton</h2>
        </div>
        <nav className="space-x-4 text-sm">
          <a href="/chat" className="hover:underline">Chat with Newton</a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-[var(--accent-1)]">Talk to Newton — your AI nutritionist.</h1>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              Describe your meal in natural language and Newton — an AI nutritionist — will estimate macros, suggest improvements, and help you meet your goals.
            </p>

            <div className="mt-6">
              <a
                href="/chat"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-[var(--primary-text)] font-medium hover:bg-[var(--primary-hover)]"
              >
                Chat with Newton
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(15,23,36,0.9)] p-6 shadow-[0_20px_50px_-30px_rgba(0,245,160,0.5)]">
            <h3 className="font-semibold text-[var(--foreground)]">Example analysis</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">"Grilled chicken breast, 1 cup cooked rice, mixed veggies, 1 tbsp olive oil"</p>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <li className="text-center">
                <div className="font-bold">Protein</div>
                <div className="text-indigo-600">32g</div>
              </li>
              <li className="text-center">
                <div className="font-bold">Carbs</div>
                <div className="text-teal-600">45g</div>
              </li>
              <li className="text-center">
                <div className="font-bold">Fat</div>
                <div className="text-amber-500">12g</div>
              </li>
            </ul>
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Suggestions: increase protein by adding Greek yogurt (+15g), swap rice for cauliflower rice (-30g carbs).
            </div>
          </div>
        </section>

        <section id="features" className="mt-12">
          <h2 className="text-2xl font-bold">Features</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Feature title="Macro breakdown" desc="Estimates protein, carbs, fats and calories for each item." />
            <Feature title="Actionable suggestions" desc="Swap, add, or remove items with estimated macro impacts." />
            <Feature title="AI parsing" desc="Understands real-world meal descriptions and ambiguous inputs." />
          </div>
        </section>

        <section id="quick-start" className="mt-12 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(11,17,28,0.55)] p-6">
          <h2 className="text-2xl font-bold">How to use Newton</h2>
          <p className="mt-3 text-[var(--muted-foreground)]">No downloads or installs — just click Chat and describe your meal.</p>
          <ul className="mt-4 list-disc pl-5 text-sm text-[var(--muted-foreground)]">
            <li>Click "Chat with Newton" to open the conversation.</li>
            <li>Type your meal in plain language (e.g., "2 eggs, avocado toast, banana").</li>
            <li>Newton will estimate macros, suggest swaps, and answer follow-ups.</li>
          </ul>
          <div className="mt-6">
            <a href="/chat" className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-[var(--primary-text)] font-medium hover:bg-[var(--primary-hover)]">Start chatting with Newton</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(255,255,255,0.1)] mt-12 py-6">
        <div className="mx-auto max-w-5xl px-6 text-sm text-[var(--muted-foreground)]">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
            <div>© {new Date().getFullYear()} Newton — Built with Next.js + Tailwind</div>
            <div className="space-x-4">
              <a href="/" className="hover:underline">Privacy</a>
              <a href="/" className="hover:underline">License</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-zinc-100 p-4 dark:border-zinc-800">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
