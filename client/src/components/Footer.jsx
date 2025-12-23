import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';

/**
 * VEIKI Footer Component
 * Implements complete VEIKI design specifications with Rubik font
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        about: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'FAQs', href: '/faq' },
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
        responsible: [
            { label: 'Responsible Gaming', href: '/responsible-gaming' },
            { label: 'Age Verification', href: '/age-verification' },
            { label: 'Self-Exclusion', href: '/self-exclusion' },
            { label: 'Complaint Resolution', href: '/complaints' },
        ],
    };

    const socialLinks = [
        { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com' },
        { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com' },
        { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
        { icon: FaTelegram, label: 'Telegram', href: 'https://telegram.org' },
        { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://whatsapp.com' },
    ];

    const paymentMethods = ['Bkash', 'Nagad', 'Rocket', 'Bank Transfer'];

    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Top Section - Links */}
                <div className="footer-grid">
                    {/* About Column */}
                    <div className="footer-column">
                        <h3 className="footer-title">About VEIKI</h3>
                        <ul className="footer-list">
                            {footerLinks.about.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="footer-link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div className="footer-column">
                        <h3 className="footer-title">Support</h3>
                        <ul className="footer-list">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="footer-link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Responsible Gaming Column */}
                    <div className="footer-column">
                        <h3 className="footer-title">Responsible Gaming</h3>
                        <ul className="footer-list">
                            {footerLinks.responsible.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="footer-link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Methods Column */}
                    <div className="footer-column">
                        <h3 className="footer-title">Payment Methods</h3>
                        <div className="payment-methods">
                            {paymentMethods.map((method) => (
                                <span key={method} className="payment-badge">
                                    {method}
                                </span>
                            ))}
                        </div>
                        <div className="footer-18plus">
                            <span className="age-badge">18+</span>
                            <p className="age-text">Gamble Responsibly</p>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Social Media */}
                <div className="footer-social-section">
                    <h3 className="footer-title">Follow Us</h3>
                    <div className="social-icons">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="social-icon"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Icon />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © {currentYear} VEIKI Betting Platform. All rights reserved.
                    </p>
                    <p className="disclaimer">
                        Gambling can be addictive. Please play responsibly. If you or someone you know has a gambling problem,
                        seek help at <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">BeGambleAware.org</a>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .footer-container {
                    background-color: var(--color-background-deep);
                    border-top: 1px solid var(--color-border-dark);
                    padding: calc(var(--spacing-unit) * 4) var(--spacing-lg);
                    margin-top: auto;
                }

                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--spacing-xl);
                    margin-bottom: var(--spacing-xl);
                }

                .footer-column {
                    min-width: 0;
                }

                .footer-title {
                    font-family: var(--font-family-rubik);
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-title-sm);
                    color: var(--color-text-light);
                    margin-bottom: var(--spacing-md);
                }

                .footer-list {
                    list-style: none;
                    padding: 0;
                }

                .footer-list li {
                    margin-bottom: var(--spacing-sm);
                }

                .footer-link {
                    font-family: var(--font-family-rubik);
                    font-weight: var(--font-weight-normal);
                    font-size: var(--font-size-body);
                    color: var(--color-text-subtle);
                    text-decoration: none;
                    transition: color var(--transition-speed-normal);
                    display: inline-block;
                }

                .footer-link:hover {
                    color: var(--color-secondary);
                }

                .payment-methods {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-md);
                }

                .payment-badge {
                    background: var(--color-background-surface);
                    color: var(--color-text-light);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--radius-sm);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-medium);
                }

                .footer-18plus {
                    margin-top: var(--spacing-md);
                }

                .age-badge {
                    display: inline-block;
                    background: var(--color-error);
                    color: var(--color-text-light);
                    padding: var(--spacing-xs) var(--spacing-md);
                    border-radius: var(--radius-md);
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-title-sm);
                    margin-bottom: var(--spacing-xs);
                }

                .age-text {
                    font-size: var(--font-size-sm);
                    color: var(--color-text-subtle);
                    margin-top: var(--spacing-xs);
                }

                .footer-social-section {
                    border-top: 1px solid var(--color-border-dark);
                    padding-top: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                    text-align: center;
                }

                .social-icons {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-md);
                }

                .social-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-background-surface);
                    border: 1px solid var(--color-border-dark);
                    border-radius: var(--radius-full);
                    color: var(--color-text-light);
                    font-size: 20px;
                    transition: all var(--transition-speed-normal);
                }

                .social-icon:hover {
                    transform: scale(1.1);
                    color: var(--color-secondary);
                    border-color: var(--color-secondary);
                }

                .footer-bottom {
                    border-top: 1px solid var(--color-border-dark);
                    padding-top: var(--spacing-lg);
                    text-align: center;
                }

                .copyright {
                    font-size: var(--font-size-sm);
                    color: var(--color-text-subtle);
                    margin-bottom: var(--spacing-sm);
                }

                .disclaimer {
                    font-size: var(--font-size-xs);
                    color: var(--color-text-disabled);
                    max-width: 800px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .disclaimer a {
                    color: var(--color-primary);
                    text-decoration: underline;
                }

                .disclaimer a:hover {
                    color: var(--color-primary-hover);
                }

                /* Responsive */
                @media (max-width: 767px) {
                    .footer-container {
                        padding: var(--spacing-lg) var(--spacing-md);
                    }

                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: var(--spacing-lg);
                    }

                    .social-icons {
                        gap: var(--spacing-sm);
                    }

                    .social-icon {
                        width: 36px;
                        height: 36px;
                        font-size: 18px;
                    }
                }
            `}</style>
        </footer>
    );
}
