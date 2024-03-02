# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# How to Re-create the Todo List

To re-create the todo list project from scratch, follow these steps:

## Nextjs starter & Shadcn/ui

Create a [Nextjs](https://nextjs.org/docs) projet by running this command :

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
```

Then run this command to init [Shadcn](https://ui.shadcn.com/docs/installation/next) on your projet :

```bash
npx shadcn-ui@latest init
```

You will be asked a few questions, answer them and you are ready to go.

## Setting Up TypeScript Types

First, let's set up TypeScript types to define the structure of our todo items and the todo store. We'll use interfaces to define these types for better type safety and code readability.

Create a file named `todo.ts` in the `types/` directory of your project and define the following TypeScript interfaces:

```typescript
// types/todo.ts
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoStore {
  todos: Todo[];
  addTodo: (todoText: string) => void;
  removeTodo: (todoId: number) => void;
  toggleTodo: (todoId: number) => void;
  updateTodoText: (todoId: number, newText: string) => void;
}
```

## Using Zustand for State Management

Zustand is a simple and flexible state management library for React applications. We will use Zustand to manage the state of our todo list.

Install Zustand by running the following command:

```bash
npm install zustand
```

Now, let's create a custom hook to manage our todo list state. Create a file named `useTodoStore.ts` in the `utils/store/` directory of your project and add the following code:

```typescript
// utils/store/useTodoStore.ts

import create from "zustand";
import { Todo, TodoStore } from "../types/todo";

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
```

## Using Zod for Data Validation

Zod is a TypeScript-first schema declaration and validation library. We'll use Zod to validate the data before adding it to our todo list.

Install Zod by running the following command:

```bash
npm install zod
```

Now, let's create a validation schema for our todo items. Create a file named `todoFormSchema.ts` in the `utils/schema` directory of your project and add the following code:

```typescript
// utils/schema/todoFormSchema.ts
import { z } from "zod";

export const todoSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  completed: z.boolean(),
});
```

This schema defines the validation rules for a todo item. We specify that the id must be a number, the text must be a non-empty string, and the completed must be a boolean value.

Now that we have set up Zod for data validation, let's move on to integrating it with our todo list functionality.

## Using React-Hook-Form for Form handling

[React Hook Form](https://react-hook-form.com/) is a performant and flexible library for building forms in React applications. We'll use React Hook Form to handle form submission and validation in our todo list project.

Install React Hook Form and its Zod resolver by running the following command :

```bash
npm install react-hook-form @hookform/resolvers
```

We will use Shadcn/ui form, input and button component so don't forget to run this command :

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

Now, let's create a form component named `AddTodosForm.tsx` in your project and add the following code:

```typescript
// src/components/todos/AddTodosForm.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { formSchema } from "@/utils/schema/todoFormSchema";
import { Button } from "@/components/ui/button";
import useTodoStore from "@/utils/store/useTodoStore";

export const AddTodosForm = () => {
  const addTodo = useTodoStore((state) => state.addTodo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTodo(values.text);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="sm" type="submit">
          Add
        </Button>
      </form>
    </Form>
  );
};
```

This component uses React Hook Form to manage the form state, handle form submission, and perform validation using Zod schemas. It also integrates with your addTodo function to add new todos to your todo list.

## Displaying Todos with TodoList Component

The `TodoList` component is responsible for displaying the list of todos in our application. It renders each todo item along with options to toggle its status and delete it.

We will use Shadcn/ui tooltip and checkbox component so don't forget to run this command :

```bash
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add checkbox
```

Create a file named `TodoList.tsx` in your project and add the following code:

```tsx
// components/todos/TodoList.tsx
import { Todo } from "@/types/todo";
import useTodoStore from "@/utils/store/useTodoStore";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

function TodoList() {
  const todos: Todo[] = useTodoStore((state) => state.todos as Todo[]);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  return (
    <div className="mt-8">
      {todos.map((todo) => (
        <div
          className={`flex mb-2 justify-between ${
            !todo.completed ? "bg-indigo-300" : "bg-green-300"
          } p-4 rounded-lg`}
          key={todo.id}
        >
          <div>
            <p
              className={`text-slate-700 font-bold  ${
                !todo.completed ? "" : " italic line-through"
              }`}
            >
              {todo.text}
            </p>
          </div>

          <div className="flex space-x-1">
            <div className="my-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Checkbox
                      checked={todo.completed}
                      onClick={() => toggleTodo(todo.id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Task Status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="my-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash2
                      size={16}
                      className="cursor-pointer"
                      onClick={() => removeTodo(todo.id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;
```

This component iterates over the todos array fetched from the todo store and renders each todo item with its text. It also provides options to toggle the completion status of each todo item and delete it.

Now that we have created the TodoList & AddTodosForm component, let's integrate it with our application to display the todos.

## Displaying Todos Page with Todos Component

The `Todos` component represents the main page of our todo list application. It consists of two main sections: adding a new todo and displaying the list of todos.

We will use Shadcn/ui card component so don't forget to run this command :

```bash
npx shadcn-ui@latest add card
```

Create a file named `Todos.tsx` in your project and add the following code:

```tsx
// components/todos/Todos.tsx
import React from "react";
import { AddTodosForm } from "@/components/todos/AddTodosForm";
import TodoList from "@/components/todos/TodoList";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

function Todos() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Todo</CardTitle>
          <CardDescription>Type and save your task</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTodosForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <TodoList />
        </CardContent>
      </Card>
    </div>
  );
}

export default Todos;
```

This component represents the main page of our todo list application. It consists of two cards: one for adding a new todo and another for displaying the list of todos.

Now that we have created the Todos component, let's integrate it with our application to display the main page.

## Display Todos Functionality

Once our Todos components is created, we can simply use it in the `page.tsx` file.

```typescript
// src/app/page.tsx
import Todos from "@/components/todos/Todos";

export default function Home() {
  return (
    <main className="mx-auto w-1/3 py-8">
      <Todos />
    </main>
  );
}
```

Now , you can see it at [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
