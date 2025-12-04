import { useEffect, useState } from "react";
import { api } from "../api";

type Todo = {
    id: string;
    title: string;
    done: boolean;
};

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");

    const load = async () => {
        const { data } = await api.get<Todo[]>("/todos");
        setTodos(data);
    };

    const add = async () => {
        if (!title) return;
        await api.post("/todos", { title });
        setTitle("");
        load();
    };

    const toggle = async (id: string) => {
        await api.post(`/todos/${id}/toggle`);
        load();
    };

    useEffect(() => {
        // Defer to avoid synchronous setState within effect
        const t = setTimeout(() => {
            void load();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Todo List</h1>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nova tarefa"
            />
            <button onClick={add}>Adicionar</button>

            <ul>
                {todos.map((t) => (
                    <li
                        key={t.id}
                        onClick={() => toggle(t.id)}
                        style={{ cursor: "pointer" }}
                    >
                        {t.done ? "✔ " : "• "}
                        {t.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
