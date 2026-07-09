import React from 'react';
import { Github } from 'lucide-react';
import LogoText from './LogoText';
import LogoIcon from './LogoIcon';

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-12 mt-auto select-none">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="w-7 h-7 text-primary" />
                        <LogoText className="text-lg" />
                    </div>
                    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                        Simple, secure, and smart financial workspace for modern creators. Master your cashflow, shape your capital.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a 
                            href="https://github.com/shaheed236" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-xl transition-all"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-4">Product</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-4">Company</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                © {new Date().getFullYear()} <LogoText />. All rights reserved.
            </div>
        </footer>
    );
}
