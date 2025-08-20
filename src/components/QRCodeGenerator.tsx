import React from "react";
import { X, QrCode, Smartphone, Copy } from "lucide-react";

interface QRCodeGeneratorProps {
  onClose: () => void;
}

export function QRCodeGenerator({ onClose }: QRCodeGeneratorProps) {
  const studentUrl = `${window.location.origin}${window.location.pathname}?mode=student`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(studentUrl);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    studentUrl
  )}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <QrCode className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Student Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <img
              src={qrCodeUrl}
              alt="QR Code for Student Access"
              className="mx-auto mb-4"
            />
            <p className="text-sm text-gray-600">
              Students can scan this QR code with their phone camera
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-600">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Or share this link:</span>
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <input
                type="text"
                value={studentUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Copy link"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-700 space-y-1 text-left">
              <li>1. Students scan the QR code or visit the link</li>
              <li>2. They enter their name to login</li>
              <li>3. They can chat with you privately</li>
              <li>4. Messages auto-delete after 24 hours</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
