import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Our Platform';
    
    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-[10rem] text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
                    
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Introduction and Definitions</h2>
                            <p className="text-gray-300">
                                1.1. Welcome to {appName}. These terms and conditions constitute a legally binding agreement between you ("User," "Client," or "You") and {appName} ("Platform," "We," "Us," or "Our").<br/><br/>
                                1.2. By accessing or using our cryptocurrency trading and investment platform, you explicitly agree to comply with and be bound by these terms.<br/><br/>
                                1.3. The Platform provides cryptocurrency trading, investment, and wallet services through advanced technological solutions and expert trading systems.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Trading and Investment Terms</h2>
                            <p className="text-gray-300">
                                2.1. Profit Verification Fee:<br/>
                                &nbsp;&nbsp;a) A mandatory 10% profit verification fee from total trading profits must be deposited before any withdrawal processing.<br/>
                                &nbsp;&nbsp;b) This applies to all profit sources including manual trading, bot trading, and investment returns.<br/>
                                &nbsp;&nbsp;c) The fee is calculated based on the total profit amount at the time of withdrawal request.<br/><br/>
                                
                                2.2. Fee Refund Process:<br/>
                                &nbsp;&nbsp;a) The profit verification fee is fully refundable upon successful verification.<br/>
                                &nbsp;&nbsp;b) Refund is processed automatically with the withdrawal amount.<br/>
                                &nbsp;&nbsp;c) Processing time: 1-3 business days for standard accounts.<br/><br/>
                                
                                2.3. Trading Requirements:<br/>
                                &nbsp;&nbsp;a) Minimum trading volume requirements may apply.<br/>
                                &nbsp;&nbsp;b) Users must maintain sufficient balance for open positions.<br/>
                                &nbsp;&nbsp;c) Platform reserves the right to close positions if maintenance requirements are not met.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. KYC and Verification Requirements</h2>
                            <p className="text-gray-300">
                                3.1. KYC Level 1 (Basic Verification):<br/>
                                &nbsp;&nbsp;a) Required for all users<br/>
                                &nbsp;&nbsp;b) Includes email verification and basic identity information<br/>
                                &nbsp;&nbsp;c) No fee required<br/>
                                &nbsp;&nbsp;d) Trading limits apply<br/><br/>
                                
                                3.2. KYC Level 2 (Advanced Verification):<br/>
                                &nbsp;&nbsp;a) Required for higher withdrawal limits<br/>
                                &nbsp;&nbsp;b) Verification fee required (refundable)<br/>
                                &nbsp;&nbsp;c) Includes government ID verification<br/>
                                &nbsp;&nbsp;d) Proof of address required<br/>
                                &nbsp;&nbsp;e) Enhanced trading privileges<br/><br/>
                                
                                3.3. Verification Fee Structure:<br/>
                                &nbsp;&nbsp;a) Fee amount displayed in dashboard<br/>
                                &nbsp;&nbsp;b) Varies by region and account type<br/>
                                &nbsp;&nbsp;c) Held in secure escrow<br/>
                                &nbsp;&nbsp;d) Fully refundable upon successful verification
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Automated Trading Systems</h2>
                            <p className="text-gray-300">
                                4.1. Bot Trading Services:<br/>
                                &nbsp;&nbsp;a) Available to verified users<br/>
                                &nbsp;&nbsp;b) Subject to platform risk management policies<br/>
                                &nbsp;&nbsp;c) Performance varies based on market conditions<br/><br/>
                                
                                4.2. Bot Trading Requirements:<br/>
                                &nbsp;&nbsp;a) Minimum balance requirements apply<br/>
                                &nbsp;&nbsp;b) Subject to profit verification fees<br/>
                                &nbsp;&nbsp;c) Regular maintenance windows may affect service
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Withdrawal Process</h2>
                            <p className="text-gray-300">
                                5.1. Withdrawals require completion of all necessary verifications.<br/><br/>
                                5.2. The 10% profit verification fee must be deposited before withdrawal processing begins.<br/><br/>
                                5.3. Users must complete KYC appropriate to their withdrawal tier.<br/><br/>
                                5.4. All fees are refunded along with the withdrawal amount upon successful verification.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Eligibility</h2>
                            <p className="text-gray-300">
                                To use {appName}, you must be at least 18 years old and legally able to enter into contracts.
                                You must comply with all applicable laws and regulations in your jurisdiction regarding cryptocurrency trading and investments.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Account Security</h2>
                            <p className="text-gray-300">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                                {appName} implements industry-standard security measures but cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Cryptocurrency Services</h2>
                            <p className="text-gray-300">
                                Our platform provides cryptocurrency wallet services, trading capabilities, and investment opportunities.
                                All transactions are final and irreversible. Users must verify transaction details before confirmation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Risk Disclosure</h2>
                            <p className="text-gray-300">
                                Cryptocurrency investments involve substantial risk. Market values can be highly volatile.
                                Past performance does not guarantee future results. Users should invest only what they can afford to lose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">10. Fees and Charges</h2>
                            <p className="text-gray-300">
                                {appName} charges fees for certain services. All applicable fees will be clearly displayed before transaction confirmation.
                                We reserve the right to modify our fee structure with appropriate notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">11. Prohibited Activities</h2>
                            <p className="text-gray-300">
                                Users must not engage in illegal activities, market manipulation, or any form of fraudulent behavior.
                                Violations may result in immediate account termination and legal action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">12. Service Modifications</h2>
                            <p className="text-gray-300">
                                {appName} reserves the right to modify, suspend, or discontinue any aspect of our services at any time.
                                We will provide reasonable notice of significant changes when possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">13. Limitation of Liability</h2>
                            <p className="text-gray-300">
                                {appName} is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our services.
                                This includes losses due to market volatility, technical issues, or external factors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
                            <p className="text-gray-300">
                                For questions about these terms, please contact our support team through the appropriate channels provided on our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">15. Dispute Resolution</h2>
                            <p className="text-gray-300">
                                15.1. All disputes shall be resolved through negotiation and mediation before pursuing legal action.<br/><br/>
                                15.2. Users agree to mandatory arbitration for unresolved disputes.<br/><br/>
                                15.3. The platform's decision is final in matters relating to trading and verification processes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">16. Platform Security</h2>
                            <p className="text-gray-300">
                                16.1. Security Measures:<br/>
                                &nbsp;&nbsp;a) Multi-factor authentication required<br/>
                                &nbsp;&nbsp;b) Regular security audits conducted<br/>
                                &nbsp;&nbsp;c) Cold storage for majority of assets<br/><br/>
                                
                                16.2. User Responsibilities:<br/>
                                &nbsp;&nbsp;a) Maintain secure passwords<br/>
                                &nbsp;&nbsp;b) Enable all security features<br/>
                                &nbsp;&nbsp;c) Report suspicious activities immediately
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Cryptocurrency Services</h2>
                            <p className="text-gray-300">
                                Our platform provides cryptocurrency wallet services, trading capabilities, and investment opportunities.
                                All transactions are final and irreversible. Users must verify transaction details before confirmation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Risk Disclosure</h2>
                            <p className="text-gray-300">
                                Cryptocurrency investments involve substantial risk. Market values can be highly volatile.
                                Past performance does not guarantee future results. Users should invest only what they can afford to lose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">10. Fees and Charges</h2>
                            <p className="text-gray-300">
                                {appName} charges fees for certain services. All applicable fees will be clearly displayed before transaction confirmation.
                                We reserve the right to modify our fee structure with appropriate notice.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">11. Prohibited Activities</h2>
                            <p className="text-gray-300">
                                Users must not engage in illegal activities, market manipulation, or any form of fraudulent behavior.
                                Violations may result in immediate account termination and legal action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">12. Service Modifications</h2>
                            <p className="text-gray-300">
                                {appName} reserves the right to modify, suspend, or discontinue any aspect of our services at any time.
                                We will provide reasonable notice of significant changes when possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">13. Limitation of Liability</h2>
                            <p className="text-gray-300">
                                {appName} is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our services.
                                This includes losses due to market volatility, technical issues, or external factors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
                            <p className="text-gray-300">
                                For questions about these terms, please contact our support team through the appropriate channels provided on our platform.
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