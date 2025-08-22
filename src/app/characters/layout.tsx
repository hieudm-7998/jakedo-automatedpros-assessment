export const metadata = {
  title: {
    default: 'Characters',
    template: '%s • Characters • Rick and Morty Database',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
