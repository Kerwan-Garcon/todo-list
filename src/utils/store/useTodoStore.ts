import { TodoStore } from "@/types/todo";
import { create } from "zustand";

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (todoText) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: state.todos.length + 1, text: todoText, completed: false },
      ],
    })),
  removeTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId),
    })),
  toggleTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  updateTodoText: (todoId, newText) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, text: newText } : todo
      ),
    })),
}));

export default useTodoStore;
