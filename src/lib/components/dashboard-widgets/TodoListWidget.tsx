"use client"

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Check, Circle, CheckCircle2 } from "lucide-react";
import { useCurrentColors } from "../../contexts/ThemeColorsContext";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export function TodoListWidget() {
  const colors = useCurrentColors();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("rahgir-todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem("rahgir-todos")) {
      localStorage.setItem("rahgir-todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      setNewTodoText("");
    }
  }, [newTodoText]);

  const handleToggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="h-full flex flex-col">
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="کار جدید اضافه کنید..."
            className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 text-sm transition-colors"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            dir="rtl"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white transition-opacity flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="flex items-center gap-4 mb-4 pb-3 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              فعال: {activeTodos.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.success || '#00c853' }}
            />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              انجام شده: {completedTodos.length}
            </span>
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <CheckCircle2 
              className="w-12 h-12 mb-3 opacity-30"
              style={{ color: colors.textSecondary }}
            />
            <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
              هنوز کاری اضافه نشده
              <br />
              <span className="text-xs">کار جدید خود را اضافه کنید</span>
            </p>
          </div>
        ) : (
          <>
            {/* Active Todos */}
            {activeTodos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                  aria-label="تکمیل کار"
                >
                  <Circle className="w-5 h-5" />
                </button>

                <span
                  className="flex-1 text-sm"
                  style={{ color: colors.textPrimary }}
                  dir="rtl"
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.error || '#e92c2c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                  aria-label="حذف کار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Completed Todos */}
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 p-3 rounded-lg border transition-all opacity-60 hover:opacity-100"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                }}
              >
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: colors.success || '#00c853' }}
                  aria-label="برگرداندن کار"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>

                <span
                  className="flex-1 text-sm line-through"
                  style={{ color: colors.textSecondary }}
                  dir="rtl"
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.error || '#e92c2c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                  aria-label="حذف کار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Clear Completed Button */}
      {completedTodos.length > 0 && (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={() => setTodos(activeTodos)}
            className="w-full px-3 py-2 text-xs rounded-lg border transition-colors"
            style={{
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              e.currentTarget.style.color = colors.error || '#e92c2c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            پاک کردن کارهای انجام شده ({completedTodos.length})
          </button>
        </div>
      )}
    </div>
  );
}
