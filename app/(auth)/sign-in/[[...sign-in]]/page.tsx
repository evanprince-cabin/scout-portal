import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cabin-linen">
      {/* Left column */}
      <div className="flex flex-col items-center justify-center px-8 py-12 lg:px-16">
        <Image
          src="/cabin-symbol-maroon.png"
          width={40}
          height={40}
          alt="Cabin"
          className="mb-8"
        />
        <h1 className="font-geist font-bold text-2xl text-cabin-charcoal text-center mb-6">
          Welcome to the Cabin Scout Portal!
        </h1>
        <SignIn
          appearance={{
            variables: {
              colorBackground: 'transparent',
              colorInputBackground: '#ffffff',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            elements: {
              card: 'shadow-none bg-cabin-linen border border-cabin-stone/15 rounded-xl',
              cardFooter: 'bg-cabin-linen rounded-b-xl',
              footer: 'bg-cabin-linen',
              footerAction: 'bg-cabin-linen',
              rootBox: 'w-full flex flex-col items-center',
              formButtonPrimary: 'bg-cabin-charcoal hover:bg-cabin-maroon transition-colors',
              socialButtonsBlockButton: 'border border-cabin-stone/30 hover:border-cabin-stone/60',
              footerActionLink: 'text-cabin-maroon hover:text-cabin-charcoal',
              dividerLine: 'bg-cabin-stone/20',
              dividerText: 'text-cabin-stone text-xs',
            },
          }}
        />
      </div>

      {/* Right column — full-height image panel, visible lg+ only */}
      <div className="hidden lg:block relative rounded-l-3xl overflow-hidden">
        <Image
          src="/sign-in-bg.jpg"
          alt="Forest cabin"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-cabin-charcoal/10" />
      </div>
    </div>
  )
}
