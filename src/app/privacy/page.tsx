import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Our Platform';

    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-[10rem] text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
                    
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                            <p className="text-gray-300">
                                {appName} collects information necessary to provide our cryptocurrency services, including:
                                personal identification information, transaction data, wallet addresses, and usage information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-300">
                                We use collected information to:
                                - Process your transactions
                                - Maintain your account security
                                - Comply with regulatory requirements
                                - Improve our services
                                - Communicate important updates
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
                            <p className="text-gray-300">
                                We implement robust security measures to protect your information from unauthorized access,
                                including encryption, secure servers, and regular security audits.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                            <p className="text-gray-300">
                                We may share your information with:
                                - Regulatory authorities when required by law
                                - Service providers who assist in our operations
                                - Financial institutions for transaction processing
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                            <p className="text-gray-300">
                                You have the right to:
                                - Access your personal data
                                - Request data correction
                                - Request data deletion
                                - Opt-out of marketing communications
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h2>
                            <p className="text-gray-300">
                                We use cookies and similar technologies to enhance your experience and collect usage data.
                                You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Updates to Privacy Policy</h2>
                            <p className="text-gray-300">
                                We may update this policy periodically. Users will be notified of significant changes.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}