"use client"

import { SignIn } from "@clerk/nextjs"

export default function ClerkSignInWrapper() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 shadow-sm transition-all rounded-xl",
          formFieldInput: "rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm",
          card: "shadow-sm bg-white rounded-3xl p-6",
          formFieldLabel: "text-gray-600 font-medium",
          footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
          formResendCodeLink: "text-blue-600 hover:text-blue-700 font-medium",
          identityPreviewEditButton: "text-blue-600 hover:text-blue-700 font-medium",
          formFieldAction: "text-blue-600 hover:text-blue-700 mt-2 font-medium",
          alternativeMethodsBlockButton: "text-sm text-blue-600 hover:text-blue-700 font-medium",
          footerAction: "flex items-center justify-center mt-8",
          identityPreviewText: "text-gray-700",
          headerTitle: "text-2xl font-semibold text-gray-900 mb-1",
          headerSubtitle: "text-base text-gray-500",
          socialButtonsBlockButton: "border border-gray-200 shadow-sm hover:bg-gray-50/80 transition-colors rounded-xl",
          socialButtonsBlockButtonText: "text-gray-700 font-medium",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500 bg-white px-3",
          formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
        },
        variables: {
          spacingUnit: "1rem",
        },
        layout: {
          socialButtonsPlacement: "bottom"
        }
      }}
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    />
  )
}
