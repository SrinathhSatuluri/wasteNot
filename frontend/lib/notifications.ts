import { toast } from "sonner";

export const notifications = {
  success: (message: string) => {
    toast.success(message, {
      description: "Action completed successfully",
    });
  },

  error: (message: string) => {
    toast.error(message, {
      description: "Something went wrong. Please try again.",
    });
  },

  info: (message: string) => {
    toast.info(message, {
      description: "Here's some information for you.",
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      description: "Please review the details.",
    });
  },

  // Specific notification types for our app
  donationCreated: () => {
    toast.success("Donation Created!", {
      description: "Your food donation has been posted successfully.",
    });
  },

  donationClaimed: () => {
    toast.success("Donation Claimed!", {
      description: "You have successfully claimed this donation.",
    });
  },

  loginSuccess: (userName: string) => {
    toast.success(`Welcome back, ${userName}!`, {
      description: "You have been successfully logged in.",
    });
  },

  registrationSuccess: () => {
    toast.success("Account Created!", {
      description: "Your account has been created successfully. Please log in.",
    });
  },

  logoutSuccess: () => {
    toast.info("Logged Out", {
      description: "You have been successfully logged out.",
    });
  },
}; 