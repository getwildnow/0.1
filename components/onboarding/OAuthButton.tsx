"use client";

import { useState } from "react";
import Button from "./Button";

interface OAuthButtonProps {
  provider: string;
  icon?: React.ReactNode;
  onConnect: () => void;
  connected?: boolean;
  required?: boolean;
}

export default function OAuthButton({
  provider,
  icon,
  onConnect,
  connected = false,
  required = false,
}: OAuthButtonProps) {
  return (
    <button
      onClick={onConnect}
      disabled={connected}
      className={`
        w-full p-4 rounded-lg border-2 transition-all duration-200
        ${connected
          ? "border-green-500 bg-green-50 cursor-not-allowed"
          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
        }
        flex items-center justify-between
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-gray-900">{provider}</span>
        {required && <span className="text-red-500 text-xs">Required</span>}
      </div>
      {connected ? (
        <span className="text-green-600 text-sm font-medium">Connected ✓</span>
      ) : (
        <span className="text-blue-600 text-sm font-medium">Connect →</span>
      )}
    </button>
  );
}

