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
