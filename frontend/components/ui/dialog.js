// frontend/components/ui/dialog.js
import React, { useState } from 'react';

export function Dialog({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
           <div className="fixed inset-0 flex justify-center items-center bg-transparent">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
}
