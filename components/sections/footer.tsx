import { Phone, Mail, Globe, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <a href="tel:+919170523331" className="flex items-center gap-2 hover:text-purple-400">
                <Phone className="w-4 h-4" /> +91 9170523331
              </a>
              <a href="mailto:contact@cosmologic.academy" className="flex items-center gap-2 hover:text-purple-400">
                <Mail className="w-4 h-4" /> contact@cosmologic.academy
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="https://edu.jabin.org" className="flex items-center gap-2 hover:text-purple-400">
                <Globe className="w-4 h-4" /> edu.jabin.org
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-400">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-purple-400">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-purple-400">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; 2024 Cosmologic Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}