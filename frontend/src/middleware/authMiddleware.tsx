"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios, { AxiosError } from "axios";

const useAuthMiddleware = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("❌ No token. Redirecting to login...");
          router.push("/auth/signin");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setUser(userData);

        if (userData.role === "admin" && pathname.startsWith("/user")) {
          console.warn("👑 Admin trying to access user dashboard. Redirecting to /admin...");
          router.push("/admin");
          return;
        }

        if (userData.role === "user") {
          if (!userData.onboarded && pathname !== "/user/onboard") {
            console.warn("⏳ Standard user not onboarded. Redirecting to /user/onboard...");
            router.push("/user/onboard");
          } else if (userData.onboarded && pathname === "/user/onboard") {
            console.warn("✅ Already onboarded. Redirecting to /user...");
            router.push("/user");
          }
        }

      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("🚫 Auth failed:", err.response?.data || err.message);
        } else if (err instanceof Error) {
          console.error("🚫 Auth failed:", err.message);
        } else {
          console.error("🚫 Auth failed: Unknown error", err);
        }

        localStorage.removeItem("token");
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router, pathname]);

  return { user, loading };
};

export default useAuthMiddleware;
