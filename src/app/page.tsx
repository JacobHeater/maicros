export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <header className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold">mA</div>
          <h2 className="text-xl font-semibold">mAIcros</h2>
        </div>
        <nav className="space-x-4 text-sm">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#quick-start" className="hover:underline">Quick Start</a>
          <a href="/chat" className="hover:underline">Chat with Newton</a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Analyze meals. Optimize macros. Eat smarter.</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              mAIcros uses AI to estimate macronutrients from meal descriptions and suggests practical swaps,
              additions, or removals so meals match your personal macro targets.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quick-start"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700"
              >
                Try it locally
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-semibold">Example analysis</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">"Grilled chicken breast, 1 cup cooked rice, mixed veggies, 1 tbsp olive oil"</p>
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

        <section id="quick-start" className="mt-12 rounded-lg border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-2xl font-bold">Quick Start</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Run locally with Node.js (LTS):</p>
          <pre className="mt-4 rounded bg-zinc-50 p-4 text-sm dark:bg-zinc-800">
            <code>npm install
npm run dev</code>
          </pre>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Open the app at http://localhost:3000 and enter a meal description to get started.</p>
        </section>
      </main>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 mt-12 py-6">
        <div className="mx-auto max-w-5xl px-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
            <div>© {new Date().getFullYear()} mAIcros — Built with Next.js + Tailwind</div>
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
