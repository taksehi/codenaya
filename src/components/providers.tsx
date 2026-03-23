"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import {
	Authenticated,
	AuthLoading,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider } from "./theme-provider";
import { UnauthenticatedView } from "@/features/auth/components/unauthenticated-view";
import { AuthLoadingView } from "@/features/auth/components/auth-loading-view";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Routes that are public and should NOT be gated by auth */
const PUBLIC_ROUTES = ["/home"];

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider
			appearance={{
				theme: shadcn,
			}}>
			<ConvexProviderWithClerk
				client={convex}
				useAuth={useAuth}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<AuthGate>{children}</AuthGate>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
};

/** Inner component so we can use hooks (usePathname) inside ClerkProvider */
function AuthGate({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

	if (isPublic) {
		// Render without auth gating — no Convex queries needed
		return <>{children}</>;
	}

	return (
		<>
			<Authenticated>
				<TooltipProvider>{children}</TooltipProvider>
			</Authenticated>
			<Unauthenticated>
				<UnauthenticatedView />
			</Unauthenticated>
			<AuthLoading>
				<AuthLoadingView />
			</AuthLoading>
		</>
	);
}
