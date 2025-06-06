import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { StatusBar } from 'expo-status-bar';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false
});
const publishabKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishabKey) {
    throw new Error("Missing publishable key!");
}

export default function ClerkAndConvexProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishabKey}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <ClerkLoaded>
                    {children}
                </ClerkLoaded>
                <StatusBar style="light" />
            </ConvexProviderWithClerk>

        </ClerkProvider>
    );
}