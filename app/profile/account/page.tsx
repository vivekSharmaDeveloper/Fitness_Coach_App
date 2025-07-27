"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Camera, Trash2, Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

export default function MyAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [lastLogin, setLastLogin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    fetchUserProfile();
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to load profile");
      const profile = await response.json();
      setName(profile.name);
      setLastLogin(new Date(profile.lastLogin).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }));
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile. Please try again later.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirmation) return;

    // Add password verification and account deletion logic here
    alert("Account deletion is not implemented.");
  };

  const handleProfileUpdate = async () => {
    // Add profile update logic here
    alert("Profile update is not implemented.");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">My Account</h1>
      <div className="mt-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter full name"
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1"
            onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Login</label>
          <p className="mt-1 text-sm">{lastLogin}</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleProfileUpdate}>Update Profile</Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

