"use client";
export function getCsrfTokenClient(): string {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "";
}
