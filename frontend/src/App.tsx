import { useEffect, useState, type FormEvent } from "react";

type Todo = {
    id: number;
    title: string;
};

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadTodos() {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch("/api/todos");
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const data: Todo[] = await res.json();
            setTodos(data);
        } catch {
            setError("Não foi possível carregar as tarefas. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function addTodo() {

        const trimmed = title.trim();
        if (!trimmed) return;

        try {
            setSubmitting(true);
            setError(null);
            await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: trimmed }),
            });

            setTitle("");
            void loadTodos();
        } catch {
            setError("Não foi possível adicionar a tarefa.");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        // Defer state updates triggered by loadTodos to avoid synchronous setState in effect
        const t = setTimeout(() => {
            void loadTodos();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 px-4 py-10">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur p-6 shadow-xl">
                <header className="text-center mb-4">
                    <h1 className="text-3xl font-semibold tracking-tight">Tarefas</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Rust + React</p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mb-3 rounded-lg border border-red-300/60 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 px-3 py-2"
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={(e: FormEvent) => {
                        e.preventDefault();
                        void addTodo();
                    }}
                    className="grid grid-cols-[1fr_auto] gap-2 mt-2"
                >
                    <input
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/70 disabled:opacity-60"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nova tarefa"
                        aria-label="Nova tarefa"
                        autoFocus
                        disabled={submitting || loading}
                    />
                    <button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={!title.trim() || submitting || loading}
                    >
                        {submitting ? "Adicionando…" : "Adicionar"}
                    </button>
                </form>

                <section className="mt-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                        <span>
                            {loading ? (
                                <span
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
                                    aria-hidden="true"
                                />
                            ) : null}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                            {todos.length} {todos.length === 1 ? "tarefa" : "tarefas"}
                        </span>
                    </div>

                    {loading ? (
                        <ul className="grid gap-2">
                            {[1, 2, 3].map((i) => (
                                <li
                                    key={i}
                                    className="h-11 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse"
                                />
                            ))}
                        </ul>
                    ) : todos.length === 0 ? (
                        <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-xl border-slate-300/70 dark:border-slate-700/70">
                            Nenhuma tarefa ainda. Que tal criar a primeira?
                        </div>
                    ) : (
                        <ul className="grid gap-2">
                            {todos.map((t) => (
                                <li
                                    key={t.id}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-4 py-3"
                                >
                                    {t.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
