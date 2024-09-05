import { CircleGauge, DollarSign, Globe, Home, Lock, LogIn, User } from "lucide-react";

export const NavLinks = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home
    },
    {
        name: 'Sites',
        href: '/dashboard/sites',
        icon: Globe
    },
    {
        name: 'Pricing',
        href: '/dashboard/pricing',
        icon: DollarSign
    }
]

export const FeaturesItems = [
    {
        name: "Sign up for free",
        description: "Easily create an account and get started without any upfront costs. Experience our platform with a free plan that gives you access to essential features.",
        icon: LogIn
    },
    {
        name: "Blazing Fast",
        description: "Enjoy lightning-fast load times and seamless performance, ensuring your blog operates efficiently even with high traffic.",
        icon: CircleGauge
    },
    {
        name: "Super secure with Kinde",
        description: "Leverage advanced security features powered by Kinde, ensuring that your data and user information are protected with enterprise-grade security measures.",
        icon: Lock
    },
    {
        name: "Easy to use",
        description: "Our intuitive interface and user-friendly design allow you to manage your blog effortlessly, even if you're not tech-savvy.",
        icon: User
    }
]