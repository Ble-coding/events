import AuthSimpleRegisterLayout from "./auth/auth-simple-register-layout";

export default function AuthRegisterLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthSimpleRegisterLayout title={title} description={description} {...props}>
            {children}
        </AuthSimpleRegisterLayout>
    );
}
