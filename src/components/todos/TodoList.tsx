"use client";

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
              className={`text-slate-600 font-bold  ${
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
