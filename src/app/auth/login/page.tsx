"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authLogin } from "@/features/auth/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email("Invalid Email address").min(1, "Email is required"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => authLogin(data),
    onSuccess: () => {
      toast.success("Registration successful! Redirecting to dashboard...");
      router.push("/dashboard");
      router.refresh();
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. please check your credentials!",
      );
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Wallet className="text-primary size-15" />
      <h1 className="text-primary text-3xl font-bold">Future APP</h1>

      <Card className="w-md mt-2 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Sign in your account here!</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup className="gap-3">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Insert your email"
                      disabled={isPending}
                      required
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="password">password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      disabled={isPending}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full font-semibold cursor-pointer text-md py-5"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex flex-row gap-2">
                  <LoaderCircle className="animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
            <div>
              Do not have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
