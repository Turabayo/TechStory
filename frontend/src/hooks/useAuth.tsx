// frontend/src/hooks/useAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const useAuth = () => {
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

        // ✅ Admin redirect
        if (userData.role === "admin" && pathname !== "/admin") {
          console.warn("👑 Admin detected. Redirecting to /admin");
          router.push("/admin");
          return;
        }

        // ✅ Standard user, not onboarded
        if (userData.role === "user" && !userData.onboarded && pathname !== "/user/onboard") {
          console.warn("⏳ User not onboarded. Redirecting to /user/onboard");
          router.push("/user/onboard");
          return;
        }

        // ✅ Standard user already onboarded but accidentally on onboard page
        if (userData.role === "user" && userData.onboarded && pathname === "/user/onboard") {
          console.warn("✅ User already onboarded. Redirecting to /user");
          router.push("/user");
          return;
        }

      } catch (err) {
        console.error("❌ Auth failed:", err);
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

export default useAuth;
