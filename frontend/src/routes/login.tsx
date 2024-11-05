import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/login")({
  component: Login,
});

const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, "password must be at least 8 chars")
    .max(20, "password must be at most 20 chars"),
});

export function Login() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginUser = async (values: z.infer<typeof formSchema>) => {
    const response = await api.user["login"].$post({ form: values });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };
  const mutation = useMutation({
    mutationFn: loginUser,
    onError: (Error) => {
      toast(Error.message);
    },
    onSuccess: (data) => {
      toast(data.message);

      navigate({ to: "/" });
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate(data);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-3 m-auto max-w-[30rem]"
        >
          <div className="text-2xl flex justify-center">Login</div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your email" {...field} type="email" />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <div>
            Not Registered?{" "}
            <Link className="hover:text-gray-600" to="/register">
              Register here
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}
