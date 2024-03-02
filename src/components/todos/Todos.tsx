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
