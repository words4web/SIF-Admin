"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/auth/auth.hook";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin({
    onSuccess: () => {
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-10 rounded-2xl border border-border bg-card p-10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-4xl font-extrabold tracking-tight text-foreground">
            Shelly Indian Foods
          </h2>
          <span className="mt-2 text-sm font-semibold tracking-wider text-primary uppercase">
            Management Portal
          </span>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-foreground">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@shellyfoods.it"
                className="h-14 w-full rounded-xl border border-input bg-background px-4 text-base font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.email?.message && (
                <p
                  className="text-xs font-semibold text-destructive mt-0.5"
                  role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-xl border border-input bg-background pl-4 pr-12 text-base font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[50%] -translate-y-[50%] text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password?.message && (
                <p
                  className="text-xs font-semibold text-destructive mt-0.5"
                  role="alert">
                  {errors.password?.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-4 text-base font-bold rounded-xl cursor-pointer"
            disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
