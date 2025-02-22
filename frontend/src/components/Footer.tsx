import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Coffee, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    const [showQR, setShowQR] = useState(false);
    return (
        <footer className="bg-slate-200 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
                        <p className="text-gray-600">
                            Hi, I'm Dexter Ifti! I'm passionate about building tools that help people improve their lives through better habits and consistent practice.
                        </p>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/dexter-ifti"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Github className="h-6 w-6" />
                            </a>
                            <a
                                href="https://twitter.com/dexter_ifti"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a
                                href="https://linkedin.com/in/ifti-taha"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a
                                href="mailto:tahaiftikhar8@gmail.com"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Mail className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support My Work</h3>
                        <p className="text-gray-600 mb-4">
                            If you find Streak Tracker helpful, consider supporting its development!
                        </p>
                        {/* <a
                            href="https://buymeacoffee.com/dexter_ifti"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-gray-900 rounded-lg hover:bg-[#FFDD00]/90 transition-colors"
                        >
                            <Coffee className="h-5 w-5" />
                            <span>Buy me a coffee</span>
                        </a> */}
                        <div className="flex justify-center items-center gap-4">
                            <div className="group relative">
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    Support Me
                                </button>
                                {/* Tooltip */}
                                <p className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded-lg">
                                    Click Here to get UPI QR Code
                                </p>
                            </div>
                        </div>
                        {showQR && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <img
                                        src="../../public/assests/upi-qr.jpg" // Path to your QR code image
                                        alt="Scan to Pay via UPI"
                                        className="w-64 rounded-lg"
                                    />
                                    <button
                                        onClick={() => setShowQR(false)}
                                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center">
                    <p className="text-gray-500">
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