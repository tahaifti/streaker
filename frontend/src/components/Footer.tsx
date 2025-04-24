import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Coffee, Mail } from 'lucide-react';

const Footer = () => {
    const [showQR, setShowQR] = useState(false);
    return (
        <footer className="bg-slate-200 border-t mx-4 mb-4 mt-8 rounded-lg shadow-sm">
            <div className="container mx-auto px-4 py-8">
                {/* Main content grid - responsive columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                        <p className="text-gray-600 text-sm md:text-base max-w-xs mx-auto">
                            Hi, I'm Dexter Ifti! I'm passionate about building tools that help people improve their lives through better habits and consistent practice.
                        </p>
                    </div>

                    {/* Connect Section */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                        <div className="flex justify-center gap-6">
                            <a
                                href="https://github.com/dexter-ifti"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Github className="h-5 w-5 md:h-6 md:w-6" />
                            </a>
                            <a
                                href="https://twitter.com/DexterIfti"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Twitter className="h-5 w-5 md:h-6 md:w-6" />
                            </a>
                            <a
                                href="https://linkedin.com/in/ifti-taha"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Linkedin className="h-5 w-5 md:h-6 md:w-6" />
                            </a>
                            <a
                                href="mailto:tahaiftikhar8@gmail.com"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Mail className="h-5 w-5 md:h-6 md:w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Support My Work</h3>
                        <p className="text-gray-600 text-sm md:text-base mb-4 max-w-xs mx-auto">
                            If you find Streak Tracker helpful, consider supporting its development!
                        </p>
                        <div className="flex justify-center items-center">
                            <div className="group relative">
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
                                >
                                    Support Me
                                </button>
                                <p className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs md:text-sm px-2 py-1 rounded-lg whitespace-nowrap">
                                    Click Here to get UPI QR Code
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Modal */}
                {showQR && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xs w-full">
                            <img
                                src="/images/upi-qr.jpg"
                                alt="Scan to Pay via UPI"
                                className="w-full rounded-lg"
                            />
                            <button
                                onClick={() => setShowQR(false)}
                                className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Credits */}
                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-gray-500 text-sm md:text-base">
                        Created with ❤️ by{' '}
                        <a
                            href="https://github.com/dexter-ifti"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                        >
                            dexter_ifti
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
