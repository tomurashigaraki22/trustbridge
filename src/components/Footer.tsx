import Link from 'next/link';

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'CryptoApp';

  return (
    <footer className="bg-[#000] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">
              Your trusted cryptocurrency tracking and analysis platform.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/contact" className="text-gray-300 hover:text-white">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/transactions/send" className="text-gray-300 hover:text-white">
                  Send Crypto
                </Link>
              </li>
              <li>
                <Link href="/dashboard/transactions/deposit" className="text-gray-300 hover:text-white">
                  Deposit
                </Link>
              </li>
              <li>
                <Link href="/dashboard/transactions" className="text-gray-300 hover:text-white">
                  Transactions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}